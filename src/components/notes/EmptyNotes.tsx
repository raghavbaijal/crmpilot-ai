import React from 'react';
import { StickyNote } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyNotesProps {
  onAddClick: () => void;
}

export const EmptyNotes: React.FC<EmptyNotesProps> = ({ onAddClick }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center py-10 bg-slate-50/20 border border-dashed border-slate-200 rounded-2xl p-6">
      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-3">
        <StickyNote className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h5 className="text-xs font-bold text-slate-700 uppercase">No notes added</h5>
        <p className="text-[10px] text-slate-405 font-semibold max-w-[240px] mx-auto leading-relaxed mb-4">
          No notes have been added for this lead yet. Keep internal notes to track conversations.
        </p>
      </div>
      <Button size="sm" onClick={onAddClick} className="font-semibold text-xs cursor-pointer">
        Add First Note
      </Button>
    </div>
  );
};
export default EmptyNotes;
