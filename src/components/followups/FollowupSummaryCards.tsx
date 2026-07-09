import React from 'react';
import type { FollowupSummary, LeadFollowup } from '../../types';
import { Card } from '../ui/Card';
import { CalendarRange, Clock, Activity, AlertTriangle, ArrowRight } from 'lucide-react';

interface FollowupSummaryCardsProps {
  summary: FollowupSummary | null;
  upcomingFollowups: LeadFollowup[];
  loading: boolean;
}

export const FollowupSummaryCards: React.FC<FollowupSummaryCardsProps> = ({
  summary,
  upcomingFollowups,
  loading,
}) => {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  // Find next upcoming follow-up (the nearest one)
  const nextUpcoming = upcomingFollowups.length > 0 ? upcomingFollowups[0] : null;

  const items = [
    {
      title: 'Total Scheduled',
      value: summary.total,
      icon: CalendarRange,
      color: 'text-indigo-650 bg-indigo-50 border-indigo-100/40',
      description: 'Scheduled events',
    },
    {
      title: 'Pending',
      value: summary.pending,
      icon: Clock,
      color: 'text-amber-650 bg-amber-50 border-amber-100/40',
      description: 'Need actions',
    },
    {
      title: 'Completed',
      value: summary.completed,
      icon: Activity,
      color: 'text-emerald-650 bg-emerald-50 border-emerald-100/40',
      description: 'Closed events',
    },
    {
      title: 'Overdue',
      value: summary.overdue,
      icon: AlertTriangle,
      color: 'text-rose-650 bg-rose-50 border-rose-100/40',
      description: 'Past due bounds',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="border-slate-200/50 p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                {item.title}
              </span>
              <div className={`p-1 rounded-lg border ${item.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-slate-900 tracking-tight leading-none block">
                {item.value}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                {item.description}
              </span>
            </div>
          </Card>
        );
      })}

      {/* Next Upcoming Follow-up Info Widget */}
      <Card className="border-slate-200/50 p-4 flex flex-col justify-between bg-gradient-to-r from-blue-50/40 to-indigo-50/30 col-span-2 sm:col-span-1 lg:col-span-1 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
            Next Upcoming
          </span>
          <div className="p-1 rounded-lg border text-blue-650 bg-blue-50 border-blue-100/40">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 min-w-0">
          {nextUpcoming ? (
            <>
              <span className="text-xs font-black text-slate-800 tracking-tight leading-snug block truncate">
                {nextUpcoming.title}
              </span>
              <span className="text-[8px] font-bold text-blue-500 uppercase tracking-wider block mt-1 truncate">
                Due: {new Date(nextUpcoming.due_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-bold text-slate-400 block leading-tight">
                No upcoming events
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                Workspace clear
              </span>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
export default FollowupSummaryCards;
