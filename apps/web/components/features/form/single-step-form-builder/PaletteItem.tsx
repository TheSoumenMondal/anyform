"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgObject } from "./field-palette-config";

type PaletteItemProps = {
  fieldType: string;
  label: string;
  icon: IconSvgObject;
  onDragStart: (fieldType: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
};

export const PaletteItem = ({
  fieldType,
  label,
  icon,
  onDragStart,
  onDragEnd,
}: PaletteItemProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(fieldType, e)}
      onDragEnd={onDragEnd}
      className={[
        "flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5",
        "cursor-grab select-none text-sm font-medium text-foreground",
        "transition-[border-color,background-color,box-shadow] duration-150",
        "hover:border-primary/30 hover:bg-accent hover:shadow-sm",
        "active:scale-[1.03] active:shadow-lg active:border-primary/50 active:bg-accent",
      ].join(" ")}
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <HugeiconsIcon icon={icon} className="size-3.5" />
      </div>
      <span className="truncate">{label}</span>
    </div>
  );
};
