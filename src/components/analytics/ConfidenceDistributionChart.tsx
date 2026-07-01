import React from 'react';
import type { ConfidenceChartItem } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { CHART_THEME } from './theme';
import { EmptyAnalyticsCard } from './ChartCard';

interface ConfidenceDistributionChartProps {
  data: ConfidenceChartItem[];
}

export const ConfidenceDistributionChart: React.FC<ConfidenceDistributionChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <EmptyAnalyticsCard title="Confidence Metrics" />;
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_THEME.marginWithYAxis}>
          <XAxis dataKey="range" {...CHART_THEME.axis} />
          <YAxis {...CHART_THEME.axis} />
          <Tooltip {...CHART_THEME.tooltip} />
          <Bar
            dataKey="count"
            fill={CHART_THEME.colors.info}
            radius={CHART_THEME.radius}
            {...CHART_THEME.animation}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ConfidenceDistributionChart;
