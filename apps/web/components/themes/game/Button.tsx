import * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Minecraft-themed Button
 * Features:
 * - 3D raised effect (top/left highlights, bottom/right shadows)
 * - Gray background
 * - Inset effect when clicked
 * - Sharp pixel corners
 */
interface GamingButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "success" | "danger";
}

function GamingButton({ className, variant = "default", ...props }: GamingButtonProps) {
  const variantStyles = {
    default: "bg-[#8b8b8b] border-[#1e1e1e] hover:bg-[#9d9d9d]",
    success: "bg-[#3fb11a] border-[#1e1e1e] hover:bg-[#4bc81e]",
    danger: "bg-[#b11a1a] border-[#1e1e1e] hover:bg-[#c81e1e]",
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-all active:top-[2px] active:left-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed",
        "border-2",
        variantStyles[variant],
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]",
        // Minecraft-style highlights (simulated with pseudo-elements for pixel-perfect look)
        "before:absolute before:inset-0 before:border-t-2 before:border-l-2 before:border-white/30 before:pointer-events-none",
        "after:absolute after:inset-0 after:border-b-2 after:border-r-2 after:border-black/30 after:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

export default GamingButton;
