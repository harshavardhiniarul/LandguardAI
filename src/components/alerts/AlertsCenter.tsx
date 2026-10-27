import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Check,
  UserCheck,
  MessageSquare,
  ArrowRight,
  Mail,
  Smartphone,
  Info
} from 'lucide-react';
import { AlertItem } from '../../types';
import { apiService } from '../../services/apiService';
import { formatDate } from '../../utils/formatters';

interface AlertsCenterProps {
  alerts: AlertItem[];
  onOpenCase: (caseId: string) => void;
  onAlertAcknowledged: () => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({
  alerts,
  onOpenCase,
  onAlertAcknowledged
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredAlerts = alerts.filter(a => {
    if (filterPriority !== 'All' && a.priority !== filterPriority) return false;
    if (filterStatus === 'unacknowledged' && a.acknowledged) return false;
    if (filterStatus === 'acknowledged' && !a.acknowledged) return false;
    return true;
  });

  const handleAcknowledge = async (alertId: string) => {
    setSubmitting(true);
    try {
      await apiService.acknowledgeAlert(alertId, actionNote);
      setAcknowledgingId(null);
      setActionNote('');
      onAlertAcknowledged();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const criticalCount = alerts.filter(a => a.priority === 'critical' && !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-blue-600" />
            Administrative Alerts & Corrective Actions Centre
          </h2>
          <p className="text-xs text-slate-500">
            Automated statutory warning queue · High risk escalation · SLA deadline breaches
          </p>
        </div>

        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="text-xs font-mono font-bold bg-red-100 text-red-800 px-2.5 py-1 rounded-md border border-red-200 tabular-nums">
              {criticalCount} Critical Unacknowledged
            </span>
          )}
        </div>
      </div>

      {/* Gateway Status Disclaimer (Requirement 10) */}
      <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong>Notification Dispatch Channels:</strong> Dashboard active. Email / SMS dispatch integrations are pending gateway credentials configuration in Settings.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> NIC Mail: <span className="text-amber-700">Ready</span>
          </span>
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" /> State SMS GW: <span className="text-amber-700">Ready</span>
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-medium text-slate-700"
          >
            <option value="All">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="unacknowledged">Pending Action</option>
            <option value="acknowledged">Acknowledged / Investigating</option>
          </select>
        </div>

        <div className="ml-auto text-slate-500 font-mono text-xs tabular-nums">
          {filteredAlerts.length} Alerts Shown
        </div>
      </div>

      {/* Alerts Queue */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">All alerts in this view have been resolved</p>
            <p className="text-xs text-slate-400">No pending statutory escalations match your filter.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.priority === 'critical';
            const isHigh = alert.priority === 'high';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border transition-all ${
                  !alert.acknowledged && isCritical
                    ? 'border-red-300 bg-red-50/20 shadow-xs'
                    : alert.acknowledged
                    ? 'border-slate-200 bg-white opacity-90'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                          isCritical
                            ? 'bg-red-600 text-white'
                            : isHigh
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {alert.priority} Priority
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-700">
                        {alert.caseNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        ({alert.district} District)
                      </span>
                      <span className="text-xs text-slate-500 truncate max-w-xs">
                        · {alert.projectName}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {alert.message}
                    </p>

                    {/* Recommended Action Box */}
                    <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                      <div className="font-bold text-blue-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Recommended Corrective Statutory Action:</span>
                      </div>
                      <p className="text-slate-700 pl-5 leading-relaxed">
                        {alert.recommendedAction}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-mono">
                      <span>Assigned Officer: <strong className="text-slate-800">{alert.assignedOfficer}</strong></span>
                      <span>Target Due Date: <strong className="text-slate-800">{formatDate(alert.dueDate)}</strong></span>
                      {alert.acknowledged && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Acknowledged by {alert.acknowledgedBy} on {alert.acknowledgedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:items-end gap-2 shrink-0 sm:self-center">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => setAcknowledgingId(alert.id)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
                      >
                        Acknowledge & Assign
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
                        Under Investigation
                      </span>
                    )}

                    <button
                      onClick={() => onOpenCase(alert.caseId)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <span>View Case Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-form when acknowledging */}
                {acknowledgingId === alert.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50 p-4 rounded-xl space-y-3 text-xs">
                    <h4 className="font-bold text-slate-800">
                      Record Executive Action Note for {alert.caseNumber}:
                    </h4>
                    <textarea
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      placeholder="e.g. Discussed with Collector. Convened special coordination meet with Government Pleader and Talathi."
                      rows={2}
                      className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setAcknowledgingId(null)}
                        className="px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        disabled={submitting}
                        className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                      >
                        {submitting ? 'Confirming...' : 'Confirm Acknowledgment'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
