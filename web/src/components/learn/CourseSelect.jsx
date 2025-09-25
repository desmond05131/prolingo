import { useEffect, useRef, useState, useCallback } from "react";
import { useBoundStore, setCourses, setSelectedCourse, removeCourse } from "@/stores/stores";
import { AddCourseModal } from "@/components/learn/AddCourseModal";

/*
  CourseSelect
  - Displays currently selected course (title)
  - On click toggles a custom dropdown panel containing list of courses
  - Each option shows title + description
  - Keyboard accessible (Enter/Space to open, Arrow keys to navigate, Esc to close)
*/

// Temporary local sample courses (replace or populate from API/constants)
const DEFAULT_COURSES = [
  { id: 1, title: "C++ Foundations", description: "Basics, syntax, and first programs" },
  { id: 2, title: "C++ OOP", description: "Classes, objects, inheritance" },
  { id: 3, title: "Data Structures", description: "Vectors, lists, maps, and more" },
  { id: 4, title: "Data Structures", description: "Vectors, lists, maps, and more" },
  { id: 5, title: "Data Structures", description: "Vectors, lists, maps, and more" },
  { id: 6, title: "Data Structures", description: "Vectors, lists, maps, and more" },
];

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
      setCourses(DEFAULT_COURSES);
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

  // Keyboard interactions
  useEffect(() => {
    function handleKey(e) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((i) => {
          const next = Math.min((i < 0 ? 0 : i + 1), courses.length - 1);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((i) => {
          const next = Math.max(i - 1, 0);
            return next;
        });
      } else if (e.key === "Enter" || e.key === " ") {
        if (highlightIndex >= 0 && courses[highlightIndex]) {
          e.preventDefault();
          onSelect(courses[highlightIndex], highlightIndex);
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, highlightIndex, courses, onSelect]);

  const label = selectedCourse ? selectedCourse.title : "Select a course";

  const handleOpenModal = () => {
    // Close dropdown before opening modal for clarity
    close();
    setOpenModal(true);
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
              <li className="px-3 py-2 text-sm text-gray-500">No courses available</li>
            )}
            {courses.map((c, idx) => {
              const isHighlighted = idx === highlightIndex;
              const isSelected = selectedCourse?.id === c.id;
              return (
                <li
                  key={c.id}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  onMouseLeave={() => setHighlightIndex(-1)}
                  className={`group flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isHighlighted ? "bg-indigo-50" : ""
                  } ${isSelected ? "font-semibold text-indigo-600" : "text-gray-700"}`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(c, idx)}
                    className="flex-1 text-left outline-none"
                  >
                    <div className="flex flex-col">
                      <span>{c.title}</span>
                      <span className="text-xs text-gray-500 leading-snug">{c.description}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCourse(c.id);
                    }}
                    className="opacity-60 hover:opacity-100 text-gray-400 hover:text-red-600 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove ${c.title}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
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
              Add / join course
            </button>
          </div>
        </div>
      )}
      <AddCourseModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
