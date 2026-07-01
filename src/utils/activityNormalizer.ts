import type { TimelineEvent, ActivityItem } from '../types';

export const getRelativeTimeString = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (isNaN(date.getTime()) || diffMs < 0) {
      return 'Just now';
    }
    
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Just now';
  }
};

export const normalizeTimeline = (event: TimelineEvent): ActivityItem => {
  return {
    id: `timeline-${event.id}`,
    type: event.type,
    title: event.title,
    description: event.description,
    timestamp: event.timestamp,
    formattedTimestamp: getRelativeTimeString(event.timestamp),
    icon: event.icon || 'Activity',
    color: event.color || 'blue',
    source: 'timeline',
    createdBy: event.created_by,
    status: event.status,
    badge: event.source,
  };
};

export const normalizeNotes = (): ActivityItem[] => {
  // Placeholder for future Notes feed integration
  return [];
};

export const normalizeTasks = (): ActivityItem[] => {
  // Placeholder for future Tasks feed integration
  return [];
};

export const normalizeFollowups = (): ActivityItem[] => {
  // Placeholder for future Follow-ups feed integration
  return [];
};

export const normalizeDocuments = (): ActivityItem[] => {
  // Placeholder for future Documents feed integration
  return [];
};

export const normalizeNotifications = (): ActivityItem[] => {
  // Placeholder for future Notifications feed integration
  return [];
};
