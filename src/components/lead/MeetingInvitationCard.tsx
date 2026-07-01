import React, { useState } from 'react';
import type { MeetingInvitationContent } from '../../types';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { copyToClipboard } from '../../utils/helpers';

interface MeetingInvitationCardProps {
  content: MeetingInvitationContent;
  onRegenerate: () => void;
}

export const MeetingInvitationCard: React.FC<MeetingInvitationCardProps> = ({ content, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyInvitation = async () => {
    const fullText = `Meeting Title: ${content.title}\nAgenda:\n${content.agenda}\n\nMessage:\n${content.message}`;
    const success = await copyToClipboard(fullText, 'Meeting invitation copied!');
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Meeting Title</label>
        <div className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
          {content.title}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Proposed Agenda</label>
        <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200/60 p-3 rounded-xl whitespace-pre-wrap leading-relaxed font-semibold">
          {content.agenda}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Invite Message Description</label>
        <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl whitespace-pre-wrap leading-relaxed font-semibold">
          {content.message}
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 pt-2 border-t border-slate-100/60">
        <button
          onClick={handleCopyInvitation}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
          <span>{copied ? 'Invitation Copied' : 'Copy Invitation Details'}</span>
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 border-slate-200 hover:border-slate-300 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Regenerate Invitation
        </Button>
      </div>
    </div>
  );
};
export default MeetingInvitationCard;
