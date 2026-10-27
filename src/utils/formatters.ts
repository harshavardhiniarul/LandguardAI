import { AcquisitionStage } from '../types';

/**
 * Format currency into Indian Rupees (INR) with standard Lakh / Crore notations
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';

  if (compact) {
    if (amount >= 10000000) {
      const cr = amount / 10000000;
      return `₹${cr.toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      const lakh = amount / 100000;
      return `₹${lakh.toFixed(2)} L`;
    }
  }

  // Indian number comma grouping (e.g. 12,34,567)
  const parts = Math.round(amount).toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `₹${formatted}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function getStageLabel(stage: AcquisitionStage): string {
  switch (stage) {
    case 'SIA_Section4':
      return 'Sec 4: SIA & Preliminary Study';
    case 'Section11_PrelimNotice':
      return 'Sec 11: Preliminary Notification';
    case 'Section15_Hearing':
      return 'Sec 15: Hearing of Objections';
    case 'Section19_Declaration':
      return 'Sec 19: Declaration of Acquisition';
    case 'Section21_NoticeInterested':
      return 'Sec 21: Notice to Interested Persons';
    case 'Section23_AwardInquiry':
      return 'Sec 23: Award Inquiry & Valuation';
    case 'Section30_AwardDeclaration':
      return 'Sec 30: Award Declaration';
    case 'Section38_TakingPossession':
      return 'Sec 38: Taking Possession';
    case 'Completed':
      return 'Acquisition Completed';
    default:
      return stage;
  }
}

export function getStageBadgeColor(stage: AcquisitionStage): { bg: string; text: string; border: string } {
  switch (stage) {
    case 'Completed':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'Section38_TakingPossession':
    case 'Section30_AwardDeclaration':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'Section23_AwardInquiry':
    case 'Section21_NoticeInterested':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    case 'Section19_Declaration':
    case 'Section15_Hearing':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export function getRiskColorClass(level: 'High' | 'Medium' | 'Low'): {
  badge: string;
  pillBg: string;
  text: string;
  barColor: string;
} {
  switch (level) {
    case 'High':
      return {
        badge: 'bg-red-50 text-red-700 border border-red-200',
        pillBg: 'bg-red-500',
        text: 'text-red-700',
        barColor: '#ef4444'
      };
    case 'Medium':
      return {
        badge: 'bg-amber-50 text-amber-700 border border-amber-200',
        pillBg: 'bg-amber-500',
        text: 'text-amber-700',
        barColor: '#f59e0b'
      };
    case 'Low':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        pillBg: 'bg-emerald-500',
        text: 'text-emerald-700',
        barColor: '#10b981'
      };
  }
}
