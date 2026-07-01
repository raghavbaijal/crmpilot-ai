import { toast } from 'react-hot-toast';

/**
 * Standardized clipboard copy function with toast notification.
 */
export const copyToClipboard = async (text: string, successMessage = 'Copied to clipboard!'): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    toast.success(successMessage);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    toast.error('Failed to copy to clipboard.');
    return false;
  }
};

/**
 * Formats a currency amount to USD format.
 */
export const formatCurrency = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  if (isNaN(num)) return typeof value === 'string' ? value : 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Formats ISO date string to readable format.
 */
export const formatIsoDate = (value: string): string => {
  if (!value) return 'N/A';
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return value;
  }
};

/**
 * Returns Tailwind css color classes based on the risk score (0-100).
 */
export const getRiskColorClass = (score: number): { text: string; bg: string; border: string; label: string } => {
  if (score >= 70) {
    return {
      text: 'text-red-700',
      bg: 'bg-red-50/80',
      border: 'border-red-100/60',
      label: 'High Risk',
    };
  }
  if (score >= 40) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50/80',
      border: 'border-amber-100/60',
      label: 'Medium Risk',
    };
  }
  return {
    text: 'text-emerald-700',
    bg: 'bg-emerald-50/80',
    border: 'border-emerald-100/60',
    label: 'Low Risk',
  };
};

/**
 * Returns style mapping for lead classification badge.
 */
export const getClassificationBadgeStyle = (classification: 'HOT' | 'WARM' | 'COLD'): string => {
  switch (classification) {
    case 'HOT':
      return 'bg-red-50 text-red-700 border-red-100/60';
    case 'WARM':
      return 'bg-amber-50 text-amber-700 border-amber-100/60';
    case 'COLD':
      return 'bg-slate-50 text-slate-600 border-slate-100/60';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-100/60';
  }
};
