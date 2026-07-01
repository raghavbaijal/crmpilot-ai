import apiClient from './client';
import { API } from '../../config/api';
import type { TimelineResponse } from '../../types';

export const getLeadTimeline = async (leadId: number, signal?: AbortSignal): Promise<TimelineResponse> => {
  const response = await apiClient.get<TimelineResponse>(API.leadTimeline, {
    params: { id: leadId },
    signal,
  });
  return response.data;
};
