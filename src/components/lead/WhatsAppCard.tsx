import React, { useState } from 'react';
import type { WhatsAppContent } from '../../types';
import { Copy, Check, RefreshCw, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { copyToClipboard } from '../../utils/helpers';

interface WhatsAppCardProps {
  content: WhatsAppContent;
  onRegenerate: () => void;
  phone?: string;
}

export const WhatsAppCard: React.FC<WhatsAppCardProps> = ({ content, onRegenerate, phone }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(content.message, 'WhatsApp message copied!');
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  const handleOpenWhatsApp = () => {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const encodedText = encodeURIComponent(content.message);
    const waUrl = cleanPhone 
      ? `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
      : `https://web.whatsapp.com/send?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center gap-2">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">WhatsApp Message</label>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
            <span>{copied ? 'Copied' : 'Copy Message'}</span>
          </button>
        </div>
        <div className="text-xs text-slate-700 bg-emerald-50/10 border border-emerald-100 p-4 rounded-xl leading-relaxed font-semibold whitespace-pre-wrap max-h-[300px] overflow-y-auto">
          {content.message}
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 pt-2 border-t border-slate-100/60">
        <button
          onClick={handleOpenWhatsApp}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
          Open WhatsApp Web
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 border-slate-200 hover:border-slate-300 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Regenerate WhatsApp
        </Button>
      </div>
    </div>
  );
};
export default WhatsAppCard;
