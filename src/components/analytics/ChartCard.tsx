import React from 'react';
import { Card } from '../ui/Card';
import { RefreshCw, AlertCircle, FileQuestion } from 'lucide-react';


interface ChartCardProps {
  title: string;
  subtitle?: string;
  loading: boolean;
  error: Error | null;
  onRefresh?: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  loading,
  error,
  onRefresh,
  footer,
  children,
}) => {
  return (
    <Card className="border-slate-200/60 shadow-sm p-5 flex flex-col justify-between min-h-[340px] bg-white transition-all duration-300 hover:shadow-md">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-50 pb-3 mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase leading-tight">
            {title}
          </h4>
          {subtitle && (
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Refresh Chart"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col justify-center relative min-h-[200px] w-full">
        {loading ? (
          /* Loading Skeleton */
          <div className="space-y-4 w-full animate-pulse flex flex-col justify-center items-center h-full">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-slate-300 animate-spin" />
            </div>
            <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
            <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center flex flex-col items-center justify-center space-y-3 py-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700">Failed to load chart</p>
              <p className="text-[10px] text-slate-400 font-semibold max-w-[200px] leading-relaxed">
                {error.message || 'The server returned an invalid response.'}
              </p>
            </div>
          </div>
        ) : (
          /* Render Content */
          <div className="w-full h-full flex items-center justify-center">
            {children}
          </div>
        )}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          {footer}
        </div>
      )}
    </Card>
  );
};

interface EmptyAnalyticsCardProps {
  title: string;
  message?: string;
}

export const EmptyAnalyticsCard: React.FC<EmptyAnalyticsCardProps> = ({
  title,
  message = 'No records available to generate analytics charts.',
}) => {
  return (
    <div className="text-center flex flex-col items-center justify-center space-y-3 py-12 min-h-[200px] w-full bg-slate-50/20 border border-dashed border-slate-200 rounded-xl p-6">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
        <FileQuestion className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h5 className="text-xs font-bold text-slate-700 uppercase">{title}</h5>
        <p className="text-[10px] text-slate-400 font-semibold max-w-[200px] mx-auto leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
};
