"use client";

import React, { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { useUpdateFormField } from "~/hooks/api/form/use-update-form-field";
import type { CanvasField } from "./FormBuilderEditor";

type FieldPropertiesPanelProps = {
  selectedField: CanvasField | null;
  onUpdateFieldLocal: (id: string, updates: Partial<CanvasField>) => void;
  isPublished: boolean;
};

export const FieldPropertiesPanel = ({
  selectedField,
  onUpdateFieldLocal,
  isPublished,
}: FieldPropertiesPanelProps) => {
  const { updateFormFieldAsync } = useUpdateFormField();

  const [localField, setLocalField] = useState<CanvasField | null>(null);

  const latestFieldRef = useRef<CanvasField | null>(null);
  latestFieldRef.current = localField;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setLocalField(selectedField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField?.id]);

  const handleChange = (key: keyof CanvasField, value: string | boolean) => {
    if (!localField || isPublished) return;

    const updatedField = { ...localField, [key]: value };
    setLocalField(updatedField);
    onUpdateFieldLocal(localField.id, { [key]: value });
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const current = latestFieldRef.current;
      if (!current) return;

      if (key === "label" && (!value || (value as string).trim().length === 0)) return;

      try {
        await updateFormFieldAsync({
          fieldId: current.id,
          [key]: key === "label" ? (value as string).trim() : value,
        });
      } catch {
        // Silently swallow — we already have the optimistic local state
      }
    }, 600);
  };

  const handleLabelBlur = () => {
    if (!localField || isPublished) return;
    if (!localField.label || localField.label.trim().length === 0) {
      const fallback = selectedField?.label || "Untitled Field";
      const restored = { ...localField, label: fallback };
      setLocalField(restored);
      onUpdateFieldLocal(localField.id, { label: fallback });
    }
  };

  if (!localField) {
    return (
      <aside className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <HugeiconsIcon icon={Settings01Icon} className="size-6" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">No field selected</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Click on a field in the canvas to edit its properties.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex-none border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Properties</h2>
          {isPublished && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
              <HugeiconsIcon icon={LockIcon} className="size-2.5" />
              Read-only
            </span>
          )}
        </div>
        {isPublished && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Archive the form to edit its fields.
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
        <fieldset
          disabled={isPublished}
          className="space-y-4 disabled:opacity-60 disabled:cursor-not-allowed border-0 p-0 m-0"
        >
          <div className="space-y-2">
            <Label htmlFor="prop-label">Field Label</Label>
            <Input
              id="prop-label"
              value={localField.label}
              onChange={(e) => handleChange("label", e.target.value)}
              onBlur={handleLabelBlur}
              placeholder="e.g. Full Name"
              disabled={isPublished}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prop-description">Description (Optional)</Label>
            <Textarea
              id="prop-description"
              value={localField.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add more context..."
              rows={2}
              className="resize-none"
              disabled={isPublished}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prop-placeholder">Placeholder Text</Label>
            <Input
              id="prop-placeholder"
              value={localField.placeholder || ""}
              onChange={(e) => handleChange("placeholder", e.target.value)}
              placeholder="e.g. John Doe"
              disabled={isPublished}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prop-help">Help Text (Tooltip)</Label>
            <Input
              id="prop-help"
              value={localField.helpText || ""}
              onChange={(e) => handleChange("helpText", e.target.value)}
              placeholder="Optional help tooltip"
              disabled={isPublished}
            />
          </div>
        </fieldset>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="prop-required">Required</Label>
              <p className="text-[11px] text-muted-foreground">User must fill this field</p>
            </div>
            <Switch
              id="prop-required"
              checked={localField.isRequired}
              onCheckedChange={(checked) => handleChange("isRequired", checked)}
              disabled={isPublished}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="prop-hidden">Hidden</Label>
              <p className="text-[11px] text-muted-foreground">Hide from public view</p>
            </div>
            <Switch
              id="prop-hidden"
              checked={localField.isHidden}
              onCheckedChange={(checked) => handleChange("isHidden", checked)}
              disabled={isPublished}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="prop-disabled">Read-Only</Label>
              <p className="text-[11px] text-muted-foreground">Prevent user input</p>
            </div>
            <Switch
              id="prop-disabled"
              checked={localField.isDisabled}
              onCheckedChange={(checked) => handleChange("isDisabled", checked)}
              disabled={isPublished}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
