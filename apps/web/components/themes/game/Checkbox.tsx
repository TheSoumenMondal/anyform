import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "~/lib/utils";

/**
 * Minecraft-themed Checkbox
 * Features:
 * - Square, pixelated look
 * - Dark gray background
 * - Inset shadow when unchecked
 * - White/Light gray "pixel" checkmark when checked
 */
function GamingCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer size-5 shrink-0 bg-[#313131] border-2 border-[#1e1e1e] shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)] outline-none transition-all data-[state=checked]:bg-[#5a5a5a] data-[state=checked]:border-white focus:ring-0",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        {/* Minecraft-style simple pixel checkmark */}
        <div className="size-2.5 bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export default GamingCheckbox;
