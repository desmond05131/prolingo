import React, { useMemo, useState, useCallback } from 'react';
import { MOCK_STREAK_CHECKINS } from '@/constants.js';

// Utility to build calendar matrix for current month
function buildMonthMatrix(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const weeks = [];
  let current = new Date(firstDay);
  // Start from Monday (ISO) - adjust index (Mon=1 .. Sun=7)
  const startOffset = (current.getDay() + 6) % 7; // 0-based index for Monday
  current.setDate(current.getDate() - startOffset);
  while (current <= lastDay || current.getDay() !== 1) { // until we've passed month and ended on Monday row start
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
    if (weeks.length > 6) break; // safety
  }
  return weeks;
}

export const StreakPopover = () => {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const [checkins, setCheckins] = useState(new Set(MOCK_STREAK_CHECKINS));

  // Helper: compute streak length ending today (or last checked day if today not checked yet?)
  const computeStreak = useCallback((set) => {
    let s = 0;
    for (let i = 0; ; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      if (set.has(iso)) s++; else break;
    }
    return s;
  }, []);

  const streak = computeStreak(checkins);
  const monthMatrix = useMemo(() => buildMonthMatrix(new Date()), []);
  const monthLabel = new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  // Find latest missed day before today (simple strategy: yesterday backward until find gap just before first contiguous block)
  const latestMissed = useMemo(() => {
    // If there is a gap inside the last 7 days, pick the most recent gap
    for (let i = 1; i < 14; i++) { // search up to 2 weeks back
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      if (!checkins.has(iso)) return iso;
    }
    return null;
  }, [checkins]);

  const handleRestore = () => {
    if (!latestMissed) return;
    setCheckins((prev) => new Set(prev).add(latestMissed));
  };

  return (
    <div className="flex flex-col gap-5 select-none p-1" aria-label="Streak calendar">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-wide uppercase text-neutral-200">{monthLabel}</span>
        </div>
        {latestMissed && (
          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={handleRestore}
              className="text-xs font-medium px-2 py-1 rounded-md bg-neutral-800/70 hover:bg-neutral-700/70 text-amber-300 border border-neutral-700 transition-colors"
            >
              Use Streak Saver
            </button>
            <div className="text-[10px] text-neutral-500">Streak saver left: 1</div>
          </div>
        )}

      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-medium tracking-wide text-neutral-400">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="flex flex-col gap-2">
        {monthMatrix.map((week, wi) => (
          <div className="grid grid-cols-7 gap-2" key={wi}>
            {week.map(day => {
              const iso = day.toISOString().slice(0,10);
              const inMonth = day.getMonth() === new Date().getMonth();
              const checked = checkins.has(iso);
              const isToday = iso === todayISO;
              return (
                <div
                  key={iso}
                  aria-label={`${iso}${checked ? ' checked in' : ''}`}
                  className={[
                    'relative h-9 w-9 rounded-md flex items-center justify-center text-[12px] font-semibold transition-colors',
                    inMonth ? 'text-neutral-300' : 'text-neutral-600',
                    checked ? 'bg-neutral-700/60 text-emerald-200' : 'bg-neutral-800/60 hover:bg-neutral-700/60',
                    isToday ? 'outline outline-amber-300' : ''
                  ].join(' ')}
                >
                  {day.getDate()}
                  {checked && (
                    <span className="absolute inset-0 flex items-center justify-center text-emerald-400 text-2xl pointer-events-none">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* <div className="mt-1 flex flex-wrap items-center gap-4 text-[11px] text-neutral-400">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-neutral-700/60 flex items-center justify-center text-[10px] text-emerald-400">✓</span> Checked</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-neutral-800/60 inline-block" /> Missed</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm outline outline-amber-300 inline-block" /> Today</div>
      </div> */}
    </div>
  );
};

export default StreakPopover;
