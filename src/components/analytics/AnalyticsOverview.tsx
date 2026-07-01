import React from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { ChartCard } from './ChartCard';
import { ClassificationChart } from './ClassificationChart';
import { MonthlyLeadsChart } from './MonthlyLeadsChart';
import { BudgetDistributionChart } from './BudgetDistributionChart';
import { PropertyTypeChart } from './PropertyTypeChart';
import { TopLocationsChart } from './TopLocationsChart';
import { ConfidenceDistributionChart } from './ConfidenceDistributionChart';

export const AnalyticsOverview: React.FC = () => {
  const { analytics, loading, error, refreshAnalytics } = useAnalytics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Lead Classification */}
      <ChartCard
        title="Lead Classification"
        subtitle="Priority Segments Split"
        loading={loading}
        error={error}
        onRefresh={refreshAnalytics}
        footer="Updated live from n8n"
      >
        {analytics && <ClassificationChart data={analytics.classification} />}
      </ChartCard>

      {/* 2. Monthly Leads */}
      <ChartCard
        title="Monthly Leads Volume"
        subtitle="Leads Flow Over Time"
        loading={loading}
        error={error}
        onRefresh={refreshAnalytics}
        footer="Creation Trend Index"
      >
        {analytics && <MonthlyLeadsChart data={analytics.monthlyLeads} />}
      </ChartCard>

      {/* 3. Budget Distribution */}
      <ChartCard
        title="Budget Distribution"
        subtitle="Investment Segments"
        loading={loading}
        error={error}
        onRefresh={refreshAnalytics}
        footer="Client purchasing levels"
      >
        {analytics && <BudgetDistributionChart data={analytics.budgetDistribution} />}
      </ChartCard>

      {/* 4. Property Types */}
      <ChartCard
        title="Property Types"
        subtitle="Layout Split"
        loading={loading}
        error={error}
        onRefresh={refreshAnalytics}
        footer="Customer requirements filter"
      >
        {analytics && <PropertyTypeChart data={analytics.propertyTypes} />}
      </ChartCard>

      {/* 5. Top Locations */}
      <ChartCard
        title="Top Enquired Locations"
        subtitle="Regional Hotspots"
        loading={loading}
        error={error}
        onRefresh={refreshAnalytics}
        footer="Sort descending by count"
      >
        {analytics && <TopLocationsChart data={analytics.locations} />}
      </ChartCard>

      {/* 6. Confidence Distribution */}
      <ChartCard
        title="Confidence Distribution"
        subtitle="AI Scoring Levels"
        loading={loading}
        error={error}
        onRefresh={refreshAnalytics}
        footer="Score bucket groupings"
      >
        {analytics && <ConfidenceDistributionChart data={analytics.confidenceDistribution} />}
      </ChartCard>
    </div>
  );
};
export default AnalyticsOverview;
