import React from 'react';
import type { LeadAnalysis } from '../../types';
import { Badge } from '../ui/Badge';
import { Eye, Calendar } from 'lucide-react';

interface LeadRowProps {
  lead: LeadAnalysis;
  onClick: () => void;
}

export const LeadRow: React.FC<LeadRowProps> = ({ lead, onClick }) => {
  const dateFormatted = new Date(lead.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <tr
      onClick={onClick}
      className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors group"
    >
      <td className="px-6 py-4 text-xs font-bold text-slate-400">
        #{lead.id}
      </td>
      <td className="px-6 py-4 text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
        {lead.customerName}
      </td>
      <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
        {lead.phone}
      </td>
      <td className="px-6 py-4 text-xs font-semibold text-slate-600 truncate max-w-[120px]">
        {lead.location}
      </td>
      <td className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
        {lead.budget}
      </td>
      <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
        {lead.propertyType}
      </td>
      <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
        {lead.timeline}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge classification={lead.leadClassification} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                lead.confidenceScore >= 80
                  ? 'bg-blue-600'
                  : lead.confidenceScore >= 50
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${lead.confidenceScore}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-800">{lead.confidenceScore}%</span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-medium text-slate-400 whitespace-nowrap">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          {dateFormatted}
        </span>
      </td>
      <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClick}
          className="inline-flex items-center gap-1 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200/50 hover:border-blue-100 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>View</span>
        </button>
      </td>
    </tr>
  );
};
export default LeadRow;
