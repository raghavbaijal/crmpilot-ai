import apiClient from './client';
import { API } from '../../config/api';
import type { FollowupsResponse, AddFollowupRequest, UpdateFollowupRequest, LeadFollowup } from '../../types';

export const getFollowups = async (leadId: number): Promise<FollowupsResponse> => {
  const response = await apiClient.get<FollowupsResponse>(API.getFollowups, {
    params: { leadId },
  });
  return response.data;
};

export const addFollowup = async (request: AddFollowupRequest): Promise<{ success: boolean; followup: LeadFollowup }> => {
  const response = await apiClient.post<{ success: boolean; followup: LeadFollowup }>(API.addFollowup, request);
  return response.data;
};

export const updateFollowup = async (request: UpdateFollowupRequest): Promise<{ success: boolean; followup: LeadFollowup }> => {
  const response = await apiClient.patch<{ success: boolean; followup: LeadFollowup }>(API.updateFollowup, request);
  return response.data;
};
