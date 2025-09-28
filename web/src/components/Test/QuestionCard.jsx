import React from 'react';
import MCQOptions from './MCQOptions';

export default function QuestionCard({ question, index, answers, onAnswerChange }) {
  if (!question) return null;
  const qid = question.id ?? question.question_id;
  const answerValue = answers[qid] || '';
  return (
    <div className="w-full h-full max-w-4xl rounded-sm border-2 border-[#3a4554] bg-[#1b2027] p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-md font-semibold">Question {index + 1}</h2>
        <span className="text-sm px-2 py-1 rounded bg-slate-700 text-slate-300 uppercase tracking-wide">
          {(question.type ?? "").replaceAll('_', ' ')}
        </span>
      </div>
      <p className="text-white my-10 text-xl leading-relaxed whitespace-pre-line">
        {question.text}
      </p>

      {question.type === 'mcq' && (
        <MCQOptions
          questionId={qid}
          options={question.choices || []}
          selectedValue={answerValue}
          onChange={onAnswerChange}
        />
      )}

      {question.type === 'fill_in_blank' && (
        <div className="mt-2">
          <label className="block text-sm mb-2 text-slate-300" htmlFor={`fill-${qid}`}>
            Your Answer
          </label>
          <input
            id={`fill-${qid}`}
            type="text"
            value={answerValue}
            onChange={(e) => onAnswerChange(qid, e.target.value)}
            className="w-full px-4 py-3 rounded-sm bg-[#14181f] border-2 border-[#3a4554] focus:outline-none focus:border-emerald-500 text-slate-100"
          />
        </div>
      )}

      {question.type !== 'mcq' && question.type !== 'fill_in_blank' && (
        <div className="text-amber-400 mt-4 text-sm">
          Unsupported question type in attempt UI: {question.question_type}
        </div>
      )}
    </div>
  );
}
