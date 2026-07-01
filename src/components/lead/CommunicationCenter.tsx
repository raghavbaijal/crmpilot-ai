import React, { useEffect } from 'react';
import { useCommunication } from '../../context/CommunicationContext';
import { useCopilot } from '../../context/CopilotContext';
import { useLeads } from '../../context/LeadContext';
import { CommunicationTabs } from './CommunicationTabs';
import { EmailCard } from './EmailCard';
import { WhatsAppCard } from './WhatsAppCard';
import { CallScriptCard } from './CallScriptCard';
import { SMSCard } from './SMSCard';
import { MeetingInvitationCard } from './MeetingInvitationCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MessageSquare, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EmailContent, WhatsAppContent, CallScriptContent, SMSContent, MeetingInvitationContent } from '../../types';
import { CommunicationLoader } from '../common/LoaderSkeletons';


export const CommunicationCenter: React.FC = () => {
  const { selectedLead } = useLeads();
  const { analysis } = useCopilot();
  const {
    selectedType,
    setSelectedType,
    generatedContent,
    loading,
    stageIndex,
    error,
    generateCommunication,
    regenerateCommunication,
  } = useCommunication();

  // Auto trigger generation when selected lead, analysis, or communication type changes
  useEffect(() => {
    if (selectedLead && analysis) {
      if (import.meta.env.DEV) {
        console.log('[Component Render] CommunicationCenter rendered for lead ID:', selectedLead.id, 'with type:', selectedType);
      }
      generateCommunication(selectedType, selectedLead, analysis);
    }
  }, [selectedLead, analysis, selectedType, generateCommunication]);


  if (!selectedLead || !analysis) return null;

  const handleRegenerate = () => {
    regenerateCommunication(selectedType, selectedLead, analysis);
  };



  const renderActiveCard = () => {
    if (!generatedContent) return null;

    switch (selectedType) {
      case 'email':
        return (
          <EmailCard
            content={generatedContent as EmailContent}
            onRegenerate={handleRegenerate}
          />
        );
      case 'whatsapp':
        return (
          <WhatsAppCard
            content={generatedContent as WhatsAppContent}
            onRegenerate={handleRegenerate}
            phone={selectedLead.phone}
          />
        );
      case 'call_script':
        return (
          <CallScriptCard
            content={generatedContent as CallScriptContent}
            onRegenerate={handleRegenerate}
          />
        );
      case 'sms':
        return (
          <SMSCard
            content={generatedContent as SMSContent}
            onRegenerate={handleRegenerate}
          />
        );
      case 'meeting_invitation':
        return (
          <MeetingInvitationCard
            content={generatedContent as MeetingInvitationContent}
            onRegenerate={handleRegenerate}
          />
        );
      default:
        return null;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 120 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };


  return (
    <Card className="border-slate-200/60 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <MessageSquare className="w-4.5 h-4.5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-none">AI Communication Center</h3>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Automated Client Touchpoints</span>
        </div>
      </div>

      {/* Tabs Row */}
      <CommunicationTabs activeTab={selectedType} onChange={setSelectedType} />

      {/* Main Display Body */}
      <div className="min-h-[220px] relative pt-2">
        <AnimatePresence mode="wait">
          {loading ? (

            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CommunicationLoader stageIndex={stageIndex} />
            </motion.div>


          ) : error ? (
            /* Error Card */
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center flex flex-col items-center justify-center space-y-4 min-h-[200px]"
            >
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100">
                <AlertCircle className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Generation Failed</h4>
                <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                  Unable to generate communication. The generator endpoint could be offline or lead properties are incomplete.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRegenerate}
                className="font-semibold px-6 py-2 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                Retry Generation
              </Button>
            </motion.div>
          ) : (
            /* Active Card Container with Framer Motion */
            <motion.div
              key={selectedType}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              {renderActiveCard()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
export default CommunicationCenter;
