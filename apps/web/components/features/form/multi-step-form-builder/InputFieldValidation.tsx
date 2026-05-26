"use client";

import React from "react";

type InputFieldValidationProps = {
  // We can add more props as we implement actual property editing
  selectedNodeId?: string | null;
};

const InputFieldValidation = ({ selectedNodeId }: InputFieldValidationProps) => {
  return (
    <div className="w-80 shrink-0 flex flex-col h-full">
      <div className="flex-1 bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        <div className="size-12 rounded-full bg-accent/50 flex items-center justify-center mb-3">
          <span className="text-lg">⚙️</span>
        </div>
        <h3 className="font-bold text-sm">
          {selectedNodeId ? `Editing Step: ${selectedNodeId}` : "Select a Step"}
        </h3>
        <p className="text-xs text-muted-foreground mt-2">
          {selectedNodeId
            ? "Configure the properties and settings for this form step."
            : "Click on a step node in the flow editor to see and edit its properties."}
        </p>
      </div>
    </div>
  );
};

export default InputFieldValidation;
