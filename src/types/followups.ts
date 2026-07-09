export interface LeadFollowup {
  id: number;
  lead_id: number;
  title: string;
  description: string;
  followup_type: "CALL" | "EMAIL" | "WHATSAPP" | "SITE_VISIT" | "MEETING";
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "COMPLETED";
  due_date: string;
  formatted_due_date: string;
  assigned_to: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  followup_status: string;
  days_until_due: number;
  overdue: boolean;
  /* Future compatibility */
  reminder_sent?: boolean;
  calendar_event_id?: string;
  created_by?: string;
  completed_by?: string;
  reminder_at?: string;
  notes?: string;
  tags?: string[];
}

export interface FollowupSummary {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  /* Extended Fields */
  due_today?: number;
  due_this_week?: number;
  high_priority?: number;
  completion_rate?: number;
}

export interface FollowupMetadata {
  generated_at: string;
  version: string;
  source: string;
}

export interface FollowupsResponse {
  success: boolean;
  lead_id: number;
  summary: FollowupSummary;
  followups: LeadFollowup[];
  metadata: FollowupMetadata;
}

export interface AddFollowupRequest {
  leadId: number;
  title: string;
  description: string;
  followupType: "CALL" | "EMAIL" | "WHATSAPP" | "SITE_VISIT" | "MEETING";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
  assignedTo: string;
}

export interface UpdateFollowupRequest {
  followupId: number;
  title?: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  status?: "PENDING" | "COMPLETED";
  dueDate?: string;
  assignedTo?: string;
  followupType?: "CALL" | "EMAIL" | "WHATSAPP" | "SITE_VISIT" | "MEETING";
}
