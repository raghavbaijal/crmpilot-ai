import React from 'react';
import { Card } from '../ui/Card';
import { ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';

interface PriorityActionsCardProps {
  actions: string[];
}

export const PriorityActionsCard: React.FC<PriorityActionsCardProps> = ({ actions }) => {
  return (
    <Card className="border-slate-200/60 p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
          <ListTodo className="w-4.5 h-4.5" aria-hidden="true" />
        </div>
        <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Priority Actions</h4>
      </div>

      <ol className="space-y-3">
        {actions.map((action, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span className="text-xs text-slate-700 font-semibold leading-relaxed">
              {action}
            </span>
          </motion.li>
        ))}
      </ol>
    </Card>
  );
};
export default PriorityActionsCard;
