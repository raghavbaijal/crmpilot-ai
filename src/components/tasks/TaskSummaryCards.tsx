import React from 'react';
import type { TaskSummary } from '../../types';
import { Card } from '../ui/Card';
import { CheckSquare, Clock, AlertTriangle, Percent, Activity } from 'lucide-react';

interface TaskSummaryCardsProps {
  summary: TaskSummary | null;
  completionPercentage: number;
  loading: boolean;
}

export const TaskSummaryCards: React.FC<TaskSummaryCardsProps> = ({
  summary,
  completionPercentage,
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

  const items = [
    {
      title: 'Total Tasks',
      value: summary.total,
      icon: CheckSquare,
      color: 'text-indigo-650 bg-indigo-50 border-indigo-100/40',
      description: 'Scheduled checklists',
    },
    {
      title: 'Pending',
      value: summary.pending,
      icon: Clock,
      color: 'text-amber-650 bg-amber-50 border-amber-100/40',
      description: 'Requires attention',
    },
    {
      title: 'Completed',
      value: summary.completed,
      icon: Activity,
      color: 'text-emerald-650 bg-emerald-50 border-emerald-100/40',
      description: 'Finished items',
    },
    {
      title: 'Overdue',
      value: summary.overdue,
      icon: AlertTriangle,
      color: 'text-rose-650 bg-rose-50 border-rose-100/40',
      description: 'Past due date',
    },
    {
      title: 'Completion %',
      value: `${completionPercentage}%`,
      icon: Percent,
      color: 'text-blue-650 bg-blue-50 border-blue-100/40',
      description: 'Progress rate',
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
    </div>
  );
};
export default TaskSummaryCards;
