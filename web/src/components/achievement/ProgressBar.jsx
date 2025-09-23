import React from 'react';
import { cn } from '@/lib/utils';

export function ProgressBar({ current = 0, total = 0, className }) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div className={cn('w-full space-y-1', className)}>
      <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden'>
        <div
          className='h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300'
          style={{ width: pct + '%' }}
        />
      </div>
      <div className='text-xs font-medium text-gray-600 dark:text-gray-300'>{current}/{total}</div>
    </div>
  );
}

export default ProgressBar;
