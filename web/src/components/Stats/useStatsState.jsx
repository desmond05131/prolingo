import { useState, useEffect } from "react";
import { getMyGameInfo, getMyLeaderboard, getMyDailyStreak, useStreakSaver as postUseStreakSaver } from "@/client-api";


export function useStatsState() {
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [streakDays, setStreakDays] = useState([]); // [{ daily_streak_date, is_streak_saver }]
    const [streakSaversLeft, setStreakSaversLeft] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [timeToMaxEnergySeconds, setTimeToMaxEnergySeconds] = useState(null);
    const [nextLevelProgressPct, setNextLevelProgressPct] = useState(0);
    const [rank, setRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [gameinfo, lb, ds] = await Promise.all([
                    getMyGameInfo(controller.signal),
                    // leaderboard/me may 404 if not implemented; handle gracefully
                    getMyLeaderboard(controller.signal).catch(() => null),
                    getMyDailyStreak(controller.signal).catch(() => null),
                ]);

                if (gameinfo) {
                    setLevel(Number(gameinfo.level ?? 1));
                    setXp(Number(gameinfo.xp_value ?? 0));
                    setEnergy(Number(gameinfo.energy_value ?? 0));
                    setNextLevelProgressPct(Number(gameinfo.next_level_progress_pct ?? 0));
                    const t = gameinfo.time_to_max_energy_seconds;
                    setTimeToMaxEnergySeconds(
                        t === null || t === undefined
                            ? null
                            : typeof t === 'number'
                                ? t
                                : Number(t) || 0
                    );
                }

                if (lb && typeof lb.rank !== 'undefined') {
                    setRank(lb.rank);
                } else {
                    setRank(null);
                }

                if (ds) {
                    setStreak(Number(ds.streak_count ?? 0));
                    setStreakDays(Array.isArray(ds.streak_days) ? ds.streak_days : []);
                    setStreakSaversLeft(Number(ds.daily_streaks_left_this_month ?? 0));
                } else {
                    setStreak(0);
                    setStreakDays([]);
                    setStreakSaversLeft(0);
                }
            } catch (e) {
                setError(e?.message || 'Failed to load stats');
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, []);

    // Local countdown for time to max energy (purely cosmetic; backend remains source of truth)
    useEffect(() => {
        if (timeToMaxEnergySeconds === null || timeToMaxEnergySeconds <= 0) return;
        const id = setInterval(() => {
            setTimeToMaxEnergySeconds((prev) => (prev && prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(id);
    }, [timeToMaxEnergySeconds]);

    // Action: use streak saver for a given missed date (YYYY-MM-DD) then refresh daily streak state
    const applyStreakSaver = async (date) => {
        // Normalize input to 'YYYY-MM-DD'
        let d = date;
        if (date instanceof Date) {
            d = date.toISOString().slice(0, 10);
        } else if (typeof date === 'string' && date.length > 10) {
            d = date.slice(0, 10);
        }
        await postUseStreakSaver(d);
        // Refresh just the streak info
        try {
            const ds = await getMyDailyStreak();
            if (ds) {
                setStreak(Number(ds.streak_count ?? 0));
                setStreakDays(Array.isArray(ds.streak_days) ? ds.streak_days : []);
                setStreakSaversLeft(Number(ds.daily_streaks_left_this_month ?? 0));
            }
        } catch {
            // ignore errors here; UI can retry on next load
        }
    };

    return {
        level,
        xp,
        streak,
        energy,
        nextLevelProgressPct,
        rank,
        loading,
        error,
        streakDays,
        streakSaversLeft,
        applyStreakSaver,
        timeToMaxEnergySeconds,
    };
}
