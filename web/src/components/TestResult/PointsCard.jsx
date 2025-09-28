import React from 'react';

export default function PointsCard({ points, elapsedSeconds, formatTime }) {
  return (
    <div className="rounded-xl bg-[#151a21] border border-[#272f39] px-5 py-5 flex items-center gap-5">
      <div className="h-14 w-14 rounded-xl bg-primary-600/25 border border-primary-500/40 flex items-center justify-center">
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='h-7 w-7 text-primary-300'>
          <polygon points='12 2 15 10 23 10 17 14 19 22 12 18 5 22 7 14 1 10 9 10 12 2' />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">XP Gained</span>
        <span className="text-xl font-bold text-primary-400 leading-tight">{points} XP</span>
        <span className="text-xs text-slate-400 mt-1">Time: {formatTime(elapsedSeconds)}</span>
      </div>
    </div>
  );
}
