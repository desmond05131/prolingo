import React from 'react';
import MCQOptions from './MCQOptions';

export default function QuestionCard({ question, index, answers, onAnswerChange }) {
  if (!question) return null;
  const answerValue = answers[question.id] || '';
  return (
    <div className="w-full h-full max-w-4xl rounded-sm border-2 border-[#3a4554] bg-[#1b2027] p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-md font-semibold">Question {index + 1}</h2>
        <span className="text-sm px-2 py-1 rounded bg-slate-700 text-slate-300 uppercase tracking-wide">
          {question.question_type}
        </span>
      </div>
      <p className="text-white my-10 text-xl leading-relaxed whitespace-pre-line">
        {question.question_text}
      </p>

      {question.question_type === 'mcq' && (
        <MCQOptions
          questionId={question.id}
          options={question.options}
          selectedValue={answerValue}
          onChange={onAnswerChange}
        />
      )}

      {question.question_type === 'fill' && (
        <div className="mt-2">
          <label className="block text-sm mb-2 text-slate-300" htmlFor={`fill-${question.id}`}>
            Your Answer
          </label>
          <input
            id={`fill-${question.id}`}
            type="text"
            value={answerValue}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            className="w-full px-4 py-3 rounded-sm bg-[#14181f] border-2 border-[#3a4554] focus:outline-none focus:border-emerald-500 text-slate-100"
          />
        </div>
      )}

      {question.question_type !== 'mcq' && question.question_type !== 'fill' && (
        <div className="text-amber-400 mt-4 text-sm">
          Unsupported question type in attempt UI: {question.question_type}
        </div>
      )}
    </div>
  );
}
