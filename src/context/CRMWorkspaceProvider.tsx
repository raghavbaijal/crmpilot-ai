import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { LeadProvider, useLeads } from './LeadContext';
import { TimelineProvider, useTimeline } from './TimelineContext';
import { NotesProvider, useNotes } from './NotesContext';
import { TasksProvider, useTasks } from './TasksContext';
import { FollowupsProvider, useFollowups } from './FollowupsContext';
import type { LeadAnalysis } from '../types';

interface CRMWorkspaceContextType {
  selectedLead: LeadAnalysis | null;
  loading: boolean;
  workspaceReady: boolean;
  workspaceError: Error | null;
  lastUpdated: string | null;
  refreshWorkspace: () => Promise<void>;
  clearWorkspace: () => void;
}

const CRMWorkspaceContext = createContext<CRMWorkspaceContextType | undefined>(undefined);

const CRMWorkspaceContextInnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedLead, loading: leadLoading, error: leadError, refreshLeads } = useLeads();
  const { loading: timelineLoading, error: timelineError, lastUpdated: timelineUpdated, refreshTimeline, clearTimeline } = useTimeline();
  const { loading: notesLoading, error: notesError, lastUpdated: notesUpdated, refreshNotes, clearNotes } = useNotes();
  const { loading: tasksLoading, error: tasksError, lastUpdated: tasksUpdated, refreshTasks, clearTasks } = useTasks();
  const { loading: followupsLoading, error: followupsError, lastUpdated: followupsUpdated, refreshFollowups, clearFollowups } = useFollowups();

  // Aggregate loading dynamically
  const loading = leadLoading || timelineLoading || notesLoading || tasksLoading || followupsLoading;

  // workspaceReady should become true only after LeadContext initialized (initial fetch resolved)
  const workspaceReady = !leadLoading;

  // Expose workspaceError aggregating any active child provider errors
  const workspaceError = leadError || timelineError || notesError || tasksError || followupsError || null;

  // Compute newest timestamp available among child providers
  const lastUpdated = useMemo(() => {
    const dates = [timelineUpdated, notesUpdated, tasksUpdated, followupsUpdated]
      .filter(Boolean) as string[];
    if (dates.length === 0) return null;
    return dates.reduce((latest, current) => (current > latest ? current : latest));
  }, [timelineUpdated, notesUpdated, tasksUpdated, followupsUpdated]);

  const refreshWorkspace = useCallback(async () => {
    await Promise.all([
      refreshLeads(),
      refreshTimeline(),
      refreshNotes(),
      refreshTasks(),
      refreshFollowups(),
    ]);
  }, [refreshLeads, refreshTimeline, refreshNotes, refreshTasks, refreshFollowups]);

  const clearWorkspace = useCallback(() => {
    clearTimeline();
    clearNotes();
    clearTasks();
    clearFollowups();
  }, [clearTimeline, clearNotes, clearTasks, clearFollowups]);

  const value = useMemo(
    () => ({
      selectedLead,
      loading,
      workspaceReady,
      workspaceError,
      lastUpdated,
      refreshWorkspace,
      clearWorkspace,
    }),
    [selectedLead, loading, workspaceReady, workspaceError, lastUpdated, refreshWorkspace, clearWorkspace]
  );

  return (
    <CRMWorkspaceContext.Provider value={value}>
      {children}
    </CRMWorkspaceContext.Provider>
  );
};

export const CRMWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LeadProvider>
      <TimelineProvider>
        <NotesProvider>
          <TasksProvider>
            <FollowupsProvider>
              <CRMWorkspaceContextInnerProvider>
                {children}
              </CRMWorkspaceContextInnerProvider>
            </FollowupsProvider>
          </TasksProvider>
        </NotesProvider>
      </TimelineProvider>
    </LeadProvider>
  );
};

export const useCRMWorkspace = () => {
  const context = useContext(CRMWorkspaceContext);
  if (context === undefined) {
    throw new Error('useCRMWorkspace must be used within a CRMWorkspaceProvider');
  }
  return context;
};
