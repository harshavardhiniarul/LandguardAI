import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  FileEdit,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { LandAcquisitionCase, AcquisitionStage } from '../../types';
import { formatINR, formatDate, getRiskColorClass, getStageLabel } from '../../utils/formatters';

interface CasesTableProps {
  cases: LandAcquisitionCase[];
  onOpenCase: (caseId: string) => void;
  onOpenEditCase?: (caseId: string) => void;
  onOpenNewCase: () => void;
}

export const CasesTable: React.FC<CasesTableProps> = ({
  cases,
  onOpenCase,
  onOpenEditCase,
  onOpenNewCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterStage, setFilterStage] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [filterCompensation, setFilterCompensation] = useState('All');
  const [sortField, setSortField] = useState<keyof LandAcquisitionCase>('predictedDelayRisk');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter & sort
  const processedCases = useMemo(() => {
    let result = [...cases];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        c =>
          c.id.toLowerCase().includes(q) ||
          c.projectName.toLowerCase().includes(q) ||
          c.village.toLowerCase().includes(q) ||
          c.taluk.toLowerCase().includes(q) ||
          c.assignedOfficer.name.toLowerCase().includes(q) ||
          c.surveyNumbers.some(s => s.toLowerCase().includes(q))
      );
    }

    if (filterDistrict !== 'All') {
      result = result.filter(c => c.district === filterDistrict);
    }

    if (filterStage !== 'All') {
      result = result.filter(c => c.currentStage === filterStage);
    }

    if (filterRisk !== 'All') {
      result = result.filter(c => c.riskLevel === filterRisk);
    }

    if (filterCompensation !== 'All') {
      result = result.filter(c => c.compensationStatus === filterCompensation);
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [cases, searchTerm, filterDistrict, filterStage, filterRisk, filterCompensation, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(processedCases.length / pageSize) || 1;
  const paginatedCases = processedCases.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: keyof LandAcquisitionCase) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for risks
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Case ID',
      'Project Name',
      'Category',
      'District',
      'Taluk',
      'Village',
      'Land Area (Acres)',
      'Current Stage',
      'Total Compensation (INR)',
      'Compensation Disbursed (INR)',
      'Compensation Status',
      'Next Milestone',
      'Milestone Due Date',
      'Predicted Delay Risk (%)',
      'Risk Level',
      'Assigned Officer'
    ];

    const rows = processedCases.map(c => [
      c.id,
      `"${c.projectName.replace(/"/g, '""')}"`,
      c.projectCategory,
      c.district,
      c.taluk,
      c.village,
      c.landAreaAcres,
      c.currentStage,
      c.totalEstimatedCompensation,
      c.compensationDisbursed,
      c.compensationStatus,
      `"${c.nextMilestoneName.replace(/"/g, '""')}"`,
      c.nextMilestoneDueDate,
      c.predictedDelayRisk,
      c.riskLevel,
      `"${c.assignedOfficer.name}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LandGuard_Acquisitions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const districts = ['All', 'Pune', 'Nagpur', 'Bengaluru Urban', 'Kanchipuram', 'Ahmedabad'];
  const stages: { val: string; label: string }[] = [
    { val: 'All', label: 'All Statutory Stages' },
    { val: 'SIA_Section4', label: 'Sec 4: SIA' },
    { val: 'Section11_PrelimNotice', label: 'Sec 11: Preliminary Notice' },
    { val: 'Section15_Hearing', label: 'Sec 15: Hearing' },
    { val: 'Section19_Declaration', label: 'Sec 19: Declaration' },
    { val: 'Section21_NoticeInterested', label: 'Sec 21: Notice to Persons' },
    { val: 'Section23_AwardInquiry', label: 'Sec 23: Award Inquiry' },
    { val: 'Section30_AwardDeclaration', label: 'Sec 30: Award' },
    { val: 'Section38_TakingPossession', label: 'Sec 38: Taking Possession' },
    { val: 'Completed', label: 'Completed' }
  ];

  return (
    <div className="space-y-4">
      {/* Table Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">Land Acquisition Case Records</h2>
          <p className="text-xs text-slate-500">
            Statutory RFCTLARR 2013 Registry · <strong className="text-slate-800 font-mono tabular-nums">{processedCases.length} records matching filters</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenNewCase}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            + Register New Case
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Case ID, Project, Village, Survey No..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500">District:</span>
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500">Stage:</span>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 font-medium text-slate-700 focus:outline-none max-w-[170px]"
          >
            {stages.map(s => (
              <option key={s.val} value={s.val}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Risk Filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500">Risk:</span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Risks</option>
            <option value="High">High Risk (&ge;70%)</option>
            <option value="Medium">Medium Risk (40-69%)</option>
            <option value="Low">Low Risk (&lt;40%)</option>
          </select>
        </div>

        {/* Compensation Filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500">Compensation:</span>
          <select
            value={filterCompensation}
            onChange={(e) => setFilterCompensation(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Fully Disbursed">Fully Disbursed</option>
            <option value="Disputed">Disputed</option>
          </select>
        </div>

        {/* Reset button if filtered */}
        {(searchTerm || filterDistrict !== 'All' || filterStage !== 'All' || filterRisk !== 'All' || filterCompensation !== 'All') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterDistrict('All');
              setFilterStage('All');
              setFilterRisk('All');
              setFilterCompensation('All');
            }}
            className="text-blue-600 hover:underline font-semibold ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* 14-Column Responsive Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <th className="py-3 px-3.5 whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('id')}>
                  <div className="flex items-center gap-1">
                    <span>Case ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 min-w-[200px] cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('projectName')}>
                  <div className="flex items-center gap-1">
                    <span>Project Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">District / Village</th>
                <th className="py-3 px-3 whitespace-nowrap">Acquisition Stage</th>
                <th className="py-3 px-3 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('landAreaAcres')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Area (Acres)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Compensation</th>
                <th className="py-3 px-3 whitespace-nowrap text-center">Pending NoC</th>
                <th className="py-3 px-3 min-w-[160px]">Next Milestone</th>
                <th className="py-3 px-3 whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('nextMilestoneDueDate')}>
                  <div className="flex items-center gap-1">
                    <span>Due Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('predictedDelayRisk')}>
                  <div className="flex items-center justify-center gap-1">
                    <span>Delay Risk</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Assigned Officer</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">No land acquisition cases match your filters</p>
                      <p className="text-xs text-slate-400">Try adjusting your search criteria or district selection.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => {
                  const riskColor = getRiskColorClass(c.riskLevel);
                  const isOverdue = new Date(c.nextMilestoneDueDate).getTime() < new Date().getTime() && c.currentStage !== 'Completed';

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                      onClick={() => onOpenCase(c.id)}
                    >
                      {/* 1. Case ID */}
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {c.id}
                      </td>

                      {/* 2. Project Name */}
                      <td className="py-3 px-3 font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                        <div className="line-clamp-1">{c.projectName}</div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {c.projectCategory}
                        </div>
                      </td>

                      {/* 3. District & Village */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{c.district}</div>
                        <div className="text-[11px] text-slate-500">{c.village} ({c.taluk})</div>
                      </td>

                      {/* 4. Stage */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-xs font-medium text-slate-800">
                          {getStageLabel(c.currentStage)}
                        </span>
                      </td>

                      {/* 5. Land Area */}
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                        {c.landAreaAcres.toFixed(2)} Ac
                      </td>

                      {/* 6. Compensation Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono text-slate-800 tabular-nums">
                          {formatINR(c.compensationDisbursed, true)} / {formatINR(c.totalEstimatedCompensation, true)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {c.compensationStatus}
                        </div>
                      </td>

                      {/* 7. Pending Approvals */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {c.pendingApprovals.length > 0 ? (
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold tabular-nums">
                            {c.pendingApprovals.filter(a => a.status === 'pending' || a.status === 'query_raised').length} Pending
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Clear</span>
                        )}
                      </td>

                      {/* 8. Next Milestone */}
                      <td className="py-3 px-3 text-slate-700 max-w-[200px] truncate" title={c.nextMilestoneName}>
                        {c.nextMilestoneName}
                      </td>

                      {/* 9. Due Date */}
                      <td className="py-3 px-3 font-mono tabular-nums whitespace-nowrap">
                        <div className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-slate-800'}`}>
                          {formatDate(c.nextMilestoneDueDate)}
                        </div>
                        {isOverdue && (
                          <span className="text-[10px] text-red-600 font-bold">Overdue</span>
                        )}
                      </td>

                      {/* 10. Predicted Delay Risk */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded ${riskColor.badge} tabular-nums`}>
                          {c.predictedDelayRisk}% {c.riskLevel}
                        </span>
                      </td>

                      {/* 11. Assigned Officer */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        <div className="font-medium">{c.assignedOfficer.name}</div>
                        <div className="text-[10px] text-slate-400">{c.assignedOfficer.designation.split('(')[0]}</div>
                      </td>

                      {/* 12. Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenCase(c.id)}
                            className="p-1 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                            title="View Case Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-800 tabular-nums">{paginatedCases.length}</strong> of{' '}
            <strong className="text-slate-800 tabular-nums">{processedCases.length}</strong> cases
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-300 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono tabular-nums text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-300 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
