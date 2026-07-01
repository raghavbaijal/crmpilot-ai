export const LEAD_PRIORITY = {
  HOT: 'HOT',
  WARM: 'WARM',
  COLD: 'COLD',
} as const;

export type LeadPriorityType = keyof typeof LEAD_PRIORITY;

export const BUYING_INTENT = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export const BUDGET_SEGMENT = {
  PREMIUM: 'PREMIUM',
  MID_RANGE: 'MID-RANGE',
  AFFORDABLE: 'AFFORDABLE',
  LUXURY: 'LUXURY',
  ENTRY_LEVEL: 'ENTRY-LEVEL',
} as const;

export const FOLLOW_UP_CHANNEL = {
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
  CALL: 'CALL',
  SMS: 'SMS',
  MEETING: 'MEETING',
} as const;

export const SITE_VISIT_PRIORITY = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export const RISK_LEVEL = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export const COMMUNICATION_TYPES = {
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  CALL_SCRIPT: 'call_script',
  SMS: 'sms',
  MEETING_INVITATION: 'meeting_invitation',
} as const;
