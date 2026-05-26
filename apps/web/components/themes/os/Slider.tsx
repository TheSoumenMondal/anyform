import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "~/lib/utils";

function OsSlider({
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
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 h-6",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-black/10 dark:bg-white/10 shadow-inner">
        <SliderPrimitive.Range className="absolute h-full bg-[#007AFF]" />
      </SliderPrimitive.Track>
      {_values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block size-4 rounded-full border border-black/10 dark:border-white/10 bg-white shadow-md outline-none transition-transform hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-[#007AFF]/30 disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
export default OsSlider;
