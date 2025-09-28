import * as React from 'react';
import { cn } from '@/lib/utils';

const STATUS_STYLES = {
  active: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/40',
  canceled: 'bg-neutral-600/20 text-neutral-300 border-neutral-600/40',
  past_due: 'bg-amber-600/20 text-amber-300 border-amber-600/40',
  expired: 'bg-neutral-600/20 text-neutral-300 border-neutral-600/40',
  pending_payment: 'bg-amber-600/20 text-amber-300 border-amber-600/40',
};

export function StatusBadge({ status, className }) {
  if (!status) return null;
  const key = String(status).toLowerCase().replace(/\s+/g, '_');
  const style = STATUS_STYLES[key] || 'bg-neutral-700/30 text-neutral-200 border-neutral-700';
  return (
    <span className={cn('inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium capitalize tracking-wide', style, className)}>
      {String(status)}
    </span>
  );
}
