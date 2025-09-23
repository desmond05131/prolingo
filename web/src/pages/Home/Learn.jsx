import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Stats } from "../../components/Stats/Stats";
import "../../styles/Home.css";
import { UnitSection } from "@/components/learn/UnitSection";
// import { ReactComponent as PracticeExerciseSvg } from "../../assets/icons/practice-exercise.svg";
// import { ReactComponent as UpArrowSvg } from "../../assets/icons/up-arrow.svg";
import { Link } from "react-router-dom";
import { setUnits, useBoundStore } from "@/stores/stores";
import { useEffect } from "react";
import { units as unitsConst } from "@/constants";

function LearnHome() {
  const units = useBoundStore((state) => state.units);

  useEffect(() => {
    setUnits(unitsConst);
  }, []);

  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <Sidebar />
      {/* Scrollable central content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto no-scrollbar">
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
