import React, { useEffect, useState } from 'react';
import { useDashboardSummary } from '../../context/DashboardSummaryContext';
import { Card } from '../ui/Card';
import { Users, Flame, ShieldAlert, Award, Calendar, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedValueProps {
  value: number;
  suffix?: string;
}

const AnimatedValue: React.FC<AnimatedValueProps> = ({ value, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.floor(value);
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    const duration = 800; // ms
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / (end - start)));
    const timer = setInterval(() => {
      start += increment;
      setDisplayValue(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 15));

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
};

export const ExecutiveKPICards: React.FC = () => {
  const { summary, loading } = useDashboardSummary();

  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-28 bg-white border border-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Leads',
      value: summary.total_leads,
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-100/40',
      trend: 'Total Registered',
    },
    {
      title: 'HOT Leads',
      value: summary.hot_leads,
      icon: Flame,
      color: 'text-red-600 bg-red-50 border-red-100/40',
      trend: 'Immediate Pitching',
    },
    {
      title: 'WARM Leads',
      value: summary.warm_leads,
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-50 border-amber-100/40',
      trend: 'Nurturing Queue',
    },
    {
      title: 'COLD Leads',
      value: summary.cold_leads,
      icon: HelpCircle,
      color: 'text-slate-500 bg-slate-100 border-slate-200/40',
      trend: 'Low Intent',
    },
    {
      title: 'Avg Confidence',
      value: summary.average_confidence,
      suffix: '%',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100/40',
      trend: 'AI Accuracy Rating',
    },
    {
      title: 'High Priority',
      value: summary.high_priority,
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50 border-rose-100/40',
      trend: 'Requires Action',
    },
    {
      title: 'New Today',
      value: summary.new_today,
      icon: Calendar,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100/40',
      trend: 'Today\'s Inflow',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      <AnimatePresence>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="border-slate-200/50 p-4 h-full flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {kpi.title}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${kpi.color}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-xl font-black text-slate-900 tracking-tight leading-none block">
                    <AnimatedValue value={kpi.value} suffix={kpi.suffix} />
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                    {kpi.trend}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
export default ExecutiveKPICards;
