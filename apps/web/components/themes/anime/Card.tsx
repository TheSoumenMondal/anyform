import * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Anime-themed Card (Container)
 * Features:
 * - Glassmorphism style
 * - Soft rounded corners
 * - Slight translucent background with backdrop blur
 */
function AnimeCard({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative bg-[#1c1a19] border border-white/5 shadow-2xl rounded-none flex flex-col overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 p-4 sm:p-10 h-full w-full">{children}</div>
    </div>
  );
}

export default AnimeCard;
