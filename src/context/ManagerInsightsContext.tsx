import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ManagerInsightsResponse, CachedManagerInsights } from '../types';
import { getManagerInsights } from '../services/api/managerInsights';
import { toast } from 'react-hot-toast';

interface ManagerInsightsContextType {
  managerInsights: ManagerInsightsResponse | null;
  loading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  lastUpdated: string | null;
  refreshManagerInsights: () => Promise<void>;
}

const ManagerInsightsContext = createContext<ManagerInsightsContextType | undefined>(undefined);

const CACHE_KEY = 'crm_session_manager_insights';
const CACHE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

export const ManagerInsightsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [managerInsights, setManagerInsights] = useState<ManagerInsightsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchInsights = useCallback(async (force = false) => {
    // Cancel any ongoing request before firing a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Check session cache if not forced refresh
    if (!force) {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed: CachedManagerInsights = JSON.parse(cached);
          const elapsed = Date.now() - parsed.timestamp;
          if (elapsed < CACHE_EXPIRATION_MS) {
            setManagerInsights(parsed.data);
            setLastUpdated(new Date(parsed.timestamp).toLocaleTimeString());
            return;
          }
        } catch (e) {
          console.warn('[Cache Parse Error] Clearing malformed cache:', e);
          sessionStorage.removeItem(CACHE_KEY);
        }
      }
    }

    if (force) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await getManagerInsights(controller.signal);
      setManagerInsights(res);
      setLastUpdated(new Date().toLocaleTimeString());

      // Update cache
      const cacheObj: CachedManagerInsights = {
        data: res,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));

      if (force) {
        toast.success('AI Insights regenerated successfully');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'CanceledError') {
        // Request aborted, do not update error state
        return;
      }
      const errorInstance = err instanceof Error ? err : new Error('Unable to connect to AI Manager Insights server.');
      setError(errorInstance);
      toast.error('Unable to fetch AI Manager Insights.');
    } finally {
      if (controller === abortControllerRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  const refreshManagerInsights = useCallback(async () => {
    await fetchInsights(true);
  }, [fetchInsights]);

  // Initial load
  useEffect(() => {
    fetchInsights(false);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchInsights]);

  // Dev-only logger
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Context Update] ManagerInsightsContext state values:', {
        managerInsights: managerInsights ? 'LOADED' : 'NULL',
        loading,
        isRefreshing,
        error: error?.message || null,
        lastUpdated,
      });
    }
  }, [managerInsights, loading, isRefreshing, error, lastUpdated]);

  return (
    <ManagerInsightsContext.Provider
      value={{
        managerInsights,
        loading,
        isRefreshing,
        error,
        lastUpdated,
        refreshManagerInsights,
      }}
    >
      {children}
    </ManagerInsightsContext.Provider>
  );
};

export const useManagerInsights = () => {
  const context = useContext(ManagerInsightsContext);
  if (context === undefined) {
    throw new Error('useManagerInsights must be used within a ManagerInsightsProvider');
  }
  return context;
};
