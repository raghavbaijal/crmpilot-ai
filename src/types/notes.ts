export interface LeadNote {
  id: number;
  lead_id: number;
  note: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  formatted_date: string;
  // Extended Future-Proof Fields
  edited?: boolean;
  pinned?: boolean;
  activity_type?: string;
}

export interface NotesMetadata {
  generated_at: string;
  version: string;
  source: string;
  // Extended Fields
  total_characters?: number;
  last_note_at?: string;
}

export interface NotesResponse {
  success: boolean;
  lead_id: number;
  count: number;
  notes: LeadNote[];
  metadata: NotesMetadata;
}

export interface AddNoteRequest {
  leadId: number;
  note: string;
  createdBy: string;
}
