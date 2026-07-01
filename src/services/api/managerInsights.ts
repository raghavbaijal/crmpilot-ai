import apiClient from './client';
import { API } from '../../config/api';
import type { ManagerInsightsResponse } from '../../types';

export const getManagerInsights = async (signal?: AbortSignal): Promise<ManagerInsightsResponse> => {
  const response = await apiClient.post<ManagerInsightsResponse>(
    API.executiveInsights,
    {},
    { signal }
  );
  return response.data;
};
