import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "~/lib/utils";

function DefaultSelect({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}
function DefaultSelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group {...props} />;
}
function DefaultSelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />;
}
function DefaultSelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-2 text-[15px] text-gray-900 transition-all duration-200 outline-none",
        "hover:border-gray-300 hover:bg-gray-50/50",
        "focus:border-[#6a9a3c] focus:ring-1 focus:ring-[#6a9a3c]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
function DefaultSelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          position === "popper" && "translate-y-2",
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
function DefaultSelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 pl-9 pr-3 text-[15px] outline-none transition-colors",
        "hover:bg-gray-50 focus:bg-gray-50 focus:text-black data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[state=checked]:font-medium data-[state=checked]:text-black",
        className,
      )}
      {...props}
    >
      <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
export {
  DefaultSelect as Select,
  DefaultSelectGroup as SelectGroup,
  DefaultSelectValue as SelectValue,
  DefaultSelectTrigger as SelectTrigger,
  DefaultSelectContent as SelectContent,
  DefaultSelectItem as SelectItem,
};
