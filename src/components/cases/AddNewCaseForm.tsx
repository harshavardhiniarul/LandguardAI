import React, { useState } from 'react';
import {
  FilePlus,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  ShieldAlert,
  Gavel,
  Users,
  FileCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LandAcquisitionCase, AcquisitionStage } from '../../types';
import { apiService } from '../../services/apiService';
import { DISTRICTS_LIST } from '../../data/mockData';

interface AddNewCaseFormProps {
  onCancel: () => void;
  onCaseCreated: (newCase: LandAcquisitionCase) => void;
  defaultDistrict?: string;
}

export const AddNewCaseForm: React.FC<AddNewCaseFormProps> = ({
  onCancel,
  onCaseCreated,
  defaultDistrict = 'Pune'
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [projectName, setProjectName] = useState('');
  const [projectCategory, setProjectCategory] = useState<LandAcquisitionCase['projectCategory']>('Highways & Expressways');
  const [stateName, setStateName] = useState('Maharashtra');
  const [district, setDistrict] = useState(defaultDistrict === 'All' ? 'Pune' : defaultDistrict);
  const [taluk, setTaluk] = useState('');
  const [village, setVillage] = useState('');
  const [surveyNumbersInput, setSurveyNumbersInput] = useState('');
  const [landAreaAcres, setLandAreaAcres] = useState<string>('25.5');
  const [landType, setLandType] = useState<LandAcquisitionCase['landType']>('Agricultural');
  const [currentStage, setCurrentStage] = useState<AcquisitionStage>('Section11_PrelimNotice');
  const [notificationDate, setNotificationDate] = useState('2026-10-15');
  const [expectedPossessionDate, setExpectedPossessionDate] = useState('2027-12-31');
  const [totalEstimatedCompensation, setTotalEstimatedCompensation] = useState<string>('85000000'); // ₹8.5 Cr
  const [compensationStatus, setCompensationStatus] = useState<LandAcquisitionCase['compensationStatus']>('Not Started');
  const [rrStatus, setRrStatus] = useState<LandAcquisitionCase['rrStatus']>('Survey Pending');
  const [hasLegalDispute, setHasLegalDispute] = useState(false);
  const [disputeSuitNo, setDisputeSuitNo] = useState('');
  const [disputeCourt, setDisputeCourt] = useState('High Court');
  const [disputeStay, setDisputeStay] = useState(false);
  const [pendingApprovalsInput, setPendingApprovalsInput] = useState('Forest Clearance Stage-I');
  const [officerName, setOfficerName] = useState('Shri Vikram S. Jadhav');
  const [officerDesignation, setOfficerDesignation] = useState('Special Land Acquisition Officer');
  const [officerContact, setOfficerContact] = useState('+91 94220 89211');
  const [nextMilestoneName, setNextMilestoneName] = useState('Section 15: Hearing of Objections');
  const [nextMilestoneDueDate, setNextMilestoneDueDate] = useState('2026-12-15');
  const [notes, setNotes] = useState('');

  // Document checklist flags
  const [docsChecklist, setDocsChecklist] = useState({
    requisitionLetter: true,
    cadastralMap: true,
    siaReport: true,
    preliminaryGazette: true,
    khatedarRegister: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!projectName.trim()) {
      setErrorMsg('Please enter a valid Project Name.');
      setActiveStep(1);
      return;
    }
    if (!village.trim() || !taluk.trim()) {
      setErrorMsg('Taluka and Village are mandatory for Cadastral Survey.');
      setActiveStep(1);
      return;
    }

    setSubmitting(true);
    try {
      const surveyList = surveyNumbersInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const parsedCompensation = parseFloat(totalEstimatedCompensation) || 0;
      const parsedArea = parseFloat(landAreaAcres) || 1;

      const legalDisputesList = hasLegalDispute
        ? [
            {
              suitNumber: disputeSuitNo || 'WP/2026/Unregistered',
              court: disputeCourt,
              petitioner: 'Aggrieved Landholders Association',
              stayGranted: disputeStay,
              filingDate: new Date().toISOString().split('T')[0],
              nextHearingDate: '2026-12-01',
              subject: 'Compensation assessment clarification petition',
              status: 'Active' as const
            }
          ]
        : [];

      const approvalsList = pendingApprovalsInput.trim()
        ? [
            {
              id: 'APP-NEW-01',
              name: pendingApprovalsInput.trim(),
              authority: 'Competent Authority',
              submittedDate: new Date().toISOString().split('T')[0],
              statutorySlaDays: 60,
              status: 'pending' as const,
              remarks: 'Under official departmental review'
            }
          ]
        : [];

      const newCaseRecord = await apiService.createCase({
        projectName: projectName.trim(),
        projectCategory,
        state: stateName,
        district,
        taluk: taluk.trim(),
        village: village.trim(),
        surveyNumbers: surveyList.length > 0 ? surveyList : ['101/A', '102/B'],
        landAreaAcres: parsedArea,
        landType,
        currentStage,
        notificationDate,
        expectedPossessionDate,
        totalEstimatedCompensation: parsedCompensation,
        compensationDisbursed: 0,
        compensationStatus,
        pendingApprovals: approvalsList,
        legalDisputes: legalDisputesList,
        rrStatus,
        assignedOfficer: {
          name: officerName,
          designation: officerDesignation,
          contact: officerContact
        },
        nextMilestoneName,
        nextMilestoneDueDate,
        documents: [
          {
            id: 'DOC-NEW-1',
            title: 'Requisition & SIA Preliminary Dossier',
            type: 'Gazette Requisition',
            uploadedAt: new Date().toISOString().split('T')[0],
            status: 'verified',
            fileSize: '3.8 MB'
          }
        ],
        notes: notes.trim()
      });

      onCaseCreated(newCaseRecord);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit statutory case record.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Project & Location' },
    { num: 2, label: 'Land & Stage' },
    { num: 3, label: 'Financial & Approvals' },
    { num: 4, label: 'Disputes & Checklist' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FilePlus className="w-5 h-5 text-blue-600" />
            Statutory Land Acquisition Case Registration
          </h2>
          <p className="text-xs text-slate-500">
            RFCTLARR Act 2013 · Automatic Case ID Generation & Baseline AI Risk Profiling
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-500">Auto Case ID Preview:</span>
          <div className="text-xs font-mono font-bold text-blue-700">
            LA-2026-{district.substring(0, 3).toUpperCase()}-XXX
          </div>
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 rounded-xl border text-xs">
        {steps.map((s) => (
          <button
            key={s.num}
            onClick={() => setActiveStep(s.num)}
            className={`flex items-center gap-2 font-semibold transition-colors ${
              activeStep === s.num
                ? 'text-blue-600'
                : activeStep > s.num
                ? 'text-emerald-700'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activeStep === s.num
                  ? 'bg-blue-600 text-white'
                  : activeStep > s.num
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Content Container */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
        {/* STEP 1: PROJECT & LOCATION */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              1. Project Particulars & Administrative Jurisdiction
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Pune Metro Line 3 Corridor Extension"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Category
                </label>
                <select
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium"
                >
                  <option value="Highways & Expressways">Highways & Expressways</option>
                  <option value="Railways & Metro">Railways & Metro</option>
                  <option value="Industrial Corridors">Industrial Corridors</option>
                  <option value="Irrigation & Water">Irrigation & Water</option>
                  <option value="Urban Infra">Urban Infra</option>
                  <option value="Energy">Energy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium"
                >
                  {DISTRICTS_LIST.filter(d => d !== 'All').map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Taluk / Tahsil <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  placeholder="e.g. Haveli, Hingna"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Revenue Village <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Wagholi, Hinjawadi"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LAND & STAGE */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              2. Land Cadastral Information & Statutory Stage
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Land Area (in Acres) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={landAreaAcres}
                  onChange={(e) => setLandAreaAcres(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Land Classification
                </label>
                <select
                  value={landType}
                  onChange={(e) => setLandType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="Agricultural">Agricultural (Irrigated / Dry)</option>
                  <option value="Non-Agricultural/Commercial">Non-Agricultural / Commercial</option>
                  <option value="Residential">Residential Abadi</option>
                  <option value="Barren/Wasteland">Barren / Government Wasteland</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Acquisition Stage
                </label>
                <select
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium"
                >
                  <option value="SIA_Section4">Sec 4: SIA Study</option>
                  <option value="Section11_PrelimNotice">Sec 11: Preliminary Notice</option>
                  <option value="Section15_Hearing">Sec 15: Hearing of Objections</option>
                  <option value="Section19_Declaration">Sec 19: Declaration</option>
                  <option value="Section21_NoticeInterested">Sec 21: Notice to Persons</option>
                  <option value="Section23_AwardInquiry">Sec 23: Award Inquiry</option>
                  <option value="Section30_AwardDeclaration">Sec 30: Award Declaration</option>
                  <option value="Section38_TakingPossession">Sec 38: Taking Possession</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Survey / Gat Numbers (Comma-separated)
              </label>
              <input
                type="text"
                value={surveyNumbersInput}
                onChange={(e) => setSurveyNumbersInput(e.target.value)}
                placeholder="e.g. 104/1, 105/2, 108/3A, 112"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section 11 Notification Date
                </label>
                <input
                  type="date"
                  value={notificationDate}
                  onChange={(e) => setNotificationDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Possession Date
                </label>
                <input
                  type="date"
                  value={expectedPossessionDate}
                  onChange={(e) => setExpectedPossessionDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FINANCIAL & APPROVALS */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              3. Financial Allocation & Clearances
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Compensation (in INR ₹)
                </label>
                <input
                  type="number"
                  value={totalEstimatedCompensation}
                  onChange={(e) => setTotalEstimatedCompensation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Includes market valuation + 100% solatium + 12% additional compensation
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Compensation Payment Status
                </label>
                <select
                  value={compensationStatus}
                  onChange={(e) => setCompensationStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="Not Started">Not Started (Awaiting Escrow Deposit)</option>
                  <option value="In Progress">In Progress (Partially Disbursed)</option>
                  <option value="Escrow Deposited">Escrow Deposited with Collector</option>
                  <option value="Disputed">Disputed / Khatedar Challenge</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pending Inter-Departmental Clearances / NoCs
              </label>
              <input
                type="text"
                value={pendingApprovalsInput}
                onChange={(e) => setPendingApprovalsInput(e.target.value)}
                placeholder="e.g. Forest Stage-II Clearance, DILR JMS Sheet, Pollution Board Buffer NoC"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Officer Name
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designation & Contact
                </label>
                <input
                  type="text"
                  value={officerDesignation}
                  onChange={(e) => setOfficerDesignation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: DISPUTES & CHECKLIST */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              4. Legal Disputes, R&R Scheme & Verification Checklist
            </h3>

            {/* Legal Dispute Toggle */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">Are there any court disputes or injunctions?</span>
                  <p className="text-[11px] text-slate-500">Civil Court or High Court petitions filed by landholders</p>
                </div>
                <input
                  type="checkbox"
                  checked={hasLegalDispute}
                  onChange={(e) => setHasLegalDispute(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              {hasLegalDispute && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1">Writ / Suit Number</label>
                    <input
                      type="text"
                      value={disputeSuitNo}
                      onChange={(e) => setDisputeSuitNo(e.target.value)}
                      placeholder="e.g. WP 5410/2026"
                      className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Court Name</label>
                    <input
                      type="text"
                      value={disputeCourt}
                      onChange={(e) => setDisputeCourt(e.target.value)}
                      placeholder="e.g. Bombay High Court"
                      className="w-full bg-white border border-slate-300 rounded p-1.5"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={disputeStay}
                        onChange={(e) => setDisputeStay(e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded"
                      />
                      <span className="text-red-700 font-bold">Interim Stay Granted</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* R&R Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rehabilitation & Resettlement (R&R) Status
              </label>
              <select
                value={rrStatus}
                onChange={(e) => setRrStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value="Not Applicable">Not Applicable (No Displaced Families)</option>
                <option value="Survey Pending">Survey Pending (Census in Progress)</option>
                <option value="Scheme Approved">Scheme Approved by Collector</option>
                <option value="R&R Disputed">R&R Package Disputed</option>
              </select>
            </div>

            {/* Document Checklist */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block mb-1">
                Mandatory Statutory Documents Checklist:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(docsChecklist).map(([key, val]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => setDocsChecklist({ ...docsChecklist, [key]: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Next Milestone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Next Milestone Designation
                </label>
                <input
                  type="text"
                  value={nextMilestoneName}
                  onChange={(e) => setNextMilestoneName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Statutory Due Date
                </label>
                <input
                  type="date"
                  value={nextMilestoneDueDate}
                  onChange={(e) => setNextMilestoneDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Administrative Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special remarks regarding gram sabha resolutions, compensation negotiations, or environmental clearances..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>
        )}

        {/* Form Actions Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Back
              </button>
            )}

            {activeStep < 4 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                Continue &rarr;
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
              >
                {submitting ? 'Registering & Computing AI Risk...' : 'Submit Statutory Case'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
