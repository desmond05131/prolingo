import React from 'react';

export default function ExitButton({ onExit, remainingUnanswered, disabled }) {
  return (
    <button
      onClick={onExit}
      disabled={disabled}
      className="h-11 w-11 flex items-center justify-center rounded-sm bg-[#1d232c] border-2 border-[#3a4554] hover:bg-[#242c36] active:translate-y-[2px] text-2xl font-bold text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
      aria-label="Exit test"
      title={remainingUnanswered > 0 ? `${remainingUnanswered} unanswered` : 'Exit test'}
      type="button"
    >
      ×
    </button>
  );
}
