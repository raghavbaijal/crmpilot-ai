import { useState, Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLeads } from './context/LeadContext';
import { CopilotProvider, useCopilot } from './context/CopilotContext';
import { CommunicationProvider, useCommunication } from './context/CommunicationContext';
import { DashboardSummaryProvider } from './context/DashboardSummaryContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { ExecutiveDashboardProvider } from './context/ExecutiveDashboardContext';
import { PipelineProvider } from './context/PipelineContext';
import { ManagerInsightsProvider } from './context/ManagerInsightsContext';
import { CRMWorkspaceProvider } from './context/CRMWorkspaceProvider';
import type { LeadAnalysis } from './types';

import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load core pages/components for code splitting and performance optimization
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LeadsPage = lazy(() => import('./pages/LeadsPage').then(m => ({ default: m.LeadsPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const CopilotWorkspace = lazy(() => import('./components/lead/CopilotWorkspace').then(m => ({ default: m.CopilotWorkspace })));

function DashboardAppContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'qualification' | 'leads' | 'analytics' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { searchQuery, setSearchQuery, selectedLead, setSelectedLead, refreshLeads, addNewLeadLocally } = useLeads();
  const { clearAnalysis } = useCopilot();
  const { clearCommunication } = useCommunication();

  const handleLeadQualified = async (lead: LeadAnalysis) => {
    addNewLeadLocally(lead);
    setActiveTab('dashboard');
    // Silently refresh leads list in background to align list state
    refreshLeads();
  };

  const handleBackToLeads = () => {
    setSelectedLead(null);
    clearAnalysis();
    clearCommunication();
  };

  const renderTabContent = () => {
    // If a lead is active, display the flagship Copilot Workspace directly
    if (selectedLead) {
      return <CopilotWorkspace onBack={handleBackToLeads} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigateToForm={() => setActiveTab('qualification')} />;
      case 'qualification':
        return <LandingPage insideDashboard onQualified={handleLeadQualified} />;
      case 'leads':
        return <LeadsPage onNavigateToForm={() => setActiveTab('qualification')} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <Login />;
      default:
        return <Dashboard onNavigateToForm={() => setActiveTab('qualification')} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-600">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedLead(null);
          clearAnalysis();
          clearCommunication();
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onMenuToggle={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={(query) => {
            setSearchQuery(query);
            if (selectedLead) {
              setSelectedLead(null);
              clearAnalysis();
              clearCommunication();
            }
            if (activeTab !== 'leads' && query.trim()) {
              setActiveTab('leads');
            }
          }}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          }>
            {renderTabContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CRMWorkspaceProvider>
        <CopilotProvider>
          <CommunicationProvider>
            <DashboardSummaryProvider>
              <AnalyticsProvider>
                <PipelineProvider>
                  <ManagerInsightsProvider>
                    <ExecutiveDashboardProvider>
                      <DashboardAppContent />
                      <Toaster
                        position="top-right"
                        toastOptions={{
                          className: 'text-sm font-semibold border border-slate-100/60 rounded-xl shadow-md p-4 bg-white text-slate-800',
                          duration: 4000,
                          success: {
                            iconTheme: {
                              primary: '#10b981',
                              secondary: '#ffffff',
                            },
                          },
                          error: {
                            iconTheme: {
                              primary: '#ef4444',
                              secondary: '#ffffff',
                            },
                          },
                        }}
                      />
                    </ExecutiveDashboardProvider>
                  </ManagerInsightsProvider>
                </PipelineProvider>
              </AnalyticsProvider>
            </DashboardSummaryProvider>
          </CommunicationProvider>
        </CopilotProvider>
      </CRMWorkspaceProvider>
    </ErrorBoundary>
  );
}

export default App;


