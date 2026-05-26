"use client";

import React, { useMemo } from "react";
import { cn } from "~/lib/utils";

interface HeatmapChartProps {
  data: { hour: number; dayOfWeek: number; count: number }[];
  className?: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const HeatmapChart = ({ data, className }: HeatmapChartProps) => {
  // Map data to a grid [day][hour]
  const grid = useMemo(() => {
    const matrix = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));

    let maxCount = 0;
    data.forEach((d) => {
      if (d.dayOfWeek >= 0 && d.dayOfWeek <= 6 && d.hour >= 0 && d.hour <= 23) {
        matrix[d.dayOfWeek]![d.hour] = d.count;
        if (d.count > maxCount) maxCount = d.count;
      }
    });

    return { matrix, maxCount };
  }, [data]);

  const getColorOpacity = (count: number, max: number) => {
    if (count === 0) return 0;
    // Scale from 0.2 to 1 based on intensity
    return 0.2 + (count / (max || 1)) * 0.8;
  };

  return (
    <div className={cn("flex flex-col overflow-x-auto", className)}>
      <div className="flex gap-2 min-w-max">
        {/* Y-axis labels (Days) */}
        <div className="flex flex-col gap-1 pr-2 pt-6">
          {DAYS.map((day) => (
            <div
              key={day}
              className="h-6 flex items-center text-xs text-muted-foreground font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid and X-axis (Hours) */}
        <div className="flex flex-col flex-1">
          {/* X-axis labels */}
          <div className="flex gap-1 h-6 items-end pb-2">
            {HOURS.map((hour) => (
              <div key={hour} className="w-6 flex justify-center text-[10px] text-muted-foreground">
                {hour % 3 === 0
                  ? `${hour === 0 ? "12a" : hour < 12 ? hour + "a" : hour === 12 ? "12p" : hour - 12 + "p"}`
                  : ""}
              </div>
            ))}
          </div>

          {/* Grid cells */}
          <div className="flex flex-col gap-1">
            {grid.matrix.map((row, dayIdx) => (
              <div key={dayIdx} className="flex gap-1">
                {row.map((count, hourIdx) => (
                  <div
                    key={`${dayIdx}-${hourIdx}`}
                    className="w-6 h-6 rounded-sm bg-chart-1 relative group cursor-crosshair transition-opacity duration-200"
                    style={{
                      opacity: count === 0 ? 0.05 : getColorOpacity(count, grid.maxCount),
                    }}
                  >
                    {count > 0 && (
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity z-10 bottom-full mb-1 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none">
                        {count} submissions
                        <br />
                        <span className="text-muted-foreground text-[10px]">
                          {DAYS[dayIdx]}{" "}
                          {hourIdx === 0
                            ? "12 AM"
                            : hourIdx < 12
                              ? `${hourIdx} AM`
                              : hourIdx === 12
                                ? "12 PM"
                                : `${hourIdx - 12} PM`}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
