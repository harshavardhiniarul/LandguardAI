import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  FolderKanban,
  ShieldAlert,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { LandAcquisitionCase, DashboardSummary, AlertItem } from '../../types';
import { formatINR, formatDate, getRiskColorClass, getStageLabel } from '../../utils/formatters';

interface OverviewDashboardProps {
  summary: DashboardSummary;
  cases: LandAcquisitionCase[];
  alerts: AlertItem[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  onOpenCase: (caseId: string) => void;
  onOpenAlerts: () => void;
  onOpenNewCase: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  summary,
  cases,
  alerts,
  selectedDistrict,
  onSelectDistrict,
  onOpenCase,
  onOpenAlerts,
  onOpenNewCase
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');

  // Filter cases for the dashboard lists
  const filteredCases = cases.filter(c => {
    if (selectedCategory !== 'All' && c.projectCategory !== selectedCategory) return false;
    if (selectedStageFilter !== 'All' && c.currentStage !== selectedStageFilter) return false;
    return true;
  });

  const highRiskCases = filteredCases.filter(c => c.riskLevel === 'High' && c.currentStage !== 'Completed');
  const urgentAlerts = alerts.filter(a => a.priority === 'critical' || a.priority === 'high').slice(0, 4);

  // Upcoming milestones from active cases
  const upcomingMilestones = filteredCases
    .filter(c => c.currentStage !== 'Completed')
    .map(c => ({
      caseId: c.id,
      projectName: c.projectName,
      milestone: c.nextMilestoneName,
      dueDate: c.nextMilestoneDueDate,
      riskLevel: c.riskLevel,
      riskScore: c.predictedDelayRisk,
      officer: c.assignedOfficer.name
    }))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const categories = ['All', 'Highways & Expressways', 'Railways & Metro', 'Industrial Corridors'];

  return (
    <div className="space-y-6">
      {/* Top Banner: Statutory Context & Synthetic Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Executive Land Acquisition Delay Monitoring
            <span className="text-[11px] font-normal text-slate-500 font-mono">
              [RFCTLARR Act, 2013 Statutory Compliance]
            </span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>District: <strong className="text-slate-800">{selectedDistrict}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Active Portfolio: <strong className="text-slate-800 tabular-nums">{summary.totalActiveCases} Projects</strong></span>
            <span aria-hidden="true">·</span>
            <span>Allocated Compensation: <strong className="text-slate-800 tabular-nums">{formatINR(summary.totalCompensationAllocated, true)}</strong></span>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'Highways & Expressways' ? 'Highways' : cat === 'Industrial Corridors' ? 'Industries' : cat}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenNewCase}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap shadow-xs"
          >
            + Register Case
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (Tabular-nums, 6 metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Total Active */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Cases</span>
            <FolderKanban className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {summary.totalActiveCases}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Across {selectedDistrict === 'All' ? '5 Districts' : selectedDistrict}
          </div>
        </div>

        {/* 2. High-Risk Cases */}
        <div className="bg-white p-4 rounded-xl border border-red-200 hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-red-700 text-xs font-semibold">
            <span>High Delay Risk</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-red-700 tabular-nums">
            {summary.highRiskCases}
          </div>
          <div className="mt-1 text-[11px] text-red-600">
            &gt;70% delay likelihood
          </div>
        </div>

        {/* 3. Milestones Due Soon */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Milestones Due &lt;30d</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {summary.milestonesDueSoon}
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">
            Statutory deadlines near
          </div>
        </div>

        {/* 4. Delayed Cases */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Delayed / Overdue</span>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-700 tabular-nums">
            {summary.delayedCases}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Breached statutory SLA
          </div>
        </div>

        {/* 5. Immediate Action Required */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Action Required</span>
            <ShieldAlert className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-orange-700 tabular-nums">
            {summary.immediateActionRequired}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Pending acknowledgements
          </div>
        </div>

        {/* 6. Completed Acquisitions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Handed Over</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {summary.completedAcquisitions}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            100% possession & mutation
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stage Distribution & Trend Line */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stage Bottleneck Analysis Bar Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cases by RFCTLARR Statutory Stage</h3>
                <p className="text-xs text-slate-500">Active caseload distribution and average statutory delay days</p>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                SLA SLA-Tracked
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {summary.stageDistribution.map((item) => {
                const maxCount = 4;
                const widthPercent = Math.min(100, Math.max(15, (item.count / maxCount) * 100));
                const isHeavyDelay = item.avgDelayDays >= 30;

                return (
                  <div key={item.stage} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{item.stage}</span>
                      <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums text-slate-600">
                        <span>{item.count} Cases</span>
                        <span className={isHeavyDelay ? 'text-red-600 font-semibold' : 'text-slate-500'}>
                          Avg +{item.avgDelayDays}d delay
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isHeavyDelay ? 'bg-red-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Delay Forecast vs Actual Line Graph */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">6-Month Delay Prediction Trend</h3>
                <p className="text-xs text-slate-500">Predicted high-risk cases vs verified actual delays (May - Oct 2026)</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-slate-600">Predicted Delay Risk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600">Actual Milestone Missed</span>
                </div>
              </div>
            </div>

            {/* Responsive Trend Chart */}
            <div className="h-44 w-full flex items-end justify-between gap-4 pt-6 px-2 border-b border-slate-200">
              {summary.delayTrends.map((trend) => (
                <div key={trend.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-32">
                    {/* Predicted bar */}
                    <div
                      className="w-4 bg-blue-600/80 rounded-t hover:bg-blue-600 transition-all"
                      style={{ height: `${(trend.predictedHighRisk / 5) * 100}%` }}
                      title={`Predicted: ${trend.predictedHighRisk} cases`}
                    />
                    {/* Actual bar */}
                    <div
                      className="w-4 bg-rose-500/80 rounded-t hover:bg-rose-500 transition-all"
                      style={{ height: `${(trend.actualDelayed / 5) * 100}%` }}
                      title={`Actual: ${trend.actualDelayed} cases`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                    {trend.month.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 text-[11px] text-slate-500 flex justify-between">
              <span>Model Confidence: <strong>88.4% Precision</strong></span>
              <span>Validated against 12,480 historical acquisition records</span>
            </div>
          </div>
        </div>

        {/* Right Col: Risk Donut & District Performance */}
        <div className="space-y-6">
          {/* Risk Distribution Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Portfolio Risk Category Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">ML probability score classification</p>

            {/* Donut representation */}
            <div className="flex items-center justify-center p-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* High Risk (Red) ~ 43% */}
                  <path
                    className="text-red-500"
                    strokeDasharray="43, 100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Medium Risk (Amber) ~ 29% */}
                  <path
                    className="text-amber-500"
                    strokeDasharray="29, 100"
                    strokeDashoffset="-43"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Low Risk (Emerald) ~ 28% */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray="28, 100"
                    strokeDashoffset="-72"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {summary.totalActiveCases}
                  </span>
                  <span className="text-[10px] uppercase text-slate-400 font-medium">Cases</span>
                </div>
              </div>
            </div>

            {/* Legend & Stats */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>High Risk (&ge;70%)</span>
                </span>
                <span className="font-mono font-bold text-red-600 tabular-nums">{summary.highRiskCases}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Medium Risk (40-69%)</span>
                </span>
                <span className="font-mono font-bold text-amber-600 tabular-nums">{summary.mediumRiskCases}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Low Risk (&lt;40%)</span>
                </span>
                <span className="font-mono font-bold text-emerald-600 tabular-nums">{summary.lowRiskCases}</span>
              </div>
            </div>
          </div>

          {/* District-wise Comparison */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">District Risk & Compliance Matrix</h3>
            <p className="text-xs text-slate-500 mb-3">Statutory SLA timeline adherence</p>

            <div className="space-y-3">
              {summary.districtPerformance.map((dist) => (
                <div key={dist.district} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSelectDistrict(dist.district)}
                      className="font-medium text-blue-700 hover:underline text-left"
                    >
                      {dist.district}
                    </button>
                    <span className="font-mono text-slate-600 tabular-nums">
                      {dist.complianceRate}% On-Time
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        dist.complianceRate >= 80
                          ? 'bg-emerald-500'
                          : dist.complianceRate >= 65
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${dist.complianceRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Upcoming Milestones & High Priority Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Milestones Timeline */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Statutory Milestones</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Next 30 Days</span>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingMilestones.map((item) => {
              const riskColor = getRiskColorClass(item.riskLevel);
              return (
                <div
                  key={item.caseId}
                  onClick={() => onOpenCase(item.caseId)}
                  className="py-3 flex items-start justify-between gap-4 hover:bg-slate-50 rounded-lg p-2 transition-colors cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.projectName}
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{item.milestone}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[11px] text-slate-500">{item.officer}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      Case ID: {item.caseId}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold font-mono text-slate-900 tabular-nums">
                      {formatDate(item.dueDate)}
                    </div>
                    <div className="mt-1">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${riskColor.badge}`}>
                        {item.riskScore}% {item.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High Priority Alerts Panel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900">Urgent Administrative Alerts</h3>
            </div>
            <button
              onClick={onOpenAlerts}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>View All Alerts ({alerts.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {urgentAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onOpenCase(alert.caseId)}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group bg-slate-50/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    {alert.title}
                  </div>
                  <span
                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 uppercase ${
                      alert.priority === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {alert.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {alert.message}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{alert.caseNumber} ({alert.district})</span>
                  <span>Due: {formatDate(alert.dueDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
