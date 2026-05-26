import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "~/lib/utils";
import { Check } from "lucide-react";

export default function MovieCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer size-6 shrink-0 rounded-[4px] border-2 border-white/20 bg-white/5 outline-none transition-all duration-300",
        "focus-visible:border-[#E23636] focus-visible:shadow-[0_0_10px_rgba(226,54,54,0.3)]",
        "data-[state=checked]:border-[#E23636] data-[state=checked]:bg-[#E23636]/20",
        "hover:border-white/40 data-[state=checked]:hover:border-[#E23636]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[#E23636]">
        <Check className="size-4 stroke-[4]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
