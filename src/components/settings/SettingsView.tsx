import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Database,
  Bell,
  Clock,
  Save,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sliders
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [highRiskCutoff, setHighRiskCutoff] = useState<number>(70);
  const [mediumRiskCutoff, setMediumRiskCutoff] = useState<number>(40);
  const [sec19DaysLimit, setSec19DaysLimit] = useState<number>(365);
  const [sec25DaysLimit, setSec25DaysLimit] = useState<number>(365);
  const [sec15DaysLimit, setSec15DaysLimit] = useState<number>(60);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Gateway config
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsUrgentAlerts, setSmsUrgentAlerts] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset simulated data to standard factory baseline? This will clear all local session edits.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            System Configuration & Model Calibration Parameters
          </h2>
          <p className="text-xs text-slate-500">
            RFCTLARR Act statutory rules · ML threshold calibration · Backend integration readiness
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Session Baseline</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configuration parameters updated and applied to active session.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: ML RISK THRESHOLDS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              1. AI Delay Risk Model Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">High Delay Risk Cutoff</span>
                <span className="font-mono text-red-600">{highRiskCutoff}% Probability</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={highRiskCutoff}
                onChange={(e) => setHighRiskCutoff(parseInt(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Cases exceeding this value trigger critical alert dispatch to District Collector.
              </span>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Medium Delay Risk Cutoff</span>
                <span className="font-mono text-amber-600">{mediumRiskCutoff}% Probability</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                value={mediumRiskCutoff}
                onChange={(e) => setMediumRiskCutoff(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Cases between {mediumRiskCutoff}% and {highRiskCutoff}% trigger SLA warnings to SLAO.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: STATUTORY RFCTLARR SLA PARAMETERS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              2. RFCTLARR Act 2013 Statutory SLA Benchmarks
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Section 19 Declaration Limit
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={sec19DaysLimit}
                  onChange={(e) => setSec19DaysLimit(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono"
                />
                <span className="text-slate-500 font-mono">Days</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Statutory Sec 19(7): 12 months from Sec 11 notice
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Section 25 Award Limit
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={sec25DaysLimit}
                  onChange={(e) => setSec25DaysLimit(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono"
                />
                <span className="text-slate-500 font-mono">Days</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Statutory Sec 25: 12 months from Sec 19 declaration
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Section 15 Hearing Window
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={sec15DaysLimit}
                  onChange={(e) => setSec15DaysLimit(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono"
                />
                <span className="text-slate-500 font-mono">Days</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Statutory 60-day objection filing window
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: BACKEND API & POSTGRESQL READINESS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              3. Database & Python FastAPI Backend Readiness
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono space-y-1 text-slate-700">
              <div className="text-slate-500 font-sans font-semibold">PostgreSQL Relational Schema Target:</div>
              <div>postgresql://landguard_admin@db.gov.in:5432/landguard_rfctlarr</div>
              <div className="text-[11px] text-emerald-700 font-sans pt-1">
                Parity verified for 16 relational entities: Users, Cases, Milestones, Compensation, Approvals, Disputes, R&R, Predictions, SHAP Factors, Audit Logs.
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono space-y-1 text-slate-700">
              <div className="text-slate-500 font-sans font-semibold">Python ML Inference Endpoint:</div>
              <div>POST http://ml-service.landguard.local/api/v2/predict-delay</div>
              <div className="text-[11px] text-slate-500 font-sans pt-1">
                Runtime Model: XGBoost v2.4 + TreeExplainer · Execution timeout: 250ms
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: NOTIFICATION CHANNELS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              4. Notification Gateway Dispatch Settings
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <span className="font-semibold text-slate-800 block">NIC Official Mail Dispatch</span>
                <span className="text-[11px] text-slate-500">Send critical delay digests to District Collector and SLAO inbox</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsUrgentAlerts}
                onChange={(e) => setSmsUrgentAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <span className="font-semibold text-slate-800 block">State SMS Gateway (Priority 1 Lapses Only)</span>
                <span className="text-[11px] text-slate-500">Send SMS warnings when Section 19 declaration is within 30 days of lapsing</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
