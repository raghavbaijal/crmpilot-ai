import apiClient from './client';
import { API } from '../../config/api';
import type { TasksResponse, AddTaskRequest, UpdateTaskRequest, LeadTask } from '../../types';

export const getTasks = async (leadId: number): Promise<TasksResponse> => {
  const response = await apiClient.get<TasksResponse>(API.getTasks, {
    params: { leadId },
  });
  return response.data;
};

export const addTask = async (request: AddTaskRequest): Promise<{ success: boolean; task: LeadTask }> => {
  const response = await apiClient.post<{ success: boolean; task: LeadTask }>(API.addTask, request);
  return response.data;
};

export const updateTask = async (request: UpdateTaskRequest): Promise<{ success: boolean; task: LeadTask }> => {
  const response = await apiClient.patch<{ success: boolean; task: LeadTask }>(API.updateTask, request);
  return response.data;
};
