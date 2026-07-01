import React from 'react';
import { usePipeline } from '../../context/PipelineContext';
import { PipelineSummaryCard } from './PipelineSummaryCard';
import { PipelineStageCard } from './PipelineStageCard';
import { PipelineFunnel } from './PipelineFunnel';
import { Card } from '../ui/Card';
import { Filter } from 'lucide-react';

export const PipelineOverview: React.FC = () => {
  const { pipeline, summary, metadata, loading, error } = usePipeline();

  if (error) {
    return (
      <Card className="border-red-150 p-8 text-center bg-white space-y-4">
        <div className="text-rose-500 font-bold">Pipeline Data Offline</div>
        <p className="text-xs text-slate-500">Unable to load the pipeline visualizer. Verify your endpoint config.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <PipelineSummaryCard summary={summary} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Stage Cards Grid */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Stage Indicators
            </span>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-20 bg-white border border-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pipeline.map((stage, idx) => (
                <PipelineStageCard
                  key={stage.stage}
                  stageName={stage.stage.replace('_', ' ')}
                  count={stage.count}
                  percentageOfPrevious={stage.percentageOfPrevious}
                  stageIndex={idx}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Funnel visualizer */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200/50 p-5 bg-white h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase leading-none">
                    Lead Lifecycle Funnel
                  </h4>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                    Stage-by-stage Conversion Rates
                  </span>
                </div>
              </div>
            </div>
            
            <PipelineFunnel pipeline={pipeline} loading={loading} />

            {metadata && (
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Source: {metadata.source || 'n8n Production API'}</span>
                <span>Refreshed: {metadata.generated_at}</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
export default PipelineOverview;
