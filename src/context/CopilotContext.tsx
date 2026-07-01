import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import type { LeadAnalysis, CopilotWorkspaceData } from '../types';
import { generateSalesCopilot } from '../services/api/copilot';
import { toast } from 'react-hot-toast';

interface CopilotContextType {
  analysis: CopilotWorkspaceData | null;
  loading: boolean;
  stageIndex: number;
  error: Error | null;
  selectedLeadId: number | null;
  getAnalysisForLead: (lead: LeadAnalysis) => Promise<void>;
  regenerateAnalysis: (lead: LeadAnalysis) => Promise<void>;
  clearAnalysis: () => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const CopilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analysis, setAnalysis] = useState<CopilotWorkspaceData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  
  const [cache, setCache] = useState<Record<number, CopilotWorkspaceData>>({});
  const intervalRef = useRef<number | null>(null);

  // Dev-only context updates logging
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Context Update] CopilotContext state values:', {
        analysis: analysis ? 'LOADED' : 'NULL',
        loading,
        stageIndex,
        error: error?.message || null,
        selectedLeadId,
        cacheKeys: Object.keys(cache),
      });
    }
  }, [analysis, loading, stageIndex, error, selectedLeadId, cache]);


  const startLoadingStages = useCallback(() => {
    setStageIndex(0);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setStageIndex((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);
  }, []);

  const stopLoadingStages = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchAnalysis = useCallback(async (lead: LeadAnalysis) => {
    setLoading(true);
    setError(null);
    setSelectedLeadId(lead.id);
    startLoadingStages();

    try {
      const startTime = Date.now();
      const result = await generateSalesCopilot(lead);

      const elapsed = Date.now() - startTime;
      const minDuration = 6000;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      stopLoadingStages();
      setStageIndex(4); // Completed
      setAnalysis(result);
      setCache((prev) => ({ ...prev, [lead.id]: result }));
    } catch (err: unknown) {
      stopLoadingStages();
      const errorInstance = err instanceof Error ? err : new Error('Unable to generate AI Sales Copilot analysis.');
      setError(errorInstance);
      setAnalysis(null);
      toast.error('Unable to generate AI Sales Copilot analysis.');
    } finally {
      setLoading(false);
    }
  }, [startLoadingStages, stopLoadingStages]);

  const getAnalysisForLead = useCallback(async (lead: LeadAnalysis) => {
    if (cache[lead.id]) {
      setAnalysis(cache[lead.id]);
      setSelectedLeadId(lead.id);
      setError(null);
      setLoading(false);
      return;
    }

    await fetchAnalysis(lead);
  }, [cache, fetchAnalysis]);

  const regenerateAnalysis = useCallback(async (lead: LeadAnalysis) => {
    await fetchAnalysis(lead);
  }, [fetchAnalysis]);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setSelectedLeadId(null);
    setError(null);
    setLoading(false);
    stopLoadingStages();
  }, [stopLoadingStages]);


  return (
    <CopilotContext.Provider
      value={{
        analysis,
        loading,
        stageIndex,
        error,
        selectedLeadId,
        getAnalysisForLead,
        regenerateAnalysis,
        clearAnalysis,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

export const useCopilot = () => {
  const context = useContext(CopilotContext);
  if (context === undefined) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
};

