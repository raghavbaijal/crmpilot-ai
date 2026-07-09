import React from 'react';
import type { LeadFollowup } from '../../types';
import { Card } from '../ui/Card';
import { useFollowups } from '../../context/FollowupsContext';
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Circle,
  Bell,
  CalendarDays,
} from 'lucide-react';

interface FollowupCardProps {
  followup: LeadFollowup;
}

export const FollowupCard: React.FC<FollowupCardProps> = ({ followup }) => {
  const { updateFollowup } = useFollowups();

  const handleToggle = () => {
    const nextStatus = followup.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    updateFollowup(followup.id, { status: nextStatus });
  };

  const getPriorityClasses = (p: string) => {
    switch (p.toUpperCase()) {
      case 'HIGH':
        return { border: 'border-l-rose-500', badge: 'text-rose-700 bg-rose-50 border-rose-100/50' };
      case 'MEDIUM':
        return { border: 'border-l-amber-500', badge: 'text-amber-700 bg-amber-50 border-amber-100/50' };
      case 'LOW':
        return { border: 'border-l-slate-400', badge: 'text-slate-600 bg-slate-50 border-slate-200/50' };
      default:
        return { border: 'border-l-slate-300', badge: 'text-slate-600 bg-slate-50' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'CALL':
        return Phone;
      case 'EMAIL':
        return Mail;
      case 'WHATSAPP':
        return MessageSquare;
      case 'SITE_VISIT':
        return MapPin;
      case 'MEETING':
        return Calendar;
      default:
        return Calendar;
    }
  };

  const isCompleted = followup.status === 'COMPLETED';
  const isTemporary = followup.id < 0;
  const classes = getPriorityClasses(followup.priority);
  const TypeIcon = getTypeIcon(followup.followup_type);

  const dueFormatted = new Date(followup.due_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const completedFormatted = followup.completed_at
    ? new Date(followup.completed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Card className={`border-slate-200/60 border-l-4 ${classes.border} p-4 bg-white transition-all hover:shadow-md flex items-start gap-3.5 ${isCompleted ? 'bg-slate-50/40 border-slate-150' : ''} ${isTemporary ? 'opacity-60 border-dashed' : ''}`}>
      {/* Checkbox Complete */}
      <button
        onClick={handleToggle}
        disabled={isTemporary}
        className="mt-1 flex items-center justify-center shrink-0 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-50"
        aria-label={isCompleted ? "Mark follow-up as pending" : "Mark follow-up as completed"}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
        ) : (
          <Circle className="w-5 h-5 text-slate-300 hover:border-slate-400" />
        )}
      </button>

      {/* Details body */}
      <div className="flex-1 space-y-2.5 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-slate-50 text-slate-500 rounded border border-slate-100">
                <TypeIcon className="w-3.5 h-3.5" />
              </div>
              <h5 className={`text-xs font-black text-slate-800 leading-tight break-words ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                {followup.title}
              </h5>
            </div>
            {followup.followup_status && !isCompleted && (
              <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider inline-block">
                {followup.followup_status}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Priority Badge */}
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${classes.badge}`}>
              {followup.priority}
            </span>

            {/* Overdue Badge */}
            {followup.overdue && !isCompleted && (
              <span className="text-[8px] bg-red-50 text-red-655 border border-red-100/50 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-wider animate-pulse">
                <AlertCircle className="w-2.5 h-2.5" />
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {followup.description && (
          <p className={`text-[11px] leading-relaxed text-slate-600 bg-slate-50/30 p-2.5 rounded-xl border border-slate-100/40 break-words ${isCompleted ? 'text-slate-400 border-none bg-none font-medium' : 'font-semibold'}`}>
            {followup.description}
          </p>
        )}

        {/* Info Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-50">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-350" />
              {isCompleted ? 'Completed:' : 'Due:'} {isCompleted ? (completedFormatted || dueFormatted) : dueFormatted}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-355" />
              Assignee: {followup.assigned_to}
            </span>
            {!isCompleted && followup.days_until_due !== undefined && followup.days_until_due > 0 && (
              <span className="text-blue-500 font-bold">
                ({followup.days_until_due} days left)
              </span>
            )}
          </div>

          {/* Placeholders for Future Integrations */}
          <div className="flex items-center gap-1.5 text-slate-350">
            <span title="Reminder configuration (Future-ready)">
              <Bell className="w-3.5 h-3.5 cursor-not-allowed hover:text-slate-450 transition-colors" />
            </span>
            <span title="Google/Outlook Calendar Sync (Future-ready)">
              <CalendarDays className="w-3.5 h-3.5 cursor-not-allowed hover:text-slate-450 transition-colors" />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default FollowupCard;
