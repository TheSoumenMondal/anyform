import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "~/lib/utils";

/**
 * Minecraft-themed Slider
 * Features:
 * - Blocky track
 * - Square, pixelated thumb
 * - Contrast colors (Minecraft UI palette)
 */
function GamingSlider({
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
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 h-10",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="bg-[#1e1e1e] relative grow overflow-hidden border-2 border-[#1e1e1e] h-2 shadow-[inset_1px_1px_0px_0px_rgba(0,0,0,0.5)]">
        <SliderPrimitive.Range className="bg-[#5a5a5a] absolute h-full" />
      </SliderPrimitive.Track>
      {_values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block size-6 bg-[#313131] border-2 border-[#1e1e1e] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] outline-none transition-all hover:bg-[#3c3c3c] focus:border-white disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export default GamingSlider;
