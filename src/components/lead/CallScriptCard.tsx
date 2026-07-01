import React, { useState } from 'react';
import type { CallScriptContent } from '../../types';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { copyToClipboard } from '../../utils/helpers';

interface CallScriptCardProps {
  content: CallScriptContent;
  onRegenerate: () => void;
}

export const CallScriptCard: React.FC<CallScriptCardProps> = ({ content, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEntireScript = async () => {
    const questionsText = content.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    const fullText = `Opening:\n${content.opening}\n\nQuestions to Ask:\n${questionsText}\n\nClosing:\n${content.closing}`;
    const success = await copyToClipboard(fullText, 'Call script copied!');
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Opening Statement</label>
        <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200/60 p-3 rounded-xl leading-relaxed font-semibold italic">
          "{content.opening}"
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Key Questions to Ask</label>
        {content.questions.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No specific questions recommended.</p>
        ) : (
          <ul className="space-y-2 bg-slate-50/40 border border-slate-100 p-3 rounded-xl">
            {content.questions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/25 h-3.5 w-3.5 cursor-pointer shrink-0"
                />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Closing Statement</label>
        <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200/60 p-3 rounded-xl leading-relaxed font-semibold italic">
          "{content.closing}"
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 pt-2 border-t border-slate-100/60">
        <button
          onClick={handleCopyEntireScript}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
          <span>{copied ? 'Script Copied' : 'Copy Entire Script'}</span>
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 border-slate-200 hover:border-slate-300 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Regenerate Script
        </Button>
      </div>
    </div>
  );
};
export default CallScriptCard;
