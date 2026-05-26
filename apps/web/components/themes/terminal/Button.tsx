import * as React from "react";
import { cn } from "~/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary";
}

const variantStyles = {
  default:
    "bg-[#00FF41] text-black hover:bg-[#00FF41]/80 hover:shadow-[0_0_15px_rgba(0,255,65,0.4)]",
  secondary:
    "bg-transparent text-[#00FF41] border border-[#00FF41]/50 hover:bg-[#00FF41]/10 hover:border-[#00FF41]",
};

export default function TerminalButton({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 text-[14px] font-mono font-bold uppercase rounded-none tracking-widest",
        "transition-[transform,background-color,box-shadow,border-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF41] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
