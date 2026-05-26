import * as React from "react";
import { cn } from "~/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// eslint-disable-next-line react/prop-types
export default function StartupInput({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[40px] w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-[15px] text-gray-900 shadow-sm",
        "transition-[border-color,box-shadow,background-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
        "placeholder:text-gray-400 placeholder:font-normal",
        "hover:border-gray-400",
        "focus-visible:outline-none focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black focus-visible:shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        className,
      )}
      {...props}
    />
  );
}
