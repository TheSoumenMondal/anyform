import * as React from "react";
import { cn } from "~/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "success" | "danger" | "secondary";
}

const variantStyles = {
  default:
    "bg-[#E23636] text-white hover:bg-[#C92A2A] shadow-[0_0_20px_rgba(226,54,54,0.4)] hover:shadow-[0_0_35px_rgba(226,54,54,0.7)]",
  success:
    "bg-[#0059CF] text-white hover:bg-[#0047A5] shadow-[0_0_20px_rgba(0,89,207,0.4)] hover:shadow-[0_0_35px_rgba(0,89,207,0.7)]",
  danger: "bg-[#8B0000] text-white hover:bg-[#660000] shadow-[0_0_20px_rgba(139,0,0,0.4)]",
  secondary:
    "bg-black/50 text-gray-300 hover:text-white border border-[#E23636]/40 hover:bg-[#E23636]/20",
};

export default function MovieButton({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 clip-button",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <span className="relative z-10 drop-shadow-md">{props.children}</span>
    </button>
  );
}
