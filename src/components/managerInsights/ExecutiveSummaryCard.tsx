import React from 'react';
import { Card } from '../ui/Card';
import { Sparkles } from 'lucide-react';

interface ExecutiveSummaryCardProps {
  summary: string;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({ summary }) => {
  return (
    <Card className="border-blue-100 bg-blue-50/20 shadow-sm p-6 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8" />
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/10">
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 leading-none">AI Executive Summary</h3>
          <p className="text-xs text-slate-700 leading-relaxed font-semibold italic whitespace-pre-wrap">
            "{summary}"
          </p>
        </div>
      </div>
    </Card>
  );
};
export default ExecutiveSummaryCard;
