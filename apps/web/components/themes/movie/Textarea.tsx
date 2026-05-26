import * as React from "react";
import { cn } from "~/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// eslint-disable-next-line react/prop-types
export default function MovieTextarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full bg-black/40 border-b-2 border-white/20 px-4 py-3 text-sm text-white transition-all duration-300 clip-angled",
        "placeholder:text-gray-500 placeholder:tracking-widest placeholder:text-xs placeholder:uppercase resize-none",
        "focus-visible:outline-none focus-visible:border-[#E23636] focus-visible:bg-[#E23636]/10 focus-visible:shadow-[0_4px_20px_-5px_rgba(226,54,54,0.4)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
