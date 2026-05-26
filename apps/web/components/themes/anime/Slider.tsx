import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "~/lib/utils";

/**
 * Anime-themed Slider
 */
function AnimeSlider({
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
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 h-10",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-none bg-white/10">
        <SliderPrimitive.Range className="absolute h-full bg-[#c41e3a]" />
      </SliderPrimitive.Track>
      {_values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block size-4 rounded-none border border-white/20 bg-[#c41e3a] shadow-lg outline-none transition-all hover:scale-110 focus:ring-4 focus:ring-[#c41e3a]/10 disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export default AnimeSlider;
