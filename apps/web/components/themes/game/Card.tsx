import * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Minecraft-themed Card (Container)
 * Features:
 * - Dirt/Stone style border or standard UI background
 * - Inset content area
 */
function GamingCard({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative bg-[#c6c6c6] border-4 border-[#1e1e1e] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] flex flex-col",
        className,
      )}
      {...props}
    >
      {/* Highlights and shadows (Fixed to container edges) */}
      <div className="absolute inset-0 border-t-4 border-l-4 border-white/50 pointer-events-none z-20" />
      <div className="absolute inset-0 border-b-4 border-r-4 border-black/30 pointer-events-none z-20" />

      <div className="relative z-10 p-6 h-full w-full">{children}</div>
    </div>
  );
}

export default GamingCard;
