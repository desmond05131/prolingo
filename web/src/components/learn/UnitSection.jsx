import { useBoundStore } from "@/stores/stores";
import { useEffect, useState, useCallback } from "react";
import { TileIcon } from "./TileIcon";
import { HoverLabel } from "./HoverLabel";
import { UnitHeader } from "./UnitHeader";
import { TileTooltip } from "./TileTooltip";

const tileLeftClassNames = [
  "left-0",
  "left-[-45px]",
  "left-[-70px]",
  "left-[-45px]",
  "left-0",
  "left-[45px]",
  "left-[70px]",
  "left-[45px]",
];

const getTileLeftClassName = ({ index, unitNumber, tilesLength }) => {
  if (index >= tilesLength - 1) {
    return "left-0";
  }

  const classNames =
    unitNumber % 2 === 1
      ? tileLeftClassNames
      : [...tileLeftClassNames.slice(4), ...tileLeftClassNames.slice(0, 4)];

  return classNames[index % classNames.length] ?? "left-0";
};

const getTileColors = ({ tileType, status, defaultColors }) => {
  switch (status) {
    case "LOCKED":
      if (tileType === "fast-forward") return defaultColors;
      return "border-[#b7b7b7] bg-[#e5e5e5]";
    case "COMPLETE":
      return "border-yellow-500 bg-yellow-400";
    case "ACTIVE":
      return defaultColors;
  }
};

// Determine the status of a tile ensuring only one ACTIVE tile per unit (chapter):
// - Tiles with completed test_id are COMPLETE
// - The first tile with a non-completed test_id is ACTIVE
// - All tiles after that are LOCKED
// - Non-test tiles (no test_id) are LOCKED to respect the single ACTIVE rule
const tileStatus = (tiles, index, completedTestIds) => {
  const tile = tiles[index];

  // Completed test tiles are COMPLETE
  if (tile?.test_id && completedTestIds?.includes(tile.test_id)) {
    return "COMPLETE";
  }

  // Find the first uncompleted test tile in this unit
  const firstUncompletedIndex = tiles.findIndex(
    (t) => t?.test_id && !(completedTestIds?.includes(t.test_id))
  );

  // If there is an uncompleted test tile, only that one is ACTIVE; others are LOCKED (unless COMPLETE above)
  if (firstUncompletedIndex !== -1) {
    if (index === firstUncompletedIndex) return "ACTIVE";
    return "LOCKED";
  }

  // No uncompleted test tiles: nothing should be ACTIVE; non-completed/non-test tiles remain LOCKED
  return "LOCKED";
};

export const UnitSection = ({ unit }) => {
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedTileInfo, setSelectedTileInfo] = useState(null);

  useEffect(() => {
    const unselectTile = () => setSelectedTile(null);
    window.addEventListener("scroll", unselectTile);
    return () => window.removeEventListener("scroll", unselectTile);
  }, []);

  const closeTooltip = useCallback(() => setSelectedTile(null), []);

  const completedTestIds = useBoundStore((x) => x.completedTestIds);
  const increaseLessonsCompleted = useBoundStore(
    (x) => x.increaseLessonsCompleted
  );
  const increaseLingots = useBoundStore((x) => x.increaseLingots);
  // Note: Status logic ensures a single ACTIVE tile per unit; no need to track chapter state here

  return (
    <>
      <UnitHeader
        unitNumber={unit.unitNumber}
        description={unit.description}
        fullDescription={unit.fullDescription}
        learningResourceUrl={unit.learningResourceUrl}
        backgroundColor={unit.backgroundColor}
        borderColor={unit.borderColor}
      />
      <div className="relative mb-8 mt-[67px] flex max-w-2xl flex-col items-center gap-4">
        {unit.tiles.map((tile, i) => {
          // Prefer status provided by unit.tiles if backend supplies it; otherwise use computed
          const status = (() => {
            const raw = tile?.status;
            if (typeof raw === 'string') {
              const s = raw.trim().toLowerCase();
              if (s === 'passed') return 'COMPLETE';
              if (s === 'active') return 'ACTIVE';
              if (s === 'locked') return 'LOCKED';
            }
            return tileStatus(unit.tiles, i, completedTestIds);
          })();
          return (
            <div key={i}>
              {(() => {
                switch (tile.type) {
                  case "star":
                  case "book":
                  case "dumbbell":
                  case "trophy":
                  case "fast-forward":
                    if (tile.type === "trophy" && status === "COMPLETE") {
                      return (
                        <div className="relative">
                          <TileIcon tileType={tile.type} status={status} />
                          <div className="absolute left-0 right-0 top-6 flex justify-center text-lg font-bold text-yellow-700">
                            {unit.unitNumber}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        className={[
                          "relative -mb-4 h-[93px] w-[98px]",
                          getTileLeftClassName({
                            index: i,
                            unitNumber: unit.unitNumber,
                            tilesLength: unit.tiles.length,
                          }),
                        ].join(" ")}
                      >
                        {selectedTile !== i && status === "ACTIVE" ? (
                          <HoverLabel text="Start" textColor={unit.textColor} />
                        ) : null}
                        {/* <LessonCompletionSvg
                          lessonsCompleted={lessonsCompleted}
                          status={status}
                        /> */}
                        <button
                          className={[
                            "absolute m-3 rounded-full border-b-8 p-4",
                            getTileColors({
                              tileType: tile.type,
                              status,
                              defaultColors: `${unit.borderColor} ${unit.backgroundColor}`,
                            }),
                          ].join(" ")}
                          onClick={() => {
                            setSelectedTile(i);
                            setSelectedTileInfo(tile);
                          }}
                        >
                          <TileIcon tileType={tile.type} status={status} />
                          <span className="sr-only">Show lesson</span>
                        </button>
                      </div>
                    );
                  case "treasure":
                    return (
                      <div
                        className={[
                          "relative -mb-4",
                          getTileLeftClassName({
                            index: i,
                            unitNumber: unit.unitNumber,
                            tilesLength: unit.tiles.length,
                          }),
                        ].join(" ")}
                        onClick={() => {
                          if (status === "ACTIVE") {
                            increaseLessonsCompleted(4);
                            increaseLingots(1);
                          }
                        }}
                        role="button"
                        tabIndex={status === "ACTIVE" ? 0 : undefined}
                        aria-hidden={status !== "ACTIVE"}
                        aria-label={status === "ACTIVE" ? "Collect reward" : ""}
                      >
                        {status === "ACTIVE" && (
                          <HoverLabel text="Open" textColor="text-yellow-400" />
                        )}
                        <TileIcon tileType={tile.type} status={status} />
                      </div>
                    );
                }
              })()}
              <TileTooltip
                selectedTile={selectedTile}
                selectedTileInfo={selectedTileInfo}
                index={i}
                unitNumber={unit.unitNumber}
                tilesLength={unit.tiles.length}
                description={(() => {
                  switch (tile.type) {
                    case "book":
                    case "dumbbell":
                    case "star":
                      return tile.description;
                    case "fast-forward":
                      return status === "LOCKED"
                        ? "Jump here?"
                        : tile.description;
                    case "trophy":
                      return `Unit ${unit.unitNumber} review`;
                    case "treasure":
                      return "";
                  }
                })()}
                status={status}
                closeTooltip={closeTooltip}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
