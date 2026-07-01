import React from 'react';
import { useExecutiveDashboard } from '../context/ExecutiveDashboardContext';
import { ExecutiveKPICards } from '../components/analytics/ExecutiveKPICards';
import { AnalyticsOverview } from '../components/analytics/AnalyticsOverview';
import { PipelineOverview } from '../components/pipeline/PipelineOverview';
import { ManagerInsightsOverview } from '../components/managerInsights/ManagerInsightsOverview';
import { RefreshCw, BarChart2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';

export const AnalyticsPage: React.FC = () => {
  const { loading, error, lastUpdated, refreshAll } = useExecutiveDashboard();

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <Card className="border-red-150 p-8 shadow-md bg-white space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Analytics Offline</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Unable to load executive KPI summary or charts. Please verify n8n connections and try again.
            </p>
          </div>
          <Button onClick={refreshAll} className="w-full font-semibold py-2.5 flex items-center justify-center gap-2 cursor-pointer">
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-[1600px] mx-auto pb-12"
    >
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-blue-600" />
            <span>Executive Analytics & BI</span>
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Business Intelligence Dashboard</p>
            {lastUpdated && (
              <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                Last Updated: {lastUpdated}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshAll}
          isLoading={loading}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 border-slate-200 hover:border-slate-350 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Refresh Dashboard Data
        </Button>
      </div>

      {/* KPI Cards Row */}
      <ExecutiveKPICards />

      {/* Charts Grid */}
      <div className="space-y-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Visualizations & Histograms</span>
        <AnalyticsOverview />
      </div>

      {/* Pipeline Funnel */}
      <div className="space-y-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lead Conversion & Pipeline</span>
        <PipelineOverview />
      </div>

      {/* AI Manager Insights */}
      <div className="space-y-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI Executive Manager Insights</span>
        <ManagerInsightsOverview />
      </div>
    </motion.div>
  );
};
export default AnalyticsPage;
