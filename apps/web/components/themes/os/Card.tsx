import * as React from "react";
import { cn } from "~/lib/utils";

export interface CardProps extends React.ComponentProps<"div"> {
  title?: string;
  withTrafficLights?: boolean;
}

export default function OsCard({
  className,
  children,
  title,
  withTrafficLights = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden",
        "bg-white/60 dark:bg-black/50 backdrop-blur-[40px] border border-white/60 dark:border-white/20 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        className,
      )}
      {...props}
    >
      {withTrafficLights && (
        <div className="flex items-center justify-center relative w-full h-12 border-b border-black/10 dark:border-white/10 bg-white/20 dark:bg-black/20">
          <div className="absolute left-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-sm" />
          </div>
          {title && (
            <div className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </div>
          )}
        </div>
      )}
      <div className="relative z-10 w-full flex-1">{children}</div>
    </div>
  );
}
