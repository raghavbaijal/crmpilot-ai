import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterClassification: 'ALL' | 'HOT' | 'WARM' | 'COLD';
  setFilterClassification: (filter: 'ALL' | 'HOT' | 'WARM' | 'COLD') => void;
  sortBy: 'newest' | 'oldest' | 'confidence-desc' | 'confidence-asc';
  setSortBy: (sort: 'newest' | 'oldest' | 'confidence-desc' | 'confidence-asc') => void;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  filterClassification,
  setFilterClassification,
  sortBy,
  setSortBy,
}) => {
  const filters: ('ALL' | 'HOT' | 'WARM' | 'COLD')[] = ['ALL', 'HOT', 'WARM', 'COLD'];

  const filterColors = {
    ALL: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80',
    HOT: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100/50',
    WARM: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/50',
    COLD: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/50',
  };

  const activeFilterColors = {
    ALL: 'bg-slate-900 text-white border-slate-900',
    HOT: 'bg-red-600 text-white border-red-600',
    WARM: 'bg-amber-500 text-white border-amber-500',
    COLD: 'bg-blue-600 text-white border-blue-600',
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-4 h-4" aria-hidden="true" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter leads by name, phone, or location..."
          className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-blue-500 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 text-xs shadow-xs"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Filter:</span>
        </div>
        {filters.map((f) => {
          const isActive = filterClassification === f;
          return (
            <button
              key={f}
              onClick={() => setFilterClassification(f)}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer shrink-0',
                isActive ? activeFilterColors[f] : filterColors[f]
              )}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Sort By:</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'confidence-desc' | 'confidence-asc')}
          className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer shadow-xs"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="confidence-desc">Highest Confidence</option>
          <option value="confidence-asc">Lowest Confidence</option>
        </select>
      </div>
    </div>
  );
};
export default SearchToolbar;
