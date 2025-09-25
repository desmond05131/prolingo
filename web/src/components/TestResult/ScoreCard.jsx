import React from 'react';

export default function ScoreCard({ correct, total, scorePercent }) {
  return (
    <div className="rounded-xl bg-[#151a21] border border-[#272f39] px-5 py-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wide">Score</span>
        <span className="text-xs font-mono text-slate-300">{correct}/{total}</span>
      </div>
      <div className="h-4 w-full rounded-full bg-white/10 border border-white/15 overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${scorePercent}%` }} />
      </div>
    </div>
  );
}
