import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { TasksResponse, LeadTask, TaskSummary } from '../types';
import { getTasks as getTasksApi, addTask as addTaskApi, updateTask as updateTaskApi } from '../services/api/tasks';
import { useLeads } from './LeadContext';
import { toast } from 'react-hot-toast';

interface TasksContextType {
  tasks: LeadTask[];
  summary: TaskSummary | null;
  upcomingTasks: LeadTask[];
  completionPercentage: number;
  loading: boolean;
  isRefreshing: boolean;
  isSubmitting: boolean;
  hasTasks: boolean;
  selectedLeadTasks: LeadTask[];
  error: Error | null;
  lastUpdated: string | null;
  selectedLeadId: number | null;
  refreshTasks: () => Promise<void>;
  getTasksForLead: (leadId: number) => Promise<void>;
  addTask: (title: string, description: string, priority: "LOW" | "MEDIUM" | "HIGH", dueDate: string, assignedTo: string) => Promise<void>;
  updateTask: (taskId: number, updates: Partial<LeadTask>) => Promise<void>;
  clearTasks: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const PRIORITY_WEIGHTS = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedLead } = useLeads();
  const [cache, setCache] = useState<Record<number, TasksResponse>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const selectedLeadId = selectedLead?.id || null;
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestsRef = useRef<Record<number, boolean>>({});

  const fetchTasks = useCallback(async (leadId: number, silent = false) => {
    // Prevent concurrent requests for the same lead
    if (activeRequestsRef.current[leadId]) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Check cache
    if (!silent && !isRefreshing && cache[leadId]) {
      setLastUpdated(new Date().toLocaleTimeString());
      return;
    }

    if (silent || isRefreshing) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    activeRequestsRef.current[leadId] = true;

    try {
      const data = await getTasksApi(leadId);
      setCache((prev) => ({
        ...prev,
        [leadId]: data,
      }));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'CanceledError') {
        return;
      }
      const errorInstance = err instanceof Error ? err : new Error('Unable to retrieve tasks.');
      setError(errorInstance);
      toast.error('Failed to load tasks.');
    } finally {
      delete activeRequestsRef.current[leadId];
      if (controller === abortControllerRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [cache, isRefreshing]);

  // Expose manual retrieval
  const getTasksForLead = useCallback(async (leadId: number) => {
    await fetchTasks(leadId, false);
  }, [fetchTasks]);

  // Expose manual refresh
  const refreshTasks = useCallback(async () => {
    if (selectedLeadId !== null) {
      setIsRefreshing(true);
      await fetchTasks(selectedLeadId, true);
    }
  }, [selectedLeadId, fetchTasks]);

  // Expose clear cache
  const clearTasks = useCallback(() => {
    setCache({});
    setError(null);
    setLastUpdated(null);
  }, []);

  // Expose addTask with optimistic updates & rollbacks
  const addTask = useCallback(async (
    title: string,
    description: string,
    priority: "LOW" | "MEDIUM" | "HIGH",
    dueDate: string,
    assignedTo: string
  ) => {
    if (selectedLeadId === null || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    // Generate temporary negative ID
    const tempId = -Math.floor(Math.random() * 1000000) - 1;
    const tempTask: LeadTask = {
      id: tempId,
      lead_id: selectedLeadId,
      title,
      description,
      status: "PENDING",
      priority,
      due_date: dueDate || null,
      formatted_due_date: dueDate ? new Date(dueDate).toLocaleDateString() : null,
      formatted_created_date: 'Just now',
      assigned_to: assignedTo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
      overdue: dueDate ? new Date(dueDate).getTime() < Date.now() : false,
    };

    // Save previous state for rollback
    const previousResponse = cache[selectedLeadId];

    // Optimistically update cache
    setCache((prev) => {
      const currentRes = prev[selectedLeadId] || {
        success: true,
        lead_id: selectedLeadId,
        summary: { total: 0, pending: 0, completed: 0, overdue: 0, high_priority: 0, medium_priority: 0, low_priority: 0 },
        completion_percentage: 0,
        upcoming_tasks: [],
        tasks: [],
        metadata: { generated_at: new Date().toISOString(), version: '1.0', source: 'client' },
      };

      const updatedTasks = [tempTask, ...currentRes.tasks];
      const total = updatedTasks.length;
      const pending = updatedTasks.filter(t => t.status === 'PENDING').length;
      const completed = updatedTasks.filter(t => t.status === 'COMPLETED').length;
      const overdue = updatedTasks.filter(t => t.overdue).length;
      const high_priority = updatedTasks.filter(t => t.priority === 'HIGH').length;
      const medium_priority = updatedTasks.filter(t => t.priority === 'MEDIUM').length;
      const low_priority = updatedTasks.filter(t => t.priority === 'LOW').length;

      return {
        ...prev,
        [selectedLeadId]: {
          ...currentRes,
          summary: { total, pending, completed, overdue, high_priority, medium_priority, low_priority },
          completion_percentage: total ? Math.round((completed / total) * 100) : 0,
          tasks: updatedTasks,
        },
      };
    });

    try {
      const result = await addTaskApi({
        leadId: selectedLeadId,
        title,
        description,
        priority,
        dueDate,
        assignedTo,
      });

      if (result.success && result.task) {
        // Swap temporary task with real task
        setCache((prev) => {
          const currentRes = prev[selectedLeadId];
          if (!currentRes) return prev;

          const updatedTasks = currentRes.tasks.map((t) => (t.id === tempId ? result.task : t));

          return {
            ...prev,
            [selectedLeadId]: {
              ...currentRes,
              tasks: updatedTasks,
            },
          };
        });
      } else {
        throw new Error('API returned failure status');
      }

      toast.success('Task created successfully');
      fetchTasks(selectedLeadId, true);
    } catch (err: unknown) {
      // Rollback
      setCache((prev) => ({
        ...prev,
        [selectedLeadId]: previousResponse,
      }));
      setError(err instanceof Error ? err : new Error('Failed to create task.'));
      toast.error('Failed to create task. Rollback applied.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedLeadId, cache, isSubmitting, fetchTasks]);

  // Expose updateTask with optimistic updates & rollbacks
  const updateTask = useCallback(async (taskId: number, updates: Partial<LeadTask>) => {
    if (selectedLeadId === null || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    // Save previous state for rollback
    const previousResponse = cache[selectedLeadId];

    // Optimistically update status/details in cache
    setCache((prev) => {
      const currentRes = prev[selectedLeadId];
      if (!currentRes) return prev;

      const updatedTasks = currentRes.tasks.map((t) => {
        if (t.id === taskId) {
          const completedAt = updates.status === 'COMPLETED' ? new Date().toISOString() : (updates.status === 'PENDING' ? null : t.completed_at);
          return {
            ...t,
            ...updates,
            completed_at: completedAt,
          };
        }
        return t;
      });

      const total = updatedTasks.length;
      const pending = updatedTasks.filter(t => t.status === 'PENDING').length;
      const completed = updatedTasks.filter(t => t.status === 'COMPLETED').length;
      const overdue = updatedTasks.filter(t => t.overdue).length;
      const high_priority = updatedTasks.filter(t => t.priority === 'HIGH').length;
      const medium_priority = updatedTasks.filter(t => t.priority === 'MEDIUM').length;
      const low_priority = updatedTasks.filter(t => t.priority === 'LOW').length;

      return {
        ...prev,
        [selectedLeadId]: {
          ...currentRes,
          summary: { total, pending, completed, overdue, high_priority, medium_priority, low_priority },
          completion_percentage: total ? Math.round((completed / total) * 100) : 0,
          tasks: updatedTasks,
        },
      };
    });

    try {
      const requestPayload = {
        taskId,
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        status: updates.status,
        dueDate: updates.due_date || undefined,
        assignedTo: updates.assigned_to,
      };

      const result = await updateTaskApi(requestPayload);

      if (result.success && result.task) {
        // Swap with response task
        setCache((prev) => {
          const currentRes = prev[selectedLeadId];
          if (!currentRes) return prev;

          const updatedTasks = currentRes.tasks.map((t) => (t.id === taskId ? result.task : t));

          return {
            ...prev,
            [selectedLeadId]: {
              ...currentRes,
              tasks: updatedTasks,
            },
          };
        });
      } else {
        throw new Error('API returned failure status');
      }

      toast.success('Task updated successfully');
      fetchTasks(selectedLeadId, true);
    } catch (err: unknown) {
      // Rollback
      setCache((prev) => ({
        ...prev,
        [selectedLeadId]: previousResponse,
      }));
      setError(err instanceof Error ? err : new Error('Failed to update task.'));
      toast.error('Failed to update task. Rollback applied.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedLeadId, cache, isSubmitting, fetchTasks]);

  // Listen to selectedLeadId from LeadContext to auto-fetch or load instantly
  useEffect(() => {
    if (selectedLeadId !== null) {
      fetchTasks(selectedLeadId, false);
    } else {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedLeadId, fetchTasks]);

  // Derived selectors
  const tasks = useMemo<LeadTask[]>(() => {
    if (selectedLeadId === null || !cache[selectedLeadId]) return [];
    
    // Sort: Pending first, then High -> Medium -> Low, then nearest due date
    return [...(cache[selectedLeadId].tasks || [])].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'PENDING' ? -1 : 1;
      }
      const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
      const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      return 0;
    });
  }, [selectedLeadId, cache]);

  const selectedLeadTasks = tasks;

  const summary = useMemo<TaskSummary | null>(() => {
    if (selectedLeadId === null || !cache[selectedLeadId]) return null;
    return cache[selectedLeadId].summary || null;
  }, [selectedLeadId, cache]);

  const upcomingTasks = useMemo<LeadTask[]>(() => {
    if (selectedLeadId === null || !cache[selectedLeadId]) return [];
    return cache[selectedLeadId].upcoming_tasks || [];
  }, [selectedLeadId, cache]);

  const completionPercentage = useMemo<number>(() => {
    if (selectedLeadId === null || !cache[selectedLeadId]) return 0;
    return cache[selectedLeadId].completion_percentage || 0;
  }, [selectedLeadId, cache]);



  const hasTasks = useMemo<boolean>(() => {
    return tasks.length > 0;
  }, [tasks]);

  // Dev-only logging
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Context Update] TasksContext values:', {
        selectedLeadId,
        tasksCount: tasks.length,
        hasTasks,
        loading,
        isRefreshing,
        isSubmitting,
        error: error?.message || null,
      });
    }
  }, [selectedLeadId, tasks, hasTasks, loading, isRefreshing, isSubmitting, error]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        summary,
        upcomingTasks,
        completionPercentage,
        loading,
        isRefreshing,
        isSubmitting,
        hasTasks,
        selectedLeadTasks,
        error,
        lastUpdated,
        selectedLeadId,
        refreshTasks,
        getTasksForLead,
        addTask,
        updateTask,
        clearTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
export default TasksContext;
