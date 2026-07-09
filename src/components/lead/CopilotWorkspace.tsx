import React, { useEffect } from 'react';
import { useCopilot } from '../../context/CopilotContext';
import { useLeads } from '../../context/LeadContext';
import { LeadIntelligenceCard } from './LeadIntelligenceCard';
import { SalesStrategyCard } from './SalesStrategyCard';
import { ActionPlanCard } from './ActionPlanCard';
import { ManagerInsightsCard } from './ManagerInsightsCard';
import { CommunicationCenter } from './CommunicationCenter';
import { NotesOverview } from '../notes/NotesOverview';
import { TaskOverview } from '../tasks/TaskOverview';
import { ActivityFeed } from '../activity/ActivityFeed';
import { FollowupOverview } from '../followups/FollowupOverview';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft, RefreshCw, User, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { CopilotLoader } from '../common/LoaderSkeletons';


interface CopilotWorkspaceProps {
  onBack: () => void;
}

export const CopilotWorkspace: React.FC<CopilotWorkspaceProps> = ({ onBack }) => {
  const { selectedLead } = useLeads();
  const {
    analysis,
    loading,
    stageIndex,
    error,
    getAnalysisForLead,
    regenerateAnalysis,
  } = useCopilot();

  // Load AI analysis when the component mounts or the selected lead changes
  useEffect(() => {
    if (selectedLead) {
      if (import.meta.env.DEV) {
        console.log('[Component Render] CopilotWorkspace rendered for lead ID:', selectedLead.id);
      }
      getAnalysisForLead(selectedLead);
    }
  }, [selectedLead, getAnalysisForLead]);


  if (!selectedLead) return null;

  const handleRegenerate = () => {
    regenerateAnalysis(selectedLead);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } },
  };


  // Rendering Loading Skeleton with Staged Messages
  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Workspace Header Skeleton */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <CopilotLoader stageIndex={stageIndex} />
      </div>
    );
  }


  // Rendering Error State
  if (error) {
    return (
      <div className="max-w-md mx-auto py-16">
        <Card className="border-red-150 p-8 text-center space-y-6 shadow-md bg-white">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Analysis Generation Failed</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Unable to generate AI Sales Copilot analysis. The endpoint could be offline or the lead details are incomplete.
            </p>
          </div>
          <Button onClick={handleRegenerate} className="w-full font-semibold py-2.5 flex items-center justify-center gap-2 cursor-pointer">
            <RefreshCw className="w-4 h-4" />
            Retry Analysis
          </Button>
          <button onClick={onBack} className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            Go Back
          </button>
        </Card>
      </div>
    );
  }

  // Rendering Loaded Workspace Data
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors mb-2 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Leads</span>
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Sales Copilot Workspace</h2>
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Copilot Active
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={handleRegenerate}
          className="flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer border-slate-200 hover:border-slate-300"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate AI Analysis
        </Button>
      </div>

      {/* Main Grid View */}
      {analysis && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          
          {/* Left Column (Lead Info & Intelligence) */}
          <div className="space-y-6">
            {/* Lead Raw Information */}
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200/60 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-none">Customer Profile</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Customer Name</span>
                    <span className="text-xs font-bold text-slate-800">{selectedLead.customerName}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Phone Number</span>
                    <span className="text-xs font-bold text-slate-800">{selectedLead.phone}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Budget Requirement</span>
                    <span className="text-xs font-bold text-slate-800">{selectedLead.budget}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Target Location</span>
                    <span className="text-xs font-bold text-slate-800">{selectedLead.location}</span>
                  </div>
                </div>

                <div className="space-y-1 bg-slate-50/40 p-3 rounded-xl border border-slate-100/50">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Original Requirement Details</span>
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold italic">
                    "{selectedLead.chatInput}"
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Lead Intelligence Card */}
            <motion.div variants={itemVariants}>
              <LeadIntelligenceCard intelligence={analysis.leadIntelligence} />
            </motion.div>
          </div>

          {/* Right Column (Sales Strategy, Action Plan, Manager Insights) */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <SalesStrategyCard strategy={analysis.salesStrategy} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <ActionPlanCard plan={analysis.actionPlan} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <ManagerInsightsCard insights={analysis.managerInsights} />
            </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="pt-8">
          <CommunicationCenter />
        </motion.div>

        {/* CRM Activity Feed (Timeline UI) */}
        <motion.div variants={itemVariants} className="pt-8">
          <ActivityFeed />
        </motion.div>

        {/* Lead Notes Workspace */}
        <motion.div variants={itemVariants} className="pt-8">
          <NotesOverview />
        </motion.div>

        {/* Lead Tasks Workspace */}
        <motion.div variants={itemVariants} className="pt-8">
          <TaskOverview />
        </motion.div>

        {/* Lead Follow-ups Workspace */}
        <motion.div variants={itemVariants} className="pt-8">
          <FollowupOverview />
        </motion.div>
      </>
    )}

    </motion.div>

  );
};
export default CopilotWorkspace;
