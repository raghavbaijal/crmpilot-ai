import React from 'react';
import type { ActivityItem } from '../../types';
import { ActivityCard } from './ActivityCard';

interface ActivityGroupProps {
  title: string;
  activities: ActivityItem[];
}

export const ActivityGroup: React.FC<ActivityGroupProps> = ({ title, activities }) => {
  return (
    <div className="space-y-3.5">
      {/* Group Header */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
          {title}
        </span>
        <div className="h-px bg-slate-100 flex-1" />
      </div>

      {/* Group Cards */}
      <div className="space-y-3.5 pl-2 border-l border-slate-100/80 ml-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};
export default ActivityGroup;
