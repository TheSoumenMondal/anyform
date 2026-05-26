"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { FieldPalette } from "./FieldPalette";
import { FormCanvas } from "./FormCanvas";
import { FieldPropertiesPanel } from "./FieldPropertiesPanel";
import { useFormBySlug } from "~/hooks/api/form/use-form-by-slug";
import { useFormFields } from "~/hooks/api/form/use-form-fields";
import { useCreateFormField } from "~/hooks/api/form/use-create-form-field";
import { useUpdateFormField } from "~/hooks/api/form/use-update-form-field";
import { useDeleteFormField } from "~/hooks/api/form/use-delete-form-field";
import { FIELD_TYPE_MAP } from "./field-palette-config";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

export type CanvasField = {
  id: string;
  formId: string;
  label: string;
  description: string | null;
  helpText: string | null;
  placeholder: string | null;
  fieldType: string;
  isRequired: boolean;
  isHidden: boolean;
  isDisabled: boolean;
  sortOrder: number;
};

type FormBuilderEditorProps = {
  slug: string;
};

export const FormBuilderEditor = ({ slug }: FormBuilderEditorProps) => {
  const { form, formIsLoading } = useFormBySlug(slug);
  const { formFields, formFieldsIsLoading, refetchFormFields } = useFormFields(form?.id || "");
  const { createFormFieldAsync } = useCreateFormField();
  const { updateFormFieldAsync } = useUpdateFormField();
  const { deleteFormFieldAsync } = useDeleteFormField();

  const [fields, setFields] = useState<CanvasField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const [draggingFieldType, setDraggingFieldType] = useState<string | null>(null);

  useEffect(() => {
    if (formFields) {
      setFields([...formFields].sort((a, b) => a.sortOrder - b.sortOrder));
    }
  }, [formFields]);

  const handlePaletteDragStart = (fieldType: string, e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("fieldType", fieldType);
    e.dataTransfer.effectAllowed = "copy";
    setDraggingFieldType(fieldType);
  };

  const handlePaletteDragEnd = () => {
    setDraggingFieldType(null);
  };

  const handlePaletteDrop = async (fieldType: string, dropIndex: number) => {
    setDraggingFieldType(null);
    if (!form?.id) return;

    if (form.formStatus === "published") {
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
      return;
    }
    const config = FIELD_TYPE_MAP[fieldType];
    if (!config) return;

    const tempId = `temp-${Date.now()}`;
    const newField: CanvasField = {
      id: tempId,
      formId: form.id,
      label: config.label,
      description: null,
      helpText: null,
      placeholder: null,
      fieldType,
      isRequired: false,
      isHidden: false,
      isDisabled: false,
      sortOrder: dropIndex,
    };

    const newFields = Array.from(fields);
    newFields.splice(dropIndex, 0, newField);
    newFields.forEach((f, i) => {
      f.sortOrder = i;
    });
    setFields(newFields);
    setSelectedFieldId(tempId);

    try {
      const created = await createFormFieldAsync({
        formId: form.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fieldType: fieldType as any,
        label: config.label,
        sortOrder: dropIndex,
      });
      refetchFormFields();
      setSelectedFieldId(created.id);
    } catch (error) {
      console.error("Failed to create field", error);
      setFields(fields);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (form?.formStatus === "published") {
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
      return;
    }

    if (source.droppableId === "canvas" && destination.droppableId === "canvas") {
      if (source.index === destination.index) return;

      const newFields = Array.from(fields);
      const [movedField] = newFields.splice(source.index, 1);
      if (!movedField) return;
      newFields.splice(destination.index, 0, movedField);
      newFields.forEach((f, i) => {
        f.sortOrder = i;
      });
      setFields(newFields);

      try {
        await updateFormFieldAsync({
          fieldId: movedField.id,
          sortOrder: destination.index,
        });
      } catch (error) {
        console.error("Failed to reorder field", error);
        setFields(fields);
      }
    }
  };

  const handleSelectField = (id: string) => setSelectedFieldId(id);

  const handleDeleteField = async (id: string) => {
    if (form?.formStatus === "published") {
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
      return;
    }
    const originalFields = [...fields];
    setFields(fields.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
    try {
      await deleteFormFieldAsync({ formFieldId: id });
    } catch (error) {
      console.error("Failed to delete field", error);
      setFields(originalFields);
    }
  };

  const handleUpdateFieldLocal = (id: string, updates: Partial<CanvasField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  if (formIsLoading || formFieldsIsLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center text-center">
        <h2 className="text-lg font-semibold">Form not found</h2>
        <p className="text-muted-foreground">The form you are looking for does not exist.</p>
      </div>
    );
  }

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full w-full flex-1 gap-2 overflow-hidden">
        <div className="w-64 shrink-0">
          <FieldPalette
            onPaletteDragStart={handlePaletteDragStart}
            onPaletteDragEnd={handlePaletteDragEnd}
          />
        </div>

        <div className="min-w-0 flex-1">
          <FormCanvas
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={handleSelectField}
            onDeleteField={handleDeleteField}
            onPaletteDrop={handlePaletteDrop}
            draggingFieldType={draggingFieldType}
            isPublished={form?.formStatus === "published"}
          />
        </div>

        <div className="w-80 shrink-0">
          <FieldPropertiesPanel
            selectedField={selectedField}
            onUpdateFieldLocal={handleUpdateFieldLocal}
            isPublished={form?.formStatus === "published"}
          />
        </div>
      </div>
    </DragDropContext>
  );
};
