import type { APIResponse, LeadAnalysis } from '../types';
export function normalizeLead(response: APIResponse): LeadAnalysis {
  const id = response.id ?? 0;
  const customerName = response.customer_name ?? response.customerName ?? 'Unknown Client';
  const phone = response.phone ?? 'N/A';
  const chatInput = response.chat_input ?? response.chatInput ?? 'N/A';
  
  const location = response.location ?? 'N/A';
  const budget = response.budget ?? 'N/A';
  const propertyType = response.property_type ?? response.propertyType ?? 'N/A';
  const timeline = response.timeline ?? 'N/A';
  
  // Normalize classification
  const rawClassification = (response.lead_classification ?? response.leadClassification ?? 'COLD').toUpperCase();
  let leadClassification: 'HOT' | 'WARM' | 'COLD' = 'COLD';
  if (rawClassification === 'HOT') {
    leadClassification = 'HOT';
  } else if (rawClassification === 'WARM') {
    leadClassification = 'WARM';
  }
  
  const confidenceScore = response.confidence_score ?? response.confidenceScore ?? 0;
  const reason = response.reason ?? 'No detailed reason provided.';
  const recommendedAction = response.recommended_action ?? response.recommendedAction ?? 'No recommended action provided.';
  
  // Normalize created date
  let createdAt = response.created_at ?? response.createdAt ?? response.createdDate ?? '';
  if (!createdAt) {
    createdAt = new Date().toISOString();
  }
  
  return {
    id,
    customerName,
    phone,
    chatInput,
    location,
    budget,
    propertyType,
    timeline,
    leadClassification,
    confidenceScore,
    reason,
    recommendedAction,
    createdAt
  };
}
