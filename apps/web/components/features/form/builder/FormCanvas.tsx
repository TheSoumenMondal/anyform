"use client";

import React, { useRef } from "react";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { FieldCard } from "./FieldCard";
import type { CanvasField } from "./FormBuilderEditor";
import { HugeiconsIcon } from "@hugeicons/react";
import { DragDropVerticalIcon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

type FormCanvasProps = {
  fields: CanvasField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onDeleteField: (id: string) => void;
  onPaletteDrop: (fieldType: string, dropIndex: number) => void;
  draggingFieldType: string | null;
  isPublished: boolean;
};

export const FormCanvas = ({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onPaletteDrop,
  draggingFieldType,
  isPublished,
}: FormCanvasProps) => {
  const seenIds = useRef<Set<string>>(new Set());

  const showPublishedToast = () =>
    toast.error("Form is published", {
      description: "Archive the form first to make changes.",
      action: (
        <Button
          className="ml-auto"
          size="sm"
          type="button"
          variant="raised"
          onClick={() => toast.dismiss()}
        >
          Close
        </Button>
      ),
      style: {
        border: "1px solid var(--border)",
        borderStyle: "dashed",
      },
    });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes("fieldtype")) return;
    if (isPublished) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "none";
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData("fieldType");
    if (!fieldType) return;

    if (isPublished) {
      showPublishedToast();
      return;
    }

    const container = e.currentTarget;
    const cards = Array.from(container.querySelectorAll("[data-field-card]"));
    let dropIndex = fields.length;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i]!.getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        dropIndex = i;
        break;
      }
    }

    onPaletteDrop(fieldType, dropIndex);
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card/50"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <StrictModeDroppable
        droppableId="canvas"
        direction="vertical"
        isDropDisabled={isPublished}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto scrollbar-hide p-3 transition-colors duration-150 ${
              snapshot.isDraggingOver || draggingFieldType ? "bg-accent/30" : "bg-transparent"
            }`}
          >
            <div className="mx-auto flex w-full min-h-full flex-col gap-3">
              {fields.length === 0 && !snapshot.isDraggingOver && !draggingFieldType ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={DragDropVerticalIcon} className="size-6" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">Canvas is empty</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Drag a field type from the left palette to get started.
                  </p>
                </div>
              ) : (
                fields.map((field, index) => {
                  const isNew = !seenIds.current.has(field.id);
                  if (isNew) seenIds.current.add(field.id);
                  return (
                    <FieldCard
                      key={`canvas-${field.id}`}
                      field={field}
                      index={index}
                      isSelected={selectedFieldId === field.id}
                      onSelect={onSelectField}
                      onDelete={onDeleteField}
                      animateIn={isNew}
                      isPublished={isPublished}
                    />
                  );
                })
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </StrictModeDroppable>
    </div>
  );
};
