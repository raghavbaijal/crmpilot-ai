import React from 'react';
import type { LocationChartItem } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { CHART_THEME } from './theme';
import { EmptyAnalyticsCard } from './ChartCard';

interface TopLocationsChartProps {
  data: LocationChartItem[];
}

export const TopLocationsChart: React.FC<TopLocationsChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <EmptyAnalyticsCard title="Top Locations" />;
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={CHART_THEME.marginHorizontal}>
          <XAxis type="number" {...CHART_THEME.axis} />
          <YAxis dataKey="location" type="category" {...CHART_THEME.axis} width={80} />
          <Tooltip {...CHART_THEME.tooltip} />
          <Bar
            dataKey="count"
            fill={CHART_THEME.colors.accent}
            radius={CHART_THEME.radiusHorizontal}
            {...CHART_THEME.animation}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default TopLocationsChart;
