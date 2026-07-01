import React from 'react';
import type { LeadAnalysis } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MapPin, DollarSign, ArrowRight } from 'lucide-react';

interface RecentLeadCardProps {
  lead: LeadAnalysis;
  onClick: () => void;
}

export const RecentLeadCard: React.FC<RecentLeadCardProps> = ({ lead, onClick }) => {
  return (
    <Card
      onClick={onClick}
      hoverable
      className="border-slate-200/50 p-5 flex flex-col justify-between gap-4 cursor-pointer group active:scale-[0.99] transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {lead.customerName}
          </h4>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
            Confidence: {lead.confidenceScore}%
          </span>
        </div>
        <Badge classification={lead.leadClassification} />
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
          <span>{lead.location}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <DollarSign className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
          <span>{lead.budget}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
        <span>View Details</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
      </div>
    </Card>
  );
};
export default RecentLeadCard;
