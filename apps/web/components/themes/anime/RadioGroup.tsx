import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "~/lib/utils";

/**
 * Anime-themed Radio Group
 */
function AnimeRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} />;
}

/**
 * Anime-themed Radio Item
 */
function AnimeRadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "aspect-square size-6 rounded-none border border-white/10 bg-white/5 outline-none transition-all focus:ring-4 focus:ring-[#c41e3a]/10 data-[state=checked]:border-[#c41e3a] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className="size-3 rounded-none bg-[#c41e3a]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { AnimeRadioGroup as RadioGroup, AnimeRadioGroupItem as RadioGroupItem };
