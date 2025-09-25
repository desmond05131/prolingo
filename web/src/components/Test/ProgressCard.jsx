import React from 'react';

export default function ProgressCard({ answered, total }) {
  const percent = total > 0 ? (answered / total) * 100 : 0;
  return (
    <div className="px-4 py-3 rounded-sm bg-[#1d232c] w-60 select-none" aria-label="Progress">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold tracking-wide text-white uppercase">
          Progress
        </span>
        <span className="text-xs font-bold text-emerald-400">
          {answered}/{total}
        </span>
      </div>
      <div className="h-4 border-2 border-[#3a4554] bg-[#14181f] flex" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered}>
        <div className="bg-emerald-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
