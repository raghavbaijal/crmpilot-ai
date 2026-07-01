import React from 'react';
import type { MonthlyChartItem } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { CHART_THEME } from './theme';
import { EmptyAnalyticsCard } from './ChartCard';

interface MonthlyLeadsChartProps {
  data: MonthlyChartItem[];
}

export const MonthlyLeadsChart: React.FC<MonthlyLeadsChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <EmptyAnalyticsCard title="Monthly Trends" />;
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_THEME.marginWithYAxis}>
          <XAxis dataKey="month" {...CHART_THEME.axis} />
          <YAxis {...CHART_THEME.axis} />
          <Tooltip {...CHART_THEME.tooltip} />
          <Bar
            dataKey="count"
            fill={CHART_THEME.colors.primary}
            radius={CHART_THEME.radius}
            {...CHART_THEME.animation}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default MonthlyLeadsChart;
