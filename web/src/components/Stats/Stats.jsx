import React from 'react';
import { useStatsState } from './useStatsState.jsx';
import './Stats.css';

/*
 Stat Bar Component
 Layout per user spec:
 - Header badges (streak + energy) top-right
 - Card 1: Current Level (number + progress bar)
 - Card 2: Energy (number + 5 lightning icons with fill state)
 - Card 3: Leaderboards Rank (icon + label)

 Dynamic values pulled from useStatsState.
*/

// Inline SVG icons (small, self-contained)
const FireIcon = ({ className = "w-5 h-5" }) => (
  <img className="fire" alt="Fire" src="/assets/Streak.svg" />
  // <svg viewBox="0 0 24 24" className={className} fill="currentColor">
  // 	<path d="M12 2c.8 2.7-.7 4.1-2 5.6-1.1 1.3-2 2.4-2 4.4 0 2.9 2.3 5 5 5s5-2.1 5-5c0-2.2-.6-3.6-1.3-4.9-.6-1.2-1.2-2.3-1.2-3.7 0-.7.1-1.3.3-1.9C18.4 4.2 20 7.2 20 11c0 5-3.9 9-8 9s-8-4-8-9c0-3.6 1.9-6.3 4.3-8.2C9.3 1.6 10.5 1 11.7 1c.1.3.2.6.3 1z" />
  // </svg>
);

// Lightning icon supports partial fill via mask
const LightningIcon = ({ filled = 1, index }) => {
	// filled: 0 (empty), 0-1 (partial), 1 (full)
	const pct = Math.max(0, Math.min(1, filled));
	return (
		<svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" aria-label={`Energy segment ${index + 1}`}>        
			<defs>
				<linearGradient id={`lg-${index}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset={`${pct * 100}%`} stopColor="#FFE34D" />
					<stop offset={`${pct * 100}%`} stopColor="#3a3a3a" />
				</linearGradient>
			</defs>
			<path
				d="M13 2 3 14h6l-2 8 10-12h-6l2-8Z"
				fill={`url(#lg-${index})`}
				stroke="#FFE34D"
				strokeWidth="1"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

const TrophyBarsIcon = ({ className = 'w-5 h-5' }) => (
	<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M4 11v7" />
		<path d="M9 7v11" />
		<path d="M14 4v14" />
		<path d="M19 9v9" />
	</svg>
);

export const Stats = ({ className = '' }) => {
	const { level, xp, energy, streak } = useStatsState();

	// Progress calculation (example formula reused from obsolete component)
	const nextLevelTotal = level * 50 + 50;
	const progressPct = Math.min(100, (xp / nextLevelTotal) * 100);

	// Energy: map total energy (0-100?) to 5 segments
	const maxEnergy = 100; // assumption based on hook default
	const segments = 5;
	const segmentValue = maxEnergy / segments; // 20 each
	const energySegments = Array.from({ length: segments }, (_, i) => {
		const start = i * segmentValue;
		const end = start + segmentValue;
		if (energy >= end) return 1; // full
		if (energy <= start) return 0; // empty
		return (energy - start) / segmentValue; // partial 0-1
	});

	return (
		<aside
			className={`pointer-events-none right-0 top-0 flex flex-col items-end gap-6 p-6 h-screen text-white ${className}`}
			aria-label="Player statistics"
		>
			{/* Header Badges */}
					<div className="pointer-events-auto flex items-center gap-6 mt-2 pr-1 select-none">
						<div className="flex items-center gap-2">
							<FireIcon className="w-7 h-7 text-orange-400" />
							<span className="text-2xl font-bold text-orange-300 leading-none" aria-label="Streak value">{streak}</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-yellow-300 text-3xl leading-none">⚡</span>
							<span className="text-2xl font-bold text-yellow-200 leading-none" aria-label="Energy value">{energy}</span>
						</div>
					</div>

			{/* Cards */}
			<div className="pointer-events-auto flex flex-col gap-6 w-full">
				{/* Current Level Card */}
				<div className="rounded-xl border border-white/15 bg-neutral-900/70 backdrop-blur-sm px-6 py-5 shadow-md flex flex-col gap-4">
					<h2 className="text-base font-bold tracking-wide">Current Level</h2>
					<div className="flex items-center gap-6">
						<div className="text-5xl font-extrabold leading-none tabular-nums">{level}</div>
						<div className="flex-1">
							<div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden">
								<div
									className="h-full rounded-full bg-green-500 transition-all duration-500"
									style={{ width: `${progressPct}%` }}
									aria-label="Level progress"
									aria-valuenow={progressPct}
									aria-valuemin={0}
									aria-valuemax={100}
									role="progressbar"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Energy Card */}
						<div className="rounded-xl border border-white/15 bg-neutral-900/70 backdrop-blur-sm px-6 py-5 shadow-md flex flex-col gap-4">
							<h2 className="text-base font-bold tracking-wide">Energy</h2>
							<div className="flex items-center gap-4 w-full min-w-0">
								<div className="text-4xl font-extrabold leading-none tabular-nums shrink-0">{energy}</div>
								<div className="flex flex-wrap items-center gap-1 max-w-[140px] overflow-hidden">
									{energySegments.map((f, i) => (
										<div key={i} className="shrink-0">
											<LightningIcon filled={f} index={i} />
										</div>
									))}
								</div>
							</div>
						</div>

				{/* Leaderboards Rank Card */}
				<div className="rounded-xl border border-white/15 bg-neutral-900/70 backdrop-blur-sm px-6 py-5 shadow-md flex flex-col gap-4">
					<h2 className="text-base font-bold tracking-wide">Leaderboards Rank</h2>
					<div className="flex items-center gap-3 text-sm font-semibold text-neutral-300">
						<TrophyBarsIcon className="w-5 h-5 text-neutral-400" />
						<span>No Rank</span>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default Stats;

