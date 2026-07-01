import React from 'react';
import type { LeadTask } from '../../types';
import { Card } from '../ui/Card';
import { useTasks } from '../../context/TasksContext';
import { Calendar, User, AlertCircle, CheckCircle2, Circle } from 'lucide-react';

interface TaskCardProps {
  task: LeadTask;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask } = useTasks();

  const handleToggle = () => {
    const nextStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    updateTask(task.id, { status: nextStatus });
  };

  const getPriorityColor = (p: string) => {
    switch (p.toUpperCase()) {
      case 'HIGH':
        return 'text-rose-700 bg-rose-50 border-rose-100/50';
      case 'MEDIUM':
        return 'text-amber-700 bg-amber-50 border-amber-100/50';
      case 'LOW':
        return 'text-slate-600 bg-slate-50 border-slate-200/50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const dateFormatted = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No due date';

  const completedFormatted = task.completed_at
    ? new Date(task.completed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const isCompleted = task.status === 'COMPLETED';
  const isTemporary = task.id < 0;

  return (
    <Card className={`border-slate-200/60 p-4 bg-white transition-all hover:shadow-md flex items-start gap-3.5 ${isCompleted ? 'bg-slate-50/40 border-slate-150' : ''} ${isTemporary ? 'opacity-60 border-dashed' : ''}`}>
      {/* Toggle Status Checkbox */}
      <button
        onClick={handleToggle}
        disabled={isTemporary}
        className="mt-1 flex items-center justify-center shrink-0 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-50"
        aria-label={isCompleted ? "Mark task as pending" : "Mark task as completed"}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
        ) : (
          <Circle className="w-5 h-5 text-slate-300 hover:border-slate-400" />
        )}
      </button>

      {/* Task Details */}
      <div className="flex-1 space-y-2.5 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div className="space-y-0.5 min-w-0 flex-1">
            <h5 className={`text-xs font-black text-slate-800 leading-tight break-words ${isCompleted ? 'line-through text-slate-400' : ''}`}>
              {task.title}
            </h5>
            <span className="text-[9px] text-slate-450 font-bold block">
              Created {task.formatted_created_date}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Priority Badge */}
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>

            {/* Overdue Badge */}
            {task.overdue && !isCompleted && (
              <span className="text-[8px] bg-red-50 text-red-650 border border-red-100/50 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-wider animate-pulse">
                <AlertCircle className="w-2.5 h-2.5" />
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Task description */}
        {task.description && (
          <p className={`text-[11px] leading-relaxed text-slate-600 bg-slate-50/30 p-2.5 rounded-xl border border-slate-100/40 break-words ${isCompleted ? 'text-slate-400 border-none bg-none font-medium' : 'font-semibold'}`}>
            {task.description}
          </p>
        )}

        {/* Meta variables Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-350" />
            {isCompleted ? 'Completed:' : 'Due:'} {isCompleted ? (completedFormatted || dateFormatted) : dateFormatted}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-355" />
            Assignee: {task.assigned_to || 'Unassigned'}
          </span>
        </div>
      </div>
    </Card>
  );
};
export default TaskCard;
