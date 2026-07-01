import React from 'react';
import { useManagerInsights } from '../../context/ManagerInsightsContext';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { PriorityActionsCard } from './PriorityActionsCard';
import { BusinessInsightsCard } from './BusinessInsightsCard';
import { RevenueForecastCard } from './RevenueForecastCard';
import { RiskAlertsCard } from './RiskAlertsCard';
import { RecommendationsCard } from './RecommendationsCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export const ManagerInsightsOverview: React.FC = () => {
  const {
    managerInsights,
    loading,
    isRefreshing,
    error,
    lastUpdated,
    refreshManagerInsights,
  } = useManagerInsights();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-150 p-8 text-center bg-white space-y-4">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900">AI Insights Connection Offline</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Unable to load the AI Executive Manager Insights workspace. Verify your n8n API configuration.
          </p>
        </div>
        <Button onClick={refreshManagerInsights} className="mx-auto font-semibold py-2 px-4 flex items-center gap-1.5 cursor-pointer">
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </Button>
      </Card>
    );
  }

  if (!managerInsights) {
    return (
      <Card className="border-slate-200/50 p-6 text-center bg-slate-50/10 flex flex-col items-center justify-center min-h-[200px] space-y-3">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-900 uppercase">No Insights Generated</h4>
          <p className="text-[10px] text-slate-400 font-semibold max-w-[200px] leading-relaxed">
            AI has not completed analyzing the CRM pipeline yet.
          </p>
        </div>
        <Button onClick={refreshManagerInsights} size="sm" className="font-semibold cursor-pointer">
          Trigger Generation
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Row */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          AI Copilot Workspace
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshManagerInsights}
          isLoading={isRefreshing}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 border-slate-200 hover:border-slate-350 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Regenerate AI Insights
        </Button>
      </div>

      {/* Hero Summary Card */}
      <ExecutiveSummaryCard summary={managerInsights.executive_summary} />

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Grid Column */}
        <div className="space-y-6">
          <PriorityActionsCard actions={managerInsights.priority_actions} />
          <BusinessInsightsCard insights={managerInsights.business_insights} />
          <RevenueForecastCard forecast={managerInsights.revenue_forecast} />
        </div>

        {/* Right Grid Column */}
        <div className="space-y-6">
          <RiskAlertsCard alerts={managerInsights.high_risk_alerts} />
          <RecommendationsCard recommendations={managerInsights.manager_recommendations} />
        </div>
      </div>

      {/* Metadata Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
        <div className="flex gap-4">
          <span>Generated: {managerInsights.generated_at || 'Live API'}</span>
          <span>Model: {managerInsights.model || 'GPT-4o / Claude 3.5 Sonnet'}</span>
          <span>Version: {managerInsights.version || 'v1.4'}</span>
        </div>
        {lastUpdated && (
          <span>Last Updated: {lastUpdated}</span>
        )}
      </div>
    </div>
  );
};
export default ManagerInsightsOverview;
