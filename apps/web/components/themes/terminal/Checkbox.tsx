import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "~/lib/utils";

export default function TerminalCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer size-[20px] shrink-0 rounded-none border border-[#00FF41]/50 bg-black outline-none",
        "transition-[border-color,background-color,transform] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
        "hover:border-[#00FF41]",
        "focus-visible:border-[#00FF41] focus-visible:ring-2 focus-visible:ring-[#00FF41]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "data-[state=checked]:bg-[#00FF41] data-[state=checked]:border-[#00FF41]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-black">
        <span className="font-mono text-[14px] leading-none select-none font-bold">X</span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
