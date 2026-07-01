import React from 'react';
import type { ActivityItem } from '../../types';
import { Card } from '../ui/Card';
import * as Icons from 'lucide-react';

interface ActivityCardProps {
  activity: ActivityItem;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  // Resolve Lucide Icon Component dynamically
  const getIconComponent = (iconName: string) => {
    if (!iconName) return Icons.Activity;
    // Map common string values to Lucide standard PascalCase
    const formattedName = iconName
      .split(/[-_ ]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
    
    const IconComp = (Icons as any)[formattedName] || (Icons as any)[iconName] || Icons.Activity;
    return IconComp;
  };

  const getThemeClasses = (colorName: string) => {
    switch (colorName?.toLowerCase()) {
      case 'blue':
      case 'info':
        return { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' };
      case 'green':
      case 'success':
      case 'emerald':
        return { border: 'border-l-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'yellow':
      case 'amber':
      case 'warning':
        return { border: 'border-l-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' };
      case 'red':
      case 'rose':
      case 'danger':
        return { border: 'border-l-rose-500', bg: 'bg-rose-50', text: 'text-rose-600' };
      case 'purple':
      case 'indigo':
        return { border: 'border-l-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600' };
      default:
        return { border: 'border-l-slate-350', bg: 'bg-slate-50', text: 'text-slate-500' };
    }
  };

  const IconComponent = getIconComponent(activity.icon);
  const theme = getThemeClasses(activity.color);

  const absoluteTimeFormatted = new Date(activity.timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className={`border-slate-200/60 border-l-4 ${theme.border} p-4 bg-white hover:shadow-md transition-shadow relative overflow-hidden`}>
      <div className="flex items-start gap-3">
        {/* Rounded Icon */}
        <div className={`w-8 h-8 rounded-full ${theme.bg} ${theme.text} flex items-center justify-center shrink-0`}>
          <IconComponent className="w-4 h-4" />
        </div>

        {/* Contents */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <h5 className="text-xs font-black text-slate-800 leading-tight break-words">
              {activity.title}
            </h5>
            <span
              title={absoluteTimeFormatted}
              className="text-[9px] text-slate-400 font-bold uppercase tracking-wider cursor-help hover:text-slate-600 transition-colors"
            >
              {activity.formattedTimestamp}
            </span>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-550 font-semibold break-words whitespace-pre-line">
            {activity.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
            {/* Source Badge */}
            <span className="bg-slate-100/80 px-1.5 py-0.5 rounded border border-slate-200/50">
              Source: {activity.source}
            </span>
            {activity.createdBy && (
              <span>By: {activity.createdBy}</span>
            )}
            {activity.status && (
              <span className="flex items-center gap-0.5">
                • Status: <span className="text-slate-500">{activity.status}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
export default ActivityCard;
