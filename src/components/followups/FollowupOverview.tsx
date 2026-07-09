import React from 'react';
import { useFollowups } from '../../context/FollowupsContext';
import { FollowupSummaryCards } from './FollowupSummaryCards';
import { AddFollowupForm } from './AddFollowupForm';
import { FollowupList } from './FollowupList';
import { EmptyFollowups } from './EmptyFollowups';
import { LoadingFollowups } from './LoadingFollowups';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CalendarRange, RefreshCw, AlertCircle, Clock } from 'lucide-react';

export const FollowupOverview: React.FC = () => {
  const {
    followups,
    summary,
    upcomingFollowups,
    loading,
    isRefreshing,
    isSubmitting,
    hasFollowups,
    error,
    lastUpdated,
    refreshFollowups,
    addFollowup,
  } = useFollowups();

  const handleScheduleFollowup = async (
    title: string,
    description: string,
    followupType: "CALL" | "EMAIL" | "WHATSAPP" | "SITE_VISIT" | "MEETING",
    priority: "LOW" | "MEDIUM" | "HIGH",
    dueDate: string,
    assignedTo: string
  ) => {
    await addFollowup(title, description, followupType, priority, dueDate, assignedTo);

    // Auto-scroll list to top
    setTimeout(() => {
      const scrollContainer = document.querySelector('.followups-scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleScheduleFirstFollowupClick = () => {
    const input = document.querySelector('input[placeholder="e.g. Discuss revised property pricing plan"]') as HTMLInputElement | null;
    input?.focus();
  };

  return (
    <Card className="border-slate-200/60 p-5 space-y-5 bg-white">
      {/* Header Panel */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <CalendarRange className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase leading-none">
              Lead Follow-up Workspace
            </h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
              Client scheduling & meetings log
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshFollowups}
            disabled={loading || isRefreshing}
            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Refresh follow-ups"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <FollowupSummaryCards
        summary={summary}
        upcomingFollowups={upcomingFollowups}
        loading={loading && !isRefreshing}
      />

      {/* Add Followup Form */}
      <AddFollowupForm onSubmit={handleScheduleFollowup} isSubmitting={isSubmitting} />

      {/* Followup List */}
      <div className="space-y-4">
        {loading && !isRefreshing ? (
          <LoadingFollowups />
        ) : error ? (
          <div className="text-center py-6 flex flex-col items-center justify-center space-y-3 bg-red-50/10 border border-red-100 rounded-2xl p-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700">Failed to load follow-ups</p>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                {error.message || 'The server connection was interrupted.'}
              </p>
            </div>
            <Button size="sm" onClick={refreshFollowups} className="font-semibold text-xs cursor-pointer">
              Retry Connection
            </Button>
          </div>
        ) : !hasFollowups ? (
          <EmptyFollowups onScheduleClick={handleScheduleFirstFollowupClick} />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Agenda Timeline</span>
              {lastUpdated && (
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  Synced: {lastUpdated}
                </span>
              )}
            </div>
            <div className="followups-scroll-container">
              <FollowupList followups={followups} />
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      {summary && (
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Source: Follow-up Engine</span>
          <span>Version: v1.0</span>
        </div>
      )}
    </Card>
  );
};
export default FollowupOverview;
