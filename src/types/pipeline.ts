export interface PipelineStages {
  NEW: number;
  QUALIFIED: number;
  CONTACTED: number;
  SITE_VISIT: number;
  NEGOTIATION: number;
  BOOKED: number;
  WON: number;
  LOST: number;
}

export interface PipelineSummary {
  total: number;
  active_pipeline: number;
  won: number;
  lost: number;
  conversion_rate: number;
  loss_rate: number;
  // Extended Future-Proof Fields
  average_stage_conversion?: number;
  stalled_leads?: number;
  followup_due?: number;
  average_days_in_pipeline?: number;
}

export interface PipelineMetadata {
  generated_at: string;
  version: string;
  // Extended Metadata Fields
  last_refresh_duration?: number;
  source?: string;
}

export interface PipelineResponse {
  pipeline: PipelineStages;
  summary: PipelineSummary;
  metadata: PipelineMetadata;
}

export interface ComputedPipelineStage {
  stage: keyof PipelineStages;
  count: number;
  percentageOfTotal: number;
  percentageOfPrevious: number;
}
