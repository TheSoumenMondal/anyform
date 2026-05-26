"use client";

import React from "react";
import FormEditor from "./FormEditor";
import FormItemsSelector from "./FormItemsSelector";
import InputFieldValidation from "./InputFieldValidation";

const FormBuilder = () => {
  return (
    <div className="w-full h-full grid grid-cols-6">
      <div className="col-span-1 border-r">
        <FormItemsSelector />
      </div>
      <div className="col-span-4 border-r">
        <FormEditor />
      </div>
      <div className="col-span-1">
        <InputFieldValidation />
      </div>
    </div>
  );
};

export default FormBuilder;
