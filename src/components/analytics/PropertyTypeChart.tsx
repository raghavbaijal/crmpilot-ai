import React from 'react';
import type { ChartDataItem } from '../../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CHART_THEME } from './theme';
import { EmptyAnalyticsCard } from './ChartCard';

interface PropertyTypeChartProps {
  data: ChartDataItem[];
}

export const PropertyTypeChart: React.FC<PropertyTypeChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <EmptyAnalyticsCard title="Property Types" />;
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={CHART_THEME.margin}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={70}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : '0'}%`}
            labelLine={false}
            {...CHART_THEME.animation}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_THEME.colors.palette[(index + 2) % CHART_THEME.colors.palette.length]}
              />
            ))}
          </Pie>
          <Tooltip {...CHART_THEME.tooltip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
export default PropertyTypeChart;
