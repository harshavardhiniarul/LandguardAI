import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  DollarSign,
  Gavel,
  Users,
  ShieldCheck,
  Cpu,
  Layers,
  History,
  ExternalLink,
  Edit3,
  RefreshCw,
  Send,
  Building,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { LandAcquisitionCase, Milestone, UserRole } from '../../types';
import { apiService } from '../../services/apiService';
import { formatINR, formatDate, getRiskColorClass, getStageLabel } from '../../utils/formatters';

interface CaseDetailModalProps {
  caseId: string;
  onClose: () => void;
  userRole: UserRole;
  onCaseUpdated: (updatedCase: LandAcquisitionCase) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseId,
  onClose,
  userRole,
  onCaseUpdated
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'milestones' | 'compensation' | 'approvals' | 'legal' | 'rr' | 'documents' | 'ai-predictions' | 'history'
  >('overview');

  const [caseData, setCaseData] = useState<LandAcquisitionCase | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  // Milestone edit state
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [newStatus, setNewStatus] = useState<Milestone['status']>('completed');
  const [remarks, setRemarks] = useState('');
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0]);
  const [updating, setUpdating] = useState(false);

  // AI recalculation state
  const [simulatingAi, setSimulatingAi] = useState(false);

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const loadCase = async () => {
    setLoading(true);
    const data = await apiService.getCaseById(caseId);
    if (data) {
      setCaseData(data);
      const ms = await apiService.getMilestones(caseId);
      setMilestones(ms);
    }
    setLoading(false);
  };

  const handleUpdateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone || !caseData) return;

    setUpdating(true);
    try {
      const updatedMs = await apiService.updateMilestone(
        caseData.id,
        editingMilestone.id,
        newStatus,
        remarks,
        completionDate
      );
      setMilestones(prev => prev.map(m => m.id === updatedMs.id ? updatedMs : m));
      setEditingMilestone(null);
      setRemarks('');

      // Refresh case to reflect updated status
      const refreshed = await apiService.getCaseById(caseData.id);
      if (refreshed) {
        setCaseData(refreshed);
        onCaseUpdated(refreshed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleTriggerPrediction = async () => {
    if (!caseData) return;
    setSimulatingAi(true);
    try {
      const res = await apiService.predictCaseDelay(caseData.id);
      const refreshed = await apiService.getCaseById(caseData.id);
      if (refreshed) {
        setCaseData(refreshed);
        onCaseUpdated(refreshed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatingAi(false);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-800">Loading statutory case record...</p>
        </div>
      </div>
    );
  }

  const riskColor = getRiskColorClass(caseData.riskLevel);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between bg-slate-50 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200">
                {caseData.id}
              </span>
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${riskColor.badge}`}>
                {caseData.predictedDelayRisk}% {caseData.riskLevel} Delay Risk
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Stage: {getStageLabel(caseData.currentStage)}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 line-clamp-1">
              {caseData.projectName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{caseData.district} District</span>
              <span aria-hidden="true">·</span>
              <span>Taluka: {caseData.taluk}</span>
              <span aria-hidden="true">·</span>
              <span>Village: {caseData.village}</span>
              <span aria-hidden="true">·</span>
              <span>Area: <strong className="text-slate-700 font-mono">{caseData.landAreaAcres} Acres</strong></span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Single line with clean underline) */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-white overflow-x-auto text-xs shrink-0">
          {[
            { id: 'overview', label: 'Overview', icon: Building },
            { id: 'milestones', label: 'Milestones (RFCTLARR)', icon: Clock },
            { id: 'ai-predictions', label: 'AI Delay Prediction', icon: Cpu },
            { id: 'compensation', label: 'Compensation', icon: DollarSign },
            { id: 'approvals', label: 'Clearances & NoCs', icon: ShieldCheck },
            { id: 'legal', label: `Legal Disputes (${caseData.legalDisputes.length})`, icon: Gavel },
            { id: 'rr', label: 'R&R Package', icon: Users },
            { id: 'documents', label: `Documents (${caseData.documents.length})`, icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 px-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium">Estimated Compensation</div>
                  <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                    {formatINR(caseData.totalEstimatedCompensation)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Disbursed: {formatINR(caseData.compensationDisbursed, true)} ({((caseData.compensationDisbursed / (caseData.totalEstimatedCompensation || 1)) * 100).toFixed(0)}%)
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium">Next Statutory Milestone</div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">
                    {caseData.nextMilestoneName}
                  </div>
                  <div className="text-[11px] font-mono text-blue-700 font-semibold mt-0.5">
                    Due: {formatDate(caseData.nextMilestoneDueDate)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium">Legal Injunction Status</div>
                  <div className="text-xs font-bold text-slate-900">
                    {caseData.legalDisputes.some(d => d.stayGranted) ? (
                      <span className="text-red-700 font-semibold">Stay Granted in HC</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">No Injunction Restraint</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {caseData.legalDisputes.length} matters on record
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium">Assigned Officer</div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">
                    {caseData.assignedOfficer.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {caseData.assignedOfficer.contact}
                  </div>
                </div>
              </div>

              {/* Case Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Land & Cadastral Profile
                  </h4>
                  <div className="space-y-2 text-xs divide-y divide-slate-100">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Project Category:</span>
                      <span className="font-semibold text-slate-800">{caseData.projectCategory}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Land Classification:</span>
                      <span className="font-semibold text-slate-800">{caseData.landType}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Survey Numbers (Gat/Khasra):</span>
                      <span className="font-mono text-slate-800 font-semibold">{caseData.surveyNumbers.join(', ')}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Notification Date (Sec 11):</span>
                      <span className="font-mono text-slate-800">{formatDate(caseData.notificationDate)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Target Possession Date:</span>
                      <span className="font-mono text-slate-800">{formatDate(caseData.expectedPossessionDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    AI Delay Risk Summary
                  </h4>
                  <div className="p-3 bg-red-50/50 rounded-lg border border-red-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-900">
                        {caseData.predictedDelayRisk}% Probability of Delay
                      </span>
                      <span className="text-[10px] font-mono text-red-700">
                        Model v2.4
                      </span>
                    </div>
                    <p className="text-xs text-red-800 leading-relaxed">
                      {caseData.riskDrivers[0]?.explanation || 'Nominal execution schedule.'}
                    </p>
                    <button
                      onClick={() => setActiveTab('ai-predictions')}
                      className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Explore Explainable SHAP Drivers & Actions</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Administrative Notes */}
              {caseData.notes && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-700 mb-1">Administrative Notes:</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{caseData.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MILESTONES (RFCTLARR Statutory Tracker) */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">RFCTLARR Statutory Milestones Tracker</h3>
                  <p className="text-xs text-slate-500">
                    Mandatory statutory deadlines under Right to Fair Compensation Act 2013
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {milestones.filter(m => m.status === 'completed').length} of {milestones.length} Completed
                </span>
              </div>

              {/* Chronological Timeline */}
              <div className="space-y-3 pt-2">
                {milestones.map((ms, index) => {
                  const isCompleted = ms.status === 'completed';
                  const isOverdue = ms.status === 'overdue';
                  const isPending = ms.status === 'pending';

                  return (
                    <div
                      key={ms.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCompleted
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : isOverdue
                          ? 'border-red-200 bg-red-50/20'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            ) : isOverdue ? (
                              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                            ) : (
                              <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {ms.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {ms.statutorySection}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>Assigned: <strong>{ms.officerAssigned}</strong></span>
                              <span aria-hidden="true">·</span>
                              <span>Statutory SLA: <strong>{ms.statutoryDaysSLA} Days</strong></span>
                            </div>
                            {ms.remarks && (
                              <p className="text-xs text-slate-600 mt-1 italic">
                                Remarks: "{ms.remarks}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 sm:self-center">
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-slate-800">
                              {isCompleted ? `Done: ${formatDate(ms.completedDate)}` : `Due: ${formatDate(ms.deadlineDate)}`}
                            </div>
                            <div className="text-[10px] font-semibold">
                              {isCompleted ? (
                                <span className="text-emerald-700">Statutory Compliance Verified</span>
                              ) : isOverdue ? (
                                <span className="text-red-700 font-bold">Overdue (+{ms.delayDays || 14} days)</span>
                              ) : (
                                <span className="text-blue-700">In Schedule</span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setEditingMilestone(ms);
                              setNewStatus(ms.status);
                              setRemarks(ms.remarks || '');
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-md border border-slate-200"
                            title="Update Status & Remarks"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Milestone Edit Sub-Modal */}
              {editingMilestone && (
                <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      Update Milestone: {editingMilestone.name}
                    </h4>
                    <button
                      onClick={() => setEditingMilestone(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateMilestone} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Status</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as any)}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 font-medium"
                        >
                          <option value="completed">Completed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="overdue">Overdue</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>

                      {newStatus === 'completed' && (
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Completion Date</label>
                          <input
                            type="date"
                            value={completionDate}
                            onChange={(e) => setCompletionDate(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-slate-600 font-medium mb-1">
                        Official Remarks / Proceedings Reference
                      </label>
                      <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="e.g. Conducted hearings with 24 khatedars. Solatium calculation finalized."
                        rows={2}
                        className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingMilestone(null)}
                        className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="px-4 py-1 bg-blue-600 text-white font-semibold rounded text-xs hover:bg-blue-700"
                      >
                        {updating ? 'Saving...' : 'Save Milestone'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI DELAY PREDICTIONS (SHAP explainability) */}
          {activeTab === 'ai-predictions' && (
            <div className="space-y-6">
              {/* Synthetic Data Disclaimer Banner */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">Synthetic ML Inference Model:</span> Predictions are generated using an XGBoost gradient boosted model trained on 12,480 RFCTLARR acquisition records with TreeSHAP explainability. All scores are advisory to assist District Collectors and SLAOs.
                </div>
              </div>

              {/* Main Scorecard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-xs text-slate-500">Delay Risk Probability</div>
                  <div className="text-3xl font-bold font-mono text-red-700 tabular-nums mt-1">
                    {caseData.predictedDelayRisk}%
                  </div>
                  <div className="text-xs font-semibold text-red-700 mt-1">
                    {caseData.riskLevel} Risk Category
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 font-mono">
                    Model: {caseData.modelVersion}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-xs text-slate-500">Imminent Statutory Milestone</div>
                  <div className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                    {caseData.nextMilestoneName}
                  </div>
                  <div className="text-xs text-slate-600 font-mono mt-1">
                    Target: {formatDate(caseData.nextMilestoneDueDate)}
                  </div>
                  <div className="text-[11px] text-amber-700 font-semibold mt-2">
                    Critical statutory cutoff window
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Data Completeness Index</div>
                    <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
                      {caseData.dataCompletenessScore}%
                    </div>
                    <div className="text-[11px] text-slate-500">
                      High confidence feature baseline
                    </div>
                  </div>
                  <button
                    onClick={handleTriggerPrediction}
                    disabled={simulatingAi}
                    className="w-full mt-3 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${simulatingAi ? 'animate-spin' : ''}`} />
                    <span>{simulatingAi ? 'Recalculating...' : 'Recalculate AI Risk'}</span>
                  </button>
                </div>
              </div>

              {/* Explainable SHAP Risk Drivers */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Top Explainable Risk Drivers (SHAP Attribution)
                </h4>
                <div className="space-y-2">
                  {caseData.riskDrivers.map((driver, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800">
                          {idx + 1}. {driver.factor}
                        </span>
                        <span className="font-mono text-red-600 font-bold tabular-nums">
                          +{driver.impactScore}% Impact
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {driver.explanation}
                      </p>
                      <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${driver.impactScore * 2}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Corrective Interventions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Suggested Statutory Corrective Actions
                </h4>
                <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
                  {caseData.suggestedActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPENSATION */}
          {activeTab === 'compensation' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Total Sanctioned Award</div>
                  <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                    {formatINR(caseData.totalEstimatedCompensation)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Calculated under First Schedule (Market Value + 100% Solatium)
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Disbursed to Khatedars</div>
                  <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums mt-1">
                    {formatINR(caseData.compensationDisbursed)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Status: <strong className="text-slate-800">{caseData.compensationStatus}</strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Remaining Balance</div>
                  <div className="text-xl font-bold font-mono text-amber-700 tabular-nums mt-1">
                    {formatINR(caseData.totalEstimatedCompensation - caseData.compensationDisbursed)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    In District Escrow / Treasury Account
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Direct Benefit Transfer (DBT) Safeguards:</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All compensation disbursements require Aadhaar biometric authentication or verified 7/12 land revenue mutation linkage. Undisputed shares are credited directly to verified bank accounts. Disputed claims are deposited into reference court under Section 77.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: APPROVALS & NOCs */}
          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Inter-Departmental Statutory Approvals
              </h4>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {caseData.pendingApprovals.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No pending inter-departmental clearances. All clearances granted.
                  </div>
                ) : (
                  caseData.pendingApprovals.map((app) => (
                    <div key={app.id} className="p-4 flex items-start justify-between gap-4 bg-white">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{app.name}</div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          Authority: <strong>{app.authority}</strong>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 font-mono">
                          Submitted: {formatDate(app.submittedDate)} · SLA: {app.statutorySlaDays} Days
                        </div>
                        {app.remarks && (
                          <div className="text-xs text-amber-800 mt-1 bg-amber-50 p-2 rounded border border-amber-200">
                            Status Note: {app.remarks}
                          </div>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'query_raised'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: LEGAL DISPUTES */}
          {activeTab === 'legal' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Litigation & Court Petitions
              </h4>
              {caseData.legalDisputes.length === 0 ? (
                <div className="p-8 text-center text-xs text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 font-medium">
                  Zero active legal petitions or court stays recorded for this acquisition case.
                </div>
              ) : (
                caseData.legalDisputes.map((dispute, idx) => (
                  <div key={idx} className="p-4 bg-red-50/30 rounded-xl border border-red-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-red-900 font-mono">
                        {dispute.suitNumber}
                      </div>
                      {dispute.stayGranted ? (
                        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded">
                          INTERIM STAY ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          HEARING PENDING (NO STAY)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-800">
                      Court: <strong>{dispute.court}</strong>
                    </div>
                    <div className="text-xs text-slate-600">
                      Petitioner: {dispute.petitioner}
                    </div>
                    <div className="text-xs text-slate-700 italic">
                      Subject: {dispute.subject}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-red-100">
                      Next Court Hearing Date: <strong>{formatDate(dispute.nextHearingDate)}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 7: R&R PACKAGE */}
          {activeTab === 'rr' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Second Schedule (Rehabilitation and Resettlement)
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {caseData.rrStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Under Chapter V of RFCTLARR Act 2013, the Administrator for Rehabilitation and Resettlement conducts census survey of affected families, drafts scheme, and places it before the Collector for approval.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block">R&R Scheme Status:</span>
                    <strong className="text-slate-800">{caseData.rrStatus}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block">Displaced Families Provision:</span>
                    <strong className="text-slate-800">Housing Unit / Annuity Scheme</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Verified Statutory Gazette & Survey Documents
              </h4>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {caseData.documents.map((doc) => (
                  <div key={doc.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{doc.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {doc.type} · {doc.fileSize} · Uploaded: {formatDate(doc.uploadedAt)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Case Created: {formatDate(caseData.createdAt)}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
