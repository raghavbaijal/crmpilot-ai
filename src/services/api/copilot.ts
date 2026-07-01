import apiClient from './client';
import type { LeadAnalysis, CopilotWorkspaceData, CopilotAPIResponse, BuyingIntent, SiteVisitPriority, FollowUpChannel } from '../../types';
import { API } from '../../config/api';

interface RawProperty {
  location?: string;
  property_type?: string;
  propertyType?: string;
  price_range?: string;
  priceRange?: string;
}

export const generateSalesCopilot = async (lead: LeadAnalysis): Promise<CopilotWorkspaceData> => {
  const payload = {
    id: lead.id,
    customer_name: lead.customerName,
    customerName: lead.customerName,
    phone: lead.phone,
    chat_input: lead.chatInput,
    chatInput: lead.chatInput,
    location: lead.location,
    budget: lead.budget,
    property_type: lead.propertyType,
    propertyType: lead.propertyType,
    timeline: lead.timeline,
    lead_classification: lead.leadClassification,
    leadClassification: lead.leadClassification,
    confidence_score: lead.confidenceScore,
    confidenceScore: lead.confidenceScore,
    reason: lead.reason,
    recommended_action: lead.recommendedAction,
    recommendedAction: lead.recommendedAction,
  };

  const response = await apiClient.post<CopilotAPIResponse>(API.salesCopilot, payload);
  const data = response.data;

  // Sturdy sub-structure resolutions
  const rawIntel = data.lead_intelligence ?? data.leadIntelligence ?? {};
  const rawStrategy = data.sales_strategy ?? data.salesStrategy ?? {};
  const rawPlan = data.action_plan ?? data.actionPlan ?? {};
  const rawInsights = data.manager_insights ?? data.managerInsights ?? {};

  const rawProps = (rawIntel.recommended_properties ?? rawIntel.recommendedProperties ?? []) as RawProperty[];
  const recommendedProperties = rawProps.map((p) => ({
    location: p.location ?? 'N/A',
    propertyType: p.property_type ?? p.propertyType ?? 'N/A',
    priceRange: p.price_range ?? p.priceRange ?? 'N/A',
  }));

  const leadIntelligence = {
    leadPriority: rawIntel.lead_priority ?? rawIntel.leadPriority ?? lead.leadClassification,
    closingProbability: rawIntel.closing_probability ?? rawIntel.closingProbability ?? 'N/A',
    confidenceScore: rawIntel.confidence_score ?? rawIntel.confidenceScore ?? lead.confidenceScore,
    buyingIntent: (rawIntel.buying_intent ?? rawIntel.buyingIntent ?? 'MEDIUM').toUpperCase() as BuyingIntent,
    customerPersona: rawIntel.customer_persona ?? rawIntel.customerPersona ?? 'Client',
    urgencyLevel: rawIntel.urgency_level ?? rawIntel.urgencyLevel ?? 'Medium',
    budgetSegment: rawIntel.budget_segment ?? rawIntel.budgetSegment ?? 'N/A',
    analysisTimestamp: rawIntel.analysis_timestamp ?? rawIntel.analysisTimestamp ?? new Date().toISOString(),
    summary: rawIntel.summary ?? 'No summary available.',
    recommendedProperties,
  };

  const salesStrategy = {
    openingMessage: rawStrategy.opening_message ?? rawStrategy.openingMessage ?? 'Hello, thank you for reaching out.',
    discoveryQuestions: Array.isArray(rawStrategy.discovery_questions ?? rawStrategy.discoveryQuestions)
      ? (rawStrategy.discovery_questions ?? rawStrategy.discoveryQuestions)
      : [],
    likelyObjections: Array.isArray(rawStrategy.likely_objections ?? rawStrategy.likelyObjections)
      ? (rawStrategy.likely_objections ?? rawStrategy.likelyObjections)
      : [],
    negotiationTips: Array.isArray(rawStrategy.negotiation_tips ?? rawStrategy.negotiationTips)
      ? (rawStrategy.negotiation_tips ?? rawStrategy.negotiationTips)
      : [],
  };

  const actionPlan = {
    recommendedAction: rawPlan.recommended_action ?? rawPlan.recommendedAction ?? 'Follow up with client.',
    followUpChannel: (rawPlan.follow_up_channel ?? rawPlan.followUpChannel ?? 'CALL').toUpperCase() as FollowUpChannel,
    followUpWithinHours: rawPlan.follow_up_within_hours ?? rawPlan.followUpWithinHours ?? 24,
    siteVisitPriority: (rawPlan.site_visit_priority ?? rawPlan.siteVisitPriority ?? 'MEDIUM').toUpperCase() as SiteVisitPriority,
    documentsToShare: Array.isArray(rawPlan.documents_to_share ?? rawPlan.documentsToShare)
      ? (rawPlan.documents_to_share ?? rawPlan.documentsToShare)
      : [],
  };

  const managerInsights = {
    managerNote: rawInsights.manager_note ?? rawInsights.managerNote ?? 'No notes provided.',
    riskScore: rawInsights.risk_score ?? rawInsights.riskScore ?? 0,
    riskReason: rawInsights.risk_reason ?? rawInsights.riskReason ?? 'No risks identified.',
    upsellOpportunity: rawInsights.upsell_opportunity ?? rawInsights.upsellOpportunity ?? 'N/A',
    crossSellOpportunity: rawInsights.cross_sell_opportunity ?? rawInsights.crossSellOpportunity ?? 'N/A',
  };

  return {
    leadIntelligence,
    salesStrategy,
    actionPlan,
    managerInsights,
  };
};
