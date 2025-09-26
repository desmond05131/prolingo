import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Stats } from "../../components/Stats/Stats";
import "../../styles/Home.css";
import { UnitSection } from "@/components/learn/UnitSection";
// import { ReactComponent as PracticeExerciseSvg } from "../../assets/icons/practice-exercise.svg";
// import { ReactComponent as UpArrowSvg } from "../../assets/icons/up-arrow.svg";
import { Link } from "react-router-dom";
import { setUnits, setCompletedTestIds, useBoundStore } from "@/stores/stores";
import { useEffect } from "react";
// import { units as unitsConst } from "@/constants";
import { fetchClientTestsTree, fetchClientUserTests } from "@/client-api";
import { CourseSelect } from "@/components/learn/CourseSelect";

function LearnHome() {
  const units = useBoundStore((state) => state.units);

  useEffect(() => {
    let abort = new AbortController();

    async function load() {
      try {
        const [tree, userTests] = await Promise.all([
          fetchClientTestsTree(abort.signal),
          fetchClientUserTests(abort.signal),
        ]);

        // userTests expected to contain test references; collect completed test_ids
        // Assuming each record has either test or test_id; and a status/score to qualify completion
        const completedIds = (userTests || [])
          .filter((ut) => {
            // Infer completion: passing score or status === 'complete' if available
            if (typeof ut.passed !== 'undefined') return !!ut.passed;
            if (typeof ut.status === 'string') return ut.status.toLowerCase() === 'complete';
            if (typeof ut.score !== 'undefined' && typeof ut.passing_score !== 'undefined') {
              return Number(ut.score) >= Number(ut.passing_score);
            }
            // Fallback: count all attempts as completed steps
            return true;
          })
          .map((ut) => ut.test_id ?? ut.test?.test_id)
          .filter(Boolean);

        setCompletedTestIds(completedIds);

        // Build units from tree data grouped by chapter or course
        // Schema item example:
        // { course: {...}, chapter: {...}, test: {...} }
        const byChapter = new Map();
        (tree || [])
          .filter(x => x.test != null) // ignore empty test items
          .forEach((row) => {
          const chapId = row.chapter?.chapter_id;
          if (!chapId) return;
          if (!byChapter.has(chapId)) {
            byChapter.set(chapId, {
              unitNumber: row.chapter.order_index ?? byChapter.size + 1,
              description: row.chapter.title || "",
              // keep colors minimal; could map per course later
              backgroundColor: "bg-[#CC8427]",
              textColor: "text-[#CC8427]",
              borderColor: "border-[#FFA531]",
              tiles: [],
              order_index: row.chapter.order_index,
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

        // Add a trophy tile at end of each unit for review UI consistency
        // byChapter.forEach((unit) => {
        //   if (unit.tiles.length > 0) {
        //     unit.tiles.push({ type: "trophy", description: `${unit.description} review` });
        //   }
        // });

        const unitsFromApi = Array.from(byChapter.values()).sort(
          (a, b) => (a.unitNumber || 0) - (b.unitNumber || 0)
        );
        setUnits(unitsFromApi);

        console.log('learning module loaded', unitsFromApi, completedIds)
      } catch (e) {
        // On failure, keep current units (could fallback to constants if desired)
        console.error("Failed to load learn tree:", e);
      }
      return () => abort.abort();
    }

    load();
    return () => abort.abort();
  }, []);

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
            {units.map((unit) => (
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
