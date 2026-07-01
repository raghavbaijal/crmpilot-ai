import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, className }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getProgressColor = (val: number) => {
    if (val >= 80) return 'bg-blue-600';
    if (val >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence Score</span>
        <span className="text-sm font-bold text-slate-900">{value}%</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
        <motion.div
          className={cn('h-full rounded-full', getProgressColor(value))}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
export default ProgressBar;
