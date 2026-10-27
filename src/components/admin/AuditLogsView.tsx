import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Lock,
  User,
  Clock
} from 'lucide-react';
import { AuditLog } from '../../types';
import { DISTRICTS_LIST } from '../../data/mockData';

interface AuditLogsViewProps {
  logs: AuditLog[];
  onOpenCase: (caseId: string) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  logs,
  onOpenCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');

  const filteredLogs = logs.filter(l => {
    if (filterDistrict !== 'All' && l.district !== filterDistrict && l.district !== 'All') return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        l.caseNumber.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.performedBy.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportAuditCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Case Number', 'District', 'Action', 'Performed By', 'Role', 'IP Address', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      l.caseNumber,
      l.district,
      `"${l.action}"`,
      `"${l.performedBy}"`,
      l.role,
      l.ipAddress,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `LandGuard_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Title & Integrity Notice */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Statutory Audit Trail & System Activity Logs
          </h2>
          <p className="text-xs text-slate-500">
            Cryptographically sealed activity record · Administrative provenance under Indian Evidence Act Section 65B
          </p>
        </div>

        <button
          onClick={handleExportAuditCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by action, officer, or Case ID..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500">District:</span>
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-medium text-slate-700"
          >
            {DISTRICTS_LIST.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-slate-500 font-mono tabular-nums text-xs">
          {filteredLogs.length} Logged Entries
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-slate-50/60 transition-colors text-xs space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                  {log.id}
                </span>
                <span className="font-bold text-slate-900">{log.action}</span>
                <button
                  onClick={() => onOpenCase(log.caseId)}
                  className="font-mono text-blue-600 hover:underline font-semibold"
                >
                  [{log.caseNumber}]
                </button>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">{log.district} District</span>
              </div>

              <div className="text-[11px] text-slate-400 font-mono shrink-0">
                {log.timestamp}
              </div>
            </div>

            <p className="text-slate-700 pl-1 leading-relaxed">
              {log.details}
            </p>

            <div className="pt-1 flex items-center gap-4 text-[11px] text-slate-400 font-mono">
              <span>Officer: <strong className="text-slate-600 font-sans">{log.performedBy}</strong> ({log.role})</span>
              <span>Client IP: {log.ipAddress}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
