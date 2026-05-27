import * as React from "react";
import { cn } from "~/lib/utils";

export type CardProps = React.ComponentProps<"div">;

export default function DefaultCard({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden bg-white rounded-xl shadow-xl shadow-black/5",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 w-full flex-1">{children}</div>
    </div>
  );
}
