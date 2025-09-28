import { useBoundStore } from "@/stores/stores";
import { Link } from "react-router-dom";

export const UnitHeader = ({
  unitNumber,
  description,
  fullDescription,
  learningResourceUrl,
  backgroundColor,
  borderColor,
}) => {
  // const language = useBoundStore((x) => x.language);
  return (
    <article
      className={["max-w-2xl text-white sm:rounded-xl", backgroundColor].join(
        " "
      )}
    >
      <header className="flex items-center justify-between gap-4 p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Chapter {unitNumber}</h2>
          <p className="text-lg">{description}</p>
        </div>
        <div className="flex flex-row gap-3 items-center">
          {fullDescription && (
            <div className="relative group shrink-0">
              <button
                type="button"
                className={[
                  "flex h-9 w-9 items-center justify-center gap-3 rounded-2xl border-2 border-b-4 transition hover:text-gray-100",
                  borderColor,
                ].join(" ")}
                aria-label="Show full description"
                aria-describedby={`unit-${unitNumber}-full-desc`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8h.01" />
                  <path d="M11 12h1v4h1" />
                </svg>
              </button>
              <div
                role="tooltip"
                id={`unit-${unitNumber}-full-desc`}
                className="pointer-events-none absolute right-0 z-20 mt-2 max-w-xs rounded-md bg-black/80 p-3 text-sm text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                <p className="whitespace-pre-wrap">{fullDescription}</p>
              </div>
            </div>
          )}
          <a
            href={learningResourceUrl}
            target="_blank"
            className={[
              "flex items-center gap-3 rounded-2xl border-2 border-b-4 p-3 transition hover:text-gray-100",
              borderColor,
            ].join(" ")}
          >
            {/* <GuidebookSvg /> */}
            <span className="sr-only font-bold uppercase lg:not-sr-only">
              Learn More
            </span>
          </a>
        </div>
      </header>
    </article>
  );
};