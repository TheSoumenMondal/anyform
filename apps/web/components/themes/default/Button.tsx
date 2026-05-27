import * as React from "react";
import { cn } from "~/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "success" | "danger" | "secondary";
}

const variantStyles = {
  default: "bg-[#6a9a3c] text-white hover:bg-[#568130] shadow-sm",
  success: "bg-[#10B981] text-white hover:bg-[#059669] shadow-sm",
  danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm",
  secondary: "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200 shadow-sm",
};

export default function DefaultButton({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-4 py-2.5 text-[14px] font-medium rounded-sm",
        "transition-[transform,background-color,box-shadow,color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2",
        "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
