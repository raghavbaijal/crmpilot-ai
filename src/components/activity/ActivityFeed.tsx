import React, { useMemo } from 'react';
import { useTimeline } from '../../context/TimelineContext';
import { normalizeTimeline } from '../../utils/activityNormalizer';
import { ActivityHeader } from './ActivityHeader';
import { ActivityGroup } from './ActivityGroup';
import { EmptyActivity } from './EmptyActivity';
import { LoadingActivity } from './LoadingActivity';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertCircle, Clock } from 'lucide-react';
import type { ActivityItem } from '../../types';

export const ActivityFeed: React.FC = () => {
  const {
    timeline,
    loading,
    isRefreshing,
    error,
    lastUpdated,
    refreshTimeline,
  } = useTimeline();

  // 1. Decoupled Aggregator & Normalizer Block
  const sortedActivities = useMemo<ActivityItem[]>(() => {
    if (!timeline) return [];
    
    // Convert Timeline events to common ActivityItem model
    const timelineItems = timeline.map(normalizeTimeline);

    // FUTURE: const noteItems = normalizeNotes(notes);
    // FUTURE: const taskItems = normalizeTasks(tasks);
    // Combine all events:
    const combined = [...timelineItems];

    // Sort newest first
    return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [timeline]);

  // 2. Memoized Grouping Block
  const groupedSections = useMemo<Record<string, ActivityItem[]>>(() => {
    const groups: Record<string, ActivityItem[]> = {
      'Today': [],
      'Yesterday': [],
      'Earlier This Week': [],
      'Earlier': [],
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Start of current week (e.g. Sunday or Monday; let's use 6 days ago as boundaries for "This Week")
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    sortedActivities.forEach((item) => {
      const itemDate = new Date(item.timestamp);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() === today.getTime()) {
        groups['Today'].push(item);
      } else if (itemDate.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(item);
      } else if (itemDate.getTime() >= sixDaysAgo.getTime()) {
        groups['Earlier This Week'].push(item);
      } else {
        groups['Earlier'].push(item);
      }
    });

    // Remove empty groups
    return Object.keys(groups).reduce<Record<string, ActivityItem[]>>((acc, key) => {
      if (groups[key].length > 0) {
        acc[key] = groups[key];
      }
      return acc;
    }, {});
  }, [sortedActivities]);

  const hasActivities = sortedActivities.length > 0;
  const showLoading = loading && !isRefreshing;

  return (
    <Card className="border-slate-200/60 p-5 space-y-5 bg-white">
      {/* Header Panel */}
      <ActivityHeader
        totalCount={sortedActivities.length}
        loading={loading || isRefreshing}
        refreshFeed={refreshTimeline}
      />

      {/* Grouped Activity items list */}
      <div className="space-y-6">
        {showLoading ? (
          <LoadingActivity />
        ) : error ? (
          <div className="text-center py-6 flex flex-col items-center justify-center space-y-3 bg-red-50/10 border border-red-100 rounded-2xl p-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700">Failed to load activities</p>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                {error.message || 'Unable to retrieve timeline data.'}
              </p>
            </div>
            <Button size="sm" onClick={refreshTimeline} className="font-semibold text-xs cursor-pointer">
              Retry Sync
            </Button>
          </div>
        ) : !hasActivities ? (
          <EmptyActivity />
        ) : (
          <div className="space-y-6 max-h-[520px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Timeline Log</span>
              {lastUpdated && (
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  Synced: {lastUpdated}
                </span>
              )}
            </div>
            
            {Object.entries(groupedSections).map(([groupTitle, groupItems]) => (
              <ActivityGroup
                key={groupTitle}
                title={groupTitle}
                activities={groupItems}
              />
            ))}
          </div>
        )}
      </div>

      {/* Metadata Footer */}
      {hasActivities && (
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Source: Activity Audit Log</span>
          <span>Version: v1.0</span>
        </div>
      )}
    </Card>
  );
};
export default ActivityFeed;
