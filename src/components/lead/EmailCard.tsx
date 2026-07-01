import React, { useState } from 'react';
import type { EmailContent } from '../../types';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { copyToClipboard } from '../../utils/helpers';

interface EmailCardProps {
  content: EmailContent;
  onRegenerate: () => void;
}

export const EmailCard: React.FC<EmailCardProps> = ({ content, onRegenerate }) => {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const handleCopySubject = async () => {
    const success = await copyToClipboard(content.subject, 'Email subject copied!');
    if (success) {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    }
  };

  const handleCopyBody = async () => {
    const success = await copyToClipboard(content.body, 'Email body copied!');
    if (success) {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };


  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center gap-2">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email Subject</label>
          <button
            onClick={handleCopySubject}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {copiedSubject ? <Check className="w-3 h-3 text-emerald-500" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
            <span>{copiedSubject ? 'Copied' : 'Copy Subject'}</span>
          </button>
        </div>
        <div className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
          {content.subject}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center gap-2">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email Message Body</label>
          <button
            onClick={handleCopyBody}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {copiedBody ? <Check className="w-3 h-3 text-emerald-500" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
            <span>{copiedBody ? 'Copied' : 'Copy Email Body'}</span>
          </button>
        </div>
        <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200/60 p-4 rounded-xl whitespace-pre-wrap leading-relaxed font-medium max-h-[300px] overflow-y-auto">
          {content.body}
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-slate-100/60">
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 border-slate-200 hover:border-slate-300 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Regenerate Email
        </Button>
      </div>
    </div>
  );
};
export default EmailCard;
