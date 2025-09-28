import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Stats } from "../../components/Stats/Stats";
import "../../styles/Home.css";
import { UnitSection } from "@/components/learn/UnitSection";
// import { ReactComponent as PracticeExerciseSvg } from "../../assets/icons/practice-exercise.svg";
// import { ReactComponent as UpArrowSvg } from "../../assets/icons/up-arrow.svg";
import { Link } from "react-router-dom";
import { useBoundStore, refreshUserCourses, loadLearnUnitsForCourse } from "@/stores/stores";
import { useEffect } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";
import { CourseSelect } from "@/components/learn/CourseSelect";

function LearnHome() {
  const units = useBoundStore((state) => state.units);
  const coursesLoading = useBoundStore((s) => s.coursesLoading);
  const learnLoading = useBoundStore((s) => s.learnLoading);
  const coursesLoaded = useBoundStore((s) => s.coursesLoaded);

  useEffect(() => {
    // Requirement 4: On page load, first load CourseSelect (user courses), then learn data for first item
    // Guard with coursesLoaded to avoid repeated fetching when the list is empty
    if (coursesLoaded) return;
    const abort = new AbortController();
    refreshUserCourses(abort.signal).then(() => {
      const first = useBoundStore.getState().selectedCourse;
      const cid = first?.course_id ?? first?.id ?? null;
      return loadLearnUnitsForCourse(cid, abort.signal);
    });
    return () => abort.abort();
  }, [coursesLoaded]);

  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <Sidebar />
      {/* Scrollable central content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {/* Overlay container so UnitSection position is unaffected */}
          <div className="pointer-events-none absolute top-0 right-0 left-0 z-30">
            <div className="flex justify-end pr-6 pt-4">
              <div className="pointer-events-auto">
                <CourseSelect />
              </div>
            </div>
          </div>
          <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-4">
            {(coursesLoading || learnLoading) && (
              <div className="min-h-[50vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                  <LoadingIndicator size="16" />
                  <span className="text-sm">Loading learning content...</span>
                </div>
              </div>
            )}
            {!coursesLoading && !learnLoading && units.length === 0 && (
              <div className="min-h-[40vh] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-base font-medium text-gray-700">No content available for this course yet</p>
                  <p className="text-sm text-gray-500">Try another course first while this one gets ready.</p>
                </div>
              </div>
            )}
            {!coursesLoading && !learnLoading && units.map((unit) => (
              <UnitSection unit={unit} key={unit.unitNumber} />
            ))}
            <div className="sticky bottom-28 left-0 right-0 flex items-end justify-between">
              {/* Practice & jump buttons (future) */}
            </div>
          </div>
        </div>
      </div>
      <Stats />
    </div>
  );
}

export default LearnHome;
