import * as React from "react";
import { StarIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface DefaultRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

export default function DefaultRating({
  value = 0,
  onChange,
  max = 5,
  disabled = false,
}: DefaultRatingProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);
  return (
    <div className="flex gap-1.5 h-10 items-center">
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
              "transition-all duration-200 active:scale-90 outline-none rounded-full p-1",
              "focus-visible:ring-2 focus-visible:ring-gray-300",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50",
            )}
          >
            <StarIcon
              className={cn(
                "size-7 transition-colors duration-200",
                isFilled ? "text-[#FBBF24] fill-[#FBBF24]" : "text-gray-200 fill-gray-200",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
