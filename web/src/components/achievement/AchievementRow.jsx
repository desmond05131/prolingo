import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  className,
}) {
  const current = progress?.current || 0;
  const total = progress?.total || 0;
  const completed = total > 0 && current >= total;

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
          {/* Right: reward + progress (compact) */}
          <div className="w-full md:w-64 lg:w-56 flex flex-col gap-2 shrink-0">
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
            <ProgressBar className="mt-3" current={current} total={total} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AchievementRow;
