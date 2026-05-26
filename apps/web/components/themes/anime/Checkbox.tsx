import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "~/lib/utils";
import { Check } from "lucide-react";

/**
 * Anime-themed Checkbox
 */
function AnimeCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer size-6 shrink-0 rounded-none border border-white/10 bg-white/5 outline-none transition-all focus:ring-4 focus:ring-[#c41e3a]/10 data-[state=checked]:bg-[#c41e3a] data-[state=checked]:border-[#c41e3a]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        <Check className="size-4 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export default AnimeCheckbox;
