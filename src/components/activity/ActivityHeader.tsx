import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';

interface ActivityHeaderProps {
  totalCount: number;
  loading: boolean;
  refreshFeed: () => void;
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  totalCount,
  loading,
  refreshFeed,
}) => {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase leading-none">
            CRM Activity Feed
          </h3>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
            Audit history & interaction logs
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {totalCount > 0 && (
          <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md">
            Events: {totalCount}
          </span>
        )}
        <button
          onClick={refreshFeed}
          disabled={loading}
          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Refresh activity feed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
export default ActivityHeader;
