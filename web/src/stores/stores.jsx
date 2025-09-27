import { create } from "zustand";
import {
  listUserCourses,
  fetchClientTestsTree,
  fetchClientUserTests,
  getMyGameInfo,
  getMyLeaderboard,
  getMyDailyStreak,
  useStreakSaver as postUseStreakSaver,
} from "@/client-api";

export const useBoundStore = create(() => ({
  count: 0,
  text: "hello",
  // Array of test_ids that the user has completed/attempted successfully
  completedTestIds: [],
  lessonsCompleted: [],
  increaseLessonsCompleted: [],
  increaseLingots: [],
  units: [],
  language: { code: "es", name: "Spanish" },
  // courses list can be populated from constants or API
  courses: [],
  selectedCourse: null,
  // loading flags
  coursesLoading: false,
  learnLoading: false,
  coursesLoaded: false,

  // Global player stats (shared across app)
  statsLoading: false,
  statsLoaded: false,
  statsError: null,
  level: 1,
  xp: 0,
  energy: 100,
  nextLevelProgressPct: 0,
  nextLevelXP: 0,
  rank: null,
  streak: 0,
  streakDays: [], // [{ daily_streak_date, is_streak_saver }]
  streakSaversLeft: 0,
  timeToMaxEnergySeconds: null,
  username: '',
  profile_icon: null,
  role: null, // 'student' or other (e.g., 'admin')
}));

export const setUnits = (units) => {
  useBoundStore.setState({ units });
};

export const setCompletedTestIds = (ids) => {
  useBoundStore.setState({ completedTestIds: Array.isArray(ids) ? ids : [] });
};

export const setCourses = (courses) => {
  useBoundStore.setState({ courses });
  // If no selected course yet, default to first
  if (courses?.length) {
    useBoundStore.setState((state) => ({
      selectedCourse: state.selectedCourse ?? courses[0],
    }));
  }
};

export const setSelectedCourse = (course) => {
  useBoundStore.setState({ selectedCourse: course });
};

export const addCourse = (course) => {
  useBoundStore.setState((state) => {
    const exists = state.courses.some((c) => c.id === course.id);
    if (exists) return {};
    return { courses: [...state.courses, course] };
  });
};

export const removeCourse = (courseId) => {
  useBoundStore.setState((state) => {
    const filtered = state.courses.filter((c) => c.id !== courseId);
    let nextSelected = state.selectedCourse;
    if (!filtered.some((c) => c.id === nextSelected?.id)) {
      nextSelected = filtered[0] || null;
    }
    return { courses: filtered, selectedCourse: nextSelected };
  });
};

// Helper: normalize array or {results: []}
const asArray = (x) => (Array.isArray(x) ? x : Array.isArray(x?.results) ? x.results : []);

// Centralized: fetch current user's joined courses and set first as selected
export const refreshUserCourses = async (signal) => {
  useBoundStore.setState({ coursesLoading: true, coursesLoaded: false });
  // Clear learn content to avoid showing stale units while selecting/refetching courses
  useBoundStore.setState({ units: [], completedTestIds: [] });
  try {
    const data = await listUserCourses(signal);
    const list = asArray(data);
    useBoundStore.setState({
      courses: list,
      selectedCourse: list[0] ?? null,
    });
  } finally {
    useBoundStore.setState({ coursesLoading: false, coursesLoaded: true });
  }
};

// Centralized: load learn units and completed test ids for a given course
export const loadLearnUnitsForCourse = async (courseId, signal) => {
  if (!courseId) {
    // Clear units if no course
    useBoundStore.setState({ units: [], completedTestIds: [] });
    return;
  }
  useBoundStore.setState({ learnLoading: true });
  try {
    const [tree, userTests] = await Promise.all([
      fetchClientTestsTree(signal),
      fetchClientUserTests(signal),
    ]);

    const completedIds = (userTests || [])
      .filter((ut) => {
        if (typeof ut.passed !== "undefined") return !!ut.passed;
        if (typeof ut.status === "string") return ut.status.toLowerCase() === "complete";
        if (typeof ut.score !== "undefined" && typeof ut.passing_score !== "undefined") {
          return Number(ut.score) >= Number(ut.passing_score);
        }
        return true;
      })
      .map((ut) => ut.test_id ?? ut.test?.test_id)
      .filter(Boolean);

    // Build units grouped by chapter for the specific course
    const byChapter = new Map();
    (tree || [])
      .filter((row) => row?.course?.course_id === courseId)
      .filter((row) => row.test != null)
      .forEach((row) => {
        const chapId = row.chapter?.chapter_id;
        if (!chapId) return;
        if (!byChapter.has(chapId)) {
          byChapter.set(chapId, {
            unitNumber: row.chapter?.order_index ?? byChapter.size + 1,
            description: row.chapter?.title || "",
            backgroundColor: "bg-[#CC8427]",
            textColor: "text-[#CC8427]",
            borderColor: "border-[#FFA531]",
            tiles: [],
            order_index: row.chapter?.order_index,
            fullDescription: row.chapter?.description || '',
            learningResourceUrl: row.chapter?.learning_resource_url || '',
          });
        }
        const unit = byChapter.get(chapId);
        if (row.test) {
          unit.tiles.push({
            type: "book",
            description: row.test.title || `Lesson ${row.test.test_id}`,
            test_id: row.test.test_id,
            order_index: row.test.order_index,
          });
        }
      });

    const unitsFromApi = Array.from(byChapter.values()).sort(
      (a, b) => (a.unitNumber || 0) - (b.unitNumber || 0)
    );

    useBoundStore.setState({
      units: unitsFromApi,
      completedTestIds: completedIds,
    });
  } finally {
    useBoundStore.setState({ learnLoading: false });
  }
};

// Centralized: refresh global player stats
export const refreshStats = async (signal) => {
  useBoundStore.setState({ statsLoading: true, statsError: null });
  const controller = new AbortController();
  const abortSignal = signal || controller.signal;
  try {
    const [gameinfo, lb, ds] = await Promise.all([
      getMyGameInfo(abortSignal),
      getMyLeaderboard(abortSignal).catch(() => null),
      getMyDailyStreak(abortSignal).catch(() => null),
    ]);

    const next = {};
    if (gameinfo) {
      next.level = Number(gameinfo.level ?? 1);
      next.xp = Number(gameinfo.xp_value ?? 0);
      next.energy = Number(gameinfo.energy_value ?? 0);
      next.nextLevelXP = Number(gameinfo.next_level_xp ?? 0);
      next.nextLevelProgressPct = Number(gameinfo.next_level_progress_pct ?? 0);
      const t = gameinfo.time_to_max_energy_seconds;
      next.timeToMaxEnergySeconds =
        t === null || t === undefined ? null : typeof t === "number" ? t : Number(t) || 0;
    }

    if (lb && typeof lb.rank !== "undefined") {
      next.rank = lb.rank;
      next.username = lb.username || '';
      next.profile_icon = lb.profile_icon || null;
    } else {
      next.rank = null;
    }

    if (ds) {
      next.streak = Number(ds.streak_count ?? 0);
      next.streakDays = Array.isArray(ds.streak_days) ? ds.streak_days : [];
      next.streakSaversLeft = Number(ds.streak_saver_left_this_month ?? 0);
    } else {
      next.streak = 0;
      next.streakDays = [];
      next.streakSaversLeft = 0;
    }

    useBoundStore.setState({ ...next, statsLoaded: true });
  } catch (e) {
    useBoundStore.setState({ statsError: e?.message || "Failed to load stats" });
  } finally {
    useBoundStore.setState({ statsLoading: false });
    // Do not abort if external signal was passed
    if (!signal) controller.abort();
  }
};

// Action: use a streak saver and refresh only the streak bits
export const useStreakSaver = async (date) => {
  // Normalize input to 'YYYY-MM-DD'
  let d = date;
  if (date instanceof Date) {
    d = date.toISOString().slice(0, 10);
  } else if (typeof date === "string" && date.length > 10) {
    d = date.slice(0, 10);
  }
  await postUseStreakSaver(d);
  try {
    const ds = await getMyDailyStreak();
    if (ds) {
      useBoundStore.setState({
        streak: Number(ds.streak_count ?? 0),
        streakDays: Array.isArray(ds.streak_days) ? ds.streak_days : [],
        streakSaversLeft: Number(ds.daily_streaks_left_this_month ?? 0),
      });
    }
  } catch {
    // ignore
  }
};

// Setter: update role in global store
export const setUserRole = (role) => {
  const r = typeof role === 'string' ? role.toLowerCase() : null;
  useBoundStore.setState({ role: r });
};