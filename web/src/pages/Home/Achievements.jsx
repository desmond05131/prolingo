import AchievementHeader from "@/components/achievement/AchievementHeader";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Stats } from "../../components/Stats/Stats";
import "../../styles/Home.css";
import "../../styles/Achievements.css"; // custom scroll styling similar to leaderboard
import AchievementRow from "@/components/achievement/AchievementRow";

// Mock achievements data (could be moved to constants or fetched later)
const achievements = [
  {
    id: "on-fire",
    title: "On Fire",
    description: "Answer 20 lessons within a week",
    reward: "+200 EXP",
    progress: { current: 15, total: 20 },
    status: "in-progress",
  },
  {
    id: "starter",
    title: "First Steps",
    description: "Complete your first lesson",
    reward: "+25 EXP",
    progress: { current: 1, total: 1 },
    status: "completed",
  },
  {
    id: "consistency",
    title: "Consistency",
    description: "Log in 7 days in a row",
    reward: "+120 EXP",
    progress: { current: 3, total: 7 },
    status: "in-progress",
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Reach 1000 total EXP",
    reward: "+300 EXP",
    progress: { current: 820, total: 1000 },
    status: "in-progress",
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Reach 1000 total EXP",
    reward: "+300 EXP",
    progress: { current: 820, total: 1000 },
    status: "in-progress",
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Reach 1000 total EXP",
    reward: "+300 EXP",
    progress: { current: 820, total: 1000 },
    status: "in-progress",
  },
];

function AchievementsHome() {
  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="px-6 pt-8 pb-4 shrink-0">
          <AchievementHeader
            title="Welcome"
            subtitle="Earn rewards by completing achievements"
          />
          <div className="mt-6 ml-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Achievements
            </h2>
          </div>
        </div>
        {/* <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
          <div className="text-xl md:text-2xl font-semibold text-white">
            Achievements
          </div>
          <div className="achievements-scroll flex flex-col gap-4">
            {achievements.map((a) => (
              <AchievementRow key={a.id} {...a} />
            ))}
          </div>
        </div> */}
        {/* Scrollable list area */}
        <div className="px-4 md:px-6 pb-8 flex-1 min-h-0">
          <div className="achievements-scroll h-full flex flex-col gap-4">
            {achievements.map((a) => (
              <AchievementRow key={a.id + a.progress.current} {...a} />
            ))}
          </div>
        </div>
      </div>
      <Stats />
    </div>
  );
}

export default AchievementsHome;
