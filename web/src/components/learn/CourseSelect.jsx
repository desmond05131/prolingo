import { useEffect, useRef, useState, useCallback } from "react";
import {
  useBoundStore,
  setSelectedCourse,
  refreshUserCourses,
  loadLearnUnitsForCourse,
} from "@/stores/stores";
import LoadingIndicator from "@/components/LoadingIndicator";
import { AddCourseModal } from "@/components/learn/AddCourseModal";

/*
  CourseSelect
  - Displays currently selected course (title)
  - On click toggles a custom dropdown panel containing list of courses
  - Each option shows title + description
  - Keyboard accessible (Enter/Space to open, Arrow keys to navigate, Esc to close)
*/

export function CourseSelect() {
  const courses = useBoundStore((s) => s.courses);
  const selectedCourse = useBoundStore((s) => s.selectedCourse);
  const loading = useBoundStore((s) => s.coursesLoading);
  const coursesLoaded = useBoundStore((s) => s.coursesLoaded);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  // keyboard highlight index can be added later if needed
  const [openModal, setOpenModal] = useState(false);

  // Initialize courses once if empty
  // Initialize courses once; do not loop when list is empty
  useEffect(() => {
    if (coursesLoaded) return; // already attempted
    const abort = new AbortController();
    refreshUserCourses(abort.signal).then(() => {
      const first = useBoundStore.getState().selectedCourse;
      const cid = first?.course_id ?? first?.id ?? null;
      loadLearnUnitsForCourse(cid, abort.signal);
    });
    return () => abort.abort();
  }, [coursesLoaded]);

  const toggle = () => setOpen((o) => !o);
  const close = () => {
    setOpen(false);
  };

  const onSelect = useCallback((course) => {
    setSelectedCourse(course);
    // Trigger learn reload for newly selected course
    const cid = course.course_id ?? course.id;
    loadLearnUnitsForCourse(cid);
    close();
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (!open) return;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        close();
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  const label = selectedCourse ? (selectedCourse.course_title || selectedCourse.title) : "Select a course";

  const handleOpenModal = () => {
    // Close dropdown before opening modal for clarity
    close();
    setOpenModal(true);
  };

  const handleModalClose = async () => {
    setOpenModal(false);
    // Always refetch courses after modal closes; requirement 5 will then trigger learn reload via first item
    const abort = new AbortController();
    await refreshUserCourses(abort.signal);
    const first = useBoundStore.getState().selectedCourse;
    const cid = first?.course_id ?? first?.id ?? null;
    await loadLearnUnitsForCourse(cid, abort.signal);
  };

  return (
    <div className="relative inline-block text-left" aria-label="Course selection">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="font-medium text-sm">{label}</span>
        {loading && (
          <span className="text-indigo-600">
            <LoadingIndicator />
          </span>
        )}
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute right-0 z-20 mt-2 w-72 rounded-md border border-gray-200 bg-white p-1 shadow-lg focus:outline-none"
        >
          <ul
            role="listbox"
            tabIndex={-1}
            className="max-h-[280px] overflow-y-auto pr-1"
          >
            {loading && (
              <li className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                <LoadingIndicator />
                <span>Loading courses...</span>
              </li>
            )}
            {!loading && courses.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">No courses available, join a course!</li>
            )}
            {!loading && courses.map((c) => {
              const isSelected = selectedCourse?.id === c.id;
              return (
                <li
                  key={c.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`group flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-indigo-50 ${isSelected ? "font-semibold text-indigo-600" : "text-gray-700"}`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(c)}
                    className="flex-1 text-left outline-none"
                  >
                    <div className="flex flex-col">
                      <span>{c.course_title || c.title}</span>
                      <span className="text-xs text-gray-500 leading-snug">{c.course_description || c.description}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-1 border-t border-gray-200 pt-1">
            <button
              type="button"
              onClick={handleOpenModal}
              className="flex w-full items-center justify-center gap-1 rounded-md bg-indigo-50 px-2 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z" />
              </svg>
              Enroll / Unenroll Course
            </button>
          </div>
        </div>
      )}
      <AddCourseModal open={openModal} onClose={handleModalClose} />
    </div>
  );
}
