export type UserRole = 'admin' | 'collector' | 'lao' | 'tahsildar';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  district: string; // 'All' or specific district e.g. 'Pune'
  avatarUrl?: string;
  phone?: string;
  department: string;
}

export type AcquisitionStage =
  | 'SIA_Section4'
  | 'Section11_PrelimNotice'
  | 'Section15_Hearing'
  | 'Section19_Declaration'
  | 'Section21_NoticeInterested'
  | 'Section23_AwardInquiry'
  | 'Section30_AwardDeclaration'
  | 'Section38_TakingPossession'
  | 'Completed';

export interface Milestone {
  id: string;
  caseId: string;
  stage: AcquisitionStage;
  name: string;
  statutorySection: string;
  statutoryDaysSLA: number; // Statutory limit under RFCTLARR 2013
  deadlineDate: string;
  completedDate?: string;
  status: 'completed' | 'in_progress' | 'pending' | 'overdue';
  remarks?: string;
  officerAssigned: string;
  delayDays?: number;
}

export interface RiskDriver {
  factor: string;
  impactScore: number; // 0 to 100 relative impact
  category: 'Compensation' | 'Approvals' | 'Litigation' | 'Surveys' | 'R&R' | 'Documentation';
  explanation: string;
}

export interface ApprovalRecord {
  id: string;
  name: string;
  authority: string;
  submittedDate: string;
  statutorySlaDays: number;
  status: 'pending' | 'approved' | 'rejected' | 'query_raised';
  remarks?: string;
}

export interface LegalDispute {
  suitNumber: string;
  court: string;
  petitioner: string;
  stayGranted: boolean;
  filingDate: string;
  nextHearingDate: string;
  subject: string;
  status: 'Active' | 'Disposed' | 'Settlement Pending';
}

export interface LandAcquisitionCase {
  id: string; // e.g. 'LA-2026-PUN-014'
  projectName: string;
  projectCategory: 'Highways & Expressways' | 'Railways & Metro' | 'Industrial Corridors' | 'Irrigation & Water' | 'Urban Infra' | 'Energy';
  state: string;
  district: string;
  taluk: string;
  village: string;
  surveyNumbers: string[];
  landAreaAcres: number;
  landType: 'Agricultural' | 'Non-Agricultural/Commercial' | 'Residential' | 'Barren/Wasteland';
  currentStage: AcquisitionStage;
  notificationDate: string;
  expectedPossessionDate: string;
  awardDate?: string;
  totalEstimatedCompensation: number; // in INR
  compensationDisbursed: number; // in INR
  compensationStatus: 'Not Started' | 'In Progress' | 'Escrow Deposited' | 'Fully Disbursed' | 'Disputed';
  pendingApprovals: ApprovalRecord[];
  legalDisputes: LegalDispute[];
  rrStatus: 'Not Applicable' | 'Survey Pending' | 'Scheme Approved' | 'Compensation In Progress' | 'R&R Disputed';
  assignedOfficer: {
    name: string;
    designation: string;
    contact: string;
  };
  nextMilestoneName: string;
  nextMilestoneDueDate: string;
  predictedDelayRisk: number; // 0 - 100%
  riskLevel: 'High' | 'Medium' | 'Low';
  riskDrivers: RiskDriver[];
  suggestedActions: string[];
  predictionTimestamp: string;
  modelVersion: string;
  dataCompletenessScore: number; // 0 - 100%
  documents: {
    id: string;
    title: string;
    type: string;
    uploadedAt: string;
    status: 'verified' | 'pending' | 'flagged';
    fileSize: string;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertItem {
  id: string;
  caseId: string;
  caseNumber: string;
  projectName: string;
  district: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'milestone_overdue' | 'high_risk_prediction' | 'pending_approval' | 'compensation_bottleneck' | 'legal_stay' | 'rr_dispute';
  title: string;
  message: string;
  recommendedAction: string;
  assignedOfficer: string;
  dueDate: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  status: 'open' | 'investigating' | 'resolved';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  caseId: string;
  caseNumber: string;
  action: string;
  details: string;
  performedBy: string;
  role: string;
  district: string;
  ipAddress: string;
}

export interface DashboardSummary {
  totalActiveCases: number;
  highRiskCases: number;
  mediumRiskCases: number;
  lowRiskCases: number;
  milestonesDueSoon: number;
  delayedCases: number;
  immediateActionRequired: number;
  completedAcquisitions: number;
  totalCompensationAllocated: number;
  totalCompensationDisbursed: number;
  stageDistribution: { stage: string; count: number; avgDelayDays: number }[];
  delayTrends: { month: string; predictedHighRisk: number; actualDelayed: number }[];
  districtPerformance: { district: string; totalCases: number; highRiskCount: number; complianceRate: number }[];
}
