import { useEffect, useMemo, useState } from "react";
import AchievementHeader from "@/components/achievement/AchievementHeader";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Stats } from "../../components/Stats/Stats";
import "../../styles/Home.css";
import "../../styles/Achievements.css"; // custom scroll styling similar to leaderboard
import AchievementRow from "@/components/achievement/AchievementRow";
import LoadingIndicator from "@/components/LoadingIndicator";
import { listAchievements, claimAchievement } from "@/client-api";
import { useBoundStore } from "@/stores/stores";
import { refreshStats } from "@/stores/stores";
import { useToast } from "@/hooks/use-toast";

function AchievementsHome() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimingMap, setClaimingMap] = useState({}); // { [achievement_id]: true }
  // Pull user stats and completed tests for progress computation
  const userXp = useBoundStore((s) => s.xp);
  const userStreak = useBoundStore((s) => s.streak);
  const completedTestIds = useBoundStore((s) => s.completedTestIds);
  const { toast } = useToast();

  useEffect(() => {
    const abort = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const data = await listAchievements(abort.signal);
        setItems(data ?? []);
        setError(null);
      } catch (err) {
        console.error("Failed to load achievements", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => abort.abort();
  }, []);

  const rows = useMemo(() => {
    // Map API schema -> UI props for AchievementRow
    // API item: { achievement_id, claimable, claimed, current_progress_streak, current_progress_xp, reward_type, reward_amount, reward_content, reward_content_description, target_completed_test_id, target_streak_value, target_xp_value }
    return items.map((it) => {
      const id = it.achievement_id ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
      let title = "Achievement";
      let description = "";
      let reward = "";

      // Server-provided state
      const claimable = Boolean(it.claimable);
      const claimed = Boolean(it.claimed);

      const targetXp = it.target_xp_value ?? null;
      const targetStreak = it.target_streak_value ?? null;
      const targetTestId = it.target_completed_test_id ?? null;

      // Reward string formatting
      if (it.reward_type === "badge") {
        reward = `Badge: ${it.reward_content_description}`;
      } else if (it.reward_type === "xp") {
        reward = `+${it.reward_amount ?? 0} XP`;
      } else if (it.reward_type === "energy") {
        reward = `+${it.reward_amount ?? 0} Energy`;
      } else {
        reward = it.reward_amount ? `+${it.reward_amount}` : (it.reward_content || "");
      }

      // Append lightweight status label from server
      if (claimed) {
        reward = `${reward} • Claimed`;
      } else if (claimable) {
        reward = `${reward} • Ready to claim`;
      }

      // Title/description derived from targets first (prefer specific goals)
      if (targetTestId) {
        title = `Complete Test "${it.target_completed_test_display}"`;
        description = it.reward_content_description || "Complete the required test to claim the reward.";
      } else if (targetStreak != null) {
        const target = Number(targetStreak) || 0;
        title = `${target}-Day Streak`;
        description = it.reward_content_description || `Maintain a ${target}-day streak to claim the reward.`;
      } else if (targetXp != null) {
        const target = Number(targetXp) || 0;
        title = `Reach ${target} XP`;
        description = it.reward_content_description || `Earn ${target} total XP to claim the reward.`;
      } else if (it.reward_type === "badge") {
        title = it.reward_content_description || (it.reward_content ? String(it.reward_content).replace(/[_-]/g, " ") : "Special Badge");
        description = it.reward_content_description || "Earn this badge by meeting the requirement.";
      } else if (it.reward_type === "xp") {
        title = "Experience Reward";
        description = "Complete tasks to earn experience points.";
      } else if (it.reward_type === "energy") {
        title = "Energy Reward";
        description = "Get extra energy for your study streaks.";
      } else {
        title = "Reward";
        description = it.reward_content_description || "";
      }

      // If multiple targets exist (e.g., test + streak + xp), build a combined, natural-language description
      const conditionParts = [];
      if (targetTestId) conditionParts.push(`complete Test "${it.target_completed_test_display}"`);
      if (targetStreak != null) conditionParts.push(`maintain a ${Number(targetStreak) || 0}-day streak`);
      if (targetXp != null) conditionParts.push(`reach ${Number(targetXp) || 0} XP`);

      if (conditionParts.length >= 2) {
        const joinWithAnd = (parts) => {
          if (parts.length <= 1) return parts[0] || "";
          if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
          return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
        };
        const base = (it.reward_content_description || "").trim();
        const requirements = `To claim the reward, ${joinWithAnd(conditionParts)}.`;
        description = base ? `${base} ${requirements}` : requirements;
      }

      // Progress calculation: combine multiple conditions if present.
      // Each condition contributes one 'step' when satisfied; otherwise partials from streak/xp use server/user values capped by target.
      let progress = null;
      const conditionProgress = [];

      // Test condition -> binary completion
      if (targetTestId) {
        const doneFromServer = claimed || claimable;
        const doneLocal = Array.isArray(completedTestIds) && completedTestIds.includes(targetTestId);
        const done = doneFromServer || doneLocal;
        conditionProgress.push({ current: done ? 1 : 0, total: 1 });
      }

      // Streak condition -> partial progress allowed
      if (targetStreak != null) {
        const total = Math.max(0, Number(targetStreak) || 0);
        if (total > 0) {
          let current = typeof it.current_progress_streak === 'number' ? it.current_progress_streak : Math.max(0, Number(userStreak) || 0);
          if ((claimed || claimable) && current < total) current = total;
          current = Math.min(current, total);
          conditionProgress.push({ current, total });
        }
      }

      // XP condition -> partial progress allowed
      if (targetXp != null) {
        const total = Math.max(0, Number(targetXp) || 0);
        if (total > 0) {
          let current = typeof it.current_progress_xp === 'number' ? it.current_progress_xp : Math.max(0, Number(userXp) || 0);
          if ((claimed || claimable) && current < total) current = total;
          current = Math.min(current, total);
          conditionProgress.push({ current, total });
        }
      }

      if (conditionProgress.length === 1) {
        progress = conditionProgress[0];
      } else if (conditionProgress.length > 1) {
        // Normalize each to [0,1] and sum, total equals number of conditions
        const normalizedSum = conditionProgress.reduce((acc, p) => acc + (p.total > 0 ? (p.current / p.total) : 0), 0);
        const total = conditionProgress.length;
        // Represent as x/total, where x can be fractional but we show as nearest integer in bar label by default
        progress = { current: normalizedSum, total };
      }

      return {
        id,
        title,
        description,
        reward,
        progress, // null hides bar; object shows progress
        claimable,
        claimed,
        claiming: !!claimingMap[id],
      };
    });
  }, [items, userXp, userStreak, completedTestIds, claimingMap]);

  async function handleClaim(achievementId) {
    if (!achievementId && achievementId !== 0) return;
    setClaimingMap((m) => ({ ...m, [achievementId]: true }));
    try {
      await claimAchievement(achievementId);
      toast.success?.("Reward claimed!") || toast("Reward claimed!");
      // Refresh top-right stats (xp/energy/streak/level) after claiming
      refreshStats?.();
      // Reload list to reflect claim state and any updated balances
      const abort = new AbortController();
      const data = await listAchievements(abort.signal);
      setItems(data ?? []);
    } catch (err) {
      console.error('Claim failed', err);
      const msg = err?.response?.data?.detail || err?.message || 'Failed to claim reward';
      toast.error?.(msg) || toast(msg);
    } finally {
      setClaimingMap((m) => {
        const { [achievementId]: _, ...rest } = m;
        return rest;
      });
    }
  }

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
        {/* Scrollable list area */}
        <div className="px-4 md:px-6 pb-8 flex-1 min-h-0">
          <div className="achievements-scroll h-full flex flex-col gap-4">
            {loading && (
              <div className="min-h-[40vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                  <LoadingIndicator size="16" />
                  <span className="text-sm">Loading achievements...</span>
                </div>
              </div>
            )}
            {!loading && !error && rows.length === 0 && (
              <div className="min-h-[30vh] flex items-center justify-center text-white/70 text-sm">
                No achievements found.
              </div>
            )}
            {!loading && !error && rows.map((a) => (
              <AchievementRow
                key={a.id}
                {...a}
                onClaim={a.claimable && !a.claimed ? () => handleClaim(a.id) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
      <Stats />
    </div>
  );
}

export default AchievementsHome;
