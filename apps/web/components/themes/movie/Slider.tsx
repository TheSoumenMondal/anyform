import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "~/lib/utils";

export default function MovieSlider({
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
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 h-8",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-white/10 shadow-inner">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-[#0059CF] to-[#E23636]" />
      </SliderPrimitive.Track>
      {_values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block size-6 rounded-full border-2 border-white bg-[#E23636] shadow-[0_0_15px_rgba(226,54,54,0.6)] outline-none transition-transform hover:scale-125 focus-visible:ring-4 focus-visible:ring-[#E23636]/30 disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
