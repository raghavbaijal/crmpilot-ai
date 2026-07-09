import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { CalendarRange, Eraser } from 'lucide-react';

interface AddFollowupFormProps {
  onSubmit: (title: string, description: string, followupType: "CALL" | "EMAIL" | "WHATSAPP" | "SITE_VISIT" | "MEETING", priority: "LOW" | "MEDIUM" | "HIGH", dueDate: string, assignedTo: string) => Promise<void>;
  isSubmitting: boolean;
}

export const AddFollowupForm: React.FC<AddFollowupFormProps> = ({ onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [followupType, setFollowupType] = useState<"CALL" | "EMAIL" | "WHATSAPP" | "SITE_VISIT" | "MEETING">('CALL');
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const assignedTo = 'Executive Agent'; // Default internally logged agent

  const titleRef = useRef<HTMLInputElement | null>(null);

  const maxTitleChars = 150;
  const maxDescChars = 1000;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= maxTitleChars) {
      setTitle(val);
    }
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= maxDescChars) {
      setDescription(val);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate || isSubmitting) return;

    try {
      await onSubmit(title, description, followupType, priority, dueDate, assignedTo);
      setTitle('');
      setDescription('');
      setFollowupType('CALL');
      setPriority('MEDIUM');
      setDueDate('');
      // Auto-focus title field after successful submit
      titleRef.current?.focus();
    } catch (err) {
      console.error('[Add Followup Form Error]:', err);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setFollowupType('CALL');
    setPriority('MEDIUM');
    setDueDate('');
    titleRef.current?.focus();
  };

  const isInvalid = !title.trim() || !dueDate;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 bg-slate-50/20 border border-slate-150 p-5 rounded-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Follow-up Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              ref={titleRef}
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              disabled={isSubmitting}
              placeholder="e.g. Discuss revised property pricing plan"
              className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-xl p-3 outline-none transition-all disabled:opacity-50"
            />
            <div className="absolute top-3.5 right-3 text-[8px] font-bold text-slate-450">
              {title.length} / {maxTitleChars}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Description
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={handleDescChange}
              disabled={isSubmitting}
              placeholder="Provide context or notes..."
              rows={3}
              className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-xl p-3 outline-none resize-none transition-all disabled:opacity-50"
            />
            <div className="absolute bottom-2.5 right-3 text-[8px] font-bold text-slate-450">
              {description.length} / {maxDescChars}
            </div>
          </div>
        </div>

        {/* Followup Type */}
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Follow-up Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={followupType}
            onChange={(e) => setFollowupType(e.target.value as any)}
            disabled={isSubmitting}
            className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-xl p-3 outline-none transition-all disabled:opacity-50 cursor-pointer"
          >
            <option value="CALL">Call</option>
            <option value="EMAIL">Email</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="SITE_VISIT">Site Visit</option>
            <option value="MEETING">Meeting</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Priority <span className="text-rose-500">*</span>
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            disabled={isSubmitting}
            className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-xl p-3 outline-none transition-all disabled:opacity-50 cursor-pointer"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Due Date & Time <span className="text-rose-500">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isSubmitting}
            className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-xl p-3 outline-none transition-all disabled:opacity-50 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <Button
          type="submit"
          disabled={isInvalid || isSubmitting}
          isLoading={isSubmitting}
          className="text-xs font-semibold py-2 px-3 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <CalendarRange className="w-3.5 h-3.5" />
          Schedule Follow-up
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={(isInvalid && !description.trim()) || isSubmitting}
          className="text-xs font-semibold py-2 px-3 flex items-center gap-1.5 border-slate-200 hover:border-slate-350 cursor-pointer disabled:opacity-50"
        >
          <Eraser className="w-3.5 h-3.5" />
          Reset
        </Button>
      </div>
    </form>
  );
};
export default AddFollowupForm;
