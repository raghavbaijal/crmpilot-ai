import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { PipelineResponse, ComputedPipelineStage, PipelineSummary, PipelineMetadata } from '../types';
import { getPipeline } from '../services/api/pipeline';
import { toast } from 'react-hot-toast';

interface PipelineContextType {
  pipeline: ComputedPipelineStage[];
  summary: PipelineSummary | null;
  metadata: PipelineMetadata | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: string | null;
  refreshPipeline: () => Promise<void>;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

const STAGES_ORDER: (keyof typeof STAGES_ORDER_MAP)[] = [
  'NEW',
  'QUALIFIED',
  'CONTACTED',
  'SITE_VISIT',
  'NEGOTIATION',
  'BOOKED',
  'WON',
  'LOST',
];

const STAGES_ORDER_MAP = {
  NEW: 0,
  QUALIFIED: 1,
  CONTACTED: 2,
  SITE_VISIT: 3,
  NEGOTIATION: 4,
  BOOKED: 5,
  WON: 6,
  LOST: 7,
};

export const PipelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawData, setRawData] = useState<PipelineResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchPipelineData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPipeline();
      setRawData(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      const errorInstance = err instanceof Error ? err : new Error('Unable to contact pipeline server.');
      setError(errorInstance);
      toast.error('Unable to fetch sales pipeline.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPipeline = useCallback(async () => {
    await fetchPipelineData();
  }, [fetchPipelineData]);

  // Initial load
  useEffect(() => {
    fetchPipelineData();
  }, [fetchPipelineData]);

  // Compute stages percentages of total and previous inside Context
  const computedPipeline = useMemo<ComputedPipelineStage[]>(() => {
    if (!rawData || !rawData.pipeline) return [];

    const rawStages = rawData.pipeline;
    const computed: ComputedPipelineStage[] = [];

    // Calculate percentage based on total or NEW stage
    const baseCount = rawStages.NEW || rawData.summary.total || 1;

    STAGES_ORDER.forEach((stage, idx) => {
      const count = rawStages[stage] || 0;
      const percentageOfTotal = Math.round((count / baseCount) * 100);

      let percentageOfPrevious = 100;
      if (idx > 0) {
        const prevStage = STAGES_ORDER[idx - 1];
        const prevCount = rawStages[prevStage] || 0;
        percentageOfPrevious = prevCount ? Math.round((count / prevCount) * 100) : 0;
      }

      computed.push({
        stage,
        count,
        percentageOfTotal,
        percentageOfPrevious,
      });
    });

    return computed;
  }, [rawData]);

  // Composing values
  const summary = rawData?.summary || null;
  const metadata = rawData?.metadata || null;

  // Dev-only logger
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Context Update] PipelineContext state values:', {
        computedStagesCount: computedPipeline.length,
        summary: summary ? 'LOADED' : 'NULL',
        loading,
        error: error?.message || null,
      });
    }
  }, [computedPipeline, summary, loading, error]);

  return (
    <PipelineContext.Provider
      value={{
        pipeline: computedPipeline,
        summary,
        metadata,
        loading,
        error,
        lastUpdated,
        refreshPipeline,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (context === undefined) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};
