import React from 'react';
import type { LeadAnalysis } from '../../types';
import { LeadRow } from './LeadRow';
import { EmptyState } from '../ui/EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LeadTableProps {
  leads: LeadAnalysis[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  onLeadClick: (lead: LeadAnalysis) => void;
  onEmptyStateClick?: () => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  currentPage,
  setCurrentPage,
  totalPages,
  onLeadClick,
  onEmptyStateClick,
}) => {
  if (leads.length === 0) {
    return <EmptyState onAction={onEmptyStateClick} />;
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[400px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Customer Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Budget</th>
              <th className="px-6 py-4">Property Type</th>
              <th className="px-6 py-4">Timeline</th>
              <th className="px-6 py-4">Classification</th>
              <th className="px-6 py-4">Confidence</th>
              <th className="px-6 py-4">Created Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 bg-slate-50/10 shrink-0">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default LeadTable;
