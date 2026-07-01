import React from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check, MapPin, DollarSign, Home, Clock, AlertCircle, CheckCircle2, Calendar, Phone } from 'lucide-react';
import type { LeadAnalysis } from '../../types';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

interface LeadDetailsPanelProps {
  lead: LeadAnalysis | null;
  onClose: () => void;
}

export const LeadDetailsPanel: React.FC<LeadDetailsPanelProps> = ({ lead, onClose }) => {
  const [copiedName, setCopiedName] = React.useState(false);
  const [copiedPhone, setCopiedPhone] = React.useState(false);

  if (!lead) return null;

  const dateFormatted = new Date(lead.createdAt).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopyName = () => {
    navigator.clipboard.writeText(lead.customerName);
    setCopiedName(true);
    toast.success('Customer name copied to clipboard');
    setTimeout(() => setCopiedName(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(lead.phone);
    setCopiedPhone(true);
    toast.success('Phone number copied to clipboard');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-xs transition-opacity"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white border-l border-slate-100 shadow-2xl flex flex-col justify-between"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lead ID: #{lead.id}</span>
            <h3 className="text-base font-bold text-slate-900 truncate">{lead.customerName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 border border-slate-200/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyName}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 font-semibold cursor-pointer"
            >
              {copiedName ? <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
              Copy Name
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPhone}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 font-semibold cursor-pointer"
            >
              {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" /> : <Phone className="w-3.5 h-3.5" aria-hidden="true" />}
              Copy Phone
            </Button>
          </div>

          <Card className="border-slate-100/80 p-5 space-y-5 bg-slate-50/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classification</span>
              <Badge classification={lead.leadClassification} className="text-xs font-bold" />
            </div>
            <ProgressBar value={lead.confidenceScore} />
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/20 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <MapPin className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                <p className="text-xs font-bold text-slate-800 truncate">{lead.location}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/20 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <DollarSign className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget</span>
                <p className="text-xs font-bold text-slate-800 truncate">{lead.budget}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/20 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <Home className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Type</span>
                <p className="text-xs font-bold text-slate-800 truncate">{lead.propertyType}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/20 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Timeline</span>
                <p className="text-xs font-bold text-slate-800 truncate">{lead.timeline}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Property Requirement</span>
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50/30 text-xs text-slate-700 leading-relaxed font-medium">
              {lead.chatInput}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 space-y-2">
            <div className="flex items-center gap-2 text-slate-800">
              <AlertCircle className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <h4 className="text-xs font-bold">Qualification Reason</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {lead.reason}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/20 space-y-2">
            <div className="flex items-center gap-2 text-blue-900">
              <CheckCircle2 className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <h4 className="text-xs font-bold">Recommended Action</h4>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              {lead.recommendedAction}
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            Qualified: {dateFormatted}
          </span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </motion.div>
    </>
  );
};
export default LeadDetailsPanel;
