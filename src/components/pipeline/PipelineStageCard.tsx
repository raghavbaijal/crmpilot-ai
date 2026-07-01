import React from 'react';
import { Card } from '../ui/Card';

interface PipelineStageCardProps {
  stageName: string;
  count: number;
  percentageOfPrevious: number;
  stageIndex: number;
}

export const PipelineStageCard: React.FC<PipelineStageCardProps> = ({
  stageName,
  count,
  percentageOfPrevious,
  stageIndex,
}) => {
  const getProgressColor = (idx: number) => {
    const colors = [
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
      'bg-red-500',
    ];
    return colors[idx % colors.length];
  };

  return (
    <Card className="border-slate-200/50 p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            {stageName}
          </span>
          <span className="text-lg font-black text-slate-900 tracking-tight block mt-0.5">
            {count}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-500 block">
            {percentageOfPrevious}%
          </span>
          <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
            Of Previous
          </span>
        </div>
      </div>

      <div className="h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(stageIndex)}`}
          style={{ width: `${Math.min(percentageOfPrevious, 100)}%` }}
        />
      </div>
    </Card>
  );
};
export default PipelineStageCard;
