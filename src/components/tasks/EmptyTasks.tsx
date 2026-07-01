import React from 'react';
import { CheckSquare } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyTasksProps {
  onCreateClick: () => void;
}

export const EmptyTasks: React.FC<EmptyTasksProps> = ({ onCreateClick }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center py-10 bg-slate-50/20 border border-dashed border-slate-200 rounded-2xl p-6">
      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-3">
        <CheckSquare className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h5 className="text-xs font-bold text-slate-700 uppercase">No tasks created</h5>
        <p className="text-[10px] text-slate-400 font-semibold max-w-[240px] mx-auto leading-relaxed mb-4">
          No tasks have been created for this lead yet. Build checklists to organize followups.
        </p>
      </div>
      <Button size="sm" onClick={onCreateClick} className="font-semibold text-xs cursor-pointer">
        Create First Task
      </Button>
    </div>
  );
};
export default EmptyTasks;
