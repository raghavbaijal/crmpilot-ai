import React from 'react';
import type { ChartDataItem } from '../../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CHART_THEME } from './theme';
import { EmptyAnalyticsCard } from './ChartCard';

interface ClassificationChartProps {
  data: ChartDataItem[];
}

export const ClassificationChart: React.FC<ClassificationChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <EmptyAnalyticsCard title="Classification Data" />;
  }

  // Get color based on segment name
  const getCellColor = (name: string) => {
    switch (name.toUpperCase()) {
      case 'HOT':
        return CHART_THEME.colors.hot;
      case 'WARM':
        return CHART_THEME.colors.warm;
      case 'COLD':
        return CHART_THEME.colors.cold;
      default:
        return CHART_THEME.colors.primary;
    }
  };

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={CHART_THEME.margin}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={4}
            dataKey="value"
            {...CHART_THEME.animation}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCellColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip {...CHART_THEME.tooltip} />
          <Legend
            verticalAlign="bottom"
            height={36}
            {...CHART_THEME.legend}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ClassificationChart;
