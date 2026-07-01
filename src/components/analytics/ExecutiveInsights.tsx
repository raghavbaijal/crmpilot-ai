import React from 'react';
import type { ExecutiveInsightsData } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sparkles, RefreshCw, AlertTriangle, ListChecks, TrendingUp, Compass, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExecutiveInsightsProps {
  insights: ExecutiveInsightsData | null;
  loading: boolean;
  onRegenerate: () => void;
}

export const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = ({ insights, loading, onRegenerate }) => {
  if (loading || !insights) {
    return (
      <Card className="border-slate-200/50 p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="h-6 w-32 bg-slate-100 rounded animate-pulse" />
          <div className="h-9 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-16 bg-slate-50 rounded-xl animate-pulse" />
          <div className="h-28 bg-slate-50 rounded-xl animate-pulse" />
        </div>
      </Card>
    );
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className="border-slate-200/50 p-6 space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100/40">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">AI Executive Insights</h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Automated Intelligence</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 border-slate-200 hover:border-slate-350 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Regenerate Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Executive Summary & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-500" aria-hidden="true" />
              <span>Executive Summary</span>
            </h4>
            <p className="text-xs text-slate-600 bg-slate-50/40 border border-slate-100 p-4 rounded-xl leading-relaxed font-medium whitespace-pre-wrap">
              {insights.executiveSummary}
            </p>
          </div>

          {/* High Risk Alerts */}
          {insights.highRiskAlerts && insights.highRiskAlerts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" aria-hidden="true" />
                <span>High Risk Lead Alerts</span>
              </h4>
              <div className="space-y-2">
                {insights.highRiskAlerts.map((alert, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: idx * 0.05 }}
                    className="p-3.5 bg-red-50/40 border border-red-100/50 text-red-800 rounded-xl flex items-start gap-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-xs font-semibold">{alert}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Forecast, Actions, Recommendations */}
        <div className="space-y-6">
          {/* Revenue Forecast */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              <span>Revenue Forecast</span>
            </h4>
            <div className="p-4 bg-emerald-50/20 border border-emerald-100 text-emerald-800 rounded-xl">
              <span className="text-base font-black tracking-tight">{insights.revenueForecast}</span>
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-1">Projected Deal Conversion value</p>
            </div>
          </div>

          {/* Priority Actions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <span>Priority Actions</span>
            </h4>
            <ul className="space-y-2 bg-slate-50/40 border border-slate-100 p-4 rounded-xl">
              {insights.priorityActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Recommendations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-500" aria-hidden="true" />
              <span>Business Recommendations</span>
            </h4>
            <ul className="space-y-2 bg-slate-50/40 border border-slate-100 p-4 rounded-xl">
              {insights.businessRecommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default ExecutiveInsights;
