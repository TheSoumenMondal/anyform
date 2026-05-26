import * as React from "react";
import { StarIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface MovieRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

export default function MovieRating({
  value = 0,
  onChange,
  max = 5,
  disabled = false,
}: MovieRatingProps) {
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
              "transition-all duration-300 active:scale-75 outline-none group",
              "focus-visible:ring-4 focus-visible:ring-[#E23636]/30 rounded-lg p-1",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110",
            )}
          >
            <StarIcon
              className={cn(
                "size-8 transition-colors duration-300",
                isFilled
                  ? "text-[#E23636] fill-[#E23636] drop-shadow-[0_0_10px_rgba(226,54,54,0.8)]"
                  : "text-gray-700 fill-transparent group-hover:text-[#E23636]/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
