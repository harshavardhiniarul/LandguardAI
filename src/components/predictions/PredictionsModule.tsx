import React, { useState } from 'react';
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  SlidersHorizontal,
  RefreshCw,
  Info,
  ShieldCheck,
  Building,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { LandAcquisitionCase } from '../../types';
import { apiService } from '../../services/apiService';
import { formatINR, formatDate, getRiskColorClass, getStageLabel } from '../../utils/formatters';

interface PredictionsModuleProps {
  cases: LandAcquisitionCase[];
  onOpenCase: (caseId: string) => void;
  onCaseUpdated: (c: LandAcquisitionCase) => void;
}

export const PredictionsModule: React.FC<PredictionsModuleProps> = ({
  cases,
  onOpenCase,
  onCaseUpdated
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [recalculating, setRecalculating] = useState(false);

  // What-If Simulation overrides
  const [simClearStay, setSimClearStay] = useState(false);
  const [simFundEscrow, setSimFundEscrow] = useState(false);
  const [simApproveClearance, setSimApproveClearance] = useState(false);
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const handleSimulateWhatIf = () => {
    if (!activeCase) return;

    let score = activeCase.predictedDelayRisk;
    if (simClearStay && activeCase.legalDisputes.some(d => d.stayGranted)) {
      score -= 35;
    }
    if (simFundEscrow && activeCase.compensationStatus !== 'Fully Disbursed') {
      score -= 22;
    }
    if (simApproveClearance && activeCase.pendingApprovals.length > 0) {
      score -= 18;
    }

    setSimulatedScore(Math.max(12, Math.min(95, score)));
  };

  const handleResetSimulation = () => {
    setSimClearStay(false);
    setSimFundEscrow(false);
    setSimApproveClearance(false);
    setSimulatedScore(null);
  };

  const handleApplyRecalculation = async () => {
    if (!activeCase) return;
    setRecalculating(true);
    try {
      const overrides: Partial<LandAcquisitionCase> = {};
      if (simClearStay) {
        overrides.legalDisputes = activeCase.legalDisputes.map(d => ({ ...d, stayGranted: false }));
      }
      if (simFundEscrow) {
        overrides.compensationStatus = 'Escrow Deposited';
        overrides.compensationDisbursed = activeCase.totalEstimatedCompensation;
      }
      if (simApproveClearance) {
        overrides.pendingApprovals = activeCase.pendingApprovals.map(a => ({ ...a, status: 'approved' }));
      }

      const res = await apiService.predictCaseDelay(activeCase.id, overrides);
      const refreshed = await apiService.getCaseById(activeCase.id);
      if (refreshed) {
        onCaseUpdated(refreshed);
      }
      handleResetSimulation();
    } catch (err) {
      console.error(err);
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Statutory & ML Integrity */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            AI Delay Prediction & Explainable SHAP Driver Console
          </h2>
          <p className="text-xs text-slate-500">
            Stage-wise ML risk scoring · XGBoost Model v2.4 · RFCTLARR Statutory SLA Forecasting
          </p>
        </div>

        {/* Model Transparency Pill */}
        <div className="flex items-center gap-2 text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-800">Responsible AI: Human-in-the-Loop</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 font-mono text-[11px]">88.4% Cross-Validated Accuracy</span>
        </div>
      </div>

      {/* Synthetic Baseline Notice */}
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Mandatory Verification Notice:</strong> All delay probabilities and SHAP driver attributions are derived from synthetic training records calibrated against statutory RFCTLARR timelines. The system provides decision-support risk indicators to District Collectors and SLAOs; it never replaces judicial or statutory administrative orders.
        </p>
      </div>

      {/* Main Prediction Layout: Case Selector & Deep-Dive Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ranked Risk Case Selector */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Ranked Delay Risk Queue ({cases.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Sort: Highest Risk</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {[...cases]
              .sort((a, b) => b.predictedDelayRisk - a.predictedDelayRisk)
              .map((c) => {
                const isSelected = c.id === selectedCaseId;
                const riskColor = getRiskColorClass(c.riskLevel);

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCaseId(c.id);
                      handleResetSimulation();
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-slate-800">{c.id}</span>
                      <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${riskColor.badge}`}>
                        {c.predictedDelayRisk}% {c.riskLevel}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {c.projectName}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{c.district} · {c.village}</span>
                      <span className="font-mono">{c.landAreaAcres} Ac</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Case Detail & What-If Simulation */}
        {activeCase ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Top Overview for Selected Case */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {activeCase.id}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {activeCase.district} District · {activeCase.village}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {activeCase.projectName}
                  </h3>
                </div>

                <button
                  onClick={() => onOpenCase(activeCase.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 self-start sm:self-center"
                >
                  <span>Open Full Case File</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Metrics: Delay Likelihood, Due Date, Completeness */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Delay Likelihood</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold font-mono text-red-700 tabular-nums">
                      {simulatedScore !== null ? simulatedScore : activeCase.predictedDelayRisk}%
                    </span>
                    {simulatedScore !== null && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 font-mono">
                        <TrendingDown className="w-3 h-3" />
                        {activeCase.predictedDelayRisk - simulatedScore}% drop
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-red-700 mt-1">
                    {simulatedScore !== null
                      ? simulatedScore >= 70 ? 'High Risk' : simulatedScore >= 40 ? 'Medium Risk' : 'Low Risk'
                      : `${activeCase.riskLevel} Risk Category`}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Next Milestone Target</div>
                  <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                    {activeCase.nextMilestoneName}
                  </div>
                  <div className="text-xs font-mono text-blue-700 font-semibold mt-1">
                    Due: {formatDate(activeCase.nextMilestoneDueDate)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Stage: {getStageLabel(activeCase.currentStage)}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Model Calibration</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    XGBoost v2.4 (TreeSHAP)
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Completeness: <strong>{activeCase.dataCompletenessScore}%</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Timestamp: {activeCase.predictionTimestamp}
                  </div>
                </div>
              </div>

              {/* Explainable SHAP Driver Breakdown */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Explainable Risk Drivers (SHAP Attribution Score)
                </h4>
                <div className="space-y-2.5">
                  {activeCase.riskDrivers.map((driver, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900">{driver.factor}</span>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {driver.category}
                          </span>
                        </div>
                        <span className="font-mono text-red-600 font-bold tabular-nums">
                          +{driver.impactScore}% Delay Weight
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                        {driver.explanation}
                      </p>
                      <div className="mt-2 ml-7 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${driver.impactScore * 2}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Administrative Interventions */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recommended Statutory Interventions
                </h4>
                <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
                  {activeCase.suggestedActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive "What-If" Corrective Action Simulator */}
            <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Proactive Intervention Simulator ("What-If" Analysis)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-blue-700">Interactive Sensitivity Engine</span>
              </div>

              <p className="text-xs text-slate-600">
                Simulate executive interventions to forecast how targeted administrative actions reduce statutory milestone delay probabilities.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={simClearStay}
                    onChange={(e) => {
                      setSimClearStay(e.target.checked);
                      setSimulatedScore(null);
                    }}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">Vacate Court Injunction</span>
                    <span className="text-[11px] text-slate-500">File emergency counter-affidavit</span>
                  </div>
                </label>

                <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={simFundEscrow}
                    onChange={(e) => {
                      setSimFundEscrow(e.target.checked);
                      setSimulatedScore(null);
                    }}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">100% Escrow Released</span>
                    <span className="text-[11px] text-slate-500">Disburse award to Collector account</span>
                  </div>
                </label>

                <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={simApproveClearance}
                    onChange={(e) => {
                      setSimApproveClearance(e.target.checked);
                      setSimulatedScore(null);
                    }}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">Fast-Track Forest/NoC</span>
                    <span className="text-[11px] text-slate-500">Convene single-window DLCC review</span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetSimulation}
                  className="text-xs text-slate-500 hover:underline"
                >
                  Reset Parameters
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateWhatIf}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Simulate Delay Reduction
                  </button>

                  {simulatedScore !== null && (
                    <button
                      type="button"
                      disabled={recalculating}
                      onClick={handleApplyRecalculation}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
                      <span>{recalculating ? 'Saving...' : 'Apply as Official Forecast'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-12 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
            Select a case to inspect delay forecast details.
          </div>
        )}
      </div>
    </div>
  );
};
