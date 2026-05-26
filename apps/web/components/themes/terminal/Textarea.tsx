import * as React from "react";
import { cn } from "~/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// eslint-disable-next-line react/prop-types
export default function TerminalTextarea({ className, ...props }: TextareaProps) {
  return (
    <div className="relative w-full group">
      <span className="absolute left-0 top-3 text-[#00FF41]/50 font-mono text-[14px] pointer-events-none">
        $&gt;
      </span>
      <textarea
        className={cn(
          "flex min-h-[120px] w-full bg-transparent border-b border-[#00FF41]/30 pl-8 pr-4 py-3 text-[15px] font-mono text-[#00FF41] rounded-none resize-none",
          "transition-[border-color,background-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
          "placeholder:text-[#00FF41]/30 placeholder:font-normal",
          "hover:border-[#00FF41]/60 hover:bg-[#00FF41]/5",
          "focus-visible:outline-none focus-visible:border-[#00FF41] focus-visible:bg-[#00FF41]/10",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-black",
          className,
        )}
        {...props}
      />
    </div>
  );
}
