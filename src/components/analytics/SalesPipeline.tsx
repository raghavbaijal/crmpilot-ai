import React from 'react';
import type { FunnelStage } from '../../types';
import { Card } from '../ui/Card';
import { Filter } from 'lucide-react';
import { motion } from 'framer-motion';


interface SalesPipelineProps {
  pipeline: FunnelStage[];
  loading: boolean;
}

export const SalesPipeline: React.FC<SalesPipelineProps> = ({ pipeline, loading }) => {
  if (loading || pipeline.length === 0) {
    return (
      <Card className="border-slate-200/50 p-6 space-y-6">
        <div className="h-6 w-32 bg-slate-100 rounded animate-pulse" />
        <div className="h-96 bg-slate-50 rounded-2xl animate-pulse" />
      </Card>
    );
  }

  // Color mapping based on index or stage
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
    <Card className="border-slate-200/50 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100/40">
            <Filter className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Sales Pipeline Funnel</h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Lead Conversion Funnel</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stages 1-8</span>
      </div>

      <div className="flex flex-col gap-3 py-4 max-w-2xl mx-auto">
        {pipeline.map((stage, idx) => {
          // Calculate proportional width (percentage of parent)
          const widthVal = `${Math.max(stage.percentage, 10)}%`;
          
          return (
            <div key={stage.stage} className="flex items-center gap-4 group">
              {/* Stage Title block */}
              <div className="w-32 text-right">
                <span className="text-xs font-bold text-slate-700 tracking-tight block">
                  {stage.stage}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Stage {idx + 1}
                </span>
              </div>

              {/* Bar wrapper */}
              <div className="flex-1 h-8 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: widthVal }}
                  transition={{ duration: 0.8, delay: idx * 0.05, type: 'spring', damping: 20 }}
                  className={`h-full ${getStageColor(idx)} flex items-center justify-end px-3 transition-colors duration-300`}
                >
                  <span className="text-[10px] font-black text-white leading-none tracking-wider">
                    {stage.percentage}%
                  </span>
                </motion.div>
              </div>

              {/* Absolute count block */}
              <div className="w-20 text-left">
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
    </Card>
  );
};
export default SalesPipeline;
