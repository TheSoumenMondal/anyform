import * as React from "react";
import { cn } from "~/lib/utils";

export type CardProps = React.ComponentProps<"div">;

export default function StartupCard({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden bg-white rounded-md border border-black/[0.1] shadow-xl",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 w-full flex-1">{children}</div>
    </div>
  );
}
