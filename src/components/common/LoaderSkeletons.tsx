import React from 'react';

/**
 * Shimmer loader for Dashboard KPI stats cards.
 */
export const DashboardLoader: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden h-32 bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-50 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );
};

interface StagedLoaderProps {
  stageIndex: number;
  stages: string[];
}

/**
 * Reusable loading component for AI pipelines showing stages and progress messages.
 */
export const StagedLoader: React.FC<StagedLoaderProps> = ({ stageIndex, stages }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 border border-slate-100 bg-white rounded-2xl shadow-xs space-y-6">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <span className="text-[10px] font-bold text-blue-600 tracking-wide uppercase">AI</span>
      </div>
      
      <div className="text-center space-y-2 max-w-sm">
        <h4 className="text-sm font-bold text-slate-800 animate-pulse">
          {stages[stageIndex] || 'Processing request...'}
        </h4>
        <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
          Step {Math.min(stageIndex + 1, stages.length)} of {stages.length}
        </p>
      </div>

      <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-500 rounded-full"
          style={{ width: `${((stageIndex + 1) / stages.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Loader skeleton for Sales Copilot.
 */
export const CopilotLoader: React.FC<{ stageIndex: number }> = ({ stageIndex }) => {
  const stages = [
    'Understanding customer profile...',
    'Calculating buying intent...',
    'Synthesizing sales strategy...',
    'Drafting actionable checklist...',
    'Finalizing copilot workspace...',
  ];
  return <StagedLoader stageIndex={stageIndex} stages={stages} />;
};

/**
 * Loader skeleton for Communication Center.
 */
export const CommunicationLoader: React.FC<{ stageIndex: number }> = ({ stageIndex }) => {
  const stages = [
    'Preparing communication context...',
    'Analyzing conversation intent...',
    'Retrieving sales parameters...',
    'Drafting custom message content...',
    'Injecting real estate property highlights...',
    'Finalizing copy text...',
  ];
  return <StagedLoader stageIndex={stageIndex} stages={stages} />;
};
