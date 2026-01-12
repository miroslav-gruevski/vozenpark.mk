'use client';

import { getDaysUntil } from '@/lib/dates';
import type { ExpiryStatus, Language } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface StatusBadgeProps {
  status: ExpiryStatus;
  daysUntil?: number;
  language: Language;
  showDays?: boolean;
}

export function StatusBadge({ status, daysUntil, language, showDays = true }: StatusBadgeProps) {
  const t = getTranslations(language);

  const getStatusStyles = () => {
    switch (status) {
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'soon':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'ok':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'expired':
        return t.status.expired;
      case 'urgent':
        return t.status.urgent;
      case 'soon':
        return t.status.dueSoon;
      case 'ok':
        return t.status.ok;
      default:
        return '';
    }
  };

  const getDaysText = () => {
    if (daysUntil === undefined) return '';
    if (daysUntil <= 0) return t.common.expired;
    if (daysUntil === 1) return `1 ${t.common.day}`;
    return `${daysUntil} ${t.common.days}`;
  };

  return (
    <div className="flex items-center gap-2">
      <span 
        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusStyles()}`}
      >
        {getStatusLabel()}
      </span>
      {showDays && daysUntil !== undefined && (
        <span className="text-xs text-slate-500">
          {getDaysText()}
        </span>
      )}
    </div>
  );
}

interface DateStatusBadgeProps {
  date: Date | string;
  language: Language;
}

export function DateStatusBadge({ date, language }: DateStatusBadgeProps) {
  const daysUntil = getDaysUntil(date);
  const status: ExpiryStatus = 
    daysUntil <= 0 ? 'expired' :
    daysUntil <= 7 ? 'urgent' :
    daysUntil <= 30 ? 'soon' : 'ok';

  return <StatusBadge status={status} daysUntil={daysUntil} language={language} />;
}
