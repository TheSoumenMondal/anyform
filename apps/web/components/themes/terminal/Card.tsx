import * as React from "react";
import { cn } from "~/lib/utils";

export type CardProps = React.ComponentProps<"div">;

export default function TerminalCard({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col bg-black border border-[#00FF41]/30 shadow-[0_0_20px_rgba(0,255,65,0.05)] rounded-none",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 w-full flex-1">{children}</div>
    </div>
  );
}
