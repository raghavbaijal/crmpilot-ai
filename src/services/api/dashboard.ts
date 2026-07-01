import apiClient from './client';
import { API } from '../../config/api';
import type { DashboardSummary, AnalyticsData, FunnelStage, ExecutiveInsightsData } from '../../types';

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await apiClient.get<DashboardSummary>(API.dashboardSummary);
  return response.data;
};


export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  const response = await apiClient.get<AnalyticsData>(API.analytics);
  return response.data;
};

export const getPipelineData = async (): Promise<FunnelStage[]> => {
  const response = await apiClient.get<FunnelStage[]>(API.pipeline);
  return Array.isArray(response.data) ? response.data : [];
};

export const getExecutiveInsights = async (leadsCount: number): Promise<ExecutiveInsightsData> => {
  const response = await apiClient.post<ExecutiveInsightsData>(API.executiveInsights, { leadsCount });
  return response.data;
};
