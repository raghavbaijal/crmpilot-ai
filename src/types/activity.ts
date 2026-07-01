export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string; // ISO string or parsable format
  formattedTimestamp: string; // Display format
  icon: string;
  color: string;
  source: "timeline" | "note" | "task" | "system";
  metadata?: Record<string, unknown>;
  // Extended Future-Proof Fields
  createdBy?: string;
  priority?: string;
  status?: string;
  badge?: string;
  actionLabel?: string;
  actionType?: string;
}
