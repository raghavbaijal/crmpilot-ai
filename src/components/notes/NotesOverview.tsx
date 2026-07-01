import React from 'react';
import { useNotes } from '../../context/NotesContext';
import { AddNoteForm } from './AddNoteForm';
import { NotesList } from './NotesList';
import { EmptyNotes } from './EmptyNotes';
import { LoadingNotes } from './LoadingNotes';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StickyNote, RefreshCw, AlertCircle, Clock } from 'lucide-react';

export const NotesOverview: React.FC = () => {
  const {
    notes,
    metadata,
    loading,
    isRefreshing,
    isSubmitting,
    hasNotes,
    error,
    lastUpdated,
    refreshNotes,
    addNote,
  } = useNotes();

  const handleAddNote = async (text: string) => {
    // Current user context (hardcoded for CRM internal logs)
    const currentUser = 'Executive Agent';
    await addNote(text, currentUser);
  };

  const handleAddFirstNoteClick = () => {
    // Select Note textarea
    const textarea = document.querySelector('textarea[placeholder="Add an internal note..."]') as HTMLTextAreaElement | null;
    textarea?.focus();
  };

  return (
    <Card className="border-slate-200/60 p-5 space-y-5 bg-white">
      {/* Header Panel */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <StickyNote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase leading-none">
              Internal Lead Notes
            </h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
              Collaboration & Comments Log
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasNotes && (
            <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
              Total Notes: {notes.length}
            </span>
          )}
          <button
            onClick={refreshNotes}
            disabled={loading || isRefreshing}
            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Refresh notes"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Note submission form */}
      <AddNoteForm onSubmit={handleAddNote} isSubmitting={isSubmitting} />

      {/* Note Lists, Skeletons, Errors, Empty placeholders */}
      <div className="space-y-4">
        {loading && !isRefreshing ? (
          <LoadingNotes />
        ) : error ? (
          <div className="text-center py-6 flex flex-col items-center justify-center space-y-3 bg-red-50/10 border border-red-100 rounded-2xl p-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700">Failed to load notes</p>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                {error.message || 'The server connection was interrupted.'}
              </p>
            </div>
            <Button size="sm" onClick={refreshNotes} className="font-semibold text-xs cursor-pointer">
              Retry Connection
            </Button>
          </div>
        ) : !hasNotes ? (
          <EmptyNotes onAddClick={handleAddFirstNoteClick} />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Timeline Log</span>
              {lastUpdated && (
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  Synced: {lastUpdated}
                </span>
              )}
            </div>
            <NotesList notes={notes} />
          </div>
        )}
      </div>

      {/* Metadata Footer */}
      {metadata && (
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Source: {metadata.source || 'CRM Database'}</span>
          <span>Version: {metadata.version || 'v1.0'}</span>
        </div>
      )}
    </Card>
  );
};
export default NotesOverview;
