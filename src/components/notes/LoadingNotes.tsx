import React from 'react';

export const LoadingNotes: React.FC = () => {
  return (
    <div className="space-y-4 py-4">
      {[1, 2].map((i) => (
        <div key={i} className="border border-slate-100 p-5 rounded-2xl bg-white shadow-sm space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-slate-100 rounded-lg w-1/4" />
              <div className="h-2.5 bg-slate-50 rounded-lg w-1/6" />
            </div>
          </div>
          <div className="h-12 bg-slate-50 rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
};
export default LoadingNotes;
