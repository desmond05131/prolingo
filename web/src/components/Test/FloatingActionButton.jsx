import React from 'react';

export default function FloatingActionButton({
  onClick,
  onPrev,
  disabled,
  disabledPrev,
  isLast,
  isFirst,
}) {
  return (
    <>
      {onPrev && (
        <button
          onClick={onPrev}
          disabled={disabledPrev || isFirst}
          className="fixed bottom-6 left-6 h-16 w-16 rounded-4xl flex items-center justify-center text-white text-2xl font-bold border-4 active:translate-y-[3px] bg-indigo-600 border-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Previous Question"
          type="button"
        >
          ◀
        </button>
      )}

      <button
        onClick={onClick}
        disabled={disabled}
        className={`fixed bottom-6 right-6 h-16 w-16 rounded-4xl flex items-center justify-center text-white text-2xl font-bold border-4 active:translate-y-[3px] ${
          isLast ? 'bg-emerald-600 border-emerald-700' : 'bg-indigo-600 border-indigo-700'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
        title={isLast ? 'Submit Test' : 'Next Question'}
        type="button"
      >
        {isLast ? '✓' : '▶'}
      </button>
    </>
  );
}
