export type CRMActivityType =
  | 'LEAD_CREATED'
  | 'AI_QUALIFIED'
  | 'STATUS_CHANGED'
  | 'NOTE_ADDED'
  | 'EMAIL_SENT'
  | 'WHATSAPP_SENT'
  | 'CALL_COMPLETED'
  | 'SITE_VISIT'
  | 'TASK_CREATED'
  | 'TASK_COMPLETED'
  | 'DOCUMENT_UPLOADED'
  | 'DEAL_WON'
  | 'DEAL_LOST';

export interface TimelineEvent {
  id: number;
  type: string; // supports CRMActivityType
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
  // Extended Future-Proof Fields
  created_by?: string;
  source?: string;
  status?: string;
  action_required?: boolean;
}

export interface TimelineMetadata {
  generated_at: string;
  version: string;
  // Extended Fields
  total_events?: number;
  source?: string;
}

export interface TimelineResponse {
  lead_id: number;
  timeline: TimelineEvent[];
  metadata: TimelineMetadata;
}
