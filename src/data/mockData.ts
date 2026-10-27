import { LandAcquisitionCase, Milestone, AlertItem, AuditLog, User, DashboardSummary } from '../types';

export const CURRENT_SYSTEM_DATE = '2026-10-26';

export const USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Dr. Rajeshwar Deshmukh, IAS',
    email: 'collector.pune@gov.in',
    role: 'collector',
    designation: 'District Collector & District Magistrate',
    district: 'Pune',
    department: 'Revenue & District Administration',
    phone: '+91 20 2612 1100'
  },
  {
    id: 'USR-002',
    name: 'Smt. Kavitha Ramanathan, IAS',
    email: 'collector.bengaluru@gov.in',
    role: 'collector',
    designation: 'District Collector & District Magistrate',
    district: 'Bengaluru Urban',
    department: 'Revenue Department',
    phone: '+91 80 2221 1292'
  },
  {
    id: 'USR-003',
    name: 'Shri Vikram S. Jadhav',
    email: 'lao.pune.corridor@gov.in',
    role: 'lao',
    designation: 'Special Land Acquisition Officer (Highways & Rail)',
    district: 'Pune',
    department: 'Office of SLAO No. 1, Pune',
    phone: '+91 94220 89211'
  },
  {
    id: 'USR-004',
    name: 'Shri Anand M. Kulkarni',
    email: 'tahsildar.haveli@gov.in',
    role: 'tahsildar',
    designation: 'Tahsildar & Executive Magistrate',
    district: 'Pune',
    department: 'Taluka Haveli Tahsil Office',
    phone: '+91 98231 44520'
  },
  {
    id: 'USR-005',
    name: 'Administrator (State Nodal Officer)',
    email: 'admin.landguard@gov.in',
    role: 'admin',
    designation: 'State Nodal Administrator (RFCTLARR Cell)',
    district: 'All',
    department: 'Revenue & Forest Department, State HQ',
    phone: '+91 22 2202 5252'
  }
];

export const DISTRICTS_LIST = ['All', 'Pune', 'Nagpur', 'Bengaluru Urban', 'Kanchipuram', 'Ahmedabad'];

export const INITIAL_CASES: LandAcquisitionCase[] = [
  {
    id: 'LA-2026-PUN-001',
    projectName: 'Pune-Nashik Semi High-Speed Rail Corridor (Package 2)',
    projectCategory: 'Railways & Metro',
    state: 'Maharashtra',
    district: 'Pune',
    taluk: 'Haveli',
    village: 'Wagholi',
    surveyNumbers: ['104/1', '104/2B', '105/3', '108/1A'],
    landAreaAcres: 48.75,
    landType: 'Agricultural',
    currentStage: 'Section19_Declaration',
    notificationDate: '2025-08-14',
    expectedPossessionDate: '2027-03-31',
    totalEstimatedCompensation: 185000000, // ₹18.5 Cr
    compensationDisbursed: 42000000, // ₹4.2 Cr
    compensationStatus: 'In Progress',
    pendingApprovals: [
      {
        id: 'APP-01',
        name: 'Forest Land Diversion (Stage-II Clearance)',
        authority: 'State Forest Advisory Committee',
        submittedDate: '2026-04-10',
        statutorySlaDays: 60,
        status: 'pending',
        remarks: 'Site inspection completed; awaiting central MoEFCC nod'
      },
      {
        id: 'APP-02',
        name: 'Joint Measurement Survey (JMS) Super-Check',
        authority: 'District Inspector of Land Records (DILR)',
        submittedDate: '2026-07-15',
        statutorySlaDays: 30,
        status: 'query_raised',
        remarks: 'Discrepancy in boundary overlap on Survey No. 104/2B'
      }
    ],
    legalDisputes: [
      {
        suitNumber: 'WP No. 4921/2026',
        court: 'Hon\'ble High Court of Judicature at Bombay',
        petitioner: 'Kisan Krishi Samiti & 12 Others',
        stayGranted: true,
        filingDate: '2026-06-20',
        nextHearingDate: '2026-11-18',
        subject: 'Writ challenging valuation benchmark and multiplier factor under First Schedule',
        status: 'Active'
      }
    ],
    rrStatus: 'R&R Disputed',
    assignedOfficer: {
      name: 'Shri Vikram S. Jadhav',
      designation: 'Special Land Acquisition Officer (Railways)',
      contact: '+91 94220 89211'
    },
    nextMilestoneName: 'Section 21: Service of Notice to Landowners',
    nextMilestoneDueDate: '2026-11-15',
    predictedDelayRisk: 86,
    riskLevel: 'High',
    riskDrivers: [
      {
        factor: 'High Court Interim Stay Order',
        impactScore: 42,
        category: 'Litigation',
        explanation: 'Interim stay restraining dispossession until rejoinder is filed by State Government.'
      },
      {
        factor: 'Pending Stage-II Forest Clearance',
        impactScore: 28,
        category: 'Approvals',
        explanation: 'Clearance pending beyond 60-day statutory timeline by 48 days.'
      },
      {
        factor: 'Compensation Disparity Objections',
        impactScore: 16,
        category: 'Compensation',
        explanation: 'Over 68% of affected khatedars filed objections on market rate multiplier.'
      }
    ],
    suggestedActions: [
      'Expedite State Government affidavit filing via Government Pleader in Bombay High Court for WP 4921/2026 to vacate stay.',
      'Convene tripartite coordination meeting with Principal Chief Conservator of Forests (PCCF) for Stage-II clearance waiver.',
      'Direct Tahsildar Haveli to organize Lok Adalat mediation camp for khatedar objections on valuation.'
    ],
    predictionTimestamp: '2026-10-25 18:30 IST',
    modelVersion: 'XGBoost-RFCTLARR-v2.4 (SHAP Grounded)',
    dataCompletenessScore: 94,
    documents: [
      { id: 'DOC-1', title: 'Preliminary Notification Gazette Sec 11', type: 'Gazette', uploadedAt: '2025-08-15', status: 'verified', fileSize: '3.4 MB' },
      { id: 'DOC-2', title: 'High Court Stay Order Copy WP 4921', type: 'Court Order', uploadedAt: '2026-06-22', status: 'verified', fileSize: '1.2 MB' },
      { id: 'DOC-3', title: 'Joint Measurement Survey Sheet (JMS)', type: 'Survey Cadastral', uploadedAt: '2026-07-16', status: 'pending', fileSize: '8.7 MB' }
    ],
    notes: 'High priority project under Chief Minister Fast-Track Infrastructure Committee. Review scheduled next week.',
    createdAt: '2025-08-14',
    updatedAt: '2026-10-25'
  },
  {
    id: 'LA-2026-PUN-002',
    projectName: 'Ring Road Greenfield Section (West Corridor)',
    projectCategory: 'Highways & Expressways',
    state: 'Maharashtra',
    district: 'Pune',
    taluk: 'Maval',
    village: 'Urse',
    surveyNumbers: ['215/1', '216/A', '219/3', '221'],
    landAreaAcres: 72.10,
    landType: 'Agricultural',
    currentStage: 'Section23_AwardInquiry',
    notificationDate: '2025-04-10',
    expectedPossessionDate: '2026-12-15',
    totalEstimatedCompensation: 340000000, // ₹34.0 Cr
    compensationDisbursed: 290000000, // ₹29.0 Cr
    compensationStatus: 'In Progress',
    pendingApprovals: [
      {
        id: 'APP-03',
        name: 'MSRDC Administrative Sanction for Enhanced Solatium',
        authority: 'State Infrastructure Board',
        submittedDate: '2026-09-01',
        statutorySlaDays: 20,
        status: 'approved',
        remarks: 'Sanction order granted on 2026-10-12'
      }
    ],
    legalDisputes: [],
    rrStatus: 'Scheme Approved',
    assignedOfficer: {
      name: 'Shri Vikram S. Jadhav',
      designation: 'Special Land Acquisition Officer (Highways)',
      contact: '+91 94220 89211'
    },
    nextMilestoneName: 'Section 30: Award Declaration & Sanction',
    nextMilestoneDueDate: '2026-11-20',
    predictedDelayRisk: 24,
    riskLevel: 'Low',
    riskDrivers: [
      {
        factor: 'Minor Khatedar Succession Mutation Delays',
        impactScore: 14,
        category: 'Documentation',
        explanation: 'Three title-holders deceased; legal heir certificates under Tahsildar review.'
      },
      {
        factor: 'Disbursement Banking Reconciliation',
        impactScore: 10,
        category: 'Compensation',
        explanation: 'Direct Benefit Transfer (DBT) verification pending for 8 bank accounts.'
      }
    ],
    suggestedActions: [
      'Instruct Talathi & Tahsildar Maval to expedite Waras (succession) mutation entries within 7 days.',
      'Coordinate with Lead District Bank Manager for instant Aadhaar-linked DBT credit.'
    ],
    predictionTimestamp: '2026-10-24 14:15 IST',
    modelVersion: 'XGBoost-RFCTLARR-v2.4 (SHAP Grounded)',
    dataCompletenessScore: 98,
    documents: [
      { id: 'DOC-4', title: 'Section 19 Declaration Gazette', type: 'Gazette', uploadedAt: '2025-11-10', status: 'verified', fileSize: '2.8 MB' },
      { id: 'DOC-5', title: 'Award Inquiry Register Form 7', type: 'Award Sheet', uploadedAt: '2026-08-30', status: 'verified', fileSize: '5.1 MB' }
    ],
    notes: 'Smooth consensus achieved through direct negotiation with gram sabha.',
    createdAt: '2025-04-10',
    updatedAt: '2026-10-24'
  },
  {
    id: 'LA-2026-BLR-003',
    projectName: 'Bengaluru Peripheral Ring Road (Phase 1)',
    projectCategory: 'Highways & Expressways',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    taluk: 'Bangalore East',
    village: 'Varthur & Gunjur',
    surveyNumbers: ['12/1', '14/2', '15/3', '18/1B', '20/2'],
    landAreaAcres: 112.50,
    landType: 'Non-Agricultural/Commercial',
    currentStage: 'Section15_Hearing',
    notificationDate: '2025-11-20',
    expectedPossessionDate: '2027-08-30',
    totalEstimatedCompensation: 890000000, // ₹89 Cr
    compensationDisbursed: 0,
    compensationStatus: 'Not Started',
    pendingApprovals: [
      {
        id: 'APP-04',
        name: 'BDA Board Financial Commitment Guarantee',
        authority: 'Finance Department, GoK',
        submittedDate: '2026-05-18',
        statutorySlaDays: 45,
        status: 'pending',
        remarks: 'Awaiting Cabinet note on bond floatation'
      },
      {
        id: 'APP-05',
        name: 'Lake Buffer Zone NoC (KSPCB & BDA)',
        authority: 'Karnataka State Pollution Control Board',
        submittedDate: '2026-08-01',
        statutorySlaDays: 30,
        status: 'query_raised',
        remarks: 'Ecological buffer mitigation report requested'
      }
    ],
    legalDisputes: [
      {
        suitNumber: 'WP No. 11048/2026',
        court: 'High Court of Karnataka, Principal Bench',
        petitioner: 'Bangalore Commercial Landowners Association',
        stayGranted: false,
        filingDate: '2026-07-02',
        nextHearingDate: '2026-11-12',
        subject: 'Challenge against inclusion of developed IT ancillary corridors',
        status: 'Active'
      }
    ],
    rrStatus: 'Survey Pending',
    assignedOfficer: {
      name: 'Shri R. Chandrashekar, KAS',
      designation: 'Special Land Acquisition Officer (BDA PRR)',
      contact: '+91 94481 22390'
    },
    nextMilestoneName: 'Section 19: Declaration of Acquisition Notification',
    nextMilestoneDueDate: '2026-11-19',
    predictedDelayRisk: 78,
    riskLevel: 'High',
    riskDrivers: [
      {
        factor: 'Statutory 12-Month Sec 19 Expiry Approaching',
        impactScore: 40,
        category: 'Litigation',
        explanation: 'Section 19 must be gazetted within 12 months of Sec 11 notification or proceedings lapse.'
      },
      {
        factor: 'Budget Allocation Unreleased by Finance Dept',
        impactScore: 26,
        category: 'Compensation',
        explanation: 'Escrow account requires ₹250 Cr deposit before declaration release.'
      },
      {
        factor: 'Lake Buffer Clearance Query',
        impactScore: 12,
        category: 'Approvals',
        explanation: 'Environmental committee queries pending review.'
      }
    ],
    suggestedActions: [
      'Issue emergency submission to District Collector for Special Cabinet authorization before Sec 11 deadline lapses.',
      'Submit revised geo-spatial alignment map excluding 2.1-acre wetland periphery to KSPCB within 4 days.',
      'Publish Section 15 objection disposal orders without delay.'
    ],
    predictionTimestamp: '2026-10-26 09:45 IST',
    modelVersion: 'XGBoost-RFCTLARR-v2.4 (SHAP Grounded)',
    dataCompletenessScore: 91,
    documents: [
      { id: 'DOC-6', title: 'Preliminary Notification Sec 11 BDA', type: 'Gazette', uploadedAt: '2025-11-20', status: 'verified', fileSize: '4.1 MB' },
      { id: 'DOC-7', title: 'Objection Hearing Minutes Sec 15', type: 'Proceedings', uploadedAt: '2026-04-12', status: 'verified', fileSize: '6.2 MB' }
    ],
    notes: 'Critical statutory cutoff on 2026-11-19. If Section 19 declaration is not issued, acquisition lapses under Section 19(7).',
    createdAt: '2025-11-20',
    updatedAt: '2026-10-26'
  },
  {
    id: 'LA-2026-NGP-004',
    projectName: 'Nagpur Multi-Modal Logistics Park (MIHAN SEZ Spur)',
    projectCategory: 'Industrial Corridors',
    state: 'Maharashtra',
    district: 'Nagpur',
    taluk: 'Hingna',
    village: 'Mandwa & Kanholibara',
    surveyNumbers: ['56/1', '58/2', '60/4A', '61'],
    landAreaAcres: 145.00,
    landType: 'Agricultural',
    currentStage: 'Section21_NoticeInterested',
    notificationDate: '2025-06-05',
    expectedPossessionDate: '2027-02-28',
    totalEstimatedCompensation: 220000000, // ₹22 Cr
    compensationDisbursed: 65000000,
    compensationStatus: 'In Progress',
    pendingApprovals: [
      {
        id: 'APP-06',
        name: 'Irrigation Canal Relocation NoC',
        authority: 'Vidarbha Irrigation Development Corporation',
        submittedDate: '2026-08-10',
        statutorySlaDays: 30,
        status: 'pending',
        remarks: 'Technical hydraulic design under scrutiny'
      }
    ],
    legalDisputes: [],
    rrStatus: 'Compensation In Progress',
    assignedOfficer: {
      name: 'Dr. Suresh Patil',
      designation: 'Sub-Divisional Officer & SLAO Hingna',
      contact: '+91 98224 55102'
    },
    nextMilestoneName: 'Section 23: Valuation & Award Determination',
    nextMilestoneDueDate: '2026-12-10',
    predictedDelayRisk: 54,
    riskLevel: 'Medium',
    riskDrivers: [
      {
        factor: 'Canal Crossing Alignment NOC Pending',
        impactScore: 26,
        category: 'Approvals',
        explanation: 'Water resource department canal alignment crossing approval delayed.'
      },
      {
        factor: 'Tree & Fruit Crop Valuation Estimation',
        impactScore: 18,
        category: 'Compensation',
        explanation: 'Horticulture Department assessment for 1,200 orange trees in progress.'
      },
      {
        factor: 'Gram Panchayat Common Land Verification',
        impactScore: 10,
        category: 'Documentation',
        explanation: 'Gairan (grazing land) record mutation pending with Tahsil office.'
      }
    ],
    suggestedActions: [
      'Depute District Horticulture Officer for joint spot valuation in Mandwa village by Friday.',
      'Convene joint review with Superintending Engineer, VIDC for canal NOC sign-off.'
    ],
    predictionTimestamp: '2026-10-24 16:00 IST',
    modelVersion: 'XGBoost-RFCTLARR-v2.4 (SHAP Grounded)',
    dataCompletenessScore: 89,
    documents: [
      { id: 'DOC-8', title: 'Sec 19 Declaration Notification', type: 'Gazette', uploadedAt: '2026-03-15', status: 'verified', fileSize: '2.9 MB' }
    ],
    notes: 'R&R package approved by State Commissioner R&R with ₹4.5 Cr provision for displaced agricultural laborers.',
    createdAt: '2025-06-05',
    updatedAt: '2026-10-24'
  },
  {
    id: 'LA-2026-KCH-005',
    projectName: 'Chennai-Bengaluru Industrial Corridor (Sriperumbudur Node)',
    projectCategory: 'Industrial Corridors',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    taluk: 'Sriperumbudur',
    village: 'Mambakkam',
    surveyNumbers: ['244/1', '245/2', '246/1C'],
    landAreaAcres: 64.20,
    landType: 'Non-Agricultural/Commercial',
    currentStage: 'Section38_TakingPossession',
    notificationDate: '2024-10-15',
    expectedPossessionDate: '2026-11-30',
    totalEstimatedCompensation: 410000000, // ₹41 Cr
    compensationDisbursed: 395000000,
    compensationStatus: 'Fully Disbursed',
    pendingApprovals: [],
    legalDisputes: [],
    rrStatus: 'Scheme Approved',
    assignedOfficer: {
      name: 'Tmt. S. Meenakshi, DRO',
      designation: 'Special District Revenue Officer (LA - SIPCOT)',
      contact: '+91 94440 18274'
    },
    nextMilestoneName: 'Section 38: Final Physical Possession & Panchnama',
    nextMilestoneDueDate: '2026-11-25',
    predictedDelayRisk: 12,
    riskLevel: 'Low',
    riskDrivers: [
      {
        factor: 'Minor Encroachment Clearance Protocol',
        impactScore: 8,
        category: 'Surveys',
        explanation: 'Three commercial sheds require police bandobast for peaceful handover.'
      },
      {
        factor: 'Electricity Pole Utility Shifting',
        impactScore: 4,
        category: 'Approvals',
        explanation: 'TANGEDCO estimation paid; line shifting underway.'
      }
    ],
    suggestedActions: [
      'Issue police protection requisition letter to Superintendent of Police, Kanchipuram for possession day.',
      'Notify SIPCOT project engineers to take immediate perimeter boundary fencing.'
    ],
    predictionTimestamp: '2026-10-26 11:20 IST',
    modelVersion: 'XGBoost-RFCTLARR-v2.4 (SHAP Grounded)',
    dataCompletenessScore: 99,
    documents: [
      { id: 'DOC-9', title: 'Award Declaration Order Sec 30', type: 'Award', uploadedAt: '2026-06-20', status: 'verified', fileSize: '4.8 MB' },
      { id: 'DOC-10', title: '100% Compensation Disbursement Ledger', type: 'Finance', uploadedAt: '2026-09-30', status: 'verified', fileSize: '1.9 MB' }
    ],
    notes: 'Award finalized without litigation. Excellent public consultation record.',
    createdAt: '2024-10-15',
    updatedAt: '2026-10-26'
  },
  {
    id: 'LA-2026-AMD-006',
    projectName: 'Ahmedabad Outer Ring Road Expansion & Flyover Links',
    projectCategory: 'Highways & Expressways',
    state: 'Gujarat',
    district: 'Ahmedabad',
    taluk: 'Daskroi',
    village: 'Sanand Rural',
    surveyNumbers: ['310/P', '312/1', '314/2'],
    landAreaAcres: 38.40,
    landType: 'Agricultural',
    currentStage: 'Section11_PrelimNotice',
    notificationDate: '2026-02-15',
    expectedPossessionDate: '2027-11-30',
    totalEstimatedCompensation: 160000000,
    compensationDisbursed: 0,
    compensationStatus: 'Not Started',
    pendingApprovals: [
      {
        id: 'APP-07',
        name: 'Social Impact Assessment (SIA) Expert Group Sanction',
        authority: 'State SIA Directorate',
        submittedDate: '2026-08-14',
        statutorySlaDays: 60,
        status: 'pending',
        remarks: 'Report public hearing held; final appraisal pending'
      }
    ],
    legalDisputes: [],
    rrStatus: 'Survey Pending',
    assignedOfficer: {
      name: 'Shri Hasmukhbhai Patel, GAS',
      designation: 'Special Land Acquisition Officer (AUDA)',
      contact: '+91 98250 33910'
    },
    nextMilestoneName: 'Section 15: Public Hearing & Objection Report Submission',
    nextMilestoneDueDate: '2026-12-05',
    predictedDelayRisk: 42,
    riskLevel: 'Medium',
    riskDrivers: [
      {
        factor: 'SIA Expert Recommendation Deliberation',
        impactScore: 24,
        category: 'Approvals',
        explanation: 'Expert group requested clarification on alternate bypass alignment feasibility.'
      },
      {
        factor: 'GIDC Industrial Corridor Zone Interlocking',
        impactScore: 18,
        category: 'Surveys',
        explanation: 'Overlap with pre-existing notified industrial plot boundaries.'
      }
    ],
    suggestedActions: [
      'Organize video conference between AUDA urban planner and SIA directorate.',
      'Submit drone orthophoto survey map clarifying non-encroachment on factory premises.'
    ],
    predictionTimestamp: '2026-10-25 15:40 IST',
    modelVersion: 'XGBoost-RFCTLARR-v2.4 (SHAP Grounded)',
    dataCompletenessScore: 86,
    documents: [
      { id: 'DOC-11', title: 'SIA Draft Report AUDA', type: 'SIA Report', uploadedAt: '2026-07-28', status: 'verified', fileSize: '14.2 MB' }
    ],
    notes: 'AUDA funding guaranteed under State Urban Development Mission.',
    createdAt: '2026-02-15',
    updatedAt: '2026-10-25'
  },
  {
    id: 'LA-2026-PUN-007',
    projectName: 'Purandar International Airport Link Road Corridor',
    projectCategory: 'Highways & Expressways',
    state: 'Maharashtra',
    district: 'Pune',
    taluk: 'Purandar',
    village: 'Rajewadi & Pargaon',
    surveyNumbers: ['89/1', '90/2', '91/3A', '92/1', '94/4'],
    landAreaAcres: 165.80,
    landType: 'Agricultural',
    currentStage: 'Section11_PrelimNotice',
    notificationDate: '2026-01-20',
    expectedPossessionDate: '2027-12-31',
    totalEstimatedCompensation: 520000000,
    compensationDisbursed: 0,
    compensationStatus: 'Not Started',
    pendingApprovals: [
      {
        id: 'APP-08',
        name: 'Ministry of Defence NoC (Airforce Station Lohagaon)',
        authority: 'Ministry of Defence, GoI',
        submittedDate: '2026-03-10',
        statutorySlaDays: 90,
        status: 'pending',
        remarks: 'Obstacle Limitation Surfaces (OLS) survey under review at Air HQ'
      },
      {
        id: 'APP-09',
        name: 'Gram Sabha Consent Under PESA Act',
        authority: 'District Collector & Panchayat Department',
        submittedDate: '2026-07-22',
        statutorySlaDays: 45,
        status: 'query_raised',
        remarks: 'Gram sabha resolution deferred due to local farmer delegations'
      }
    ],
    legalDisputes: [
      {
        suitNumber: 'PIL No. 34/2026',
        court: 'High Court of Judicature at Bombay',
        petitioner: 'Purandar Shetkari Sangharsh Samiti',
        stayGranted: false,
        filingDate: '2026-05-14',
        nextHearingDate: '2026-11-26',
        subject: 'Writ against non-inclusion of alternate dry-land site in SIA study',
        status: 'Active'
      }
    ],
    rrStatus: 'R&R Disputed',
    assignedOfficer: {
      name: 'Shri Vikram S. Jadhav',
      designation: 'Special Land Acquisition Officer No. 2, Pune',
      contact: '+91 94220 89211'
    },
    nextMilestoneName: 'Section 15: Hearing of Objections Completion',
    nextMilestoneDueDate: '2026-11-10',
    predictedDelayRisk: 89,
    riskLevel: 'High',
    riskDrivers: [
      {
        factor: 'Gram Sabha Resistance & Consultation Impasse',
        impactScore: 45,
        category: 'R&R',
        explanation: 'Local village farmers demanding revised compensation package of 5x guideline rate.'
      },
      {
        factor: 'Defence Aviation Safety NoC Delay',
        impactScore: 28,
        category: 'Approvals',
        explanation: 'Clearance from MoD pending beyond 90 days.'
      },
      {
        factor: 'Public Interest Litigation Active',
        impactScore: 16,
        category: 'Litigation',
        explanation: 'PIL pending before division bench with demand for stay on notice publication.'
      }
    ],
    suggestedActions: [
      'Convene District Collector Special Grievance Redressal Camp with farmer representatives and local MLA.',
      'Send demi-official (D.O.) letter from Chief Secretary to Defence Secretary for fast-track OLS clearance.',
      'Prepare detailed comparative statement explaining why alternate airport site was non-viable on aeronautical grounds.'
    ],
    predictionTimestamp: '2026-10-26 12:00 IST',
    modelVersion: 'XGBoost-RFCTLARR-v2.4 (SHAP Grounded)',
    dataCompletenessScore: 88,
    documents: [
      { id: 'DOC-12', title: 'Sec 11 Preliminary Notification Gazette', type: 'Gazette', uploadedAt: '2026-01-20', status: 'verified', fileSize: '5.6 MB' },
      { id: 'DOC-13', title: 'Farmer Representation Charter', type: 'Grievance', uploadedAt: '2026-08-10', status: 'verified', fileSize: '1.4 MB' }
    ],
    notes: 'Sensitive political and agrarian context. Strict adherence to Section 15 procedural fairness required.',
    createdAt: '2026-01-20',
    updatedAt: '2026-10-26'
  },
  {
    id: 'LA-2026-NGP-008',
    projectName: 'Nagpur-Bhandara 6-Lane Access Controlled Highway',
    projectCategory: 'Highways & Expressways',
    state: 'Maharashtra',
    district: 'Nagpur',
    taluk: 'Kuhi',
    village: 'Ambhora & Chacher',
    surveyNumbers: ['18/2', '19/1', '22/3B'],
    landAreaAcres: 52.30,
    landType: 'Agricultural',
    currentStage: 'Completed',
    notificationDate: '2024-03-12',
    expectedPossessionDate: '2026-05-30',
    awardDate: '2025-10-18',
    totalEstimatedCompensation: 195000000,
    compensationDisbursed: 195000000,
    compensationStatus: 'Fully Disbursed',
    pendingApprovals: [],
    legalDisputes: [],
    rrStatus: 'Scheme Approved',
    assignedOfficer: {
      name: 'Dr. Suresh Patil',
      designation: 'Sub-Divisional Officer & SLAO',
      contact: '+91 98224 55102'
    },
    nextMilestoneName: 'Final Possession Handed Over & Mutation Done',
    nextMilestoneDueDate: '2026-06-15',
    predictedDelayRisk: 5,
    riskLevel: 'Low',
    riskDrivers: [],
    suggestedActions: [
      'Post-acquisition monitoring: verify revenue records 7/12 extract mutation in favor of NHAI.'
    ],
    predictionTimestamp: '2026-06-10 10:00 IST',
    modelVersion: 'XGBoost-RFCTLARR-v2.4 (SHAP Grounded)',
    dataCompletenessScore: 100,
    documents: [
      { id: 'DOC-14', title: 'Final Possession Receipt Form 11', type: 'Possession', uploadedAt: '2026-05-30', status: 'verified', fileSize: '2.1 MB' },
      { id: 'DOC-15', title: 'Award Declaration Sec 30', type: 'Award', uploadedAt: '2025-10-18', status: 'verified', fileSize: '3.7 MB' }
    ],
    notes: 'Successfully completed on schedule with zero litigation.',
    createdAt: '2024-03-12',
    updatedAt: '2026-06-15'
  }
];

export const INITIAL_MILESTONES: Record<string, Milestone[]> = {
  'LA-2026-PUN-001': [
    {
      id: 'MS-101',
      caseId: 'LA-2026-PUN-001',
      stage: 'SIA_Section4',
      name: 'Social Impact Assessment Study & Public Hearing',
      statutorySection: 'Section 4(1) & 5',
      statutoryDaysSLA: 180,
      deadlineDate: '2025-06-15',
      completedDate: '2025-06-10',
      status: 'completed',
      remarks: 'SIA approved by Multi-disciplinary Expert Group',
      officerAssigned: 'Tahsildar Haveli'
    },
    {
      id: 'MS-102',
      caseId: 'LA-2026-PUN-001',
      stage: 'Section11_PrelimNotice',
      name: 'Publication of Preliminary Notification',
      statutorySection: 'Section 11(1)',
      statutoryDaysSLA: 60,
      deadlineDate: '2025-08-30',
      completedDate: '2025-08-14',
      status: 'completed',
      remarks: 'Published in State Gazette & two local Marathi dailies',
      officerAssigned: 'SLAO Railways'
    },
    {
      id: 'MS-103',
      caseId: 'LA-2026-PUN-001',
      stage: 'Section15_Hearing',
      name: 'Hearing of Objections & District Collector Report',
      statutorySection: 'Section 15(2)',
      statutoryDaysSLA: 60,
      deadlineDate: '2025-11-15',
      completedDate: '2025-11-28',
      status: 'completed',
      remarks: '12 hearings conducted. 48 objections addressed with compensation advice.',
      officerAssigned: 'District Collector Pune',
      delayDays: 13
    },
    {
      id: 'MS-104',
      caseId: 'LA-2026-PUN-001',
      stage: 'Section19_Declaration',
      name: 'Publication of Declaration of Acquisition',
      statutorySection: 'Section 19(1)',
      statutoryDaysSLA: 365,
      deadlineDate: '2026-08-14',
      completedDate: '2026-08-02',
      status: 'completed',
      remarks: 'Declaration published within statutory 12-month limit under Sec 19(7)',
      officerAssigned: 'State Revenue Department'
    },
    {
      id: 'MS-105',
      caseId: 'LA-2026-PUN-001',
      stage: 'Section21_NoticeInterested',
      name: 'Service of Notice to Persons Interested (Individual Notices)',
      statutorySection: 'Section 21(1)',
      statutoryDaysSLA: 60,
      deadlineDate: '2026-11-15',
      status: 'overdue',
      remarks: 'Delayed due to HC Stay order and boundary discrepancy. Immediate intervention required.',
      officerAssigned: 'Tahsildar Haveli',
      delayDays: 24
    },
    {
      id: 'MS-106',
      caseId: 'LA-2026-PUN-001',
      stage: 'Section23_AwardInquiry',
      name: 'Enquiry and Award Determination by Collector',
      statutorySection: 'Section 23 & 27',
      statutoryDaysSLA: 90,
      deadlineDate: '2027-01-31',
      status: 'pending',
      officerAssigned: 'SLAO Railways'
    },
    {
      id: 'MS-107',
      caseId: 'LA-2026-PUN-001',
      stage: 'Section30_AwardDeclaration',
      name: 'Final Award Pronouncement & Depositing in Escrow',
      statutorySection: 'Section 30',
      statutoryDaysSLA: 365,
      deadlineDate: '2027-08-02',
      status: 'pending',
      officerAssigned: 'District Collector Pune'
    },
    {
      id: 'MS-108',
      caseId: 'LA-2026-PUN-001',
      stage: 'Section38_TakingPossession',
      name: 'Taking Possession & Revenue Mutation (7/12 Update)',
      statutorySection: 'Section 38',
      statutoryDaysSLA: 60,
      deadlineDate: '2027-10-31',
      status: 'pending',
      officerAssigned: 'Tahsildar Haveli & SDO'
    }
  ]
};

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-2026-001',
    caseId: 'LA-2026-PUN-001',
    caseNumber: 'LA-2026-PUN-001',
    projectName: 'Pune-Nashik Semi High-Speed Rail Corridor',
    district: 'Pune',
    priority: 'critical',
    type: 'high_risk_prediction',
    title: 'High Delay Risk (86%) - Statutory Milestone at Imminent Risk',
    message: 'High Court interim stay (WP 4921/2026) and pending Stage-II Forest clearance threaten Section 21 notice compliance.',
    recommendedAction: 'Instruct Government Pleader to file counter-affidavit; convene PCCF coordination meet.',
    assignedOfficer: 'Shri Vikram S. Jadhav (SLAO)',
    dueDate: '2026-11-15',
    acknowledged: false,
    status: 'open'
  },
  {
    id: 'ALT-2026-002',
    caseId: 'LA-2026-BLR-003',
    caseNumber: 'LA-2026-BLR-003',
    projectName: 'Bengaluru Peripheral Ring Road (Phase 1)',
    district: 'Bengaluru Urban',
    priority: 'critical',
    type: 'milestone_overdue',
    title: 'Section 19 Declaration Cutoff: 24 Days Remaining',
    message: 'Under RFCTLARR Sec 19(7), declaration lapses if not gazetted by 2026-11-19. Escrow funds pending.',
    recommendedAction: 'Urgent submission to Chief Secretary for emergency fund deposit authorization.',
    assignedOfficer: 'Shri R. Chandrashekar, KAS',
    dueDate: '2026-11-19',
    acknowledged: false,
    status: 'open'
  },
  {
    id: 'ALT-2026-003',
    caseId: 'LA-2026-PUN-007',
    caseNumber: 'LA-2026-PUN-007',
    projectName: 'Purandar International Airport Link Road',
    district: 'Pune',
    priority: 'high',
    type: 'rr_dispute',
    title: 'Gram Sabha Consultation Deadlock in Rajewadi',
    message: 'Landowners resisting Section 15 objection disposal; demanding 5x compensation multiplier.',
    recommendedAction: 'Organize Collector-led public hearing camp with village panchayat representatives.',
    assignedOfficer: 'Shri Vikram S. Jadhav (SLAO)',
    dueDate: '2026-11-10',
    acknowledged: true,
    acknowledgedBy: 'Dr. Rajeshwar Deshmukh, IAS',
    acknowledgedAt: '2026-10-25 10:15 IST',
    status: 'investigating'
  },
  {
    id: 'ALT-2026-004',
    caseId: 'LA-2026-PUN-001',
    caseNumber: 'LA-2026-PUN-001',
    projectName: 'Pune-Nashik Semi High-Speed Rail Corridor',
    district: 'Pune',
    priority: 'high',
    type: 'pending_approval',
    title: 'MoEFCC Forest Diversion Stage-II Overdue by 48 Days',
    message: 'Statutory 60-day SLA for forest advisory recommendation exceeded.',
    recommendedAction: 'Collector Pune to issue D.O. letter to Principal Chief Conservator of Forests.',
    assignedOfficer: 'Dr. Rajeshwar Deshmukh, IAS',
    dueDate: '2026-10-31',
    acknowledged: false,
    status: 'open'
  },
  {
    id: 'ALT-2026-005',
    caseId: 'LA-2026-NGP-004',
    caseNumber: 'LA-2026-NGP-004',
    projectName: 'Nagpur Multi-Modal Logistics Park',
    district: 'Nagpur',
    priority: 'medium',
    type: 'compensation_bottleneck',
    title: 'Horticulture Assessment Pending for 1,200 Orange Trees',
    message: 'Award inquiry cannot be finalized without valuation from District Horticulture Officer.',
    recommendedAction: 'Direct DHO Nagpur to conduct spot verification within 5 working days.',
    assignedOfficer: 'Dr. Suresh Patil (SDO)',
    dueDate: '2026-12-01',
    acknowledged: true,
    acknowledgedBy: 'Dr. Suresh Patil',
    acknowledgedAt: '2026-10-24 18:00 IST',
    status: 'investigating'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-901',
    timestamp: '2026-10-26 14:32 IST',
    caseId: 'LA-2026-PUN-001',
    caseNumber: 'LA-2026-PUN-001',
    action: 'AI Risk Recalculation Triggered',
    details: 'Recalculated delay risk following update to pending court hearing date. Predicted risk adjusted to 86%.',
    performedBy: 'Automated ML Pipeline (XGBoost v2.4)',
    role: 'System',
    district: 'Pune',
    ipAddress: '10.24.1.88'
  },
  {
    id: 'LOG-902',
    timestamp: '2026-10-26 11:15 IST',
    caseId: 'LA-2026-KCH-005',
    caseNumber: 'LA-2026-KCH-005',
    action: 'Milestone Updated',
    details: 'Compensation Disbursement updated to 100% (₹39.5 Cr distributed across 84 khatedars).',
    performedBy: 'Tmt. S. Meenakshi, DRO',
    role: 'lao',
    district: 'Kanchipuram',
    ipAddress: '172.16.4.12'
  },
  {
    id: 'LOG-903',
    timestamp: '2026-10-25 16:40 IST',
    caseId: 'LA-2026-PUN-007',
    caseNumber: 'LA-2026-PUN-007',
    action: 'Alert Acknowledged',
    details: 'Collector acknowledged Gram Sabha deadlock alert; directed Tahsildar to prepare village brief.',
    performedBy: 'Dr. Rajeshwar Deshmukh, IAS',
    role: 'collector',
    district: 'Pune',
    ipAddress: '10.20.0.15'
  },
  {
    id: 'LOG-904',
    timestamp: '2026-10-25 10:20 IST',
    caseId: 'LA-2026-PUN-002',
    caseNumber: 'LA-2026-PUN-002',
    action: 'Approval Record Updated',
    details: 'MSRDC Administrative Sanction verified and attached with Govt Order Ref No. MSRDC/2026/891.',
    performedBy: 'Shri Vikram S. Jadhav',
    role: 'lao',
    district: 'Pune',
    ipAddress: '10.20.14.9'
  },
  {
    id: 'LOG-905',
    timestamp: '2026-10-24 15:10 IST',
    caseId: 'LA-2026-BLR-003',
    caseNumber: 'LA-2026-BLR-003',
    action: 'Legal Dispute Registered',
    details: 'Added WP No. 11048/2026 High Court petition filed by commercial landowners association.',
    performedBy: 'Shri R. Chandrashekar, KAS',
    role: 'lao',
    district: 'Bengaluru Urban',
    ipAddress: '192.168.10.5'
  }
];

export const INITIAL_SUMMARY: DashboardSummary = {
  totalActiveCases: 7,
  highRiskCases: 3,
  mediumRiskCases: 2,
  lowRiskCases: 2,
  milestonesDueSoon: 4,
  delayedCases: 3,
  immediateActionRequired: 3,
  completedAcquisitions: 1,
  totalCompensationAllocated: 2740000000, // ₹274 Cr
  totalCompensationDisbursed: 992000000, // ₹99.2 Cr
  stageDistribution: [
    { stage: 'Sec 4 SIA', count: 1, avgDelayDays: 12 },
    { stage: 'Sec 11 Notice', count: 2, avgDelayDays: 24 },
    { stage: 'Sec 15 Hearing', count: 1, avgDelayDays: 38 },
    { stage: 'Sec 19 Declaration', count: 1, avgDelayDays: 45 },
    { stage: 'Sec 21 Notice', count: 1, avgDelayDays: 28 },
    { stage: 'Sec 23 Valuation', count: 1, avgDelayDays: 15 },
    { stage: 'Sec 38 Possession', count: 1, avgDelayDays: 8 }
  ],
  delayTrends: [
    { month: 'May 2026', predictedHighRisk: 2, actualDelayed: 2 },
    { month: 'Jun 2026', predictedHighRisk: 3, actualDelayed: 2 },
    { month: 'Jul 2026', predictedHighRisk: 4, actualDelayed: 3 },
    { month: 'Aug 2026', predictedHighRisk: 3, actualDelayed: 3 },
    { month: 'Sep 2026', predictedHighRisk: 4, actualDelayed: 4 },
    { month: 'Oct 2026', predictedHighRisk: 3, actualDelayed: 3 }
  ],
  districtPerformance: [
    { district: 'Pune', totalCases: 3, highRiskCount: 2, complianceRate: 68 },
    { district: 'Bengaluru Urban', totalCases: 1, highRiskCount: 1, complianceRate: 62 },
    { district: 'Nagpur', totalCases: 2, highRiskCount: 0, complianceRate: 85 },
    { district: 'Kanchipuram', totalCases: 1, highRiskCount: 0, complianceRate: 94 },
    { district: 'Ahmedabad', totalCases: 1, highRiskCount: 0, complianceRate: 80 }
  ]
};

// Model evaluation stats for validated reports
export const MODEL_EVALUATION_METRICS = {
  modelName: 'LandGuard XGBoost Delay Classifier v2.4',
  algorithm: 'Gradient Boosted Decision Trees + TreeSHAP Explainability',
  trainingDatasetSize: '12,480 Statutory Land Acquisition Records (2014-2025)',
  validationMethod: '5-Fold Stratified Cross Validation',
  overallAccuracy: 88.4,
  precisionHighRisk: 86.2,
  recallHighRisk: 89.1,
  f1Score: 87.6,
  rocAuc: 0.932,
  confusionMatrix: {
    truePositive: 412,
    falsePositive: 66,
    trueNegative: 780,
    falseNegative: 51
  },
  statutoryDelayDistribution: [
    { range: '0 - 15 Days (Minor)', frequency: 32 },
    { range: '16 - 30 Days (Moderate)', frequency: 28 },
    { range: '31 - 60 Days (Severe)', frequency: 24 },
    { range: '60+ Days (Critical Lapsing Risk)', frequency: 16 }
  ],
  topGlobalFeatureImportance: [
    { feature: 'Court Stay / Litigation Status (Sec 15/19)', weight: 0.31 },
    { feature: 'Statutory 12-Month Countdown Proximity', weight: 0.24 },
    { feature: 'Inter-Departmental Approvals SLA Breach (Forest/Irrigation)', weight: 0.18 },
    { feature: 'Compensation Budget Escrow Deposit Status', weight: 0.14 },
    { feature: 'Gram Sabha / R&R Public Consultation Dispute Count', weight: 0.08 },
    { feature: 'DILR Cadastral Joint Measurement Discrepancies', weight: 0.05 }
  ]
};
