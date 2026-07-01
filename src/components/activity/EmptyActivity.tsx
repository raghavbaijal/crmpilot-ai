import React from 'react';
import { Activity } from 'lucide-react';

export const EmptyActivity: React.FC = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center py-10 bg-slate-50/20 border border-dashed border-slate-200 rounded-2xl p-6">
      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-3">
        <Activity className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h5 className="text-xs font-bold text-slate-700 uppercase">No Activity Recorded</h5>
        <p className="text-[10px] text-slate-400 font-semibold max-w-[240px] mx-auto leading-relaxed">
          There are no logs, communications, or status changes recorded for this lead yet.
        </p>
      </div>
    </div>
  );
};
export default EmptyActivity;
