import type { LeadClassification } from './lead';

export interface APIResponse {
  id?: number;
  customer_name?: string;
  customerName?: string;
  phone?: string;
  chat_input?: string;
  chatInput?: string;
  location?: string;
  budget?: string;
  property_type?: string;
  propertyType?: string;
  timeline?: string;
  lead_classification?: string;
  leadClassification?: LeadClassification;
  confidence_score?: number;
  confidenceScore?: number;
  reason?: string;
  recommended_action?: string;
  recommendedAction?: string;
  created_at?: string;
  createdAt?: string;
  createdDate?: string;
}

export interface CopilotAPIResponse {
  lead_intelligence?: {
    lead_priority?: string;
    leadPriority?: string;
    closing_probability?: number | string;
    closingProbability?: number | string;
    confidence_score?: number;
    confidenceScore?: number;
    buying_intent?: string;
    buyingIntent?: string;
    customer_persona?: string;
    customerPersona?: string;
    urgency_level?: string;
    urgencyLevel?: string;
    budget_segment?: string;
    budgetSegment?: string;
    analysis_timestamp?: string;
    analysisTimestamp?: string;
    summary?: string;
    recommended_properties?: Array<{
      location?: string;
      property_type?: string;
      propertyType?: string;
      price_range?: string;
      priceRange?: string;
    }>;
    recommendedProperties?: Array<{
      location?: string;
      propertyType?: string;
      priceRange?: string;
    }>;
  };
  leadIntelligence?: any;
  
  sales_strategy?: {
    opening_message?: string;
    openingMessage?: string;
    discovery_questions?: string[];
    discoveryQuestions?: string[];
    likely_objections?: string[];
    likelyObjections?: string[];
    negotiation_tips?: string[];
    negotiationTips?: string[];
  };
  salesStrategy?: any;
  
  action_plan?: {
    recommended_action?: string;
    recommendedAction?: string;
    follow_up_channel?: string;
    followUpChannel?: string;
    follow_up_within_hours?: number;
    followUpWithinHours?: number;
    site_visit_priority?: string;
    siteVisitPriority?: string;
    documents_to_share?: string[];
    documentsToShare?: string[];
  };
  actionPlan?: any;
  
  manager_insights?: {
    manager_note?: string;
    managerNote?: string;
    risk_score?: number;
    riskScore?: number;
    risk_reason?: string;
    riskReason?: string;
    upsell_opportunity?: string;
    upsellOpportunity?: string;
    cross_sell_opportunity?: string;
    crossSellOpportunity?: string;
  };
  managerInsights?: any;
}

export interface DashboardSummaryData {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  averageConfidenceScore: number;
  highPriorityLeads: number;
  newLeadsToday: number;
}

export interface DashboardSummary {
  total_leads: number;
  hot_leads: number;
  warm_leads: number;
  cold_leads: number;
  average_confidence: number;
  high_priority: number;
  new_today: number;
}


export interface AnalyticsData {
  leadClassification: { name: string; value: number }[];
  monthlyLeads: { month: string; count: number }[];
  budgetDistribution: { segment: string; count: number }[];
  propertyType: { type: string; value: number }[];
  topLocations: { location: string; count: number }[];
  confidenceScoreDistribution: { range: string; count: number }[];
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface ExecutiveInsightsData {
  executiveSummary: string;
  priorityActions: string[];
  revenueForecast: string;
  businessRecommendations: string[];
  highRiskAlerts: string[];
}

