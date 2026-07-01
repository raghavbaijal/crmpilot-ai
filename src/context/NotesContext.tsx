import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { NotesResponse, LeadNote, NotesMetadata } from '../types';
import { getNotes as getNotesApi, addNote as addNoteApi } from '../services/api/notes';
import { useLeads } from './LeadContext';
import { toast } from 'react-hot-toast';

interface NotesContextType {
  notes: LeadNote[];
  metadata: NotesMetadata | null;
  loading: boolean;
  isRefreshing: boolean;
  isSubmitting: boolean;
  hasNotes: boolean;
  selectedLeadNotes: LeadNote[];
  error: Error | null;
  lastUpdated: string | null;
  selectedLeadId: number | null;
  refreshNotes: () => Promise<void>;
  getNotesForLead: (leadId: number) => Promise<void>;
  addNote: (noteText: string, createdBy: string) => Promise<void>;
  clearNotes: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedLead } = useLeads();
  const [cache, setCache] = useState<Record<number, NotesResponse>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const selectedLeadId = selectedLead?.id || null;
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestsRef = useRef<Record<number, boolean>>({});

  const fetchNotes = useCallback(async (leadId: number, silent = false) => {
    // Prevent duplicate concurrent requests for the same lead ID
    if (activeRequestsRef.current[leadId]) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Check cache
    if (!silent && !isRefreshing && cache[leadId]) {
      setLastUpdated(new Date().toLocaleTimeString());
      return;
    }

    if (silent || isRefreshing) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    activeRequestsRef.current[leadId] = true;

    try {
      const data = await getNotesApi(leadId);
      setCache((prev) => ({
        ...prev,
        [leadId]: data,
      }));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'CanceledError') {
        return;
      }
      const errorInstance = err instanceof Error ? err : new Error('Unable to retrieve notes.');
      setError(errorInstance);
      toast.error('Failed to load lead notes.');
    } finally {
      delete activeRequestsRef.current[leadId];
      if (controller === abortControllerRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [cache, isRefreshing]);

  // Expose manual retrieval
  const getNotesForLead = useCallback(async (leadId: number) => {
    await fetchNotes(leadId, false);
  }, [fetchNotes]);

  // Expose manual refresh
  const refreshNotes = useCallback(async () => {
    if (selectedLeadId !== null) {
      setIsRefreshing(true);
      await fetchNotes(selectedLeadId, true);
    }
  }, [selectedLeadId, fetchNotes]);

  // Expose clear cache
  const clearNotes = useCallback(() => {
    setCache({});
    setError(null);
    setLastUpdated(null);
  }, []);

  // Expose addNote with Optimistic Updates & Rollbacks
  const addNote = useCallback(async (noteText: string, createdBy: string) => {
    if (selectedLeadId === null || isSubmitting || !noteText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    // Generate temporary negative ID
    const tempId = -Math.floor(Math.random() * 1000000) - 1;
    const tempNote: LeadNote = {
      id: tempId,
      lead_id: selectedLeadId,
      note: noteText,
      created_by: createdBy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      formatted_date: 'Just now',
    };

    // Save previous cache for rollback
    const previousResponse = cache[selectedLeadId];

    // Optimistically update local cache
    setCache((prev) => {
      const currentRes = prev[selectedLeadId] || {
        success: true,
        lead_id: selectedLeadId,
        count: 0,
        notes: [],
        metadata: { generated_at: new Date().toISOString(), version: '1.0', source: 'client' },
      };

      return {
        ...prev,
        [selectedLeadId]: {
          ...currentRes,
          count: currentRes.count + 1,
          notes: [tempNote, ...currentRes.notes],
        },
      };
    });

    try {
      const requestPayload = {
        leadId: selectedLeadId,
        note: noteText,
        createdBy,
      };

      const result = await addNoteApi(requestPayload);

      if (result.success && result.note) {
        // Swap temp note with real note from backend response
        setCache((prev) => {
          const currentRes = prev[selectedLeadId];
          if (!currentRes) return prev;

          const updatedNotes = currentRes.notes.map((n) => (n.id === tempId ? result.note : n));

          return {
            ...prev,
            [selectedLeadId]: {
              ...currentRes,
              notes: updatedNotes,
            },
          };
        });
      } else {
        throw new Error('API returned unsuccessful status');
      }

      toast.success('Note added successfully');

      // Silently refresh notes in the background to ensure consistency
      fetchNotes(selectedLeadId, true);
    } catch (err: unknown) {
      // Rollback optimistic update
      setCache((prev) => ({
        ...prev,
        [selectedLeadId]: previousResponse,
      }));
      setError(err instanceof Error ? err : new Error('Failed to save note.'));
      toast.error('Failed to add note. Rollback applied.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedLeadId, cache, isSubmitting, fetchNotes]);

  // Listen to selectedLeadId from LeadContext to auto-fetch or load instantly
  useEffect(() => {
    if (selectedLeadId !== null) {
      fetchNotes(selectedLeadId, false);
    } else {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedLeadId, fetchNotes]);

  // Memoized derived selectors
  const notes = useMemo<LeadNote[]>(() => {
    if (selectedLeadId === null || !cache[selectedLeadId]) return [];
    
    // Sort by created_at DESC. Do not mutate cached array directly.
    return [...(cache[selectedLeadId].notes || [])].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [selectedLeadId, cache]);

  const selectedLeadNotes = notes;

  const metadata = useMemo<NotesMetadata | null>(() => {
    if (selectedLeadId === null || !cache[selectedLeadId]) return null;
    return cache[selectedLeadId].metadata || null;
  }, [selectedLeadId, cache]);

  const hasNotes = useMemo<boolean>(() => {
    return notes.length > 0;
  }, [notes]);

  // Dev-only logging
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Context Update] NotesContext values:', {
        selectedLeadId,
        notesCount: notes.length,
        hasNotes,
        loading,
        isRefreshing,
        isSubmitting,
        error: error?.message || null,
      });
    }
  }, [selectedLeadId, notes, hasNotes, loading, isRefreshing, isSubmitting, error]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        metadata,
        loading,
        isRefreshing,
        isSubmitting,
        hasNotes,
        selectedLeadNotes,
        error,
        lastUpdated,
        selectedLeadId,
        refreshNotes,
        getNotesForLead,
        addNote,
        clearNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
