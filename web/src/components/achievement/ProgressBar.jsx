import React from 'react';
import { cn } from '@/lib/utils';

export function ProgressBar({ current = 0, total = 0, className }) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  const completed = total > 0 && current >= total;
  return (
    <div className={cn('w-full', className)}>
      <div className='relative h-7 w-full rounded-sm bg-gray-200 dark:bg-gray-700 overflow-hidden border border-white'>
        <div
          className={cn('absolute left-0 top-0 h-full transition-all duration-300', completed ? 'bg-green-600 dark:bg-green-500' : 'bg-blue-600 dark:bg-blue-500')}
          style={{ width: pct + '%' }}
        />
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-xs font-semibold text-gray-700 dark:text-gray-100 whitespace-nowrap'>
            {completed ? 'Completed' : `${current}/${total}`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
