import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "~/lib/utils";

function MovieRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} />;
}

function MovieRadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "aspect-square size-6 rounded-full border-2 border-white/20 bg-white/5 outline-none transition-all duration-300",
        "focus-visible:border-[#E23636] focus-visible:shadow-[0_0_10px_rgba(226,54,54,0.3)]",
        "data-[state=checked]:border-[#E23636] data-[state=checked]:bg-[#E23636]/20",
        "hover:border-white/40 data-[state=checked]:hover:border-[#E23636]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className="size-2.5 rounded-full bg-[#E23636] shadow-[0_0_10px_rgba(226,54,54,0.8)]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { MovieRadioGroup as RadioGroup, MovieRadioGroupItem as RadioGroupItem };
