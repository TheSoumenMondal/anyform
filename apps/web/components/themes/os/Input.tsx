import * as React from "react";
import { cn } from "~/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// eslint-disable-next-line react/prop-types
export default function OsInput({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-8 w-full rounded-md border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 px-3 py-1 text-[13px] shadow-inner transition-colors",
        "placeholder:text-gray-500 dark:placeholder:text-gray-400",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#007AFF]/30 focus-visible:border-[#007AFF]/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
