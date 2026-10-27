import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { LandAcquisitionCase, DashboardSummary } from '../../types';
import { MODEL_EVALUATION_METRICS, DISTRICTS_LIST } from '../../data/mockData';
import { formatINR, formatDate } from '../../utils/formatters';

interface ReportsAnalyticsProps {
  cases: LandAcquisitionCase[];
  summary: DashboardSummary;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({
  cases,
  summary,
  selectedDistrict,
  onSelectDistrict
}) => {
  const [selectedReportTab, setSelectedReportTab] = useState<'ml-performance' | 'statutory-bottlenecks' | 'district-matrix'>('ml-performance');

  const handlePrint = () => {
    window.print();
  };

  const handleExportSummaryCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Metric,Value',
        `Active Cases,${summary.totalActiveCases}`,
        `High Delay Risk Cases,${summary.highRiskCases}`,
        `Total Allocated Compensation (INR),${summary.totalCompensationAllocated}`,
        `Total Disbursed Compensation (INR),${summary.totalCompensationDisbursed}`,
        `ML Overall Precision,${MODEL_EVALUATION_METRICS.precisionHighRisk}%`,
        `ML Overall Recall,${MODEL_EVALUATION_METRICS.recallHighRisk}%`,
        `ML ROC-AUC,${MODEL_EVALUATION_METRICS.rocAuc}`
      ].join('\n');

    const encoded = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `LandGuard_Executive_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Statutory Reports & Predictive Model Analytics
          </h2>
          <p className="text-xs text-slate-500">
            RFCTLARR Act 2013 Performance Audits · XGBoost Validation Metrics · Delay Attribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSummaryCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-6 py-2 rounded-xl border text-xs">
        <button
          onClick={() => setSelectedReportTab('ml-performance')}
          className={`py-2 px-3 font-semibold rounded-md transition-colors ${
            selectedReportTab === 'ml-performance'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Model Precision, Recall & Confusion Matrix
        </button>
        <button
          onClick={() => setSelectedReportTab('statutory-bottlenecks')}
          className={`py-2 px-3 font-semibold rounded-md transition-colors ${
            selectedReportTab === 'statutory-bottlenecks'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Stage Bottlenecks & SLA Lapsing Analysis
        </button>
        <button
          onClick={() => setSelectedReportTab('district-matrix')}
          className={`py-2 px-3 font-semibold rounded-md transition-colors ${
            selectedReportTab === 'district-matrix'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          District Performance & Fairness Metrics
        </button>
      </div>

      {/* TAB 1: MODEL VALIDATION METRICS & CONFUSION MATRIX */}
      {selectedReportTab === 'ml-performance' && (
        <div className="space-y-6">
          {/* Methodology Banner */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Model Architecture & Cross-Validation Protocol:</span>
            </div>
            <p className="leading-relaxed">
              Trained on {MODEL_EVALUATION_METRICS.trainingDatasetSize} using {MODEL_EVALUATION_METRICS.algorithm}. Evaluated via {MODEL_EVALUATION_METRICS.validationMethod} against statutory Section 11 to Section 38 deadlines under RFCTLARR Act 2013.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Overall Accuracy</div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                {MODEL_EVALUATION_METRICS.overallAccuracy}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Cross-validated across 5 folds</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">High-Risk Precision</div>
              <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums mt-1">
                {MODEL_EVALUATION_METRICS.precisionHighRisk}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Minimizes false alarms for Collectors</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">High-Risk Recall</div>
              <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums mt-1">
                {MODEL_EVALUATION_METRICS.recallHighRisk}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Detects 89% of potential statutory lapses</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">ROC - AUC Score</div>
              <div className="text-2xl font-bold font-mono text-purple-700 tabular-nums mt-1">
                {MODEL_EVALUATION_METRICS.rocAuc}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Distinction index between normal/delayed</div>
            </div>
          </div>

          {/* Confusion Matrix Table & Global Feature Weights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Confusion Matrix */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Confusion Matrix (Test Evaluation Set)
                </h3>
                <span className="text-[11px] font-mono text-slate-500">N = 1,309 Records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs border border-slate-200">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="p-2 border-r border-slate-200">Actual \ Predicted</th>
                      <th className="p-2 border-r border-slate-200 text-red-700">Predicted Delayed</th>
                      <th className="p-2 text-emerald-700">Predicted On-Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    <tr>
                      <td className="p-3 bg-slate-50 text-slate-700 font-semibold border-r border-slate-200 text-left">
                        Actual Delayed
                      </td>
                      <td className="p-3 bg-red-50 text-red-800 font-bold border-r border-slate-200">
                        {MODEL_EVALUATION_METRICS.confusionMatrix.truePositive} (True Pos)
                      </td>
                      <td className="p-3 bg-slate-50 text-slate-600">
                        {MODEL_EVALUATION_METRICS.confusionMatrix.falseNegative} (False Neg)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-50 text-slate-700 font-semibold border-r border-slate-200 text-left">
                        Actual On-Time
                      </td>
                      <td className="p-3 bg-slate-50 text-slate-600 border-r border-slate-200">
                        {MODEL_EVALUATION_METRICS.confusionMatrix.falsePositive} (False Pos)
                      </td>
                      <td className="p-3 bg-emerald-50 text-emerald-800 font-bold">
                        {MODEL_EVALUATION_METRICS.confusionMatrix.trueNegative} (True Neg)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed">
                Low false-positive rate prevents administrative alert fatigue; high recall ensures critical 12-month statutory lapsing risks under Section 19(7) are surfaced ahead of time.
              </div>
            </div>

            {/* Global SHAP Feature Importance */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Global Feature Attribution (TreeSHAP)
                </h3>
                <span className="text-[11px] font-mono text-slate-500">Relative Weight</span>
              </div>

              <div className="space-y-3">
                {MODEL_EVALUATION_METRICS.topGlobalFeatureImportance.map((f) => (
                  <div key={f.feature} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 truncate max-w-[280px]">
                        {f.feature}
                      </span>
                      <span className="font-mono text-blue-700 font-bold tabular-nums">
                        {(f.weight * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${f.weight * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATUTORY BOTTLENECK ANALYSIS */}
      {selectedReportTab === 'statutory-bottlenecks' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              RFCTLARR Statutory SLA Lapsing Duration Histogram
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of delay magnitudes across statutory milestones (social impact assessment to award)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              {MODEL_EVALUATION_METRICS.statutoryDelayDistribution.map((dist, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700">{dist.range}</div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                    {dist.frequency}%
                  </div>
                  <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        idx === 3 ? 'bg-red-600' : idx === 2 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${dist.frequency * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISTRICT PERFORMANCE & FAIRNESS MATRIX */}
      {selectedReportTab === 'district-matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                District-Wise Statutory Adherence Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Evaluating fairness and procedural equity across administrative divisions
              </p>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4 text-center">Active Caseload</th>
                  <th className="py-3 px-4 text-center">High Delay Risk Cases</th>
                  <th className="py-3 px-4 text-center">On-Time SLA Compliance</th>
                  <th className="py-3 px-4">Procedural Fairness Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.districtPerformance.map((dist) => (
                  <tr key={dist.district} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{dist.district}</td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums">{dist.totalCases}</td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums font-bold text-red-600">
                      {dist.highRiskCount}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        dist.complianceRate >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {dist.complianceRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {dist.complianceRate >= 80 ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> High Statutory Adherence
                        </span>
                      ) : (
                        <span className="text-amber-700 flex items-center gap-1 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" /> Forest / Injunction Bottleneck
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
