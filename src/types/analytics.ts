export interface AnalyticsResponse {
  classification: Record<string, number>;
  property_types: Record<string, number>;
  locations: Record<string, number>;
  monthly_leads: Record<string, number>;
  confidence_distribution: Record<string, number>;
  budget_distribution: Record<string, number>;
  metadata?: {
    generated_at?: string;
    version?: string;
  };
}

export interface ChartDataItem {
  name: string;
  value: number;
}

export interface MonthlyChartItem {
  month: string;
  count: number;
}

export interface BudgetChartItem {
  segment: string;
  count: number;
}

export interface LocationChartItem {
  location: string;
  count: number;
}

export interface ConfidenceChartItem {
  range: string;
  count: number;
}

export interface NormalizedAnalyticsData {
  classification: ChartDataItem[];
  propertyTypes: ChartDataItem[];
  locations: LocationChartItem[];
  monthlyLeads: MonthlyChartItem[];
  confidenceDistribution: ConfidenceChartItem[];
  budgetDistribution: BudgetChartItem[];
}

export interface ExecutiveMetrics {
  totalLeads: number;
  hotPercentage: number;
  warmPercentage: number;
  coldPercentage: number;
  averageConfidence: number;
  highPriorityPercentage: number;
  todayGrowth: number;
}

export interface FutureProofLeadField {
  leadStatus?: string;
  pipelineStage?: string;
  assignedExecutive?: string;
  createdTimestamp?: string;
  updatedTimestamp?: string;
}
