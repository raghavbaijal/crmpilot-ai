import React from 'react';
import { Users, Flame, Zap, Snowflake } from 'lucide-react';
import { StatsCard } from '../ui/StatsCard';

interface DashboardStatsProps {
  stats: {
    total: number;
    hot: number;
    warm: number;
    cold: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Qualified Leads"
        count={stats.total}
        icon={Users}
        trend="+14% this month"
        color="blue"
      />
      <StatsCard
        title="Hot Leads"
        count={stats.hot}
        icon={Zap}
        trend="+2 new today"
        color="red"
      />
      <StatsCard
        title="Warm Leads"
        count={stats.warm}
        icon={Flame}
        trend="stable volume"
        color="amber"
      />
      <StatsCard
        title="Cold Leads"
        count={stats.cold}
        icon={Snowflake}
        trend="-5% this week"
        color="blue"
      />
    </div>
  );
};
export default DashboardStats;
