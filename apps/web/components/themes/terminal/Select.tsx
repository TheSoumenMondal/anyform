import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "~/lib/utils";

function TerminalSelect({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}
function TerminalSelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group {...props} />;
}
function TerminalSelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />;
}
function TerminalSelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-[44px] w-full items-center justify-between border border-[#00FF41]/30 bg-black px-4 py-2 text-[15px] font-mono text-[#00FF41] rounded-none outline-none",
        "transition-[border-color,background-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
        "hover:border-[#00FF41]/60 hover:bg-[#00FF41]/5",
        "focus:border-[#00FF41] focus:bg-[#00FF41]/10",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-black",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <span className="text-[#00FF41] font-mono select-none">▼</span>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
function TerminalSelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-none border border-[#00FF41] bg-black text-[#00FF41] font-mono data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          position === "popper" && "translate-y-2",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
function TerminalSelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-none py-2.5 pl-8 pr-3 text-[14px] outline-none transition-colors",
        "hover:bg-[#00FF41]/20 focus:bg-[#00FF41] focus:text-black data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[state=checked]:bg-[#00FF41]/20 data-[state=checked]:text-[#00FF41] focus:data-[state=checked]:bg-[#00FF41] focus:data-[state=checked]:text-black",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <span className="text-current font-mono">»</span>
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
export {
  TerminalSelect as Select,
  TerminalSelectGroup as SelectGroup,
  TerminalSelectValue as SelectValue,
  TerminalSelectTrigger as SelectTrigger,
  TerminalSelectContent as SelectContent,
  TerminalSelectItem as SelectItem,
};
