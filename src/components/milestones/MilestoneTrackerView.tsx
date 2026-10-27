import React, { useState, useEffect } from 'react';
import {
  Milestone as MilestoneIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Filter,
  Edit3,
  X,
  FileCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { LandAcquisitionCase, Milestone } from '../../types';
import { apiService } from '../../services/apiService';
import { formatDate, getStageLabel } from '../../utils/formatters';

interface MilestoneTrackerViewProps {
  cases: LandAcquisitionCase[];
  onOpenCase: (caseId: string) => void;
  onMilestoneUpdated: () => void;
}

export const MilestoneTrackerView: React.FC<MilestoneTrackerViewProps> = ({
  cases,
  onOpenCase,
  onMilestoneUpdated
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit sub-modal
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [statusVal, setStatusVal] = useState<Milestone['status']>('completed');
  const [remarksVal, setRemarksVal] = useState('');
  const [completionDateVal, setCompletionDateVal] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedCaseId) {
      loadMilestones(selectedCaseId);
    }
  }, [selectedCaseId]);

  const loadMilestones = async (caseId: string) => {
    setLoading(true);
    const ms = await apiService.getMilestones(caseId);
    setMilestones(ms);
    setLoading(false);
  };

  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;

    setSaving(true);
    try {
      await apiService.updateMilestone(
        selectedCaseId,
        editingMilestone.id,
        statusVal,
        remarksVal,
        completionDateVal
      );
      await loadMilestones(selectedCaseId);
      setEditingMilestone(null);
      onMilestoneUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MilestoneIcon className="w-5 h-5 text-blue-600" />
            Statutory Milestone Progression & SLA Tracking
          </h2>
          <p className="text-xs text-slate-500">
            RFCTLARR Act 2013 Statutory Deadlines · Lapsing Risk Countdown · Collector Approval Gates
          </p>
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Select Case:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-xs truncate"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentCase && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {currentCase.id}
              </span>
              <span className="font-semibold text-slate-800">{currentCase.projectName}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              District: <strong>{currentCase.district}</strong> · Village: <strong>{currentCase.village}</strong> · Current Stage: <strong>{getStageLabel(currentCase.currentStage)}</strong>
            </div>
          </div>

          <button
            onClick={() => onOpenCase(currentCase.id)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 flex items-center gap-1.5"
          >
            <span>View Full Case File</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Statutory Timeline Flow */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Chronological Statutory Milestones
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Completed
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              In Progress
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              Overdue / SLA Breached
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading milestones...
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {milestones.map((ms, index) => {
              const isCompleted = ms.status === 'completed';
              const isOverdue = ms.status === 'overdue';
              const isInProgress = ms.status === 'in_progress';

              return (
                <div key={ms.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div
                    className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${
                      isCompleted
                        ? 'border-emerald-600 text-emerald-600'
                        : isOverdue
                        ? 'border-red-600 text-red-600'
                        : 'border-blue-600 text-blue-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : isOverdue
                        ? 'border-red-200 bg-red-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {ms.name}
                          </span>
                          <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {ms.statutorySection}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                          <span>Assigned Officer: <strong className="text-slate-700">{ms.officerAssigned}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>Statutory SLA: <strong className="text-slate-700">{ms.statutoryDaysSLA} Days</strong></span>
                          {ms.delayDays !== undefined && ms.delayDays > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-red-600 font-bold font-mono">
                                +{ms.delayDays} Days Lapsing Risk
                              </span>
                            </>
                          )}
                        </div>

                        {ms.remarks && (
                          <div className="mt-2 text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200/80">
                            <span className="font-semibold text-slate-700">Official Proceedings:</span> {ms.remarks}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 sm:self-start">
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                            {isCompleted ? formatDate(ms.completedDate) : formatDate(ms.deadlineDate)}
                          </div>
                          <div className="text-[10px] font-semibold mt-0.5">
                            {isCompleted ? (
                              <span className="text-emerald-700">Gazetted / Sanctioned</span>
                            ) : isOverdue ? (
                              <span className="text-red-700 font-bold">Overdue</span>
                            ) : (
                              <span className="text-blue-700">Target Deadline</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setEditingMilestone(ms);
                            setStatusVal(ms.status);
                            setRemarksVal(ms.remarks || '');
                            setCompletionDateVal(ms.completedDate || new Date().toISOString().split('T')[0]);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                          title="Record Status or Remarks"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Milestone Edit Modal */}
      {editingMilestone && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-slate-900">
                Update Milestone: {editingMilestone.name}
              </h4>
              <button
                onClick={() => setEditingMilestone(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Status</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-medium"
                  >
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="overdue">Overdue</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {statusVal === 'completed' && (
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Completion Date</label>
                    <input
                      type="date"
                      value={completionDateVal}
                      onChange={(e) => setCompletionDateVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-600 font-medium mb-1">
                  Official Proceedings Remarks / Sanction Reference
                </label>
                <textarea
                  value={remarksVal}
                  onChange={(e) => setRemarksVal(e.target.value)}
                  placeholder="Enter gazette notification number, hearing summary, or mutation details..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  {saving ? 'Updating...' : 'Save Milestone Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
