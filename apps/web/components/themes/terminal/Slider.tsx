import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "~/lib/utils";

export default function TerminalSlider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [value, defaultValue, min],
  );
  return (
    <SliderPrimitive.Root
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 h-6 cursor-pointer",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-none bg-black border border-[#00FF41]/30">
        <SliderPrimitive.Range className="absolute h-full bg-[#00FF41]/20" />
      </SliderPrimitive.Track>
      {_values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block w-4 h-6 rounded-none bg-[#00FF41] outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#00FF41]/50 disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
