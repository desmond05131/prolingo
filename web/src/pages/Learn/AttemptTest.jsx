import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { questions as MockQuestions } from '@/constants';
import { getTestQuestions } from '@/client-api';
import ExitButton from '@/components/Test/ExitButton';
import ProgressCard from '@/components/Test/ProgressCard';
import TimerCard from '@/components/Test/TimerCard';
import QuestionCard from '@/components/Test/QuestionCard';
import FloatingActionButton from '@/components/Test/FloatingActionButton';

/**
 * AttemptTest Page
 * Features:
 * - Top-left: Exit (X) button + progress bar (answered / total)
 * - Top-right: Timer (count up for now; could be adapted to countdown if test provides duration)
 * - Center: Question display (MCQ or fill-in-the-blank supported initially)
 * - Bottom-right: Floating circular Next button
 * - Local state to track answers; submission placeholder for future integration
 */
export default function AttemptTest() {
	const navigate = useNavigate();
	const { testId } = useParams();

	// Data state
	const [questions, setQuestions] = useState([]); // Each question may include options array
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Progress & interaction state
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState({}); // key: question.id, value: user answer string or option id
	const [hasSubmitted, setHasSubmitted] = useState(false);

	// Timer state
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const timerRef = useRef(null);

	// Timer effect
	useEffect(() => {
		timerRef.current = setInterval(() => {
			setElapsedSeconds(prev => prev + 1);
		}, 1000);
		return () => clearInterval(timerRef.current);
	}, []);

	// Fetch questions for this test on mount/param change
	const fetchQuestions = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const data = await getTestQuestions(testId);
			const arr = Array.isArray(data) ? data : (data?.results ?? []);
			setQuestions(arr);
			if (arr.length === 0) {
				setError('No questions found for this test yet.');
			}
		} catch (err) {
			const message = err?.response?.data?.detail || 'Failed to load questions';
			setError(message);
			console.error('AttemptTest fetchQuestions error', err);
		} finally {
			setLoading(false);
		}
	}, [testId]);

	useEffect(() => {
		fetchQuestions();
	}, [fetchQuestions]);

	const currentQuestion = questions[currentIndex];
	const total = questions.length;
	const answeredCount = Object.keys(answers).length; // Could refine to only count non-empty answers

	const handleAnswerChange = (questionId, value) => {
		setAnswers(prev => ({ ...prev, [questionId]: value }));
	};

	const goNext = () => {
		if (currentIndex < total - 1) {
			setCurrentIndex(idx => idx + 1);
		} else {
			// Last question -> attempt submit (placeholder)
			submitAttempt();
		}
	};

	const submitAttempt = async () => {
		// Placeholder: gather payload and (future) POST to an endpoint.
		const payload = {
			test: Number(testId),
			elapsed_seconds: elapsedSeconds,
			answers: questions.map(q => ({
				question: q.id,
				given_answer: answers[q.id] ?? '',
				// For MCQ, given_answer could be option id or option text; backend contract TBD.
			}))
		};
		console.log('Attempt submission payload (placeholder):', payload);
		setHasSubmitted(true);
		// Navigate to result page with state
		navigate(`/attempt-test/${testId}/result`, {
			state: { questions, answers, elapsedSeconds }
		});
	};

  const handleExit = () => {
    if (!hasSubmitted) {
      const remaining = total - answeredCount;
      const confirmExit = window.confirm(`You have ${remaining} unanswered question(s). Exit anyway?`);
      if (!confirmExit) return;
    }
    navigate('/learn');
  };

  // Progress percentage now computed inside ProgressCard; option grid handled in MCQOptions

  return (
    <div className="min-h-screen flex flex-col text-slate-100 relative p-4 bg-[#0f1115]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-start gap-3">
          <ExitButton onExit={handleExit} remainingUnanswered={total - answeredCount} />
          <ProgressCard answered={answeredCount} total={total} />
        </div>
        <TimerCard elapsedSeconds={elapsedSeconds} />
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center">
        {loading && (
          <div className="mt-20 animate-pulse text-slate-400">Loading questions...</div>
        )}
        {!loading && error && <div className="text-red-400 mt-8">{error}</div>}
        {!loading && !error && currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            answers={answers}
            onAnswerChange={handleAnswerChange}
          />
        )}
        {!loading && !error && !currentQuestion && (
          <div className="mt-20 text-slate-400">No questions to display.</div>
        )}
      </div>

      {/* Floating Next Button */}
      {total > 0 && (
        <FloatingActionButton
          onClick={goNext}
            disabled={!currentQuestion || !answers[currentQuestion.id]}
            isLast={currentIndex === total - 1}
        />
      )}
    </div>
  );
}

