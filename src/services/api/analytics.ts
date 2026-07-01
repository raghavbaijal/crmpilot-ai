import apiClient from './client';
import { API } from '../../config/api';
import type { AnalyticsResponse } from '../../types';

export const getAnalytics = async (): Promise<AnalyticsResponse> => {
  const response = await apiClient.get<AnalyticsResponse>(API.analytics);
  return response.data;
};
