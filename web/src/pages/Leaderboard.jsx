import React, { useState, useMemo } from 'react';
import { LeaderboardHeader } from '@/components/leaderboard/LeaderboardHeader';
import { LeaderboardTabs } from '@/components/leaderboard/LeaderboardTabs';
import { LeaderboardList } from '@/components/leaderboard/LeaderboardList';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import Stats from '@/components/Stats/Stats';

// Sample datasets (replace with API calls later)
const streakData = [
	{ id: '1', rank: 1, name: 'Name1', level: 9999 },
	{ id: '2', rank: 2, name: 'Name2', level: 99 },
	{ id: '3', rank: 3, name: 'BigOrange', level: 95, avatarUrl: 'https://placekitten.com/120/120' },
	{ id: '4', rank: 4, name: 'Name4', level: 94 },
	{ id: '5', rank: 5, name: 'Name5', level: 94 },
	// duplicate ranks example
	{ id: '6a', rank: 6, name: 'Name6A', level: 94 },
	{ id: '6b', rank: 6, name: 'Name6B', level: 94 },
	{ id: '6c', rank: 6, name: 'Name6C', level: 94 },
];

const levelData = [
	{ id: 'l1', rank: 1, name: 'LevelKing', level: 120 },
	{ id: 'l2', rank: 2, name: 'ConsistentPro', level: 118 },
	{ id: 'l3', rank: 3, name: 'OrangeCat', level: 110, avatarUrl: 'https://placekitten.com/121/121' },
	{ id: 'l4', rank: 4, name: 'Polyglot', level: 105 },
	{ id: 'l5', rank: 5, name: 'NightOwl', level: 99 },
];

const tabs = [
	{ id: 'streak', label: 'Highest Streak' },
	{ id: 'level', label: 'Highest Level' },
];

export default function LeaderboardPage() {
	const [activeTab, setActiveTab] = useState('streak');

	const items = useMemo(() => {
		return activeTab === 'streak' ? streakData : levelData;
	}, [activeTab]);

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
          <LeaderboardList items={items} />
        </div>
      </div>
      <Stats />
    </>
  );
}

