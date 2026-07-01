import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { LeadForm } from '../components/lead/LeadForm';
import { QualificationReport } from '../components/lead/QualificationReport';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { useLeadSubmit } from '../hooks/useLeadSubmit';
import type { LeadAnalysis, LeadRequest } from '../types';

interface LandingPageProps {
  insideDashboard?: boolean;
  onQualified?: (result: LeadAnalysis) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  insideDashboard = false,
  onQualified,
}) => {
  const { isLoading, stageIndex, result, submit, reset } = useLeadSubmit();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFormSubmit = (data: LeadRequest) => {
    submit(data, (res) => {

      if (onQualified) {
        // Wait a small moment to let the "Completed" check show, then redirect
        setTimeout(() => {
          onQualified(res);
          reset();
        }, 800);
      }
    });
  };

  const content = (
    <main className="flex-1">
      {/* Hero Section */}
      {!insideDashboard && (
        <section className="relative overflow-hidden py-24 md:py-32 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
            <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl" />
            <div className="absolute -top-24 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-100/30 blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 bg-blue-50/80 border border-blue-100/60 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Phase 1 Enterprise Active</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none"
            >
              AI Real Estate CRM
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Instantly qualify customer enquiries using AI and automatically store structured leads inside your CRM.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-4"
            >
              <button
                onClick={scrollToWorkspace}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer text-sm"
              >
                <span>Analyze Lead</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Lead Qualification Workspace */}
      <section
        ref={workspaceRef}
        className={insideDashboard ? 'py-4' : 'py-16 md:py-24 px-6 border-t border-slate-100/60 scroll-mt-20'}
      >
        <div className="max-w-4xl mx-auto space-y-12">
          {!insideDashboard && (
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lead Qualification Workspace</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Submit raw enquiry details below. The pipeline will classify the lead, extract location/budget details, and suggest next actions.
              </p>
            </div>
          )}

          <div className="relative">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoadingSkeleton stageIndex={stageIndex} />
                </motion.div>
              ) : result && !insideDashboard ? (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <QualificationReport report={result} onReset={reset} />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <LeadForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );

  if (insideDashboard) {
    return content;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-600">
      <Header />
      {content}
      <Footer />
    </div>
  );
};
export default LandingPage;
