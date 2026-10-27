/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, LandAcquisitionCase, DashboardSummary, AlertItem, AuditLog, UserRole } from './types';
import { apiService } from './services/apiService';
import { Sidebar, NavItemKey } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { CasesTable } from './components/cases/CasesTable';
import { AddNewCaseForm } from './components/cases/AddNewCaseForm';
import { CaseDetailModal } from './components/cases/CaseDetailModal';
import { PredictionsModule } from './components/predictions/PredictionsModule';
import { MilestoneTrackerView } from './components/milestones/MilestoneTrackerView';
import { AlertsCenter } from './components/alerts/AlertsCenter';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { UserManagement } from './components/admin/UserManagement';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { SettingsView } from './components/settings/SettingsView';
import { LoginView } from './components/auth/LoginView';
import { USERS } from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => apiService.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<NavItemKey>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Pune');
  const [globalSearch, setGlobalSearch] = useState('');

  // Domain data
  const [cases, setCases] = useState<LandAcquisitionCase[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals & detailed views
  const [activeCaseModalId, setActiveCaseModalId] = useState<string | null>(null);

  // Sync state with selected district & user
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role !== 'admin' && currentUser.district !== 'All') {
        setSelectedDistrict(currentUser.district);
      }
      refreshData();
    }
  }, [currentUser, selectedDistrict]);

  const refreshData = async () => {
    const fetchedCases = await apiService.getCases(selectedDistrict);
    const fetchedSummary = await apiService.getDashboardSummary(selectedDistrict);
    const fetchedAlerts = await apiService.getAlerts(selectedDistrict);
    const fetchedLogs = await apiService.getAuditLogs(selectedDistrict);

    setCases(fetchedCases);
    setSummary(fetchedSummary);
    setAlerts(fetchedAlerts);
    setAuditLogs(fetchedLogs);
  };

  const handleSwitchUserRole = (newRole: UserRole) => {
    const targetUser = USERS.find(u => u.role === newRole) || USERS[0];
    apiService.setCurrentUser(targetUser);
    setCurrentUser(targetUser);
    if (targetUser.role !== 'admin' && targetUser.district !== 'All') {
      setSelectedDistrict(targetUser.district);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user: User) => {
    apiService.setCurrentUser(user);
    setCurrentUser(user);
    if (user.role !== 'admin' && user.district !== 'All') {
      setSelectedDistrict(user.district);
    }
  };

  const handleCaseCreated = (newCase: LandAcquisitionCase) => {
    refreshData();
    setActiveCaseModalId(newCase.id);
    setCurrentTab('cases');
  };

  const handleCaseUpdated = (updatedCase: LandAcquisitionCase) => {
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    refreshData();
  };

  // Unread alerts count
  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length;

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* 1. Left Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setGlobalSearch('');
        }}
        userRole={currentUser.role}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        alertCount={unreadAlertsCount}
        onLogout={handleLogout}
      />

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <Header
          currentUser={currentUser}
          onSwitchUserRole={handleSwitchUserRole}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
          globalSearch={globalSearch}
          onSearchChange={setGlobalSearch}
          unreadAlertCount={unreadAlertsCount}
          onOpenAlerts={() => setCurrentTab('alerts')}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Global Search Banner when active */}
            {globalSearch.trim() && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center justify-between">
                <span>Filtering all views for search query: <strong className="font-mono">"{globalSearch}"</strong></span>
                <button
                  onClick={() => setGlobalSearch('')}
                  className="font-bold hover:underline"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* TAB 1: OVERVIEW DASHBOARD */}
            {currentTab === 'overview' && summary && (
              <OverviewDashboard
                summary={summary}
                cases={cases}
                alerts={alerts}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                onOpenCase={(id) => setActiveCaseModalId(id)}
                onOpenAlerts={() => setCurrentTab('alerts')}
                onOpenNewCase={() => setCurrentTab('add-case')}
              />
            )}

            {/* TAB 2: CASES TABLE */}
            {currentTab === 'cases' && (
              <CasesTable
                cases={cases}
                onOpenCase={(id) => setActiveCaseModalId(id)}
                onOpenNewCase={() => setCurrentTab('add-case')}
              />
            )}

            {/* TAB 3: ADD NEW CASE */}
            {currentTab === 'add-case' && (
              <AddNewCaseForm
                onCancel={() => setCurrentTab('cases')}
                onCaseCreated={handleCaseCreated}
                defaultDistrict={selectedDistrict}
              />
            )}

            {/* TAB 4: AI DELAY PREDICTIONS */}
            {currentTab === 'predictions' && (
              <PredictionsModule
                cases={cases}
                onOpenCase={(id) => setActiveCaseModalId(id)}
                onCaseUpdated={handleCaseUpdated}
              />
            )}

            {/* TAB 5: MILESTONE TRACKER */}
            {currentTab === 'milestones' && (
              <MilestoneTrackerView
                cases={cases}
                onOpenCase={(id) => setActiveCaseModalId(id)}
                onMilestoneUpdated={refreshData}
              />
            )}

            {/* TAB 6: ALERTS AND NOTIFICATIONS */}
            {currentTab === 'alerts' && (
              <AlertsCenter
                alerts={alerts}
                onOpenCase={(id) => setActiveCaseModalId(id)}
                onAlertAcknowledged={refreshData}
              />
            )}

            {/* TAB 7: REPORTS AND ANALYTICS */}
            {currentTab === 'reports' && summary && (
              <ReportsAnalytics
                cases={cases}
                summary={summary}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
              />
            )}

            {/* TAB 8: USER MANAGEMENT (Admin only) */}
            {currentTab === 'users' && currentUser.role === 'admin' && (
              <UserManagement />
            )}

            {/* TAB 9: AUDIT LOGS */}
            {currentTab === 'audit' && (
              <AuditLogsView
                logs={auditLogs}
                onOpenCase={(id) => setActiveCaseModalId(id)}
              />
            )}

            {/* TAB 10: SETTINGS */}
            {currentTab === 'settings' && (
              <SettingsView />
            )}
          </div>
        </main>
      </div>

      {/* Case Profile Detailed Modal */}
      {activeCaseModalId && (
        <CaseDetailModal
          caseId={activeCaseModalId}
          onClose={() => setActiveCaseModalId(null)}
          userRole={currentUser.role}
          onCaseUpdated={handleCaseUpdated}
        />
      )}
    </div>
  );
}
