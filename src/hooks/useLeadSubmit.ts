import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import type { LeadRequest, LeadAnalysis } from '../types';

import { submitLead } from '../services/api/lead';





export const useLeadSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<LeadAnalysis | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startLoadingStages = () => {
    setStageIndex(0);
    
    // Clear any existing intervals
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setStageIndex((prev) => {
        if (prev < 3) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);
  };

  const stopLoadingStages = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const submit = async (data: LeadRequest, onSuccess?: (result: LeadAnalysis) => void) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    startLoadingStages();

    try {
      const startTime = Date.now();
      const analysisResult = await submitLead(data);
      
      const elapsed = Date.now() - startTime;
      const minDuration = 4500;
      
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      stopLoadingStages();
      setStageIndex(4); // Completed
      setResult(analysisResult);
      toast.success('Lead successfully added to CRM');
      if (onSuccess) {
        onSuccess(analysisResult);
      }
    } catch (err: unknown) {
      stopLoadingStages();
      const errorInstance = err instanceof Error ? err : new Error('Unable to contact AI server.');
      setError(errorInstance);
      toast.error('Unable to contact AI server.');
    } finally {
      setIsLoading(false);
    }
  };


  const reset = () => {
    setResult(null);
    setError(null);
    setStageIndex(0);
    setIsLoading(false);
  };

  return {
    isLoading,
    stageIndex,
    error,
    result,
    submit,
    reset,
  };
};
export default useLeadSubmit;
