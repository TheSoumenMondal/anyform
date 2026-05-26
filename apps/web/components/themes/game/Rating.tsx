import * as React from "react";
import { HeartIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface GamingRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

/**
 * Minecraft-themed Rating component (using Hearts)
 */
function GamingRating({ value = 0, onChange, max = 5, disabled = false }: GamingRatingProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);

  return (
    <div className="flex gap-2.5 h-12 items-center">
      {Array.from({ length: max }).map((_, i) => {
        const heartValue = i + 1;
        const isFilled = hoveredValue !== null ? heartValue <= hoveredValue : heartValue <= value;

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(heartValue)}
            onMouseEnter={() => !disabled && setHoveredValue(heartValue)}
            onMouseLeave={() => !disabled && setHoveredValue(null)}
            className={cn(
              "transition-all active:scale-90 outline-none group",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            )}
          >
            <div
              className={cn(
                "p-1.5 border-2 border-[#1e1e1e] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] transition-colors relative overflow-hidden",
                isFilled ? "bg-[#ff4d4d]" : "bg-[#f0f0f0]",
                "before:absolute before:inset-0 before:border-t-2 before:border-l-2 before:border-white/40 before:pointer-events-none",
                "after:absolute after:inset-0 after:border-b-2 after:border-r-2 after:border-black/20 after:pointer-events-none",
              )}
            >
              <HeartIcon
                className={cn(
                  "size-6 transition-all",
                  isFilled
                    ? "text-white fill-white scale-110"
                    : "text-[#8b8b8b] fill-transparent group-hover:text-[#ff4d4d]/50",
                )}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default GamingRating;
