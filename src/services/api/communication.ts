import apiClient from './client';
import type { LeadAnalysis, CopilotWorkspaceData, CommunicationType, CommunicationResponse } from '../../types';
import { API } from '../../config/api';

interface RawCommunicationResponse {
  subject?: string;
  emailSubject?: string;
  email_subject?: string;
  body?: string;
  emailBody?: string;
  email_body?: string;
  message?: string;
  whatsappMessage?: string;
  whatsapp_message?: string;
  opening?: string;
  callOpening?: string;
  call_opening?: string;
  questions?: string[];
  callQuestions?: string[];
  call_questions?: string[];
  closing?: string;
  callClosing?: string;
  call_closing?: string;
  smsMessage?: string;
  sms_message?: string;
  title?: string;
  meetingTitle?: string;
  meeting_title?: string;
  agenda?: string;
  meetingAgenda?: string;
  meeting_agenda?: string;
  meetingMessage?: string;
  meeting_message?: string;
}

export const generateCommunication = async (
  type: CommunicationType,
  lead: LeadAnalysis,
  copilot: CopilotWorkspaceData
): Promise<CommunicationResponse> => {
  const payload = {
    type,
    lead: {
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
    },
    copilot: {
      lead_intelligence: {
        lead_priority: copilot.leadIntelligence.leadPriority,
        closing_probability: copilot.leadIntelligence.closingProbability,
        buying_intent: copilot.leadIntelligence.buyingIntent,
        customer_persona: copilot.leadIntelligence.customerPersona,
        urgency_level: copilot.leadIntelligence.urgencyLevel,
        budget_segment: copilot.leadIntelligence.budgetSegment,
        summary: copilot.leadIntelligence.summary,
      },
      sales_strategy: {
        opening_message: copilot.salesStrategy.openingMessage,
        discovery_questions: copilot.salesStrategy.discoveryQuestions,
        likely_objections: copilot.salesStrategy.likelyObjections,
        negotiation_tips: copilot.salesStrategy.negotiationTips,
      },
      action_plan: {
        recommended_action: copilot.actionPlan.recommendedAction,
        follow_up_channel: copilot.actionPlan.followUpChannel,
        follow_up_within_hours: copilot.actionPlan.followUpWithinHours,
        site_visit_priority: copilot.actionPlan.siteVisitPriority,
      },
      manager_insights: {
        manager_note: copilot.managerInsights.managerNote,
        risk_score: copilot.managerInsights.riskScore,
        risk_reason: copilot.managerInsights.riskReason,
      },
    },
  };

  const response = await apiClient.post<RawCommunicationResponse>(API.communication, payload);
  const data = response.data;

  let result: CommunicationResponse;
  switch (type) {
    case 'email':
      result = {
        subject: data.subject ?? data.emailSubject ?? data.email_subject ?? 'Property Consultation - Real Estate Lead',
        body: data.body ?? data.emailBody ?? data.email_body ?? data.message ?? 'Dear Client,\n\nI hope this email finds you well...',
      };
      break;
    case 'whatsapp':
      result = {
        message: data.message ?? data.whatsappMessage ?? data.whatsapp_message ?? data.body ?? 'Hi, thank you for reaching out...',
      };
      break;
    case 'call_script':
      result = {
        opening: data.opening ?? data.callOpening ?? data.call_opening ?? 'Hello, may I speak with...',
        questions: Array.isArray(data.questions ?? data.callQuestions ?? data.call_questions)
          ? (data.questions ?? data.callQuestions ?? data.call_questions) as string[]
          : [],
        closing: data.closing ?? data.callClosing ?? data.call_closing ?? 'Thank you for your time. Speak soon.',
      };
      break;
    case 'sms':
      result = {
        message: data.message ?? data.smsMessage ?? data.sms_message ?? data.body ?? 'Hi, this is...',
      };
      break;
    case 'meeting_invitation':
      result = {
        title: data.title ?? data.meetingTitle ?? data.meeting_title ?? 'Real Estate Site Visit & Consultation',
        agenda: data.agenda ?? data.meetingAgenda ?? data.meeting_agenda ?? 'Discuss budget and location matches.',
        message: data.message ?? data.meetingMessage ?? data.meeting_message ?? data.body ?? 'Looking forward to meeting you.',
      };
      break;
    default:
      throw new Error(`Unsupported communication type: ${type}`);
  }

  return result;
};
