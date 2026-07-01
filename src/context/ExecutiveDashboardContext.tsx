import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useDashboardSummary } from './DashboardSummaryContext';
import { useAnalytics } from './AnalyticsContext';
import { usePipeline } from './PipelineContext';
import { useManagerInsights } from './ManagerInsightsContext';


interface ExecutiveDashboardContextType {
  loading: boolean;
  error: Error | null;
  lastUpdated: string | null;
  refreshAll: () => Promise<void>;
}

const ExecutiveDashboardContext = createContext<ExecutiveDashboardContextType | undefined>(undefined);

export const ExecutiveDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    loading: summaryLoading,
    error: summaryError,
    refreshSummary,
  } = useDashboardSummary();

  const {
    loading: analyticsLoading,
    error: analyticsError,
    lastUpdated,
    refreshAnalytics,
  } = useAnalytics();

  const {
    loading: pipelineLoading,
    error: pipelineError,
    refreshPipeline,
  } = usePipeline();

  const {
    loading: insightsLoading,
    error: insightsError,
    refreshManagerInsights,
  } = useManagerInsights();

  const loading = summaryLoading || analyticsLoading || pipelineLoading || insightsLoading;
  const error = summaryError || analyticsError || pipelineError || insightsError;

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshSummary(), refreshAnalytics(), refreshPipeline(), refreshManagerInsights()]);
  }, [refreshSummary, refreshAnalytics, refreshPipeline, refreshManagerInsights]);



  const value = useMemo(
    () => ({
      loading,
      error,
      lastUpdated,
      refreshAll,
    }),
    [loading, error, lastUpdated, refreshAll]
  );

  return (
    <ExecutiveDashboardContext.Provider value={value}>
      {children}
    </ExecutiveDashboardContext.Provider>
  );
};

export const useExecutiveDashboard = () => {
  const context = useContext(ExecutiveDashboardContext);
  if (context === undefined) {
    throw new Error('useExecutiveDashboard must be used within an ExecutiveDashboardProvider');
  }
  return context;
};
