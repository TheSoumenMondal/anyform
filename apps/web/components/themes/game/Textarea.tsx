import * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Minecraft-themed Textarea
 */
function GamingTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full bg-[#313131] border-2 border-[#1e1e1e] text-white px-3 py-2 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] placeholder:text-[#8b8b8b] outline-none transition-all",
        "focus:border-white focus:shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export default GamingTextarea;
