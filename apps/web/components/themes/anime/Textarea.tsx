import * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Anime-themed Textarea
 */
function AnimeTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-30 w-full resize-none rounded-none border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-200",
        "focus:border-[#c41e3a]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#c41e3a]/10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export default AnimeTextarea;
