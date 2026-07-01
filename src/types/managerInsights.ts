export interface ManagerInsightsResponse {
  executive_summary: string;
  priority_actions: string[];
  business_insights: string[];
  revenue_forecast: string;
  high_risk_alerts: string[];
  manager_recommendations: string[];
  // Extended Metadata
  generated_at?: string;
  model?: string;
  version?: string;
  cached?: boolean;
}

export interface CachedManagerInsights {
  data: ManagerInsightsResponse;
  timestamp: number;
}
