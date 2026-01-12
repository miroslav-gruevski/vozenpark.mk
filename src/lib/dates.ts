import { differenceInDays, format, parseISO, isValid } from 'date-fns';
import type { ExpiryStatus } from '@/types';

export function getDaysUntil(date: Date | string): number {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return differenceInDays(targetDate, today);
}

export function getExpiryStatus(date: Date | string): ExpiryStatus {
  const daysUntil = getDaysUntil(date);
  
  if (daysUntil <= 0) return 'expired';
  if (daysUntil <= 7) return 'urgent';
  if (daysUntil <= 30) return 'soon';
  return 'ok';
}

export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(targetDate)) return 'Invalid date';
  return format(targetDate, formatStr);
}

export function formatDateForInput(date: Date | string): string {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(targetDate)) return '';
  return format(targetDate, 'yyyy-MM-dd');
}

export function getStatusColor(status: ExpiryStatus): string {
  switch (status) {
    case 'expired':
      return 'bg-red-500';
    case 'urgent':
      return 'bg-red-500';
    case 'soon':
      return 'bg-amber-500';
    case 'ok':
      return 'bg-emerald-500';
    default:
      return 'bg-gray-500';
  }
}

export function getStatusBgColor(status: ExpiryStatus): string {
  switch (status) {
    case 'expired':
      return 'bg-red-500/10 border-red-500/30';
    case 'urgent':
      return 'bg-red-500/10 border-red-500/30';
    case 'soon':
      return 'bg-amber-500/10 border-amber-500/30';
    case 'ok':
      return 'bg-emerald-500/10 border-emerald-500/30';
    default:
      return 'bg-gray-500/10 border-gray-500/30';
  }
}

export function getStatusTextColor(status: ExpiryStatus): string {
  switch (status) {
    case 'expired':
      return 'text-red-400';
    case 'urgent':
      return 'text-red-400';
    case 'soon':
      return 'text-amber-400';
    case 'ok':
      return 'text-emerald-400';
    default:
      return 'text-gray-400';
  }
}

export function getMinExpiryStatus(
  regExpiry: Date,
  insExpiry: Date,
  inspExpiry: Date
): { type: 'registration' | 'insurance' | 'inspection'; date: Date; daysUntil: number; status: ExpiryStatus } {
  const expiries = [
    { type: 'registration' as const, date: regExpiry, daysUntil: getDaysUntil(regExpiry) },
    { type: 'insurance' as const, date: insExpiry, daysUntil: getDaysUntil(insExpiry) },
    { type: 'inspection' as const, date: inspExpiry, daysUntil: getDaysUntil(inspExpiry) },
  ];

  const minExpiry = expiries.reduce((min, curr) => 
    curr.daysUntil < min.daysUntil ? curr : min
  );

  return {
    ...minExpiry,
    status: getExpiryStatus(minExpiry.date),
  };
}
