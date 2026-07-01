import React from 'react';
import type { SalesStrategy } from '../../types';
import { Card } from '../ui/Card';
import { Copy, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { copyToClipboard } from '../../utils/helpers';

interface SalesStrategyCardProps {
  strategy: SalesStrategy;
}

export const SalesStrategyCard: React.FC<SalesStrategyCardProps> = ({ strategy }) => {
  const [copiedMessage, setCopiedMessage] = React.useState(false);

  const handleCopyMessage = async () => {
    const success = await copyToClipboard(strategy.openingMessage, 'Opening message copied to clipboard');
    if (success) {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };


  return (
    <Card className="border-slate-200/60 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Sparkles className="w-4.5 h-4.5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-none">Sales Strategy</h3>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Pitching Guidance</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Opening Message</span>
          <button
            onClick={handleCopyMessage}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            {copiedMessage ? <Check className="w-3 h-3 text-emerald-500" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
            <span>{copiedMessage ? 'Copied' : 'Copy Message'}</span>
          </button>
        </div>
        <p className="text-xs text-blue-800 bg-blue-50/30 border border-blue-100/50 p-4 rounded-xl leading-relaxed font-semibold italic">
          "{strategy.openingMessage}"
        </p>
      </div>

      <div className="space-y-3">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Discovery Questions</span>
        {strategy.discoveryQuestions.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No custom questions generated.</p>
        ) : (
          <ul className="space-y-2">
            {strategy.discoveryQuestions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
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

      <div className="space-y-3">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Likely Objections</span>
        {strategy.likelyObjections.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No objections identified.</p>
        ) : (
          <div className="space-y-2.5">
            {strategy.likelyObjections.map((obj, idx) => (
              <div key={idx} className="p-3 bg-red-50/20 border border-red-100/50 text-red-800 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-xs font-semibold">{obj}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Negotiation Tips</span>
        {strategy.negotiationTips.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No negotiation tips generated.</p>
        ) : (
          <div className="space-y-2.5">
            {strategy.negotiationTips.map((tip, idx) => (
              <div key={idx} className="p-3 bg-emerald-50/20 border border-emerald-100/50 text-emerald-800 rounded-xl flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-xs font-semibold">{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
export default SalesStrategyCard;
