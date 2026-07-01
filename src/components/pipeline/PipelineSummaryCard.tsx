import React from 'react';
import type { PipelineSummary } from '../../types';
import { Card } from '../ui/Card';
import { Percent, TrendingUp, AlertTriangle, Calendar, Zap } from 'lucide-react';


interface PipelineSummaryCardProps {
  summary: PipelineSummary | null;
  loading: boolean;
}

export const PipelineSummaryCard: React.FC<PipelineSummaryCardProps> = ({ summary, loading }) => {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 bg-white border border-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const items = [
    {
      title: 'Active Pipeline',
      value: summary.active_pipeline,
      icon: Zap,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100/40',
      description: `Total Active Deals: ${summary.total}`,
    },
    {
      title: 'Conversion Rate',
      value: `${summary.conversion_rate}%`,
      icon: Percent,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100/40',
      description: `Deals Won: ${summary.won}`,
    },
    {
      title: 'Loss Rate',
      value: `${summary.loss_rate}%`,
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-100/40',
      description: `Deals Lost: ${summary.lost}`,
    },
    {
      title: 'Stalled Leads',
      value: summary.stalled_leads !== undefined ? summary.stalled_leads : 0,
      icon: Calendar,
      color: 'text-amber-600 bg-amber-50 border-amber-100/40',
      description: 'Stalled > 14 Days (Future)',
    },
    {
      title: 'Follow-up Due',
      value: summary.followup_due !== undefined ? summary.followup_due : 0,
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-100/40',
      description: 'Tasks Overdue (Future)',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="border-slate-200/50 p-5 flex flex-col justify-between hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {item.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-xl font-black text-slate-900 tracking-tight leading-none block">
                {item.value}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                {item.description}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
export default PipelineSummaryCard;
