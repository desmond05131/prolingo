import React from 'react';

function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TimerCard({ elapsedSeconds }) {
  return (
    <div className="px-4 py-3 rounded-sm bg-[#1d232c] min-w-[150px] flex items-center gap-3 select-none" aria-label="Timer">
      <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#14181f] border-2 border-[#3a4554] text-emerald-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 16 14" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
          Time
        </span>
        <span className="font-mono text-lg leading-none pt-1 text-slate-100">
          {formatTime(elapsedSeconds)}
        </span>
      </div>
    </div>
  );
}
