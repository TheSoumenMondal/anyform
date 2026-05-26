"use client";

import React from "react";
import { FieldPalette } from "../builder/FieldPalette";

type FormItemsSelectorProps = {
  onPaletteDragStart: (fieldType: string, e: React.DragEvent<HTMLDivElement>) => void;
  onPaletteDragEnd: () => void;
};

const FormItemsSelector = ({ onPaletteDragStart, onPaletteDragEnd }: FormItemsSelectorProps) => {
  return (
    <div className="w-64 shrink-0 flex flex-col h-full">
      <FieldPalette onPaletteDragStart={onPaletteDragStart} onPaletteDragEnd={onPaletteDragEnd} />
    </div>
  );
};

export default FormItemsSelector;
