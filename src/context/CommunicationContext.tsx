import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import type { LeadAnalysis, CopilotWorkspaceData, CommunicationType, CommunicationResponse } from '../types';
import { generateCommunication as apiGenerate } from '../services/api/communication';
import { toast } from 'react-hot-toast';

interface CommunicationContextType {
  selectedType: CommunicationType;
  setSelectedType: (type: CommunicationType) => void;
  generatedContent: CommunicationResponse | null;
  loading: boolean;
  stageIndex: number;
  error: Error | null;
  generateCommunication: (type: CommunicationType, lead: LeadAnalysis, copilot: CopilotWorkspaceData) => Promise<void>;
  regenerateCommunication: (type: CommunicationType, lead: LeadAnalysis, copilot: CopilotWorkspaceData) => Promise<void>;
  clearCommunication: () => void;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const CommunicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedType, setSelectedType] = useState<CommunicationType>('email');
  const [generatedContent, setGeneratedContent] = useState<CommunicationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);

  const [cache, setCache] = useState<Record<number, Partial<Record<CommunicationType, CommunicationResponse>>>>({});
  const intervalRef = useRef<number | null>(null);

  // Dev-only context updates logging
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Context Update] CommunicationContext state values:', {
        selectedType,
        generatedContent: generatedContent ? 'LOADED' : 'NULL',
        loading,
        stageIndex,
        error: error?.message || null,
        cacheKeys: Object.keys(cache),
      });
    }
  }, [selectedType, generatedContent, loading, stageIndex, error, cache]);


  const startLoadingStages = useCallback(() => {
    setStageIndex(0);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setStageIndex((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1500);
  }, []);

  const stopLoadingStages = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchCommunication = useCallback(async (
    type: CommunicationType,
    lead: LeadAnalysis,
    copilot: CopilotWorkspaceData
  ) => {
    setLoading(true);
    setError(null);
    setSelectedType(type);
    startLoadingStages();

    try {
      const startTime = Date.now();
      const result = await apiGenerate(type, lead, copilot);

      const elapsed = Date.now() - startTime;
      const minDuration = 4500;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      stopLoadingStages();
      setStageIndex(3);
      setGeneratedContent(result);

      setCache((prev) => {
        const leadCache = prev[lead.id] ?? {};
        return {
          ...prev,
          [lead.id]: {
            ...leadCache,
            [type]: result,
          },
        };
      });
    } catch (err: unknown) {
      stopLoadingStages();
      const errorInstance = err instanceof Error ? err : new Error('Unable to generate customer communication.');
      setError(errorInstance);
      setGeneratedContent(null);
      toast.error('Unable to generate customer communication.');
    } finally {
      setLoading(false);
    }
  }, [startLoadingStages, stopLoadingStages]);

  const generateCommunication = useCallback(
    async (type: CommunicationType, lead: LeadAnalysis, copilot: CopilotWorkspaceData) => {
      setSelectedType(type);
      const leadCache = cache[lead.id];
      if (leadCache && leadCache[type]) {
        setGeneratedContent(leadCache[type]!);
        setError(null);
        setLoading(false);
        return;
      }

      await fetchCommunication(type, lead, copilot);
    },
    [cache, fetchCommunication]
  );

  const regenerateCommunication = useCallback(
    async (type: CommunicationType, lead: LeadAnalysis, copilot: CopilotWorkspaceData) => {
      await fetchCommunication(type, lead, copilot);
    },
    [fetchCommunication]
  );

  const clearCommunication = useCallback(() => {
    setGeneratedContent(null);
    setSelectedType('email');
    setError(null);
    setLoading(false);
    stopLoadingStages();
  }, [stopLoadingStages]);


  return (
    <CommunicationContext.Provider
      value={{
        selectedType,
        setSelectedType,
        generatedContent,
        loading,
        stageIndex,
        error,
        generateCommunication,
        regenerateCommunication,
        clearCommunication,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
};

