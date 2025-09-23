import { create } from "zustand";

export const useBoundStore = create(() => ({
  count: 0,
  text: "hello",
  lessonsCompleted: [],
  increaseLessonsCompleted: [],
  increaseLingots: [],
  units: [],
  language: { code: "es", name: "Spanish" },
}));

export const setUnits = (units) => {
  useBoundStore.setState({ units });
}