import * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Minecraft-themed Input component
 * Features:
 * - Thick 2px solid border
 * - Dark gray background (matching Minecraft UI)
 * - White text
 * - Sharp corners
 * - "Pixelated" shadow effect on focus
 */
function GamingInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-10 w-full min-w-0 bg-[#313131] border-2 border-[#1e1e1e] text-white px-3 py-1 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] placeholder:text-[#8b8b8b] outline-none transition-all",
        "focus:border-white focus:shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export default GamingInput;
