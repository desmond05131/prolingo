import { create } from "zustand";
import {
  listUserCourses,
  fetchClientTestsTree,
  fetchClientUserTests,
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