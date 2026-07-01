import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { LeadAnalysis } from '../types';
import { getAllLeads } from '../services/api/lead';

interface LeadContextType {
  leads: LeadAnalysis[];
  filteredLeads: LeadAnalysis[];
  paginatedLeads: LeadAnalysis[];
  loading: boolean;
  error: Error | null;
  refreshLeads: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterClassification: 'ALL' | 'HOT' | 'WARM' | 'COLD';
  setFilterClassification: (filter: 'ALL' | 'HOT' | 'WARM' | 'COLD') => void;
  sortBy: 'newest' | 'oldest' | 'confidence-desc' | 'confidence-asc';
  setSortBy: (sort: 'newest' | 'oldest' | 'confidence-desc' | 'confidence-asc') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  selectedLead: LeadAnalysis | null;
  setSelectedLead: (lead: LeadAnalysis | null) => void;
  stats: {
    total: number;
    hot: number;
    warm: number;
    cold: number;
  };
  addNewLeadLocally: (lead: LeadAnalysis) => void;
}


const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<LeadAnalysis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Search, Filter, Sort, Pagination, Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClassification, setFilterClassification] = useState<'ALL' | 'HOT' | 'WARM' | 'COLD'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'confidence-desc' | 'confidence-asc'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<LeadAnalysis | null>(null);

  const refreshLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllLeads();
      console.log("Leads from API:", data);
      setLeads(data);

    } catch (err: unknown) {
      const errorInstance = err instanceof Error ? err : new Error('Unable to contact AI server.');
      setError(errorInstance);
    } finally {
      setLoading(false);
    }
  }, []);


  const addNewLeadLocally = useCallback((lead: LeadAnalysis) => {
    setLeads((prev) => {
      if (prev.some((l) => l.id === lead.id)) {
        return prev;
      }
      const updated = [lead, ...prev];
      if (import.meta.env.DEV) {
        console.log('[Context Action] Optimistically added new lead locally:', lead);
      }
      return updated;
    });
  }, []);


  // Fetch leads on mount
  useEffect(() => {
    refreshLeads();
  }, [refreshLeads]);

  // Dev-only context updates logging
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Context Update] LeadContext state values:', {
        leadsCount: leads.length,
        loading,
        error: error?.message || null,
        searchQuery,
        filterClassification,
        sortBy,
        currentPage,
        selectedLeadId: selectedLead?.id || null,
      });
    }
  }, [leads, loading, error, searchQuery, filterClassification, sortBy, currentPage, selectedLead]);


  // Compute stats on raw leads
  const stats = useMemo(() => {
    const counts = { total: leads.length, hot: 0, warm: 0, cold: 0 };
    leads.forEach((lead) => {
      const classification = lead.leadClassification.toUpperCase();
      if (classification === 'HOT') counts.hot++;
      else if (classification === 'WARM') counts.warm++;
      else if (classification === 'COLD') counts.cold++;
    });
    return counts;
  }, [leads]);

  // Filter and Sort leads
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Apply Search by Customer Name, Phone, or Location
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (lead) =>
          lead.customerName.toLowerCase().includes(query) ||
          lead.phone.toLowerCase().includes(query) ||
          lead.location.toLowerCase().includes(query)
      );
    }

    // Apply Classification Filter
    if (filterClassification !== 'ALL') {
      result = result.filter(
        (lead) => lead.leadClassification.toUpperCase() === filterClassification
      );
    }

    // Apply Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id - a.id;
      }
      if (sortBy === 'oldest') {
        return a.id - b.id;
      }
      if (sortBy === 'confidence-desc') {
        return b.confidenceScore - a.confidenceScore;
      }
      if (sortBy === 'confidence-asc') {
        return a.confidenceScore - b.confidenceScore;
      }
      return 0;
    });

    return result;
  }, [leads, searchQuery, filterClassification, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterClassification, sortBy]);

  // Pagination details
  const totalPages = useMemo(() => {
    const pages = Math.ceil(filteredLeads.length / 10);
    return pages < 1 ? 1 : pages;
  }, [filteredLeads]);

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredLeads.slice(startIndex, startIndex + 10);
  }, [filteredLeads, currentPage]);

  const value = useMemo(
    () => ({
      leads,
      filteredLeads,
      paginatedLeads,
      loading,
      error,
      refreshLeads,
      searchQuery,
      setSearchQuery,
      filterClassification,
      setFilterClassification,
      sortBy,
      setSortBy,
      currentPage,
      setCurrentPage,
      totalPages,
      selectedLead,
      setSelectedLead,
      stats,
      addNewLeadLocally,
    }),
    [
      leads,
      filteredLeads,
      paginatedLeads,
      loading,
      error,
      refreshLeads,
      searchQuery,
      filterClassification,
      sortBy,
      currentPage,
      totalPages,
      selectedLead,
      stats,
      addNewLeadLocally,
    ]

  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};



