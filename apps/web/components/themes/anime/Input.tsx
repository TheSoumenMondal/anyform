import * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Anime-themed Input component
 * Features:
 * - Rounded borders
 * - Red focus ring
 * - Dark background
 */
function AnimeInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-12 w-full min-w-0 bg-white/5 border border-white/10 rounded-none px-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-200",
        "focus:border-[#c41e3a]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#c41e3a]/10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export default AnimeInput;
