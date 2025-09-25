import React from 'react';

export default function MCQOptions({ questionId, options = [], selectedValue, onChange }) {
  const optionCount = options.length;
  let optionGridCols = 'grid-cols-1';
  if (optionCount >= 2) optionGridCols = 'grid-cols-2';
  if (optionCount >= 4) optionGridCols = 'grid-cols-2 md:grid-cols-3';
  if (optionCount >= 6) optionGridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  if (!options.length) {
    return <div className="text-slate-400 italic">No options available for this question.</div>;
  }

  return (
    <div className={`grid ${optionGridCols} gap-4 items-stretch`}>
      {options.map((opt, idx) => {
        const selected = selectedValue === String(opt.id);
        return (
          <button
            type="button"
            key={opt.id}
            onClick={() => onChange(questionId, String(opt.id))}
            className={`text-center px-4 py-3 rounded-sm border-2 font-medium tracking-wide focus:outline-none transition-colors duration-150 ${selected ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-[#14181f] text-slate-200 border-[#3a4554] hover:bg-[#1f2630]'}`}
          >
            {/* <span className="mr-3 text-white">
              {String.fromCharCode(65 + idx)}.
            </span> */}
            <span>{opt.option_text}</span>
          </button>
        );
      })}
    </div>
  );
}
