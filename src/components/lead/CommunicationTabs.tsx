import React from 'react';
import type { CommunicationType } from '../../types';
import { Mail, MessageSquare, PhoneCall, Smartphone, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CommunicationTabsProps {
  activeTab: CommunicationType;
  onChange: (tab: CommunicationType) => void;
}

export const CommunicationTabs: React.FC<CommunicationTabsProps> = ({ activeTab, onChange }) => {
  const tabsList: { id: CommunicationType; label: string; icon: React.ReactNode }[] = [
    { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'call_script', label: 'Call Script', icon: <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'sms', label: 'SMS Text', icon: <Smartphone className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'meeting_invitation', label: 'Meeting Invite', icon: <Calendar className="w-3.5 h-3.5" aria-hidden="true" /> },
  ];

  return (
    <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar scroll-smooth gap-2">
      {tabsList.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer select-none',
              isActive
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
export default CommunicationTabs;
