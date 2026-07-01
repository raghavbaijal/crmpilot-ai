import apiClient from './client';
import { API } from '../../config/api';
import type { NotesResponse, AddNoteRequest, LeadNote } from '../../types';

export const getNotes = async (leadId: number): Promise<NotesResponse> => {
  const response = await apiClient.get<NotesResponse>(API.getNotes, {
    params: { leadId },
  });
  return response.data;
};

export const addNote = async (request: AddNoteRequest): Promise<{ success: boolean; note: LeadNote }> => {
  const response = await apiClient.post<{ success: boolean; note: LeadNote }>(API.addNote, request);
  return response.data;
};
