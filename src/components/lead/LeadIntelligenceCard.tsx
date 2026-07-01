import React from 'react';
import type { LeadIntelligence, LeadClassification } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { UserCheck, Sparkles, MapPin, Home } from 'lucide-react';

interface LeadIntelligenceCardProps {
  intelligence: LeadIntelligence;
}

export const LeadIntelligenceCard: React.FC<LeadIntelligenceCardProps> = ({ intelligence }) => {
  const intentColors = {
    HIGH: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200/60',
    LOW: 'bg-slate-50 text-slate-600 border-slate-200/60',
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/60 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <UserCheck className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Lead Intelligence</h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Profile Insights</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50/40 rounded-xl border border-slate-100/50 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Intent Priority</span>
            <Badge classification={intelligence.leadPriority as LeadClassification} />
          </div>
          <div className="p-3 bg-slate-50/40 rounded-xl border border-slate-100/50 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Closing Probability</span>
            <span className="text-sm font-black text-slate-900">{intelligence.closingProbability}</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI Analysis Summary</span>
          <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/20 border border-slate-100 p-3.5 rounded-xl">
            {intelligence.summary}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Buying Intent</span>
            <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md border ${intentColors[intelligence.buyingIntent] || intentColors.MEDIUM}`}>
              {intelligence.buyingIntent}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Urgency Level</span>
            <span className="text-xs font-bold text-slate-800">{intelligence.urgencyLevel}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Customer Persona</span>
            <span className="text-xs font-bold text-slate-800 truncate block max-w-full">{intelligence.customerPersona}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Budget Segment</span>
            <span className="text-xs font-bold text-slate-800 block truncate max-w-full">{intelligence.budgetSegment}</span>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200/60 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <Sparkles className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Recommended Properties</h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Matched Listings</span>
          </div>
        </div>

        <div className="space-y-3">
          {intelligence.recommendedProperties.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No custom matched properties available.</p>
          ) : (
            intelligence.recommendedProperties.map((prop, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/20 space-y-2 hover:border-blue-100 transition-colors">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Home className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    <span className="text-xs font-bold text-slate-800 truncate">{prop.propertyType}</span>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100/30 px-2 py-0.5 rounded-md shrink-0">
                    {prop.priceRange}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="truncate">{prop.location}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
export default LeadIntelligenceCard;
