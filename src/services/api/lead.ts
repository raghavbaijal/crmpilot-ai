import apiClient from './client';
import type { LeadRequest, LeadAnalysis, APIResponse } from '../../types';
import { normalizeLead } from '../../utils/normalizeLead';
import { API } from '../../config/api';

export const submitLead = async (data: LeadRequest): Promise<LeadAnalysis> => {
  const response = await apiClient.post<APIResponse>(API.qualifyLead, data);
  return normalizeLead(response.data);
};

export const getAllLeads = async (): Promise<LeadAnalysis[]> => {
  const response = await apiClient.get<APIResponse[]>(API.getLeads);
  const rawLeads = Array.isArray(response.data) ? response.data : [];
  return rawLeads.map(normalizeLead);
};

export const getLeadById = async (id: number): Promise<LeadAnalysis> => {
  const leads = await getAllLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) {
    throw new Error(`Lead with ID ${id} not found.`);
  }
  return lead;
};

// Placeholder delete function
export const deleteLead = async (id: number): Promise<void> => {
  if (import.meta.env.DEV) {
    console.warn(`deleteLead placeholder invoked for ID: ${id}`);
  }
};
