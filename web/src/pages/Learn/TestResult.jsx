import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProfileCard from '@/components/TestResult/ProfileCard';
import ScoreCard from '@/components/TestResult/ScoreCard';
import PointsCard from '@/components/TestResult/PointsCard';
import PerformanceCard from '@/components/TestResult/PerformanceCard';
import ActionsFeedbackCard from '@/components/TestResult/ActionsFeedbackCard';

function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function computeStreak(orderedQuestions, answers) {
  let streak = 0;
  for (let i = orderedQuestions.length - 1; i >= 0; i--) {
    const q = orderedQuestions[i];
    const isCorrect = evaluateCorrect(q, answers[q.id]);
    if (isCorrect) streak++; else break;
  }
  return streak;
}
function evaluateCorrect(q, rawAnswer) {
  if (!q) return false;
  if (q.question_type === 'mcq') return String(rawAnswer) === String(q.correct_option_id);
  if (q.question_type === 'fill') return !!rawAnswer && rawAnswer.trim().toLowerCase() === (q.correct_answer || '').trim().toLowerCase();
  return false;
}

export default function TestResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { courseId, chapterId, testId } = useParams();
  const questions = state?.questions || [];
  const answers = state?.answers || {};
  const elapsedSeconds = state?.elapsedSeconds || 0;
  const username = state?.username || 'Name123';
  const currentLevel = state?.level ?? 10;

  const total = questions.length || 10;
  let correct = 0;
  questions.forEach(q => { if (evaluateCorrect(q, answers[q.id])) correct++; });
  const scorePercent = total > 0 ? (correct / total) * 100 : 0;
  const levelProgressPercent = scorePercent;
  const streak = computeStreak(questions, answers);
  const incorrect = Math.max(total - correct, 0);

  return (
    <div className="min-h-screen w-full bg-[#0f1115] text-slate-100 flex flex-col p-6">
      <div className="max-w-3xl w-full mx-auto flex flex-col gap-6">
        {/* Page Title */}
        <div className="pt-2">
          <h1 className="text-sm font-semibold tracking-wide text-white">Results</h1>
        </div>

        {/* Section 1: User Profile & Level */}
        <ProfileCard username={username} currentLevel={currentLevel} levelProgressPercent={levelProgressPercent} />

        {/* Parent Card with nested sub-cards */}
        <div className="rounded-2xl bg-[#111418] border border-[#242c36] px-6 py-7 flex flex-col gap-8 shadow-lg">
          {/* Score (full width inner card) */}
          <ScoreCard correct={correct} total={total} scorePercent={scorePercent} />

          {/* Points + Performance row (nested grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Points card (1/3) */}
            <PointsCard points={correct} elapsedSeconds={elapsedSeconds} formatTime={formatTime} />

            {/* Performance card (2/3) */}
            <PerformanceCard correct={correct} incorrect={incorrect} streak={streak} />
          </div>

          {/* Actions & Feedback inner card */}
          <ActionsFeedbackCard
            onRetry={() => navigate(`/attempt-test/${courseId}/${chapterId}/${testId}`)}
            onExit={() => navigate('/learn')}
            onFeedback={() => alert('Feedback flow coming soon!')}
          />
        </div>
      </div>
    </div>
  );
}
