import React from 'react';
import AchievementHeader from '@/components/achievement/Header';
import SectionTitle from '@/components/achievement/SectionTitle';
import AchievementCard from '@/components/achievement/AchievementCard';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import Stats from '@/components/Stats/Stats';

// Mock achievements data (could be moved to constants or fetched later)
const achievements = [
	{
		id: 'on-fire',
		title: 'On Fire',
		description: 'Answer 20 lessons within a week',
		reward: '+200 EXP',
		progress: { current: 15, total: 20 },
		status: 'in-progress',
	},
	{
		id: 'starter',
		title: 'First Steps',
		description: 'Complete your first lesson',
		reward: '+25 EXP',
		progress: { current: 1, total: 1 },
		status: 'completed',
	},
	{
		id: 'consistency',
		title: 'Consistency',
		description: 'Log in 7 days in a row',
		reward: '+120 EXP',
		progress: { current: 3, total: 7 },
		status: 'in-progress',
	},
	{
		id: 'scholar',
		title: 'Scholar',
		description: 'Reach 1000 total EXP',
		reward: '+300 EXP',
		progress: { current: 820, total: 1000 },
		status: 'in-progress',
	},
];

export default function AchievementPage() {
  return (
    <>
      <Sidebar />
      <div className="min-h-screen w-full bg-background text-white flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-3xl">
          <div className="space-y-10 pb-20">
            <AchievementHeader
              title="Welcome"
              subtitle="Earn rewards by completing achievements"
            />

            <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
              <SectionTitle text="Achievements" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {achievements.map((a) => (
                  <AchievementCard key={a.id} {...a} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Stats />
    </>
  );
}

