import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import axios from 'axios';

export const Header: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678';
        // Ping baseUrl directly
        await axios.get(`${baseURL}/`, { timeout: 3000 });
        setIsOnline(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
          setIsOnline(false);
        } else {
          // If we receive a response (like 404 or 405), the server is active and reachable
          setIsOnline(true);
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">AI Real Estate CRM</h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Enterprise Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/40 rounded-full px-3.5 py-1.5">
            <span className={`w-2 h-2 rounded-full ${
              isOnline === null ? 'bg-slate-300' : isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-xs font-semibold text-slate-600">
              {isOnline === null ? 'Checking Status...' : isOnline ? 'Backend Online' : 'Backend Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
