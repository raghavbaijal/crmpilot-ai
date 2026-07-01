export type BuyingIntent = 'HIGH' | 'MEDIUM' | 'LOW';
export type SiteVisitPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type FollowUpChannel = 'WHATSAPP' | 'EMAIL' | 'CALL' | 'SMS';
export type BudgetSegment = 'LUXURY' | 'PREMIUM' | 'MID-RANGE' | 'AFFORDABLE' | string;

export interface RecommendedProperty {
  location: string;
  propertyType: string;
  priceRange: string;
}

export interface LeadIntelligence {
  leadPriority: string;
  closingProbability: number | string;
  confidenceScore: number;
  buyingIntent: BuyingIntent;
  customerPersona: string;
  urgencyLevel: string;
  budgetSegment: BudgetSegment;
  analysisTimestamp: string;
  summary: string;
  recommendedProperties: RecommendedProperty[];
}

export interface SalesStrategy {
  openingMessage: string;
  discoveryQuestions: string[];
  likelyObjections: string[];
  negotiationTips: string[];
}

export interface ActionPlan {
  recommendedAction: string;
  followUpChannel: FollowUpChannel;
  followUpWithinHours: number;
  siteVisitPriority: SiteVisitPriority;
  documentsToShare: string[];
}

export interface ManagerInsights {
  managerNote: string;
  riskScore: number;
  riskReason: string;
  upsellOpportunity: string;
  crossSellOpportunity: string;
}

export interface CopilotWorkspaceData {
  leadIntelligence: LeadIntelligence;
  salesStrategy: SalesStrategy;
  actionPlan: ActionPlan;
  managerInsights: ManagerInsights;
}

// Phase 4.1 Communication Center types
export type CommunicationType = 'email' | 'whatsapp' | 'call_script' | 'sms' | 'meeting_invitation';

export interface EmailContent {
  subject: string;
  body: string;
}

export interface WhatsAppContent {
  message: string;
}

export interface CallScriptContent {
  opening: string;
  questions: string[];
  closing: string;
}

export interface SMSContent {
  message: string;
}

export interface MeetingInvitationContent {
  title: string;
  agenda: string;
  message: string;
}

export type CommunicationResponse = EmailContent | WhatsAppContent | CallScriptContent | SMSContent | MeetingInvitationContent;
