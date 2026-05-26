import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "~/lib/utils";
import { Check } from "lucide-react";

function OsCheckbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer size-[18px] shrink-0 rounded-[4px] border border-black/20 dark:border-white/20 bg-white dark:bg-black/20 outline-none transition-all shadow-inner",
        "focus-visible:ring-[3px] focus-visible:ring-[#007AFF]/30",
        "data-[state=checked]:bg-[#007AFF] data-[state=checked]:border-[#007AFF]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        <Check className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export default OsCheckbox;
