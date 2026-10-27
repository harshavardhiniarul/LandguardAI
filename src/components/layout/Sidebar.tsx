import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  FilePlus,
  Cpu,
  Milestone as MilestoneIcon,
  BellRing,
  BarChart3,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Landmark
} from 'lucide-react';
import { UserRole } from '../../types';

export type NavItemKey =
  | 'overview'
  | 'cases'
  | 'add-case'
  | 'predictions'
  | 'milestones'
  | 'alerts'
  | 'reports'
  | 'users'
  | 'audit'
  | 'settings';

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  userRole: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  alertCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  isCollapsed,
  onToggleCollapse,
  alertCount,
  onLogout
}) => {
  const navItems: { key: NavItemKey; label: string; icon: React.ElementType; adminOnly?: boolean; badge?: number }[] = [
    { key: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { key: 'cases', label: 'Land Acquisition Cases', icon: FolderKanban },
    { key: 'add-case', label: 'Add New Case', icon: FilePlus },
    { key: 'predictions', label: 'AI Delay Predictions', icon: Cpu },
    { key: 'milestones', label: 'Milestone Tracker', icon: MilestoneIcon },
    { key: 'alerts', label: 'Alerts & Notifications', icon: BellRing, badge: alertCount },
    { key: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { key: 'users', label: 'User Management', icon: Users, adminOnly: true },
    { key: 'audit', label: 'Audit Logs', icon: ShieldCheck },
    { key: 'settings', label: 'Settings', icon: Settings }
  ];

  const visibleItems = navItems.filter(item => !item.adminOnly || userRole === 'admin');

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="/src/assets/images/emblem_civic_seal_1793072367567.jpg"
              alt="LandGuard Emblem"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // styled fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Landmark className="w-5 h-5 text-blue-400 hidden only:block" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                LandGuard AI
                <span className="text-[10px] font-mono font-medium text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800">
                  NEXORA
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 truncate">RFCTLARR Monitoring System</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left relative group whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              {!isCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  } ${isCollapsed ? 'absolute -top-1 -right-1 px-1 text-[9px]' : ''}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Statutory Disclaimer & Sign Out */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        {!isCollapsed && (
          <div className="mb-2 p-2 rounded bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Statutory Notice:</span> AI delay risk predictions support administrative monitoring and do not replace legal officer determinations under RFCTLARR Act 2013.
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-400" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
