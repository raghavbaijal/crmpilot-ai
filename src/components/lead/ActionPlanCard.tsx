import React from 'react';
import type { ActionPlan } from '../../types';
import { Card } from '../ui/Card';
import { ClipboardList, Clock, Landmark } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ActionPlanCardProps {
  plan: ActionPlan;
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ plan }) => {
  const channelColors = {
    WHATSAPP: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
    EMAIL: 'bg-blue-50 text-blue-700 border-blue-200/50',
    CALL: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
    SMS: 'bg-slate-50 text-slate-700 border-slate-200/50',
  };

  const priorityColors = {
    HIGH: 'text-red-600 bg-red-50 border-red-100',
    MEDIUM: 'text-amber-600 bg-amber-50 border-amber-100',
    LOW: 'text-slate-500 bg-slate-50 border-slate-100',
  };

  return (
    <Card className="border-slate-200/60 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <ClipboardList className="w-4.5 h-4.5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-none">Action Plan</h3>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Execution Steps</span>
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Recommended Action</span>
        <p className="text-xs text-slate-800 leading-relaxed font-semibold bg-slate-50/20 border border-slate-100 p-3.5 rounded-xl shadow-xs">
          {plan.recommendedAction}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Channel</span>
          <span className={cn('inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md border', channelColors[plan.followUpChannel] || channelColors.CALL)}>
            {plan.followUpChannel}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Timeline</span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>{plan.followUpWithinHours}h</span>
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Visit Priority</span>
          <span className={cn('inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md border', priorityColors[plan.siteVisitPriority] || priorityColors.MEDIUM)}>
            {plan.siteVisitPriority}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Documents to Share</span>
        {plan.documentsToShare.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No specific documents checkoff needed.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {plan.documentsToShare.map((doc, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200/60 rounded-lg shadow-xs"
              >
                <Landmark className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{doc}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
export default ActionPlanCard;
