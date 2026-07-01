import React from 'react';
import { useTasks } from '../../context/TasksContext';
import { TaskSummaryCards } from './TaskSummaryCards';
import { AddTaskForm } from './AddTaskForm';
import { TaskList } from './TaskList';
import { EmptyTasks } from './EmptyTasks';
import { LoadingTasks } from './LoadingTasks';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckSquare, RefreshCw, AlertCircle, Clock } from 'lucide-react';

export const TaskOverview: React.FC = () => {
  const {
    tasks,
    summary,
    completionPercentage,
    loading,
    isRefreshing,
    isSubmitting,
    hasTasks,
    error,
    lastUpdated,
    refreshTasks,
    addTask,
  } = useTasks();

  const handleCreateTask = async (
    title: string,
    description: string,
    priority: "LOW" | "MEDIUM" | "HIGH",
    dueDate: string,
    assignedTo: string
  ) => {
    await addTask(title, description, priority, dueDate, assignedTo);
    
    // Auto-scroll to newly created task (which is sorted to the top or near the top)
    setTimeout(() => {
      const scrollContainer = document.querySelector('.tasks-scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCreateFirstTaskClick = () => {
    const input = document.querySelector('input[placeholder="e.g. Call client to verify site visit slot"]') as HTMLInputElement | null;
    input?.focus();
  };

  return (
    <Card className="border-slate-200/60 p-5 space-y-5 bg-white">
      {/* Header Panel */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase leading-none">
              Lead Tasks & Checklist
            </h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
              Task assignments & progress tracking
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshTasks}
            disabled={loading || isRefreshing}
            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Refresh tasks"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {hasTasks && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Overall Progress</span>
            <span>{completionPercentage}% Complete</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <TaskSummaryCards
        summary={summary}
        completionPercentage={completionPercentage}
        loading={loading && !isRefreshing}
      />

      {/* Add Task Form */}
      <AddTaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />

      {/* Task List */}
      <div className="space-y-4">
        {loading && !isRefreshing ? (
          <LoadingTasks />
        ) : error ? (
          <div className="text-center py-6 flex flex-col items-center justify-center space-y-3 bg-red-50/10 border border-red-100 rounded-2xl p-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700">Failed to load tasks</p>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                {error.message || 'The server connection was interrupted.'}
              </p>
            </div>
            <Button size="sm" onClick={refreshTasks} className="font-semibold text-xs cursor-pointer">
              Retry Connection
            </Button>
          </div>
        ) : !hasTasks ? (
          <EmptyTasks onCreateClick={handleCreateFirstTaskClick} />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Task List</span>
              {lastUpdated && (
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  Synced: {lastUpdated}
                </span>
              )}
            </div>
            <div className="tasks-scroll-container">
              <TaskList tasks={tasks} />
            </div>
          </div>
        )}
      </div>

      {/* Metadata Footer */}
      {summary && (
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Source: CRM Task Scheduler</span>
          <span>Version: v1.0</span>
        </div>
      )}
    </Card>
  );
};
export default TaskOverview;
