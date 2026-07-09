import React from 'react';

export const LoadingFollowups: React.FC = () => {
  return (
    <div className="space-y-4 py-4">
      {[1, 2].map((i) => (
        <div key={i} className="border border-slate-100 p-5 rounded-2xl bg-white shadow-sm space-y-3 animate-pulse">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 bg-slate-150 rounded-lg w-1/3" />
            <div className="h-4 bg-slate-100 rounded-lg w-1/12" />
          </div>
          <div className="h-10 bg-slate-55 rounded-xl w-full" />
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
            <div className="h-3 bg-slate-50 rounded-lg w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};
export default LoadingFollowups;
