import React from 'react';

/**
 * tabs: Array<{ id: string; label: string }>
 * activeTabId: string
 * onTabChange: (id: string) => void
 */
export function LeaderboardTabs({ tabs, activeTabId, onTabChange }) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-[#0f172a] p-1 rounded-full border border-slate-600/60">
        {tabs.map((t) => {
          const active = t.id === activeTabId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={[
                'px-5 py-2 rounded-full text-sm font-semibold transition-colors',
                active
                  ? 'bg-primary text-black shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
