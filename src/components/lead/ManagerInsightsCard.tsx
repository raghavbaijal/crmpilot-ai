import React from 'react';
import type { ManagerInsights } from '../../types';
import { Card } from '../ui/Card';
import { ShieldCheck, TrendingUp, AlertOctagon, HelpCircle } from 'lucide-react';
import { getRiskColorClass } from '../../utils/helpers';
import { cn } from '../../utils/cn';



interface ManagerInsightsCardProps {
  insights: ManagerInsights;
}

export const ManagerInsightsCard: React.FC<ManagerInsightsCardProps> = ({ insights }) => {
  const riskStyle = getRiskColorClass(insights.riskScore);

  return (
    <Card className="border-slate-200/60 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <ShieldCheck className="w-4.5 h-4.5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-none">Manager Insights</h3>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Admin Overview</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Risk Assessment</span>
          <span className={cn('px-2 py-0.5 text-[10px] font-black rounded-md border', riskStyle.text, riskStyle.bg, riskStyle.border)}>
            Risk Score: {insights.riskScore}
          </span>
        </div>
        
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
          <div
            className={cn('h-full rounded-full transition-all duration-500', insights.riskScore >= 70 ? 'bg-red-500' : insights.riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500')}
            style={{ width: `${insights.riskScore}%` }}
          />

        </div>

        <div className="p-3 bg-slate-50/40 border border-slate-100 rounded-xl flex items-start gap-2.5">
          <AlertOctagon className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Risk Reason</span>
            <p className="text-xs text-slate-600 font-medium">{insights.riskReason}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Manager Note</span>
        <p className="text-xs text-slate-700 bg-slate-50/20 border border-slate-100 p-3.5 rounded-xl leading-relaxed font-semibold">
          {insights.managerNote}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
            <span>Upsell Triggers</span>
          </span>
          <span className="text-xs font-semibold text-slate-800 block truncate max-w-full">
            {insights.upsellOpportunity}
          </span>
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
            <span>Cross Sell Options</span>
          </span>
          <span className="text-xs font-semibold text-slate-800 block truncate max-w-full">
            {insights.crossSellOpportunity}
          </span>
        </div>
      </div>
    </Card>
  );
};
export default ManagerInsightsCard;
