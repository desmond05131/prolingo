import React, { useEffect, useMemo, useState } from 'react';
import { LeaderboardHeader } from '@/components/leaderboard/LeaderboardHeader';
import { LeaderboardTabs } from '@/components/leaderboard/LeaderboardTabs';
import { LeaderboardList } from '@/components/leaderboard/LeaderboardList';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import Stats from '@/components/Stats/Stats';
import LoadingIndicator from '@/components/LoadingIndicator';
import { getLeaderboardTop50 } from '@/client-api';
import { MOCK_LEADERBOARD_TOP50 } from '@/constants';

// Helper to normalize API or mock response
const asArray = (x) => (Array.isArray(x) ? x : Array.isArray(x?.results) ? x.results : []);

const tabs = [
	{ id: 'streak', label: 'Highest Streak' },
	{ id: 'level', label: 'Highest Level' },
];

export default function LeaderboardPage() {
	const [activeTab, setActiveTab] = useState('streak');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [top, setTop] = useState([]); // normalized array from API/mock

	useEffect(() => {
		const abort = new AbortController();
		async function load() {
			try {
				setLoading(true);
				setError(null);
				const data = await getLeaderboardTop50(abort.signal);
				const list = asArray(data);
				// Fallback if API returns empty
				const fallback = list && list.length ? list : asArray(MOCK_LEADERBOARD_TOP50);
				setTop(fallback);
			} catch (err) {
				console.error('Failed to load leaderboard', err);
				setError(err);
				// Use mock data as fallback on error
				setTop(asArray(MOCK_LEADERBOARD_TOP50));
			} finally {
				setLoading(false);
			}
		}
		load();
		return () => abort.abort();
	}, []);

	const items = useMemo(() => {
		// Map API/mock shape -> component shape
		const mapped = asArray(top).map((it, idx) => ({
			id: String(it.user_id ?? it.username ?? idx + 1),
			rank: it.rank ?? idx + 1,
			name: it.username ?? it.name ?? 'Anonymous',
			// For now, we use streak value as the numeric metric shown (displayed as level badge)
			level: Number(it.streak_value ?? it.level ?? 0),
			avatarUrl: it.avatar_url ?? it.avatarUrl ?? undefined,
		}));
		if (activeTab === 'streak') return mapped;
		// For "Highest Level" tab, sort descending by the same metric (placeholder until level endpoint exists)
		return [...mapped].sort((a, b) => (b.level || 0) - (a.level || 0));
	}, [top, activeTab]);

  return (
    <>
      <Sidebar />
      <div className="min-h-screen w-full bg-background text-white flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-3xl">
          <LeaderboardHeader />
          <LeaderboardTabs
            tabs={tabs}
            activeTabId={activeTab}
            onTabChange={setActiveTab}
          />
					{loading && (
						<div className="min-h-[50vh] flex items-center justify-center">
							<div className="flex flex-col items-center gap-3 text-gray-500">
								<LoadingIndicator size="16" />
								<span className="text-sm">Loading leaderboard...</span>
							</div>
						</div>
					)}
					{!loading && !error && items.length === 0 && (
						<div className="min-h-[30vh] flex items-center justify-center text-gray-400 text-sm">
							No leaderboard data yet.
						</div>
					)}
					{!loading && items.length > 0 && (
						<LeaderboardList items={items} />
					)}
        </div>
      </div>
      <Stats />
    </>
  );
}

