import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "~/lib/utils";

function DefaultRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} />;
}

function DefaultRadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "aspect-square size-[22px] rounded-full border-2 border-gray-200 bg-white outline-none transition-all duration-200",
        "hover:border-gray-300",
        "focus-visible:border-[#6a9a3c] focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2",
        "data-[state=checked]:border-[#6a9a3c]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className="size-2.5 rounded-full bg-[#6a9a3c]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { DefaultRadioGroup as RadioGroup, DefaultRadioGroupItem as RadioGroupItem };
