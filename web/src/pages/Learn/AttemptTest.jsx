import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/api';
import { questions as MockQuestions } from '@/constants';

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
	const { courseId, chapterId, testId } = useParams();

	// Data state
	const [questions, setQuestions] = useState(MockQuestions); // Each question may include options array
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Progress & interaction state
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState({}); // key: question.id, value: user answer string or option id
	const [hasSubmitted, setHasSubmitted] = useState(false);

	// Timer state
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const timerRef = useRef(null);

	// Assumptions (since backend test object details not loaded here yet)
	// Could fetch test metadata if endpoint exists: /api/courses/tests/{testId}/ ??? Not in current code; leaving future hook.

	// const fetchQuestions = useCallback(async () => {
	// 	setLoading(true);
	// 	setError('');
	// 	try {
	// 		// Fetch all questions then filter by testId (QuestionTable fetches all). Ideally there'd be an endpoint for test-specific.
	// 		const response = await api.get('/api/courses/questions/');
	// 		const all = response.data || [];
	// 		const filtered = all.filter(q => String(q.test) === String(testId));

	// 		// For MCQ we need options. Some question objects might embed options already (QuestionTable shows question.options?).
	// 		// If not present, we could optionally fetch all options and join. For now, use existing included options field if present.
	// 		setQuestions(filtered);
	// 		if (filtered.length === 0) {
	// 			setError('No questions found for this test yet.');
	// 		}
	// 	} catch (err) {
	// 		const message = err?.response?.data?.detail || 'Failed to load questions';
	// 		setError(message);
	// 		console.error('AttemptTest fetchQuestions error', err);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// }, [testId]);

	// Timer effect
	useEffect(() => {
		timerRef.current = setInterval(() => {
			setElapsedSeconds(prev => prev + 1);
		}, 1000);
		return () => clearInterval(timerRef.current);
	}, []);

	// useEffect(() => {
	// 	fetchQuestions();
	// }, [fetchQuestions]);

	const formatTime = (totalSec) => {
		const m = Math.floor(totalSec / 60);
		const s = totalSec % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	};

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
			course: Number(courseId),
			chapter: Number(chapterId),
			elapsed_seconds: elapsedSeconds,
			answers: questions.map(q => ({
				question: q.id,
				given_answer: answers[q.id] ?? '',
				// For MCQ, given_answer could be option id or option text; backend contract TBD.
			}))
		};
		console.log('Attempt submission payload (placeholder):', payload);
		setHasSubmitted(true);
		// Navigate back after a brief delay or directly
		setTimeout(() => navigate('/learn'), 1200);
	};

	const handleExit = () => {
		if (!hasSubmitted) {
			const remaining = total - answeredCount;
			const confirmExit = window.confirm(`You have ${remaining} unanswered question(s). Exit anyway?`);
			if (!confirmExit) return;
		}
		navigate('/learn');
	};

	const progressPercent = total > 0 ? (answeredCount / total) * 100 : 0;

	return (
		<div className="min-h-screen flex flex-col text-slate-100 relative p-4 bg-[#0f1115]">
			{/* Header */}
			<div className="flex items-start justify-between mb-4 flex-wrap gap-3">
				<div className="flex items-start gap-3">
					{/* Square Exit Button - Flat 2D */}
					<button
						onClick={handleExit}
						className="h-11 w-11 flex items-center justify-center rounded-sm bg-[#1d232c] border-2 border-[#3a4554] hover:bg-[#242c36] active:translate-y-[2px] text-2xl font-bold text-slate-200"
						aria-label="Exit test"
					>
						×
					</button>
					{/* Progress Card - Flat */}
					<div className="px-4 py-3 rounded-sm bg-[#1d232c] w-60 select-none">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-semibold tracking-wide text-white uppercase">Progress</span>
							<span className="text-xs font-bold text-emerald-400">{answeredCount}/{total}</span>
						</div>
						<div className="h-4 border-2 border-[#3a4554] bg-[#14181f] flex">
							<div
								className="bg-emerald-500"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
					</div>
				</div>
				{/* Timer Card - Flat */}
				<div className="px-4 py-3 rounded-sm bg-[#1d232c] min-w-[150px] flex items-center gap-3 select-none">
					<div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#14181f] border-2 border-[#3a4554] text-emerald-400">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
							<circle cx="12" cy="12" r="9" />
							<polyline points="12 7 12 12 16 14" />
						</svg>
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">Time</span>
						<span className="font-mono text-lg leading-none pt-1 text-slate-100">{formatTime(elapsedSeconds)}</span>
					</div>
				</div>
			</div>

			{/* Body */}
			<div className="flex-1 flex flex-col items-center justify-start">
				{loading && (
					<div className="mt-20 animate-pulse text-slate-400">Loading questions...</div>
				)}
				{!loading && error && (
					<div className="text-red-400 mt-8">{error}</div>
				)}
				{!loading && !error && currentQuestion && (
					<div className="w-full max-w-3xl rounded-sm border-2 border-[#3a4554] bg-[#1b2027] p-6">
						<div className="flex items-start justify-between mb-4">
							<h2 className="text-xl font-semibold">Question {currentIndex + 1}</h2>
							<span className="text-sm px-2 py-1 rounded bg-slate-700 text-slate-300 uppercase tracking-wide">{currentQuestion.question_type}</span>
						</div>
						<p className="text-slate-100 leading-relaxed mb-6 whitespace-pre-line">{currentQuestion.question_text}</p>

						{currentQuestion.question_type === 'mcq' && (
							<div className="space-y-3">
								{currentQuestion.options?.length ? currentQuestion.options.map((opt, idx) => {
									const selected = answers[currentQuestion.id] === String(opt.id);
									return (
										<button
											key={opt.id}
											type="button"
											onClick={() => handleAnswerChange(currentQuestion.id, String(opt.id))}
											className={`w-full text-left px-4 py-3 rounded-sm border-2 font-medium tracking-wide focus:outline-none active:translate-y-[2px] ${selected ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-[#14181f] text-slate-200 border-[#3a4554] hover:bg-[#1f2630]'}`}
										>
											<span className="mr-3 text-slate-300">{String.fromCharCode(65 + idx)}.</span>
											<span>{opt.option_text}</span>
										</button>
									);
								}) : (
									<div className="text-slate-400 italic">No options available for this question.</div>
								)}
							</div>
						)}

						{currentQuestion.question_type === 'fill' && (
							<div className="mt-2">
								<label className="block text-sm mb-2 text-slate-300">Your Answer</label>
								<input
									type="text"
									value={answers[currentQuestion.id] || ''}
									onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
									className="w-full px-4 py-3 rounded-sm bg-[#14181f] border-2 border-[#3a4554] focus:outline-none focus:border-emerald-500 text-slate-100" />
							</div>
						)}

						{currentQuestion.question_type !== 'mcq' && currentQuestion.question_type !== 'fill' && (
							<div className="text-amber-400 mt-4 text-sm">Unsupported question type in attempt UI: {currentQuestion.question_type}</div>
						)}
					</div>
				)}
				{!loading && !error && !currentQuestion && (
					<div className="mt-20 text-slate-400">No questions to display.</div>
				)}
			</div>

			{/* Floating Next Button */}
			{total > 0 && (
				<button
					onClick={goNext}
					disabled={!currentQuestion || !answers[currentQuestion.id]}
					className={`fixed bottom-6 right-6 h-16 w-16 rounded-sm flex items-center justify-center text-white text-2xl font-bold border-4 active:translate-y-[3px] ${currentIndex === total - 1 ? 'bg-emerald-600 border-emerald-700' : 'bg-indigo-600 border-indigo-700'} disabled:opacity-40 disabled:cursor-not-allowed`}
					title={currentIndex === total - 1 ? 'Submit Test' : 'Next Question'}
				>
					{currentIndex === total - 1 ? '✓' : '▶'}
				</button>
			)}
		</div>
	);
}

