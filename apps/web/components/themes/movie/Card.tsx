import * as React from "react";
import { cn } from "~/lib/utils";

export type CardProps = React.ComponentProps<"div">;

export default function MovieCard({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col clip-angled shadow-[0_0_50px_rgba(0,0,0,0.8)]",
        "bg-[#09090b]/80 backdrop-blur-2xl",
        className,
      )}
      {...props}
    >
      {/* Spider-Man Tech Lines / Dual Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0059CF] via-[#E23636] to-[#0059CF] opacity-90 shadow-[0_0_20px_rgba(226,54,54,0.8)]" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#E23636] via-[#0059CF] to-[#E23636] opacity-90 shadow-[0_0_20px_rgba(0,89,207,0.8)]" />

      {/* Subtle honeycomb or grid pattern could go here, for now a simple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E23636]/5 via-transparent to-[#0059CF]/5 pointer-events-none" />

      <div className="relative z-10 w-full flex-1">{children}</div>
    </div>
  );
}
