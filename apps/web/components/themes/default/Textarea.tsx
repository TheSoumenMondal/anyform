import * as React from "react";
import { cn } from "~/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// eslint-disable-next-line react/prop-types
export default function DefaultTextarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-[15px] text-gray-900 shadow-sm resize-none",
        "transition-[border-color,box-shadow,background-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
        "placeholder:text-gray-400 placeholder:font-normal",
        "hover:border-gray-400",
        "focus-visible:outline-none focus-visible:border-[#6a9a3c] focus-visible:ring-1 focus-visible:ring-[#6a9a3c] focus-visible:shadow-[0_2px_8px_rgba(106,154,60,0.1)]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        className,
      )}
      {...props}
    />
  );
}
