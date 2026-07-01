import apiClient from './client';
import { API } from '../../config/api';
import type { PipelineResponse } from '../../types';

export const getPipeline = async (): Promise<PipelineResponse> => {
  const response = await apiClient.get<PipelineResponse>(API.pipeline);
  return response.data;
};
