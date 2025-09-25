import React from 'react';

export default function PerformanceCard({ correct, incorrect, streak }) {
  return (
    <div className="sm:col-span-2 rounded-xl bg-[#151a21] border border-[#272f39] px-5 py-5 flex flex-col gap-4">
      <span className="text-sm font-semibold">Performance</span>
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <span>✅</span><span>{correct} correct</span>
        </div>
        <div className="flex items-center gap-2 text-rose-400 font-medium">
          <span>❌</span><span>{incorrect} incorrect</span>
        </div>
        <div className="flex items-center gap-2 text-orange-400 font-medium">
          <span>🔥</span><span>{streak} streak</span>
        </div>
      </div>
    </div>
  );
}
