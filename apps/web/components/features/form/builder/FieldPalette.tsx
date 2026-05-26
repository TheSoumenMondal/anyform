"use client";

import React from "react";
import { PaletteItem } from "./PaletteItem";
import { FIELD_CATEGORIES, FIELD_TYPE_CONFIG } from "./field-palette-config";

type FieldPaletteProps = {
  onPaletteDragStart: (fieldType: string, e: React.DragEvent<HTMLDivElement>) => void;
  onPaletteDragEnd: () => void;
};

export const FieldPalette = ({ onPaletteDragStart, onPaletteDragEnd }: FieldPaletteProps) => {
  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-3">
        <div className="flex flex-col gap-4">
          {FIELD_CATEGORIES.map((category) => {
            const fields = FIELD_TYPE_CONFIG.filter((f) => f.category === category);

            return (
              <div key={category} className="flex flex-col gap-1.5">
                <p className="px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {category}
                </p>
                {fields.map((field) => (
                  <PaletteItem
                    key={field.fieldType}
                    fieldType={field.fieldType}
                    label={field.label}
                    icon={field.icon}
                    onDragStart={onPaletteDragStart}
                    onDragEnd={onPaletteDragEnd}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
