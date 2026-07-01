import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { TimelineResponse, TimelineEvent, TimelineMetadata } from '../types';
import { getLeadTimeline } from '../services/api/timeline';
import { useLeads } from './LeadContext';
import { toast } from 'react-hot-toast';

interface TimelineContextType {
  timeline: TimelineEvent[];
  metadata: TimelineMetadata | null;
  loading: boolean;
  isRefreshing: boolean;
  hasTimeline: boolean;
  error: Error | null;
  lastUpdated: string | null;
  selectedLeadId: number | null;
  refreshTimeline: () => Promise<void>;
  getTimelineForLead: (leadId: number) => Promise<void>;
  clearTimeline: () => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedLead } = useLeads();
  const [cache, setCache] = useState<Record<number, TimelineResponse>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const selectedLeadId = selectedLead?.id || null;
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestsRef = useRef<Record<number, boolean>>({});

  const fetchTimeline = useCallback(async (leadId: number, force = false) => {
    // Prevent duplicate concurrent requests for the same lead
    if (activeRequestsRef.current[leadId]) {
      return;
    }

    // Cancel any previous pending abort controller request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Check Cache
    if (!force && cache[leadId]) {
      setLastUpdated(new Date().toLocaleTimeString());
      return;
    }

    if (force) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    activeRequestsRef.current[leadId] = true;

    try {
      const data = await getLeadTimeline(leadId, controller.signal);
      setCache((prev) => ({
        ...prev,
        [leadId]: data,
      }));
      setLastUpdated(new Date().toLocaleTimeString());
      
      if (force) {
        toast.success('Lead Timeline updated successfully');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'CanceledError') {
        return;
      }
      const errorInstance = err instanceof Error ? err : new Error('Unable to retrieve lead timeline.');
      setError(errorInstance);
      toast.error('Failed to retrieve timeline data.');
    } finally {
      delete activeRequestsRef.current[leadId];
      if (controller === abortControllerRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [cache]);

  // Expose manual retrieval
  const getTimelineForLead = useCallback(async (leadId: number) => {
    await fetchTimeline(leadId, false);
  }, [fetchTimeline]);

  // Expose manual refresh
  const refreshTimeline = useCallback(async () => {
    if (selectedLeadId !== null) {
      await fetchTimeline(selectedLeadId, true);
    }
  }, [selectedLeadId, fetchTimeline]);

  // Expose clear cache
  const clearTimeline = useCallback(() => {
    setCache({});
    setError(null);
    setLastUpdated(null);
  }, []);

  // Listen to selectedLeadId from LeadContext to auto-fetch or load instantly
  useEffect(() => {
    if (selectedLeadId !== null) {
      fetchTimeline(selectedLeadId, false);
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
  }, [selectedLeadId, fetchTimeline]);

  // Memoized derived selectors
  const timeline = useMemo<TimelineEvent[]>(() => {
    if (selectedLeadId === null || !cache[selectedLeadId]) return [];
    
    // Derived memoized chronological/reverse-chronological sorting
    return [...(cache[selectedLeadId].timeline || [])].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [selectedLeadId, cache]);

  const metadata = useMemo<TimelineMetadata | null>(() => {
    if (selectedLeadId === null || !cache[selectedLeadId]) return null;
    return cache[selectedLeadId].metadata || null;
  }, [selectedLeadId, cache]);

  const hasTimeline = useMemo<boolean>(() => {
    return timeline.length > 0;
  }, [timeline]);

  // Dev-only logging
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Context Update] TimelineContext values:', {
        selectedLeadId,
        eventsCount: timeline.length,
        hasTimeline,
        loading,
        isRefreshing,
        error: error?.message || null,
      });
    }
  }, [selectedLeadId, timeline, hasTimeline, loading, isRefreshing, error]);

  return (
    <TimelineContext.Provider
      value={{
        timeline,
        metadata,
        loading,
        isRefreshing,
        hasTimeline,
        error,
        lastUpdated,
        selectedLeadId,
        refreshTimeline,
        getTimelineForLead,
        clearTimeline,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
};
