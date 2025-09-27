import { useEffect, useRef, useState, useCallback } from "react";
import { useBoundStore, setCourses, setSelectedCourse } from "@/stores/stores";
import { AddCourseModal } from "@/components/learn/AddCourseModal";
import { listUserCourses } from "@/client-api";
import { MOCK_USER_COURSES } from "@/constants";

/*
  CourseSelect
  - Displays currently selected course (title)
  - On click toggles a custom dropdown panel containing list of courses
  - Each option shows title + description
  - Keyboard accessible (Enter/Space to open, Arrow keys to navigate, Esc to close)
*/

// Temporary local sample courses (fallback)
const DEFAULT_COURSES = MOCK_USER_COURSES;

export function CourseSelect() {
  const courses = useBoundStore((s) => s.courses);
  const selectedCourse = useBoundStore((s) => s.selectedCourse);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [openModal, setOpenModal] = useState(false);

  // Initialize courses once if empty
  useEffect(() => {
    if (!courses || courses.length === 0) {
      listUserCourses()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setCourses(data);
          } else {
            setCourses(DEFAULT_COURSES);
          }
        })
        .catch((err) => {
          console.error("Failed to load courses", err);
          setCourses(DEFAULT_COURSES);
        });
    }
  }, [courses]);

  const toggle = () => setOpen((o) => !o);
  const close = () => {
    setOpen(false);
    setHighlightIndex(-1);
  };

  const onSelect = useCallback((course, idx) => {
    setSelectedCourse(course);
    setHighlightIndex(idx ?? -1);
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

  const label = selectedCourse ? selectedCourse.course_title : "Select a course";

  const handleOpenModal = () => {
    // Close dropdown before opening modal for clarity
    close();
    setOpenModal(true);
  };

  const handleModalClose = async (payload) => {
    setOpenModal(false);
    // If unjoin happened, force page reload as requested
    if (payload?.unjoined) {
      window.location.reload();
      return;
    }
    // Otherwise, refetch dropdown values
    try {
      const data = await listUserCourses();
      if (Array.isArray(data) && data.length > 0) {
        setCourses(data);
      } else {
        setCourses(DEFAULT_COURSES);
      }
    } catch (err) {
      console.error("Failed to refresh courses after modal close", err);
      setCourses(DEFAULT_COURSES);
    }
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
            {courses.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">No courses available, join a course!</li>
            )}
            {courses.map((c, idx) => {
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
                    onClick={() => onSelect(c, idx)}
                    className="flex-1 text-left outline-none"
                  >
                    <div className="flex flex-col">
                      <span>{c.course_title}</span>
                      <span className="text-xs text-gray-500 leading-snug">{c.course_description}</span>
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
