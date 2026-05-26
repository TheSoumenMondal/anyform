import * as React from "react";
import { StarIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface AnimeRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

/**
 * Anime-themed Rating component (using Stars)
 */
function AnimeRating({ value = 0, onChange, max = 5, disabled = false }: AnimeRatingProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);

  return (
    <div className="flex gap-2.5 h-12 items-center">
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
              "transition-all active:scale-90 outline-none group",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110",
            )}
          >
            <div
              className={cn(
                "p-2 rounded-none border border-white/5 transition-all duration-200 relative overflow-hidden",
                isFilled ? "bg-[#c41e3a]/10 shadow-[0_0_15px_rgba(196,30,58,0.2)]" : "bg-white/5",
              )}
            >
              <StarIcon
                className={cn(
                  "size-6 transition-all",
                  isFilled
                    ? "text-[#c41e3a] fill-[#c41e3a]"
                    : "text-gray-600 fill-transparent group-hover:text-[#c41e3a]/50",
                )}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default AnimeRating;
