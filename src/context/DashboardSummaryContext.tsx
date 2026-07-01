import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { DashboardSummary } from '../types';
import { getDashboardSummary } from '../services/api/dashboard';
import { toast } from 'react-hot-toast';

interface DashboardSummaryContextType {
  summary: DashboardSummary | null;
  loading: boolean;
  error: Error | null;
  refreshSummary: () => Promise<void>;
}

const DashboardSummaryContext = createContext<DashboardSummaryContextType | undefined>(undefined);

export const DashboardSummaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardSummary();
      setSummary(res);
    } catch (err: unknown) {
      const errorInstance = err instanceof Error ? err : new Error('Unable to contact dashboard summary server.');
      setError(errorInstance);
      toast.error('Unable to fetch dashboard summary.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSummary = useCallback(async () => {
    await fetchSummary();
  }, [fetchSummary]);

  // Initial load
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Dev-only logger
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Context Update] DashboardSummaryContext state values:', {
        summary: summary ? 'LOADED' : 'NULL',
        loading,
        error: error?.message || null,
      });
    }
  }, [summary, loading, error]);

  return (
    <DashboardSummaryContext.Provider
      value={{
        summary,
        loading,
        error,
        refreshSummary,
      }}
    >
      {children}
    </DashboardSummaryContext.Provider>
  );
};

export const useDashboardSummary = () => {
  const context = useContext(DashboardSummaryContext);
  if (context === undefined) {
    throw new Error('useDashboardSummary must be used within a DashboardSummaryProvider');
  }
  return context;
};
