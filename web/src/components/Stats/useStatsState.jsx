import { useBoundStore, refreshStats, useStreakSaver as storeUseStreakSaver } from "@/stores/stores";

// Obsolete: prefer importing values/actions directly from the zustand store.
// This wrapper remains for compatibility with any leftover imports.
export function useStatsState() {
  const state = useBoundStore((s) => ({
    level: s.level,
    xp: s.xp,
    streak: s.streak,
    energy: s.energy,
    nextLevelProgressPct: s.nextLevelProgressPct,
    rank: s.rank,
    loading: s.statsLoading,
    error: s.statsError,
    streakDays: s.streakDays,
    streakSaversLeft: s.streakSaversLeft,
    timeToMaxEnergySeconds: s.timeToMaxEnergySeconds,
  }));
  return { ...state, applyStreakSaver: storeUseStreakSaver, refreshStats };
}
