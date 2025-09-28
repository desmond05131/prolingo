import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { listCourses, listUserCourses, joinUserCourse, unjoinUserCourse } from "@/client-api";
import LoadingIndicator from "@/components/LoadingIndicator";

export function AddCourseModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [joinedMap, setJoinedMap] = useState({}); // courseId -> { userCourseId, raw }
  const [actionId, setActionId] = useState(null); // course id currently joining/unjoining
  const [didUnjoin, setDidUnjoin] = useState(false); // track if any unjoin occurred while open

  useEffect(() => {
    if (!open) return;
    // reset session flags each time modal opens
  setDidUnjoin(false);
    const abort = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [coursesRes, userCoursesRes] = await Promise.all([
          listCourses(abort.signal),
          listUserCourses(abort.signal),
        ]);
        const ensureArray = (x) => (Array.isArray(x) ? x : Array.isArray(x?.results) ? x.results : []);
        const courses = ensureArray(coursesRes);
        const userCourses = ensureArray(userCoursesRes);
        setItems(courses);
        // Build map: courseId -> userCourse record id
        const map = {};
        for (const uc of userCourses) {
            map[uc.course_id] = true;
        }
        setJoinedMap(map);
      } catch {
        // omit error handling: keep items empty and show loading state only
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => abort.abort();
  }, [open]);

  const isJoined = useMemo(() => {
    return (courseId) => Boolean(joinedMap[courseId]);
  }, [joinedMap]);

  const handleJoin = async (course) => {
    try {
      setActionId(course.course_id);
      await joinUserCourse(course.course_id);
      setJoinedMap((prev) => ({ ...prev, [course.course_id]: true }));
    } catch {
      // omit error handling
    } finally {
      setActionId(null);
    }
  };

  const handleUnjoin = async (course) => {
    const entry = joinedMap[course.course_id];
    if (!entry) return;
    try {
      setActionId(course.course_id);
      await unjoinUserCourse(course.course_id);
      setJoinedMap((prev) => {
        const copy = { ...prev };
        delete copy[course.course_id];
        return copy;
      });
      setDidUnjoin(true);
    } catch {
      // omit error handling
    } finally {
      setActionId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.({ unjoined: didUnjoin }); }}>
      <DialogContent className="p-0">
        <DialogHeader className="px-5 py-4 border-b">
          <DialogTitle className="text-sm">Join a Course</DialogTitle>
          <DialogDescription className="sr-only">Select a course to join from the list</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-3">
          {loading && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <LoadingIndicator />
              <span>Loading courses...</span>
            </div>
          )}
          {/* omit error UI per requirement */}
          {!loading && !error && items.length === 0 && (
            <div className="text-xs text-muted-foreground">No courses available.</div>
          )}
          {!loading && items.map((c) => (
            <div
              key={c.course_id}
              className="group rounded-md border border-border p-3 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex flex-col gap-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{c.description}</p>
                </div>
              </div>
              <div className="flex justify-end">
                {isJoined(c.course_id) ? (
                  <button
                    onClick={() => handleUnjoin(c)}
                    disabled={actionId === c.course_id}
                    className="inline-flex items-center gap-1 rounded-md border border-red-500 text-red-600 bg-white px-2 py-1 text-[11px] font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60"
                  >
                    {actionId === c.course_id ? (
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1Z" />
                      </svg>
                    )}
                    Unjoin 
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(c)}
                    disabled={actionId === c.course_id}
                    className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-1 text-[11px] font-medium text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                  >
                    {actionId === c.course_id ? (
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1Z" />
                      </svg>
                    )}
                    Join
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="px-5 py-3 border-t">
          <button
            onClick={() => onClose?.({ unjoined: didUnjoin })}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
