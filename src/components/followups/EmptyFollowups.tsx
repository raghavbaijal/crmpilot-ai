import React from 'react';
import { CalendarRange } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyFollowupsProps {
  onScheduleClick: () => void;
}

export const EmptyFollowups: React.FC<EmptyFollowupsProps> = ({ onScheduleClick }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center py-10 bg-slate-50/20 border border-dashed border-slate-200 rounded-2xl p-6">
      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-3">
        <CalendarRange className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h5 className="text-xs font-bold text-slate-700 uppercase">No follow-ups scheduled</h5>
        <p className="text-[10px] text-slate-405 font-semibold max-w-[240px] mx-auto leading-relaxed mb-4">
          No follow-ups have been scheduled for this lead. Schedule meetings, calls, or site visits.
        </p>
      </div>
      <Button size="sm" onClick={onScheduleClick} className="font-semibold text-xs cursor-pointer">
        Schedule First Follow-up
      </Button>
    </div>
  );
};
export default EmptyFollowups;
