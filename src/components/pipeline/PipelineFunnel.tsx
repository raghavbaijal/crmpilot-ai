import React from 'react';
import type { ComputedPipelineStage } from '../../types';
import { EmptyAnalyticsCard } from '../analytics/ChartCard';
import { motion } from 'framer-motion';

interface PipelineFunnelProps {
  pipeline: ComputedPipelineStage[];
  loading: boolean;
}

export const PipelineFunnel: React.FC<PipelineFunnelProps> = ({ pipeline, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4 py-8 text-center animate-pulse flex flex-col justify-center items-center h-[340px]">
        <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
        <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
        <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
      </div>
    );
  }

  if (pipeline.length === 0) {
    return <EmptyAnalyticsCard title="Funnel Layout" />;
  }

  const getStageColor = (idx: number) => {
    const colors = [
      'bg-blue-600 shadow-blue-500/10',
      'bg-indigo-600 shadow-indigo-500/10',
      'bg-violet-600 shadow-violet-500/10',
      'bg-purple-600 shadow-purple-500/10',
      'bg-fuchsia-600 shadow-fuchsia-500/10',
      'bg-pink-600 shadow-pink-500/10',
      'bg-rose-600 shadow-rose-500/10',
      'bg-red-600 shadow-red-500/10',
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="flex flex-col gap-3 py-4 max-w-2xl mx-auto">
      {pipeline.map((stage, idx) => {
        // Calculate proportional width
        const widthVal = `${Math.max(stage.percentageOfTotal, 10)}%`;

        return (
          <div key={stage.stage} className="flex items-center gap-4 group">
            {/* Stage Title */}
            <div className="w-28 text-right shrink-0">
              <span className="text-xs font-bold text-slate-700 tracking-tight block">
                {stage.stage.replace('_', ' ')}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Stage {idx + 1}
              </span>
            </div>

            {/* Funnel Segment Bar */}
            <div className="flex-1 h-8 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: widthVal }}
                transition={{ duration: 0.8, delay: idx * 0.05, type: 'spring', damping: 20 }}
                className={`h-full ${getStageColor(idx)} flex items-center justify-between px-3 transition-colors duration-300`}
              >
                <span className="text-[9px] font-black text-white leading-none tracking-wider ml-1">
                  Prev: {stage.percentageOfPrevious}%
                </span>
                <span className="text-[10px] font-black text-white leading-none tracking-wider">
                  Total: {stage.percentageOfTotal}%
                </span>
              </motion.div>
            </div>

            {/* Stage count */}
            <div className="w-20 text-left shrink-0">
              <span className="text-sm font-black text-slate-800 tracking-tight leading-none block">
                {stage.count}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Leads count
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default PipelineFunnel;
