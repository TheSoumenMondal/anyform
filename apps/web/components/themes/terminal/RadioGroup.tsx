import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "~/lib/utils";

function TerminalRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-4", className)} {...props} />;
}

function TerminalRadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "aspect-square size-[20px] rounded-none border border-[#00FF41]/50 bg-black outline-none",
        "transition-[border-color,background-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
        "hover:border-[#00FF41]",
        "focus-visible:border-[#00FF41] focus-visible:ring-2 focus-visible:ring-[#00FF41]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center w-full h-full">
        <div className="w-[12px] h-[12px] bg-[#00FF41]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { TerminalRadioGroup as RadioGroup, TerminalRadioGroupItem as RadioGroupItem };
