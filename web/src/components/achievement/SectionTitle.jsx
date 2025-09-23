import React from 'react';
import { cn } from '@/lib/utils';

export function SectionTitle({ text, className }) {
  return (
    <h2 className={cn('text-xl md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100', className)}>
      {text}
    </h2>
  );
}

export default SectionTitle;
