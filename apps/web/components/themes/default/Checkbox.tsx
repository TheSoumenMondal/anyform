import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "~/lib/utils";
import { Check } from "lucide-react";

export default function DefaultCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer size-[22px] shrink-0 rounded-[6px] border-2 border-gray-200 bg-white outline-none",
        "transition-[border-color,background-color,color,transform] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
        "hover:border-gray-300",
        "focus-visible:border-[#6a9a3c] focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2",
        "data-[state=checked]:border-[#6a9a3c] data-[state=checked]:bg-[#6a9a3c] data-[state=checked]:text-white",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
