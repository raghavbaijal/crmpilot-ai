import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color?: 'blue' | 'red' | 'amber' | 'emerald';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  count,
  icon: Icon,
  trend,
  color = 'blue',
}) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100/50',
    red: 'bg-red-50 text-red-600 border-red-100/50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
  };

  return (
    <Card hoverable className="flex items-center justify-between border-slate-200/50 p-6">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 leading-none">{count}</span>
          {trend && (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={cn('w-12 h-12 rounded-xl border flex items-center justify-center shrink-0', colorStyles[color])}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
    </Card>
  );
};
export default StatsCard;
