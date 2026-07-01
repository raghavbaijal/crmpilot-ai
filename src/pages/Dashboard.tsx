import { useLeads } from '../context/LeadContext';

import { DashboardStats } from '../components/lead/DashboardStats';
import { RecentLeadCard } from '../components/lead/RecentLeadCard';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { BarChart3, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  onNavigateToForm: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToForm }) => {
  const { leads, stats, setSelectedLead, loading } = useLeads();

  // Get 5 most recently qualified leads (sorted by ID descending)
  const recentLeads = [...leads]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Overview</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">CRM Dashboard</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white border border-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <DashboardStats stats={stats} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" aria-hidden="true" />
              <span>Recent Qualified Leads</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Top 5</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : recentLeads.length === 0 ? (
            <EmptyState onAction={onNavigateToForm} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentLeads.map((lead) => (
                <motion.div key={lead.id} variants={itemVariants}>
                  <RecentLeadCard lead={lead} onClick={() => setSelectedLead(lead)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>Operational Insights</span>
          </h3>
          <Card className="border-slate-100/60 p-8 text-center bg-slate-50/10 min-h-[250px] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/40">
              <Sparkles className="w-5 h-5 animate-pulse" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Analytics Coming Soon</h4>
              <p className="text-[11px] text-slate-400 font-semibold max-w-[200px] mx-auto leading-relaxed">
                Phase 3 will introduce interactive conversion pipelines, timeline graphs, and agent suggestions.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
export default Dashboard;
