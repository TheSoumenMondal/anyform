import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "~/lib/utils";

function MovieSelect({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}
function MovieSelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group {...props} />;
}
function MovieSelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />;
}
function MovieSelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-12 w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white shadow-inner transition-all duration-300 outline-none",
        "hover:bg-white/10",
        "focus:border-[#E23636] focus:bg-white/10 focus:shadow-[0_0_15px_rgba(226,54,54,0.15)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-70 text-gray-400" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
function MovieSelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-lg border border-white/10 bg-[#0B0C10] text-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.8)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          position === "popper" && "translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-2">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
function MovieSelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-md py-2.5 pl-9 pr-3 text-sm outline-none transition-colors",
        "focus:bg-[#E23636]/20 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-[#E23636]" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
export {
  MovieSelect as Select,
  MovieSelectGroup as SelectGroup,
  MovieSelectValue as SelectValue,
  MovieSelectTrigger as SelectTrigger,
  MovieSelectContent as SelectContent,
  MovieSelectItem as SelectItem,
};
