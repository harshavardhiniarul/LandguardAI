import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Bell,
  Calendar,
  ChevronDown,
  Shield,
  UserCheck
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { DISTRICTS_LIST } from '../../data/mockData';

interface HeaderProps {
  currentUser: User;
  onSwitchUserRole: (role: UserRole) => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  globalSearch: string;
  onSearchChange: (query: string) => void;
  unreadAlertCount: number;
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUserRole,
  selectedDistrict,
  onSelectDistrict,
  globalSearch,
  onSearchChange,
  unreadAlertCount,
  onOpenAlerts
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Formatted Indian date
  const displayDate = 'Monday, 26 Oct 2026';

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    collector: { title: 'District Collector', color: 'bg-blue-100 text-blue-800' },
    lao: { title: 'Land Acquisition Officer', color: 'bg-emerald-100 text-emerald-800' },
    tahsildar: { title: 'Tahsildar / Executive Magistrate', color: 'bg-amber-100 text-amber-800' },
    admin: { title: 'State Nodal Administrator', color: 'bg-purple-100 text-purple-800' }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-6 shrink-0 z-20">
      {/* Zone 1: Global Search & District Jurisdiction */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Case ID (e.g. LA-2026-PUN), Project, Village..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        {/* District Selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">District:</span>
          {currentUser.role === 'admin' ? (
            <select
              value={selectedDistrict}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {DISTRICTS_LIST.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Districts (State View)' : `${d} District`}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded border border-slate-200">
              {currentUser.district} District
            </span>
          )}
        </div>
      </div>

      {/* Zone 2: Date & Operational Calendar */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 shrink-0 font-medium">
        <Calendar className="w-4 h-4 text-slate-400" />
        <span className="font-mono tabular-nums">{displayDate}</span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-500 text-[11px]">RFCTLARR 2013 Statutory Portal</span>
      </div>

      {/* Zone 3: Alerts Notification & User Role Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title={`${unreadAlertCount} Pending Delay Alerts`}
          aria-label="View Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
          )}
        </button>

        {/* Role & User Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-900 truncate max-w-[150px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-blue-600" />
                {roleLabels[currentUser.role].title}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role Switcher Menu for Testing & Evaluation */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Current Session
                </div>
                <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                <div className="text-[11px] text-slate-500">Jurisdiction: {currentUser.district}</div>
              </div>

              <div className="px-3 pt-2 pb-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role (Demo Mode)
                </div>
              </div>

              <div className="space-y-0.5 px-1">
                {(['collector', 'lao', 'tahsildar', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onSwitchUserRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md transition-colors text-left ${
                      currentUser.role === r
                        ? 'bg-blue-50 text-blue-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className={`w-3.5 h-3.5 ${currentUser.role === r ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{roleLabels[r].title}</span>
                    </div>
                    {currentUser.role === r && (
                      <span className="text-[10px] text-blue-600 font-bold">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
