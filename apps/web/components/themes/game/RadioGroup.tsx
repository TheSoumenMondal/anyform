import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "~/lib/utils";

/**
 * Minecraft-themed Radio Group
 */
function GamingRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} />;
}

/**
 * Minecraft-themed Radio Item
 * Features:
 * - Square look (Minecraft UI often uses squares even for radios)
 * - Dark gray background
 * - White inner pixel when selected
 */
function GamingRadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "aspect-square size-5 bg-[#313131] border-2 border-[#1e1e1e] shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)] outline-none transition-all focus:border-white data-[state=checked]:border-white disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className="size-2 bg-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { GamingRadioGroup as RadioGroup, GamingRadioGroupItem as RadioGroupItem };
