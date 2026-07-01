import React from 'react';
import type { LeadNote } from '../../types';
import { NoteCard } from './NoteCard';

interface NotesListProps {
  notes: LeadNote[];
}

export const NotesList: React.FC<NotesListProps> = ({ notes }) => {
  return (
    <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};
export default NotesList;
