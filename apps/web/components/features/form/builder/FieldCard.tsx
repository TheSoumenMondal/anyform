"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DragDropVerticalIcon,
  Delete01Icon,
  CheckmarkSquare01Icon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { FIELD_TYPE_MAP } from "./field-palette-config";
import { cn } from "~/lib/utils";
import type { CanvasField } from "./FormBuilderEditor";

type FieldCardProps = {
  field: CanvasField;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  animateIn?: boolean;
  isPublished?: boolean;
};

export const FieldCard = ({
  field,
  index,
  isSelected,
  onSelect,
  onDelete,
  animateIn,
  isPublished,
}: FieldCardProps) => {
  const config = FIELD_TYPE_MAP[field.fieldType];

  return (
    <Draggable draggableId={`canvas-${field.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          data-field-card
          style={{
            ...provided.draggableProps.style,
          }}
          onClick={() => onSelect(field.id)}
          className={cn(
            "group relative flex items-center gap-3 rounded-lg border bg-card px-3 py-3 cursor-pointer",
            "transition-[border-color,box-shadow,opacity] duration-150",
            isSelected
              ? "border-primary ring-1 ring-primary/20 shadow-sm"
              : "border-border hover:border-primary/30 hover:shadow-sm",
            snapshot.isDragging ? "shadow-xl border-primary/50 opacity-95" : "",

            animateIn && !snapshot.isDragging ? "animate-field-enter" : "",
          )}
        >
          <div
            {...provided.dragHandleProps}
            className={cn(
              "flex shrink-0 items-center text-muted-foreground/40 transition-colors hover:text-muted-foreground",
              isPublished ? "cursor-not-allowed pointer-events-none opacity-30" : "cursor-grab",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <HugeiconsIcon icon={DragDropVerticalIcon} className="size-4" />
          </div>

          {config && (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <HugeiconsIcon icon={config.icon} className="size-4" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{field.label}</p>
            <p className="truncate text-xs text-muted-foreground">
              {config?.label ?? field.fieldType}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {field.isRequired && (
              <span
                className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary"
                title="Required"
              >
                <HugeiconsIcon icon={CheckmarkSquare01Icon} className="size-3" />
              </span>
            )}
            {field.isHidden && (
              <span
                className="flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground"
                title="Hidden"
              >
                <HugeiconsIcon icon={ViewOffIcon} className="size-3" />
              </span>
            )}
          </div>

          {!isPublished && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(field.id);
              }}
              className={cn(
                "ml-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground/40 transition-all",
                "hover:bg-destructive/10 hover:text-destructive",
                "opacity-0 group-hover:opacity-100",
              )}
              aria-label="Remove field"
            >
              <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};
