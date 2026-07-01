export interface LeadTask {
  id: number;
  lead_id: number;
  title: string;
  description: string;
  status: "PENDING" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  due_date: string | null;
  formatted_due_date: string | null;
  formatted_created_date: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  overdue: boolean;
  // Extended Future-Proof Fields
  created_by?: string;
  category?: string;
  estimated_duration?: number;
  tags?: string[];
}

export interface TaskSummary {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  high_priority: number;
  medium_priority: number;
  low_priority: number;
  // Extended Fields
  completion_rate?: number;
  due_today?: number;
  due_this_week?: number;
  future_tasks?: number;
}

export interface TaskMetadata {
  generated_at: string;
  version: string;
  source: string;
}

export interface TasksResponse {
  success: boolean;
  lead_id: number;
  summary: TaskSummary;
  completion_percentage: number;
  upcoming_tasks: LeadTask[];
  tasks: LeadTask[];
  metadata: TaskMetadata;
}

export interface AddTaskRequest {
  leadId: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
  assignedTo: string;
}

export interface UpdateTaskRequest {
  taskId: number;
  title?: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  status?: "PENDING" | "COMPLETED";
  dueDate?: string;
  assignedTo?: string;
}
