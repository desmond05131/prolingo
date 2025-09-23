import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Header Banner for Achievement page
 * Props:
 *  - title: string
 *  - subtitle: string
 */
export function AchievementHeader({ title, subtitle, className }) {
  return (
    <div className={cn('w-full rounded-xl bg-background text-white px-6 py-10 md:py-14 relative overflow-hidden', className)}>
      {/* <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_30%_30%,white,transparent_70%)]" /> */}
      <div className="relative max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg md:text-xl text-white max-w-2xl">{subtitle}</p>
      </div>
    </div>
  );
}

export default AchievementHeader;
