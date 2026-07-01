import { motion } from 'framer-motion';
import { MapPin, DollarSign, Home, Clock, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import type { LeadAnalysis } from '../../types';

import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QualificationReportProps {
  report: LeadAnalysis;
  onReset: () => void;
}

export const QualificationReport: React.FC<QualificationReportProps> = ({ report, onReset }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Lead Qualification Report</h2>
        <Button variant="outline" size="sm" onClick={onReset} className="flex items-center gap-1.5 cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Re-analyze
        </Button>
      </div>

      <Card className="border-slate-200/60 shadow-md p-8 space-y-8">
        {/* Header Block */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classification</span>
            <div className="flex items-center gap-2">
              <Badge classification={report.leadClassification} className="text-sm px-3.5 py-1" />
            </div>
          </div>
          <div className="w-full md:w-64">
            <ProgressBar value={report.confidenceScore} />
          </div>
        </motion.div>

        {/* Structured Data Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
              <span className="text-sm font-semibold text-slate-800">{report.location}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget</span>
              <span className="text-sm font-semibold text-slate-800">{report.budget}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Home className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Type</span>
              <span className="text-sm font-semibold text-slate-800">{report.propertyType}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Timeline</span>
              <span className="text-sm font-semibold text-slate-800">{report.timeline}</span>
            </div>
          </div>
        </motion.div>

        {/* Narrative & Recommended Action Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Reason Card */}
          <motion.div variants={itemVariants} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-800">
                <AlertCircle className="w-4 h-4 text-slate-500" aria-hidden="true" />
                <h4 className="text-sm font-bold tracking-tight">Qualification Reason</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {report.reason}
              </p>
            </div>
          </motion.div>

          {/* Recommended Action Card */}
          <motion.div variants={itemVariants} className="p-5 rounded-2xl border border-blue-100 bg-blue-50/10 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-600" aria-hidden="true" />
                <h4 className="text-sm font-bold tracking-tight">Recommended Action</h4>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                {report.recommendedAction}
              </p>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
export default QualificationReport;
