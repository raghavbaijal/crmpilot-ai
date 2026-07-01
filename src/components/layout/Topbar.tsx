import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import axios from 'axios';

interface TopbarProps {
  onMenuToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onMenuToggle,
  searchQuery,
  setSearchQuery,
}) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678';
        await axios.get(`${baseURL}/`, { timeout: 3000 });
        setIsOnline(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
          setIsOnline(false);
        } else {
          setIsOnline(true);
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/40 cursor-pointer"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-none">Welcome back</h2>
          <span className="text-[10px] text-slate-400 font-semibold">{today}</span>
        </div>
      </div>

      <div className="flex-1 max-w-md relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-4 h-4" aria-hidden="true" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search leads by name, phone, or location..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/60 focus:border-blue-500 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 text-xs shadow-inner"
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/40 rounded-full px-3 py-1">
          <span className={`w-1.5 h-1.5 rounded-full ${
            isOnline === null ? 'bg-slate-300' : isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
          }`} />
          <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase hidden md:inline">
            {isOnline === null ? 'Syncing...' : isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 border border-slate-200/20 relative cursor-pointer">
          <Bell className="w-4.5 h-4.5" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs cursor-pointer shadow-xs">
          RB
        </div>
      </div>
    </header>
  );
};
export default Topbar;
