import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoadingSkeletonProps {
  stageIndex: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ stageIndex }) => {
  const stages = [
    { text: 'Receiving Lead...', icon: ArrowRight },
    { text: 'Analyzing Requirement...', icon: Sparkles },
    { text: 'Qualifying Lead...', icon: ShieldCheck },
    { text: 'Saving to CRM...', icon: Database },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Stages Progress Indicator */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 tracking-wide uppercase">AI Qualification Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < stageIndex;
            const isActive = idx === stageIndex;
            return (
              <div
                key={stage.text}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all duration-300',
                  isActive
                    ? 'border-blue-200 bg-blue-50/30 shadow-xs'
                    : isCompleted
                    ? 'border-slate-100 bg-slate-50/50'
                    : 'border-slate-100 bg-white opacity-40'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : isActive
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{stage.text}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {isCompleted ? 'Completed' : isActive ? 'Processing...' : 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shimmering Report Skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6 relative overflow-hidden">
        {/* Shimmer background gradient overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/50 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
          </div>
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-3 w-8 bg-slate-100 rounded-lg animate-pulse" />
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-lg overflow-hidden">
              <div className="h-full w-1/3 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Info Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-50 bg-slate-50/20 space-y-2">
              <div className="h-3 w-16 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-5 w-24 bg-slate-200 rounded-md animate-pulse" />
            </div>
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 rounded-2xl border border-slate-100 bg-white space-y-3">
            <div className="h-4 w-28 bg-slate-200 rounded-md animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded-md animate-pulse" />
              <div className="h-3 w-11/12 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-3 w-4/5 bg-slate-100 rounded-md animate-pulse" />
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/10 space-y-3">
            <div className="h-4 w-40 bg-slate-200 rounded-md animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded-md animate-pulse" />
              <div className="h-3 w-5/6 bg-slate-100 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoadingSkeleton;
