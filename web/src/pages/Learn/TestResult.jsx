import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProfileCard from '@/components/TestResult/ProfileCard';
import ScoreCard from '@/components/TestResult/ScoreCard';
import PointsCard from '@/components/TestResult/PointsCard';
import PerformanceCard from '@/components/TestResult/PerformanceCard';
import ActionsFeedbackCard from '@/components/TestResult/ActionsFeedbackCard';
import FeedbackModal from '@/components/TestResult/FeedbackModal';
import { useToast } from '@/hooks/use-toast';
import { refreshStats, useBoundStore } from '@/stores/stores';

function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TestResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { testId } = useParams();
  const { toast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const elapsedSeconds = state?.elapsedSeconds || 0;
  
  const username = useBoundStore((s) => s.username);
  const profile_icon = useBoundStore((s) => s.profile_icon);
  const currentLevel = useBoundStore((s) => s.level);
  const streak = useBoundStore((s) => s.streak);
  const xpAwarded = state?.submitResult?.xp_awarded;
  const correct = state?.submitResult?.correct_count ?? 0;
  const total = state?.submitResult?.total_questions ?? 0;
  const incorrect = Math.max(total - correct, 0);
  const scorePercent = total > 0 ? (correct / total) * 100 : 0;
  const levelProgressPercent = useBoundStore((s) => s.nextLevelProgressPct);
  
  useEffect(() => {
    refreshStats().catch(() => {});
  }, [])

  return (
    <div className="min-h-screen w-full bg-[#0f1115] text-slate-100 flex flex-col p-6">
      <div className="max-w-3xl w-full mx-auto flex flex-col gap-6">
        {/* Page Title */}
        <div className="pt-2">
          <h1 className="text-sm font-semibold tracking-wide text-white">Results</h1>
        </div>

        {/* Section 1: User Profile & Level */}
        <ProfileCard username={username} profile_icon={profile_icon} currentLevel={currentLevel} levelProgressPercent={levelProgressPercent} />

        {/* Parent Card with nested sub-cards */}
        <div className="rounded-2xl bg-[#111418] border border-[#242c36] px-6 py-7 flex flex-col gap-8 shadow-lg">
          {/* Score (full width inner card) */}
          <ScoreCard correct={correct} total={total} scorePercent={scorePercent} />

          {/* Points + Performance row (nested grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Points card (1/3) */}
            <PointsCard points={xpAwarded} elapsedSeconds={elapsedSeconds} formatTime={formatTime} />

            {/* Performance card (2/3) */}
            <PerformanceCard correct={correct} incorrect={incorrect} streak={streak} />
          </div>

          {/* Actions & Feedback inner card */}
          <ActionsFeedbackCard
            onRetry={() => navigate(`/attempt-test/${testId}`)}
            onExit={() => navigate('/learn')}
            onFeedback={() => setFeedbackOpen(true)}
          />
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        onSubmitted={() => toast('Feedback submitted')}
      />
    </div>
  );
}
