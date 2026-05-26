import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "~/lib/utils";
import { Check } from "lucide-react";

export default function StartupCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer size-[22px] shrink-0 rounded-[6px] border-2 border-gray-200 bg-white outline-none",
        "transition-[border-color,background-color,color,transform] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
        "hover:border-gray-300",
        "focus-visible:border-black focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2",
        "data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white",
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
