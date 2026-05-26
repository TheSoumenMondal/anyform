import * as React from "react";
import { cn } from "~/lib/utils";

interface TerminalRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

export default function TerminalRating({
  value = 0,
  onChange,
  max = 5,
  disabled = false,
}: TerminalRatingProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);
  return (
    <div className="flex gap-2 h-10 items-center">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = hoveredValue !== null ? starValue <= hoveredValue : starValue <= value;
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => !disabled && setHoveredValue(starValue)}
            onMouseLeave={() => !disabled && setHoveredValue(null)}
            className={cn(
              "transition-all duration-150 active:scale-90 outline-none p-1 font-mono text-2xl leading-none",
              "focus-visible:ring-2 focus-visible:ring-[#00FF41]/50 focus-visible:bg-[#00FF41]/10",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-[#00FF41]/10",
              isFilled ? "text-[#00FF41]" : "text-[#00FF41]/20",
            )}
          >
            {isFilled ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
