import React, { useState } from 'react';
import type { SMSContent } from '../../types';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { copyToClipboard } from '../../utils/helpers';

interface SMSCardProps {
  content: SMSContent;
  onRegenerate: () => void;
}

export const SMSCard: React.FC<SMSCardProps> = ({ content, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(content.message, 'SMS text copied!');
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  const charCount = content.message.length;
  const segments = Math.ceil(charCount / 160);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center gap-2">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SMS Text Message</label>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
            <span>{copied ? 'Copied' : 'Copy Message'}</span>
          </button>
        </div>
        <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200/60 p-4 rounded-xl leading-relaxed font-semibold whitespace-pre-wrap">
          {content.message}
        </div>
        <div className="flex justify-end text-[10px] font-bold text-slate-400 uppercase tracking-wider gap-3 mt-1">
          <span>{charCount} Characters</span>
          <span>•</span>
          <span>{segments} SMS Segment{segments > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-slate-100/60">
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 border-slate-200 hover:border-slate-350 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Regenerate SMS
        </Button>
      </div>
    </div>
  );
};
export default SMSCard;
