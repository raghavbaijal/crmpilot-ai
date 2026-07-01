export type LeadClassification = 'HOT' | 'WARM' | 'COLD';

export interface LeadRequest {
  customer_name: string;
  phone: string;
  chatInput: string;
}

export interface LeadAnalysis {
  id: number;
  customerName: string;
  phone: string;
  chatInput: string;
  location: string;
  budget: string;
  propertyType: string;
  timeline: string;
  leadClassification: LeadClassification;
  confidenceScore: number;
  reason: string;
  recommendedAction: string;
  createdAt: string;
}
