import React from 'react';
import type { BudgetChartItem } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { CHART_THEME } from './theme';
import { EmptyAnalyticsCard } from './ChartCard';

interface BudgetDistributionChartProps {
  data: BudgetChartItem[];
}

export const BudgetDistributionChart: React.FC<BudgetDistributionChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <EmptyAnalyticsCard title="Budget Segments" />;
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_THEME.marginWithYAxis}>
          <XAxis dataKey="segment" {...CHART_THEME.axis} />
          <YAxis {...CHART_THEME.axis} />
          <Tooltip {...CHART_THEME.tooltip} />
          <Bar
            dataKey="count"
            fill={CHART_THEME.colors.secondary}
            radius={CHART_THEME.radius}
            {...CHART_THEME.animation}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default BudgetDistributionChart;
