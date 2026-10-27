import {
  LandAcquisitionCase,
  Milestone,
  AlertItem,
  AuditLog,
  DashboardSummary,
  User
} from '../types';
import {
  INITIAL_CASES,
  INITIAL_MILESTONES,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SUMMARY,
  USERS,
  MODEL_EVALUATION_METRICS
} from '../data/mockData';

const STORAGE_KEYS = {
  CASES: 'landguard_cases_v1',
  MILESTONES: 'landguard_milestones_v1',
  ALERTS: 'landguard_alerts_v1',
  AUDIT_LOGS: 'landguard_audit_v1',
  CURRENT_USER: 'landguard_current_user_v1'
};

function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed to read ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to save ${key} to storage:`, err);
  }
}

// In-memory / localStorage state container
class LandGuardApiService {
  private cases: LandAcquisitionCase[];
  private milestones: Record<string, Milestone[]>;
  private alerts: AlertItem[];
  private auditLogs: AuditLog[];
  private currentUser: User;

  constructor() {
    this.cases = getStoredData<LandAcquisitionCase[]>(STORAGE_KEYS.CASES, INITIAL_CASES);
    this.milestones = getStoredData<Record<string, Milestone[]>>(STORAGE_KEYS.MILESTONES, INITIAL_MILESTONES);
    this.alerts = getStoredData<AlertItem[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    this.auditLogs = getStoredData<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.currentUser = getStoredData<User>(STORAGE_KEYS.CURRENT_USER, USERS[0]); // Default to District Collector Pune
  }

  // --- Auth & User context ---
  getCurrentUser(): User {
    return this.currentUser;
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    setStoredData(STORAGE_KEYS.CURRENT_USER, user);
  }

  getAllUsers(): User[] {
    return USERS;
  }

  // --- REST Contract: GET /api/dashboard/summary ---
  async getDashboardSummary(selectedDistrict: string = 'All'): Promise<DashboardSummary> {
    const accessibleCases = this.filterByDistrict(this.cases, selectedDistrict);
    const totalActive = accessibleCases.filter(c => c.currentStage !== 'Completed').length;
    const highRisk = accessibleCases.filter(c => c.riskLevel === 'High' && c.currentStage !== 'Completed').length;
    const mediumRisk = accessibleCases.filter(c => c.riskLevel === 'Medium' && c.currentStage !== 'Completed').length;
    const lowRisk = accessibleCases.filter(c => c.riskLevel === 'Low' && c.currentStage !== 'Completed').length;
    const completed = accessibleCases.filter(c => c.currentStage === 'Completed').length;

    const totalAllocated = accessibleCases.reduce((sum, c) => sum + c.totalEstimatedCompensation, 0);
    const totalDisbursed = accessibleCases.reduce((sum, c) => sum + c.compensationDisbursed, 0);

    const delayed = accessibleCases.filter(c => c.predictedDelayRisk > 75).length;
    const actionRequired = this.alerts.filter(a => !a.acknowledged && (selectedDistrict === 'All' || a.district === selectedDistrict)).length;

    return {
      ...INITIAL_SUMMARY,
      totalActiveCases: totalActive,
      highRiskCases: highRisk,
      mediumRiskCases: mediumRisk,
      lowRiskCases: lowRisk,
      delayedCases: delayed,
      immediateActionRequired: actionRequired,
      completedAcquisitions: completed,
      totalCompensationAllocated: totalAllocated,
      totalCompensationDisbursed: totalDisbursed
    };
  }

  // --- REST Contract: GET /api/cases ---
  async getCases(district: string = 'All'): Promise<LandAcquisitionCase[]> {
    return this.filterByDistrict(this.cases, district);
  }

  // --- REST Contract: GET /api/cases/{id} ---
  async getCaseById(id: string): Promise<LandAcquisitionCase | null> {
    const found = this.cases.find(c => c.id === id);
    return found || null;
  }

  // --- REST Contract: POST /api/cases ---
  async createCase(caseData: Omit<LandAcquisitionCase, 'id' | 'createdAt' | 'updatedAt' | 'predictedDelayRisk' | 'riskLevel' | 'riskDrivers' | 'suggestedActions' | 'modelVersion' | 'predictionTimestamp' | 'dataCompletenessScore'>): Promise<LandAcquisitionCase> {
    const districtCode = caseData.district.substring(0, 3).toUpperCase();
    const sequenceNum = String(this.cases.length + 1).padStart(3, '0');
    const newId = `LA-2026-${districtCode}-${sequenceNum}`;

    // Predict risk initially based on baseline attributes
    const { predictedDelayRisk, riskLevel, riskDrivers, suggestedActions } = this.calculateSyntheticPrediction(caseData);

    const fullCase: LandAcquisitionCase = {
      ...caseData,
      id: newId,
      predictedDelayRisk,
      riskLevel,
      riskDrivers,
      suggestedActions,
      predictionTimestamp: new Date().toLocaleString('en-IN') + ' IST',
      modelVersion: 'XGBoost-RFCTLARR-v2.4 (SHAP Grounded)',
      dataCompletenessScore: 85,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    this.cases.unshift(fullCase);
    setStoredData(STORAGE_KEYS.CASES, this.cases);

    // Seed default statutory milestones under RFCTLARR Act 2013
    this.seedMilestonesForCase(newId, fullCase);

    // Append to audit log
    this.addAuditLog({
      caseId: newId,
      caseNumber: newId,
      action: 'Case Created',
      details: `New land acquisition case created for project: ${caseData.projectName} (${caseData.landAreaAcres} Acres, Village: ${caseData.village})`,
      district: caseData.district
    });

    return fullCase;
  }

  // --- REST Contract: PATCH /api/cases/{id} ---
  async updateCase(id: string, updates: Partial<LandAcquisitionCase>): Promise<LandAcquisitionCase> {
    const index = this.cases.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Case ${id} not found`);

    const existing = this.cases[index];
    const updatedCase = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    this.cases[index] = updatedCase;
    setStoredData(STORAGE_KEYS.CASES, this.cases);

    this.addAuditLog({
      caseId: id,
      caseNumber: id,
      action: 'Case Record Updated',
      details: `Updated parameters for ${id}. Current stage: ${updatedCase.currentStage}, Compensation Status: ${updatedCase.compensationStatus}`,
      district: updatedCase.district
    });

    return updatedCase;
  }

  // --- REST Contract: GET /api/cases/{id}/milestones ---
  async getMilestones(caseId: string): Promise<Milestone[]> {
    if (this.milestones[caseId]) {
      return this.milestones[caseId];
    }
    // Generate default statutory milestone structure if not existing
    const foundCase = this.cases.find(c => c.id === caseId);
    if (foundCase) {
      this.seedMilestonesForCase(caseId, foundCase);
      return this.milestones[caseId] || [];
    }
    return [];
  }

  // --- REST Contract: POST /api/cases/{id}/milestones ---
  async updateMilestone(caseId: string, milestoneId: string, status: Milestone['status'], remarks?: string, completionDate?: string): Promise<Milestone> {
    const list = this.milestones[caseId] || [];
    const index = list.findIndex(m => m.id === milestoneId);
    if (index === -1) throw new Error(`Milestone ${milestoneId} not found`);

    const existing = list[index];
    const updated: Milestone = {
      ...existing,
      status,
      remarks: remarks ?? existing.remarks,
      completedDate: status === 'completed' ? (completionDate || new Date().toISOString().split('T')[0]) : existing.completedDate
    };

    list[index] = updated;
    this.milestones[caseId] = list;
    setStoredData(STORAGE_KEYS.MILESTONES, this.milestones);

    this.addAuditLog({
      caseId,
      caseNumber: caseId,
      action: `Milestone Status Changed: ${updated.name}`,
      details: `Status set to ${status}. Remarks: ${remarks || 'None'}`,
      district: this.cases.find(c => c.id === caseId)?.district || 'Pune'
    });

    return updated;
  }

  // --- REST Contract: POST /api/cases/{id}/predict (ML inference / recalculation) ---
  async predictCaseDelay(caseId: string, overrides?: Partial<LandAcquisitionCase>): Promise<{
    predictedDelayRisk: number;
    riskLevel: 'High' | 'Medium' | 'Low';
    riskDrivers: LandAcquisitionCase['riskDrivers'];
    suggestedActions: string[];
    modelVersion: string;
    predictionTimestamp: string;
    dataCompletenessScore: number;
  }> {
    const theCase = this.cases.find(c => c.id === caseId);
    if (!theCase) throw new Error(`Case ${caseId} not found`);

    const evalCase = { ...theCase, ...overrides };
    const prediction = this.calculateSyntheticPrediction(evalCase);

    const timestamp = new Date().toLocaleString('en-IN') + ' IST';
    const updated = {
      ...theCase,
      predictedDelayRisk: prediction.predictedDelayRisk,
      riskLevel: prediction.riskLevel,
      riskDrivers: prediction.riskDrivers,
      suggestedActions: prediction.suggestedActions,
      predictionTimestamp: timestamp
    };

    const idx = this.cases.findIndex(c => c.id === caseId);
    if (idx !== -1) {
      this.cases[idx] = updated;
      setStoredData(STORAGE_KEYS.CASES, this.cases);
    }

    this.addAuditLog({
      caseId,
      caseNumber: caseId,
      action: 'AI Delay Prediction Recalculated',
      details: `New predicted risk: ${prediction.predictedDelayRisk}% (${prediction.riskLevel} Risk). Drivers: ${prediction.riskDrivers.map(d => d.factor).join(', ')}`,
      district: theCase.district
    });

    return {
      ...prediction,
      modelVersion: 'XGBoost-RFCTLARR-v2.4 (SHAP Grounded)',
      predictionTimestamp: timestamp,
      dataCompletenessScore: theCase.dataCompletenessScore
    };
  }

  // --- REST Contract: GET /api/alerts ---
  async getAlerts(district: string = 'All'): Promise<AlertItem[]> {
    if (district === 'All') return this.alerts;
    return this.alerts.filter(a => a.district === district);
  }

  // --- REST Contract: POST /api/alerts/{id}/acknowledge ---
  async acknowledgeAlert(alertId: string, actionNote?: string): Promise<AlertItem> {
    const idx = this.alerts.findIndex(a => a.id === alertId);
    if (idx === -1) throw new Error(`Alert ${alertId} not found`);

    const existing = this.alerts[idx];
    const updated: AlertItem = {
      ...existing,
      acknowledged: true,
      acknowledgedBy: this.currentUser.name,
      acknowledgedAt: new Date().toLocaleString('en-IN') + ' IST',
      status: 'investigating'
    };

    this.alerts[idx] = updated;
    setStoredData(STORAGE_KEYS.ALERTS, this.alerts);

    this.addAuditLog({
      caseId: existing.caseId,
      caseNumber: existing.caseNumber,
      action: 'Alert Acknowledged & Action Logged',
      details: `Alert "${existing.title}" acknowledged. Note: ${actionNote || 'Under investigation by assigned officer'}`,
      district: existing.district
    });

    return updated;
  }

  // --- REST Contract: GET /api/audit-logs ---
  async getAuditLogs(district: string = 'All'): Promise<AuditLog[]> {
    if (district === 'All') return this.auditLogs;
    return this.auditLogs.filter(l => l.district === district || l.district === 'All');
  }

  // --- REST Contract: GET /api/reports ---
  async getReports(district: string = 'All') {
    const cases = this.filterByDistrict(this.cases, district);
    return {
      metrics: MODEL_EVALUATION_METRICS,
      totalAnalyzedCases: cases.length,
      highRiskRatio: cases.filter(c => c.riskLevel === 'High').length / (cases.length || 1),
      avgCompensationDisbursementRate: cases.reduce((acc, c) => acc + (c.compensationDisbursed / (c.totalEstimatedCompensation || 1)), 0) / (cases.length || 1) * 100
    };
  }

  // --- Helper: Private calculation simulating XGBoost + TreeSHAP explainability ---
  private calculateSyntheticPrediction(c: Partial<LandAcquisitionCase>): {
    predictedDelayRisk: number;
    riskLevel: 'High' | 'Medium' | 'Low';
    riskDrivers: LandAcquisitionCase['riskDrivers'];
    suggestedActions: string[];
  } {
    let score = 25; // baseline risk
    const drivers: LandAcquisitionCase['riskDrivers'] = [];
    const actions: string[] = [];

    // Factor 1: Legal stays
    const activeStay = c.legalDisputes?.some(d => d.stayGranted && d.status === 'Active');
    if (activeStay) {
      score += 40;
      drivers.push({
        factor: 'Court Stay Injunction Active',
        impactScore: 40,
        category: 'Litigation',
        explanation: 'Judicial stay order restrains possession or declaration proceedings until court hearing.'
      });
      actions.push('Direct Government Pleader to file counter-affidavit for early vacation of stay.');
    } else if (c.legalDisputes && c.legalDisputes.length > 0) {
      score += 15;
      drivers.push({
        factor: 'Pending Court Writ Challenge',
        impactScore: 15,
        category: 'Litigation',
        explanation: 'Litigation filed on compensation rate without stay granted.'
      });
      actions.push('Prepare comparative land transaction rate analysis to submit before the court.');
    }

    // Factor 2: Approvals pending SLA
    const pendingApprovalsCount = c.pendingApprovals?.filter(a => a.status === 'pending' || a.status === 'query_raised').length || 0;
    if (pendingApprovalsCount > 1) {
      score += 25;
      drivers.push({
        factor: 'Multiple Inter-Departmental Clearances Delayed',
        impactScore: 25,
        category: 'Approvals',
        explanation: `${pendingApprovalsCount} statutory NoCs (Forest/Pollution/Irrigation) pending beyond standard timeline.`
      });
      actions.push('Escalate approval bottlenecks to District Level Coordination Committee (DLCC).');
    } else if (pendingApprovalsCount === 1) {
      score += 12;
      drivers.push({
        factor: 'Statutory Clearance Under Scrutiny',
        impactScore: 12,
        category: 'Approvals',
        explanation: 'Departmental query raised on alignment boundary coordinates.'
      });
      actions.push('Depute SLAO technical team to resolve departmental query within 7 days.');
    }

    // Factor 3: Compensation status
    if (c.compensationStatus === 'Not Started' && c.currentStage !== 'SIA_Section4' && c.currentStage !== 'Section11_PrelimNotice') {
      score += 20;
      drivers.push({
        factor: 'Compensation Escrow Deposit Unfunded',
        impactScore: 20,
        category: 'Compensation',
        explanation: 'Requisitioning department has not yet transferred estimated award funds.'
      });
      actions.push('Issue formal demand notice to Requisitioning Body for immediate escrow release.');
    } else if (c.compensationStatus === 'Disputed') {
      score += 22;
      drivers.push({
        factor: 'Gram Sabha / Khatedar Valuation Dispute',
        impactScore: 22,
        category: 'Compensation',
        explanation: 'Dispute over market value determination and Solatium multiplier.'
      });
      actions.push('Conduct special Taluka Lok Adalat camp for negotiated settlement.');
    }

    // Factor 4: R&R disputes
    if (c.rrStatus === 'R&R Disputed') {
      score += 18;
      drivers.push({
        factor: 'Rehabilitation & Resettlement Impasse',
        impactScore: 18,
        category: 'R&R',
        explanation: 'Affected families challenging R&R resettlement site package.'
      });
      actions.push('Convene meeting with Commissioner R&R to review alternate rehabilitation site allocation.');
    }

    // Clamp score
    const finalScore = Math.min(96, Math.max(8, Math.round(score)));
    let riskLevel: 'High' | 'Medium' | 'Low' = 'Low';
    if (finalScore >= 70) riskLevel = 'High';
    else if (finalScore >= 40) riskLevel = 'Medium';

    if (drivers.length === 0) {
      drivers.push({
        factor: 'Nominal Statutory Timeline Progression',
        impactScore: 8,
        category: 'Surveys',
        explanation: 'Case is progressing within standard RFCTLARR SLA limits without major encumbrances.'
      });
      actions.push('Continue scheduled milestone tracking and monitor weekly mutation records.');
    }

    return {
      predictedDelayRisk: finalScore,
      riskLevel,
      riskDrivers: drivers,
      suggestedActions: actions
    };
  }

  private filterByDistrict<T extends { district: string }>(items: T[], selectedDistrict: string): T[] {
    if (this.currentUser.role !== 'admin' && this.currentUser.district !== 'All') {
      // User is locked to their authorized district!
      return items.filter(i => i.district === this.currentUser.district);
    }
    if (selectedDistrict === 'All') return items;
    return items.filter(i => i.district === selectedDistrict);
  }

  private addAuditLog(entry: { caseId: string; caseNumber: string; action: string; details: string; district: string }): void {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      caseId: entry.caseId,
      caseNumber: entry.caseNumber,
      action: entry.action,
      details: entry.details,
      performedBy: this.currentUser.name,
      role: this.currentUser.role,
      district: entry.district,
      ipAddress: '10.20.' + Math.floor(Math.random() * 200) + '.' + Math.floor(Math.random() * 200)
    };
    this.auditLogs.unshift(newLog);
    setStoredData(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  private seedMilestonesForCase(caseId: string, caseData: LandAcquisitionCase): void {
    const list: Milestone[] = [
      {
        id: `MS-${Date.now()}-1`,
        caseId,
        stage: 'SIA_Section4',
        name: 'Social Impact Assessment Study & Public Hearing',
        statutorySection: 'Section 4(1)',
        statutoryDaysSLA: 180,
        deadlineDate: '2026-03-31',
        completedDate: '2026-03-15',
        status: 'completed',
        officerAssigned: caseData.assignedOfficer.name
      },
      {
        id: `MS-${Date.now()}-2`,
        caseId,
        stage: 'Section11_PrelimNotice',
        name: 'Publication of Preliminary Notification',
        statutorySection: 'Section 11(1)',
        statutoryDaysSLA: 60,
        deadlineDate: caseData.notificationDate,
        completedDate: caseData.notificationDate,
        status: 'completed',
        officerAssigned: caseData.assignedOfficer.name
      },
      {
        id: `MS-${Date.now()}-3`,
        caseId,
        stage: 'Section15_Hearing',
        name: 'Hearing of Objections by Collector',
        statutorySection: 'Section 15(2)',
        statutoryDaysSLA: 60,
        deadlineDate: '2026-11-20',
        status: caseData.currentStage === 'Section11_PrelimNotice' ? 'pending' : 'completed',
        officerAssigned: 'District Collector'
      },
      {
        id: `MS-${Date.now()}-4`,
        caseId,
        stage: 'Section19_Declaration',
        name: 'Publication of Declaration of Acquisition',
        statutorySection: 'Section 19(1)',
        statutoryDaysSLA: 365,
        deadlineDate: '2027-01-15',
        status: 'pending',
        officerAssigned: 'State Revenue Department'
      },
      {
        id: `MS-${Date.now()}-5`,
        caseId,
        stage: 'Section21_NoticeInterested',
        name: 'Notice to Persons Interested in Claims',
        statutorySection: 'Section 21',
        statutoryDaysSLA: 60,
        deadlineDate: '2027-03-15',
        status: 'pending',
        officerAssigned: caseData.assignedOfficer.name
      },
      {
        id: `MS-${Date.now()}-6`,
        caseId,
        stage: 'Section23_AwardInquiry',
        name: 'Award Inquiry & Compensation Valuation',
        statutorySection: 'Section 23 & 27',
        statutoryDaysSLA: 90,
        deadlineDate: '2027-05-30',
        status: 'pending',
        officerAssigned: caseData.assignedOfficer.name
      },
      {
        id: `MS-${Date.now()}-7`,
        caseId,
        stage: 'Section30_AwardDeclaration',
        name: 'Award Declaration & Collector Approval',
        statutorySection: 'Section 30',
        statutoryDaysSLA: 365,
        deadlineDate: '2027-08-15',
        status: 'pending',
        officerAssigned: 'District Collector'
      },
      {
        id: `MS-${Date.now()}-8`,
        caseId,
        stage: 'Section38_TakingPossession',
        name: 'Taking Possession & Land Handover',
        statutorySection: 'Section 38',
        statutoryDaysSLA: 60,
        deadlineDate: caseData.expectedPossessionDate,
        status: 'pending',
        officerAssigned: 'Tahsildar & Revenue Officials'
      }
    ];

    this.milestones[caseId] = list;
    setStoredData(STORAGE_KEYS.MILESTONES, this.milestones);
  }
}

export const apiService = new LandGuardApiService();
