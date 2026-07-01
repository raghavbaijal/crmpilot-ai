import React from 'react';
import { LayoutDashboard, FileSignature, TableProperties, Settings, X, Building2, BarChart2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  activeTab: 'dashboard' | 'qualification' | 'leads' | 'analytics' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'qualification' | 'leads' | 'analytics' | 'settings') => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'qualification', label: 'Lead Qualification', icon: FileSignature },
    { id: 'leads', label: 'Leads', icon: TableProperties },
    { id: 'analytics', label: 'Executive Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;


  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs lg:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-100 p-6 transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-4.5 h-4.5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">AI Real Estate</h1>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">CRM Admin</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon className="w-4.5 h-4.5" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
            RB
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">Raghav Baijal</p>
            <p className="text-[10px] text-slate-400 truncate">raghav@realestate.com</p>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
