import React from 'react';
import { Card } from '../ui/Card';
import { Compass } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecommendationsCardProps {
  recommendations: string[];
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  return (
    <Card className="border-slate-200/60 p-5 space-y-4 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
          <Compass className="w-4.5 h-4.5" aria-hidden="true" />
        </div>
        <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Manager Recommendations</h4>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3 bg-blue-50/20 border border-blue-100/50 text-blue-900 rounded-xl flex items-start gap-2.5"
          >
            <Compass className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-xs font-semibold leading-relaxed">{rec}</span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
export default RecommendationsCard;
