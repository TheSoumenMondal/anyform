"use client";

import React from "react";
import FormEditor from "./FormEditor";
import FormItemsSelector from "./FormItemsSelector";

type FormDetails = {
  id: string;
  formType: "single_step" | "multi_step";
  formStatus: "draft" | "published" | "archived" | "deleted";
};

type FormBuilderProps = {
  slug: string;
  form: FormDetails;
};

const FormBuilder = ({ form }: FormBuilderProps) => {
  const handlePaletteDragStart = (fieldType: string, e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("fieldType", fieldType);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handlePaletteDragEnd = () => {
    // No-op for now
  };

  return (
    <div className="flex h-full w-full flex-1 gap-1 overflow-hidden bg-background">
      {/* Left Palette */}
      <FormItemsSelector
        onPaletteDragStart={handlePaletteDragStart}
        onPaletteDragEnd={handlePaletteDragEnd}
      />

      {/* Main Canvas and Properties Panel */}
      <div className="flex-1 flex min-w-0 h-full">
        <FormEditor form={form} />
      </div>
    </div>
  );
};

export default FormBuilder;
