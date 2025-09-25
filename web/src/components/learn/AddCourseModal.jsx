import { useEffect, useState } from "react";
import { addCourse, setSelectedCourse } from "@/stores/stores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock API function
function fetchAvailableCourses() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, title: "Algorithms", description: "Sorting, searching, complexity" },
        { id: 102, title: "Advanced C++", description: "Templates, STL internals, patterns" },
        { id: 103, title: "Systems Programming", description: "Memory, processes, concurrency" },
        { id: 104, title: "Game Dev Basics", description: "Loops, sprites, physics intro" },
        { id: 105, title: "Networking", description: "Sockets, protocols, HTTP" },
      ]);
    }, 600);
  });
}

export function AddCourseModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetchAvailableCourses()
      .then((data) => setItems(data))
      .catch(() => setError("Failed to load courses"))
      .finally(() => setLoading(false));
  }, [open]);

  const addAndSelect = (course) => {
    addCourse(course);
    setSelectedCourse(course);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
      <DialogContent className="p-0">
        <DialogHeader className="px-5 py-4 border-b">
          <DialogTitle className="text-sm">Join a Course</DialogTitle>
          <DialogDescription className="sr-only">Select a course to join from the list</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-3">
          {loading && <div className="text-xs text-muted-foreground">Loading courses...</div>}
          {error && <div className="text-xs text-red-600">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div className="text-xs text-muted-foreground">No courses available.</div>
          )}
          {!loading && items.map((c) => (
            <div
              key={c.id}
              className="group rounded-md border border-border p-3 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex flex-col gap-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{c.description}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => addAndSelect(c)}
                  className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-1 text-[11px] font-medium text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1Z" />
                  </svg>
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="px-5 py-3 border-t">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
