import React from 'react';
import { Card } from '../ui/Card';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface BusinessInsightsCardProps {
  insights: string[];
}

export const BusinessInsightsCard: React.FC<BusinessInsightsCardProps> = ({ insights }) => {
  return (
    <Card className="border-slate-200/60 p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
          <Lightbulb className="w-4.5 h-4.5" aria-hidden="true" />
        </div>
        <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Business Insights</h4>
      </div>

      <ul className="space-y-3">
        {insights.map((insight, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold leading-relaxed"
          >
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0 animate-pulse" />
            <span>{insight}</span>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
};
export default BusinessInsightsCard;
