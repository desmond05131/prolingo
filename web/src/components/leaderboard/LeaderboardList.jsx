import React from 'react';
import { LeaderboardRow } from './LeaderboardRow';

/**
 * items: Array<{ id: string; rank: number | string; name: string; level: number; avatarUrl?: string }>
 */
export function LeaderboardList({ items }) {
  return (
    <div className="divide-y divide-slate-700/70 border border-slate-700/70 rounded-xl bg-slate-900/60 backdrop-blur-sm">
      {items.map(item => (
        <div key={item.id} className="px-4 md:px-6">
          <LeaderboardRow {...item} />
        </div>
      ))}
    </div>
  );
}
