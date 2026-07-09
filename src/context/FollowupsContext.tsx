import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { FollowupsResponse, LeadFollowup, FollowupSummary } from '../types';
import { getFollowups as getFollowupsApi, addFollowup as addFollowupApi, updateFollowup as updateFollowupApi } from '../services/api/followups';
import { useLeads } from './LeadContext';
import { toast } from 'react-hot-toast';

interface FollowupsContextType {
  followups: LeadFollowup[];
  summary: FollowupSummary | null;
  upcomingFollowups: LeadFollowup[];
  overdueFollowups: LeadFollowup[];
  todayFollowups: LeadFollowup[];
  hasFollowups: boolean;
  selectedLeadFollowups: LeadFollowup[];
  loading: boolean;
  isRefreshing: boolean;
  isSubmitting: boolean;
  error: Error | null;
  lastUpdated: string | null;
  selectedLeadId: number | null;
  refreshFollowups: () => Promise<void>;
  getFollowupsForLead: (leadId: number) => Promise<void>;
  addFollowup: (title: string, description: string, followupType: "CALL" | "EMAIL" | "WHATSAPP" | "SITE_VISIT" | "MEETING", priority: "LOW" | "MEDIUM" | "HIGH", dueDate: string, assignedTo: string) => Promise<void>;
  updateFollowup: (followupId: number, updates: Partial<LeadFollowup>) => Promise<void>;
  clearFollowups: () => void;
  // Activity Feed compatibility helpers
  logFollowupScheduled: (followup: LeadFollowup) => void;
  logFollowupCompleted: (followup: LeadFollowup) => void;
  logFollowupRescheduled: (followup: LeadFollowup) => void;
}

const FollowupsContext = createContext<FollowupsContextType | undefined>(undefined);

const PRIORITY_WEIGHTS = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export const FollowupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedLead } = useLeads();
  const [cache, setCache] = useState<Record<number, FollowupsResponse>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const selectedLeadId = selectedLead?.id || null;
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestsRef = useRef<Record<number, boolean>>({});

  // Future Activity Feed compatibility helper placeholders
  const logFollowupScheduled = useCallback((followup: LeadFollowup) => {
    if (import.meta.env.DEV) {
      console.log('[Activity Log Trigger] Follow-up Scheduled:', followup);
    }
  }, []);

  const logFollowupCompleted = useCallback((followup: LeadFollowup) => {
    if (import.meta.env.DEV) {
      console.log('[Activity Log Trigger] Follow-up Completed:', followup);
    }
  }, []);

  const logFollowupRescheduled = useCallback((followup: LeadFollowup) => {
    if (import.meta.env.DEV) {
      console.log('[Activity Log Trigger] Follow-up Rescheduled:', followup);
    }
  }, []);

  const fetchFollowups = useCallback(async (leadId: number, silent = false) => {
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
      const data = await getFollowupsApi(leadId);
      setCache((prev) => ({
        ...prev,
        [leadId]: data,
      }));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'CanceledError') {
        return;
      }
      const errorInstance = err instanceof Error ? err : new Error('Unable to retrieve followups.');
      setError(errorInstance);
      toast.error('Failed to load follow-ups.');
    } finally {
      delete activeRequestsRef.current[leadId];
      if (controller === abortControllerRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [cache, isRefreshing]);

  // Expose manual retrieval
  const getFollowupsForLead = useCallback(async (leadId: number) => {
    await fetchFollowups(leadId, false);
  }, [fetchFollowups]);

  // Expose manual refresh
  const refreshFollowups = useCallback(async () => {
    if (selectedLeadId !== null) {
      setIsRefreshing(true);
      await fetchFollowups(selectedLeadId, true);
    }
  }, [selectedLeadId, fetchFollowups]);

  // Expose clear cache
  const clearFollowups = useCallback(() => {
    setCache({});
    setError(null);
    setLastUpdated(null);
  }, []);

  // Expose addFollowup with optimistic updates & rollbacks
  const addFollowup = useCallback(async (
    title: string,
    description: string,
    followupType: "CALL" | "EMAIL" | "WHATSAPP" | "SITE_VISIT" | "MEETING",
    priority: "LOW" | "MEDIUM" | "HIGH",
    dueDate: string,
    assignedTo: string
  ) => {
    if (selectedLeadId === null || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    // Calculate days remaining
    const diffMs = new Date(dueDate).getTime() - Date.now();
    const daysUntilDue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const overdue = diffMs < 0;

    // Generate temporary negative ID
    const tempId = -Math.floor(Math.random() * 1000000) - 1;
    const tempFollowup: LeadFollowup = {
      id: tempId,
      lead_id: selectedLeadId,
      title,
      description,
      followup_type: followupType,
      priority,
      status: "PENDING",
      due_date: dueDate,
      formatted_due_date: new Date(dueDate).toLocaleDateString(),
      assigned_to: assignedTo,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      followup_status: "Scheduled",
      days_until_due: daysUntilDue,
      overdue,
      created_by: 'Executive Agent',
    };

    // Save previous state for rollback
    const previousResponse = cache[selectedLeadId];

    // Optimistically update cache
    setCache((prev) => {
      const currentRes = prev[selectedLeadId] || {
        success: true,
        lead_id: selectedLeadId,
        summary: { total: 0, pending: 0, completed: 0, overdue: 0 },
        followups: [],
        metadata: { generated_at: new Date().toISOString(), version: '1.0', source: 'client' },
      };

      const updatedList = [tempFollowup, ...currentRes.followups];
      const total = updatedList.length;
      const pending = updatedList.filter(f => f.status === 'PENDING').length;
      const completed = updatedList.filter(f => f.status === 'COMPLETED').length;
      const overdueCount = updatedList.filter(f => f.overdue).length;

      return {
        ...prev,
        [selectedLeadId]: {
          ...currentRes,
          summary: { total, pending, completed, overdue: overdueCount },
          followups: updatedList,
        },
      };
    });

    try {
      const result = await addFollowupApi({
        leadId: selectedLeadId,
        title,
        description,
        followupType,
        priority,
        dueDate,
        assignedTo,
      });

      if (result.success && result.followup) {
        // Swap temporary mockup with server response
        setCache((prev) => {
          const currentRes = prev[selectedLeadId];
          if (!currentRes) return prev;

          const updatedList = currentRes.followups.map((f) => (f.id === tempId ? result.followup : f));

          return {
            ...prev,
            [selectedLeadId]: {
              ...currentRes,
              followups: updatedList,
            },
          };
        });
        logFollowupScheduled(result.followup);
      } else {
        throw new Error('API returned failure status');
      }

      toast.success('Follow-up scheduled successfully');
      fetchFollowups(selectedLeadId, true);
    } catch (err: unknown) {
      // Rollback
      setCache((prev) => ({
        ...prev,
        [selectedLeadId]: previousResponse,
      }));
      setError(err instanceof Error ? err : new Error('Failed to schedule follow-up.'));
      toast.error('Failed to schedule follow-up. Rollback applied.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedLeadId, cache, isSubmitting, fetchFollowups, logFollowupScheduled]);

  // Expose updateFollowup with optimistic updates & rollbacks
  const updateFollowup = useCallback(async (followupId: number, updates: Partial<LeadFollowup>) => {
    if (selectedLeadId === null || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    // Save previous state for rollback
    const previousResponse = cache[selectedLeadId];

    // Optimistically update status/details in cache
    setCache((prev) => {
      const currentRes = prev[selectedLeadId];
      if (!currentRes) return prev;

      const updatedList = currentRes.followups.map((f) => {
        if (f.id === followupId) {
          const completedAt = updates.status === 'COMPLETED' ? new Date().toISOString() : (updates.status === 'PENDING' ? null : f.completed_at);
          return {
            ...f,
            ...updates,
            completed_at: completedAt,
          };
        }
        return f;
      });

      const total = updatedList.length;
      const pending = updatedList.filter(f => f.status === 'PENDING').length;
      const completed = updatedList.filter(f => f.status === 'COMPLETED').length;
      const overdueCount = updatedList.filter(f => f.overdue).length;

      return {
        ...prev,
        [selectedLeadId]: {
          ...currentRes,
          summary: { total, pending, completed, overdue: overdueCount },
          followups: updatedList,
        },
      };
    });

    try {
      const requestPayload = {
        followupId,
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        status: updates.status,
        dueDate: updates.due_date,
        assignedTo: updates.assigned_to,
        followupType: updates.followup_type,
      };

      const result = await updateFollowupApi(requestPayload);

      if (result.success && result.followup) {
        // Swap with response
        setCache((prev) => {
          const currentRes = prev[selectedLeadId];
          if (!currentRes) return prev;

          const updatedList = currentRes.followups.map((f) => (f.id === followupId ? result.followup : f));

          return {
            ...prev,
            [selectedLeadId]: {
              ...currentRes,
              followups: updatedList,
            },
          };
        });

        if (updates.status === 'COMPLETED') {
          logFollowupCompleted(result.followup);
        } else if (updates.due_date) {
          logFollowupRescheduled(result.followup);
        }
      } else {
        throw new Error('API returned failure status');
      }

      toast.success('Follow-up updated successfully');
      fetchFollowups(selectedLeadId, true);
    } catch (err: unknown) {
      // Rollback
      setCache((prev) => ({
        ...prev,
        [selectedLeadId]: previousResponse,
      }));
      setError(err instanceof Error ? err : new Error('Failed to update follow-up.'));
      toast.error('Failed to update follow-up. Rollback applied.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedLeadId, cache, isSubmitting, fetchFollowups, logFollowupCompleted, logFollowupRescheduled]);

  // Listen to selectedLeadId from LeadContext to auto-fetch
  useEffect(() => {
    if (selectedLeadId !== null) {
      fetchFollowups(selectedLeadId, false);
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
  }, [selectedLeadId, fetchFollowups]);

  // Derived memoized selectors
  const followups = useMemo<LeadFollowup[]>(() => {
    if (selectedLeadId === null || !cache[selectedLeadId]) return [];
    
    // Sort: Pending first, then Overdue first, then High -> Medium -> Low, then nearest due date
    return [...(cache[selectedLeadId].followups || [])].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'PENDING' ? -1 : 1;
      }
      if (a.status === 'PENDING') {
        if (a.overdue !== b.overdue) {
          return a.overdue ? -1 : 1;
        }
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

  const selectedLeadFollowups = followups;

  const summary = useMemo<FollowupSummary | null>(() => {
    if (selectedLeadId === null || !cache[selectedLeadId]) return null;
    return cache[selectedLeadId].summary || null;
  }, [selectedLeadId, cache]);

  const upcomingFollowups = useMemo<LeadFollowup[]>(() => {
    return followups.filter((f) => f.status === 'PENDING' && !f.overdue);
  }, [followups]);

  const overdueFollowups = useMemo<LeadFollowup[]>(() => {
    return followups.filter((f) => f.status === 'PENDING' && f.overdue);
  }, [followups]);

  const todayFollowups = useMemo<LeadFollowup[]>(() => {
    const todayStr = new Date().toDateString();
    return followups.filter((f) => new Date(f.due_date).toDateString() === todayStr);
  }, [followups]);

  const hasFollowups = useMemo<boolean>(() => {
    return followups.length > 0;
  }, [followups]);

  // Dev logging
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Context Update] FollowupsContext values:', {
        selectedLeadId,
        followupsCount: followups.length,
        hasFollowups,
        loading,
        isRefreshing,
        isSubmitting,
        error: error?.message || null,
      });
    }
  }, [selectedLeadId, followups, hasFollowups, loading, isRefreshing, isSubmitting, error]);

  return (
    <FollowupsContext.Provider
      value={{
        followups,
        summary,
        upcomingFollowups,
        overdueFollowups,
        todayFollowups,
        hasFollowups,
        selectedLeadFollowups,
        loading,
        isRefreshing,
        isSubmitting,
        error,
        lastUpdated,
        selectedLeadId,
        refreshFollowups,
        getFollowupsForLead,
        addFollowup,
        updateFollowup,
        clearFollowups,
        logFollowupScheduled,
        logFollowupCompleted,
        logFollowupRescheduled,
      }}
    >
      {children}
    </FollowupsContext.Provider>
  );
};

export const useFollowups = () => {
  const context = useContext(FollowupsContext);
  if (context === undefined) {
    throw new Error('useFollowups must be used within a FollowupsProvider');
  }
  return context;
};
export default FollowupsContext;
