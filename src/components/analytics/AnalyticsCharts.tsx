import React from 'react';
import type { AnalyticsData } from '../../types';
import { Card } from '../ui/Card';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

interface AnalyticsChartsProps {
  data: AnalyticsData | null;
  loading: boolean;
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#8b5cf6', '#ec4899'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-80 bg-white border border-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  // Format custom tooltip style
  const tooltipStyle = {
    contentStyle: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '11px',
      fontFamily: 'sans-serif',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Lead Classification Pie */}
      <Card className="border-slate-200/50 p-5 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase">Lead Classification</h4>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Priority Segments</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.leadClassification}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.leadClassification.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Monthly Leads Bar */}
      <Card className="border-slate-200/50 p-5 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase">Monthly Leads Volume</h4>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Leads Flow Over Time</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyLeads}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 3. Budget Distribution Histogram */}
      <Card className="border-slate-200/50 p-5 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase">Budget Segments</h4>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Leads Segment Distribution</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.budgetDistribution}>
              <XAxis dataKey="segment" stroke="#94a3b8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 4. Property Type Pie */}
      <Card className="border-slate-200/50 p-5 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase">Property Types</h4>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Requirements Split</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.propertyType}
                cx="50%"
                cy="50%"
                outerRadius={75}
                dataKey="value"
                nameKey="type"
                label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : '0'}%`}
                labelLine={false}
              >
                {data.propertyType.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 5. Top Locations Horizontal Bar */}
      <Card className="border-slate-200/50 p-5 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase">Top Enquired Locations</h4>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Regional Hotspots</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topLocations} layout="vertical">
              <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} />
              <YAxis dataKey="location" type="category" stroke="#94a3b8" fontSize={9} tickLine={false} width={80} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 6. Confidence Score Distribution Area */}
      <Card className="border-slate-200/50 p-5 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase">Confidence Distribution</h4>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">AI Confidence Metric</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.confidenceScoreDistribution}>
              <XAxis dataKey="range" stroke="#94a3b8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
