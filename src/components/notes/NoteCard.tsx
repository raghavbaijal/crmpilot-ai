import React from 'react';
import type { LeadNote } from '../../types';
import { Card } from '../ui/Card';



interface NoteCardProps {
  note: LeadNote;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  // First letter of author name
  const authorInitials = note.created_by ? note.created_by.charAt(0).toUpperCase() : 'U';

  const dateFormatted = new Date(note.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isTemporary = note.id < 0;

  return (
    <Card className={`border-slate-200/60 p-4 bg-white transition-all hover:shadow-md ${isTemporary ? 'opacity-60 border-dashed' : ''}`}>
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          {/* Small Avatar */}
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-xs font-black shrink-0 uppercase">
            {authorInitials}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              {note.created_by || 'Unknown Executive'}
            </span>
            <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
              {note.formatted_date || dateFormatted}
            </span>
          </div>
        </div>
        {isTemporary && (
          <span className="text-[8px] bg-slate-100 text-slate-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
            Saving...
          </span>
        )}
      </div>

      <div className="text-xs text-slate-650 leading-relaxed font-semibold bg-slate-50/20 border border-slate-100/40 p-3 rounded-xl whitespace-pre-wrap break-words">
        {note.note}
      </div>
    </Card>
  );
};
export default NoteCard;
