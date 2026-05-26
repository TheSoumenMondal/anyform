import * as React from "react";
import { StarIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface OsRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

function OsRating({ value = 0, onChange, max = 5, disabled = false }: OsRatingProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);
  return (
    <div className="flex gap-1 h-8 items-center">
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
              "transition-all active:scale-90 outline-none group p-1 rounded-md",
              "focus-visible:ring-[3px] focus-visible:ring-[#007AFF]/30",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-black/5 dark:hover:bg-white/5",
            )}
          >
            <StarIcon
              className={cn(
                "size-5 transition-colors",
                isFilled
                  ? "text-[#FFCC00] fill-[#FFCC00]"
                  : "text-gray-400 dark:text-gray-500 fill-transparent group-hover:text-[#FFCC00]/50",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
export default OsRating;
