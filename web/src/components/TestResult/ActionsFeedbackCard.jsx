import React from 'react';

export default function ActionsFeedbackCard({ onRetry, onExit, onFeedback }) {
  return (
    <div className="rounded-xl bg-[#151a21] border border-[#272f39] px-5 py-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onRetry}
          className="w-full py-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:translate-y-[2px] font-semibold tracking-wide text-white shadow"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={onExit}
          className="w-full py-4 rounded-lg bg-white text-black font-semibold tracking-wide hover:bg-slate-100 active:translate-y-[2px] shadow"
        >
          Exit
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium text-slate-300">Give us a feedback if you like to!</span>
        <button
          type="button"
          onClick={onFeedback}
          className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold active:translate-y-[2px] w-fit"
        >
          Go
        </button>
      </div>
    </div>
  );
}
