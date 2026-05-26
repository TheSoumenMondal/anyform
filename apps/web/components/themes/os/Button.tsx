import * as React from "react";
import { cn } from "~/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "success" | "danger" | "secondary";
}

const variantStyles = {
  default: "bg-[#007AFF] text-white hover:bg-[#007AFF]/90 focus-visible:ring-[#007AFF]/30",
  success: "bg-[#27C93F] text-white hover:bg-[#27C93F]/90 focus-visible:ring-[#27C93F]/30",
  danger: "bg-[#FF5F56] text-white hover:bg-[#FF5F56]/90 focus-visible:ring-[#FF5F56]/30",
  secondary:
    "bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 focus-visible:ring-gray-400/30",
};

export default function OsButton({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-4 py-1.5 text-[13px] font-medium rounded-md shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-[3px]",
        "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
