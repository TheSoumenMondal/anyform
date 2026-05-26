import * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Anime-themed Button
 * Features:
 * - Rounded pill shape
 * - Solid red background
 * - Subtle shadow
 * - Smooth transition
 */
interface AnimeButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "success" | "danger";
}

function AnimeButton({ className, variant = "default", ...props }: AnimeButtonProps) {
  const variantStyles = {
    default: "bg-[#c41e3a] text-white hover:bg-[#a01830] shadow-lg shadow-[#c41e3a]/10",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/10",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-900/10",
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold tracking-tight transition-all duration-200 rounded-none",
        "active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export default AnimeButton;
