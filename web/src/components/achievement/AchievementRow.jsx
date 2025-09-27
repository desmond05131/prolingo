import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";

/**
 * AchievementRow (formerly AchievementCard)
 * Displays a full-width horizontal row with: Left (title + description) | Right (reward + progress)
 */
export function AchievementRow({
  title,
  description,
  reward,
  progress,
  claimable,
  claimed,
  onClaim,
  claiming,
  className,
}) {
  const hasProgress = !!(progress && (typeof progress.current === 'number') && (typeof progress.total === 'number'));
  const current = hasProgress ? progress.current : 0;
  const total = hasProgress ? progress.total : 0;
  const completed = hasProgress && total > 0 && current >= total;
  const claimBtnColor = completed
    ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600';
  // Build a label for the progress bar. If current is fractional, show a rounded integer over total.
  const progressLabel = hasProgress
    ? (Number.isInteger(current) ? undefined : `${Math.round(current)}/${total}`)
    : undefined;

  return (
    <Card
      className={cn(
        "w-full bg-secondary hover:shadow-md transition-shadow border border-border/50",
        className
      )}
    >
      <CardContent className="px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          {/* Left: title + description */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg text-white font-semibold truncate">
              {title}
            </h3>
            {description && (
              <p className="mt-3 text-sm md:text-base text-white line-clamp-3">
                {description}
              </p>
            )}
          </div>
          {/* Right: reward + action + progress (compact) */}
          <div className="w-full md:w-72 lg:w-80 flex flex-col gap-2 shrink-0">
            <div
              className={cn(
                "text-xs font-semibold ml-auto text-right",
                completed
                  ? "text-green-600 dark:text-green-400"
                  : "text-blue-600 dark:text-blue-400"
              )}
            >
              {reward}
            </div>
            {claimable && !claimed ? (
              <div className="flex items-center gap-3">
                <button
                  className={cn(
                    "inline-flex h-7 items-center justify-center px-3 text-white text-sm font-semibold rounded-sm border border-white disabled:opacity-60",
                    claimBtnColor
                  )}
                  disabled={!!claiming}
                  onClick={onClaim}
                >
                  {claiming ? 'Claiming…' : 'Claim'}
                </button>
                {hasProgress && (
                  <div className="flex-1">
                    <ProgressBar current={current} total={total} label={progressLabel} />
                  </div>
                )}
              </div>
            ) : (
              hasProgress && (
                <ProgressBar className="mt-3" current={current} total={total} label={progressLabel} />
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AchievementRow;
