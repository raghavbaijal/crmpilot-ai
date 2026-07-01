import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Send, Eraser } from 'lucide-react';

interface AddNoteFormProps {
  onSubmit: (noteText: string) => Promise<void>;
  isSubmitting: boolean;
}

export const AddNoteForm: React.FC<AddNoteFormProps> = ({ onSubmit, isSubmitting }) => {
  const [noteText, setNoteText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const maxChars = 1000;
  const remainingChars = maxChars - noteText.length;
  const isEmpty = !noteText.trim();

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= maxChars) {
      setNoteText(val);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || isSubmitting) return;

    try {
      await onSubmit(noteText);
      setNoteText('');
      // Auto-focus textarea after successful submission
      textareaRef.current?.focus();
    } catch (err) {
      console.error('[Note Form Submission Error]:', err);
    }
  };

  const handleClear = () => {
    setNoteText('');
    textareaRef.current?.focus();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-3 bg-slate-50/20 border border-slate-150 p-4 rounded-2xl">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={noteText}
          onChange={handleTextareaChange}
          disabled={isSubmitting}
          placeholder="Add an internal note..."
          rows={3}
          className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-xl p-3 outline-none resize-none placeholder:text-slate-400 transition-all disabled:opacity-50"
        />
        {/* Character Counter */}
        <div className="absolute bottom-2.5 right-3 text-[9px] font-bold text-slate-400">
          {remainingChars} / {maxChars}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={isEmpty || isSubmitting}
          isLoading={isSubmitting}
          className="text-xs font-semibold py-2 px-3 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3 h-3" />
          Add Note
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={isEmpty || isSubmitting}
          className="text-xs font-semibold py-2 px-3 flex items-center gap-1.5 border-slate-200 hover:border-slate-350 cursor-pointer disabled:opacity-50"
        >
          <Eraser className="w-3 h-3" />
          Clear
        </Button>
      </div>
    </form>
  );
};
export default AddNoteForm;
