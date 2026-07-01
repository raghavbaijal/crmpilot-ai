import React from 'react';
import { Card } from '../ui/Card';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RiskAlertsCardProps {
  alerts: string[];
}

export const RiskAlertsCard: React.FC<RiskAlertsCardProps> = ({ alerts }) => {
  return (
    <Card className="border-red-100 bg-red-50/10 p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-red-100/30 pb-3">
        <div className="p-1.5 bg-red-50 text-red-600 border border-red-100/30 rounded-lg">
          <AlertTriangle className="w-4.5 h-4.5 animate-pulse" aria-hidden="true" />
        </div>
        <h4 className="text-xs font-bold text-red-900 tracking-tight uppercase">High Risk Alerts</h4>
      </div>

      <div className="space-y-2">
        {alerts.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium italic">No immediate high risk alerts identified.</p>
        ) : (
          alerts.map((alert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 bg-red-50/40 border border-red-100/50 text-red-800 rounded-xl flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-xs font-semibold leading-relaxed">{alert}</span>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
};
export default RiskAlertsCard;
