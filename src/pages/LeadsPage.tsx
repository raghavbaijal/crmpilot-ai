import { useLeads } from '../context/LeadContext';

import { SearchToolbar } from '../components/lead/SearchToolbar';
import { LeadTable } from '../components/lead/LeadTable';
import { TableProperties } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadsPageProps {
  onNavigateToForm: () => void;
}

export const LeadsPage: React.FC<LeadsPageProps> = ({ onNavigateToForm }) => {
  const {
    paginatedLeads,
    loading,
    searchQuery,
    setSearchQuery,
    filterClassification,
    setFilterClassification,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    setSelectedLead,
  } = useLeads();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TableProperties className="w-6 h-6 text-slate-400" aria-hidden="true" />
            <span>Qualified Leads</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Operational Database</p>
        </div>
      </div>

      <SearchToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterClassification={filterClassification}
        setFilterClassification={setFilterClassification}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {loading ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm animate-pulse min-h-[400px]">
          <div className="h-10 bg-slate-100 rounded-lg" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-lg" />
          ))}
        </div>
      ) : (
        <LeadTable
          leads={paginatedLeads}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          onLeadClick={setSelectedLead}
          onEmptyStateClick={onNavigateToForm}
        />
      )}
    </motion.div>
  );
};
export default LeadsPage;
