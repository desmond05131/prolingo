import { create } from "zustand";

export const useBoundStore = create(() => ({
  count: 0,
  text: "hello",
  lessonsCompleted: [],
  increaseLessonsCompleted: [],
  increaseLingots: [],
  units: [],
  language: { code: "es", name: "Spanish" },
  // courses list can be populated from constants or API
  courses: [],
  selectedCourse: null,
}));

export const setUnits = (units) => {
  useBoundStore.setState({ units });
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