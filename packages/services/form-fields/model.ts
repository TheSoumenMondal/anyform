import z from "zod";

export const formFieldTypeEnum = z.enum([
  "short_text",
  "long_text",
  "email",
  "phone",
  "url",
  "number",
  "rating",
  "slider",
  "select",
  "multi_select",
  "radio",
  "checkbox",
  "boolean",
  "date",
  "file",
]);

export const createFormFieldInput = z.object({
  userId: z.string().describe("ID of the user creating the form field"),
  formId: z.string().describe("ID of the form to which the field belongs"),
  label: z.string().min(1).max(150).describe("Label of the form field"),
  description: z.string().max(1000).describe("Description of the form field").optional(),
  helpText: z.string().max(1000).describe("Help text for the form field").optional(),
  placeholder: z.string().max(1000).describe("Placeholder text for the form field").optional(),
  fieldType: formFieldTypeEnum,
  isRequired: z.boolean().default(false).describe("Whether the form field is required"),
  isHidden: z.boolean().default(false).describe("Whether the form field is hidden"),
  isDisabled: z.boolean().default(false).describe("Whether the form field is disabled"),
  stepNumber: z.number().int().positive().describe("Step number for multi-step forms").optional(),
  sortOrder: z.number().int().describe("Sort order of the form field"),
  defaultValue: z.json().describe("Default value for the form field").optional(),
  options: z.json().describe("Options for select, multi_select, radio, checkbox fields").optional(),
  validation: z.json().describe("Validation rules for the form field").optional(),
  settings: z.json().describe("Additional settings for the form field").optional(),
  dependsOnFieldId: z.string().describe("ID of the form field this field depends on").optional(),
  conditionalLogic: z
    .json()
    .describe("Value of the dependent field that triggers this field")
    .optional(),
});

export type CreateFormFieldInputType = z.infer<typeof createFormFieldInput>;

export const updateFormFieldInput = z.object({
  userId: z.string().describe("ID of the user updating the form field"),
  fieldId: z.string().describe("ID of the form field to update"),
  label: z.string().min(1).max(150).describe("Label of the form field").optional(),
  description: z.string().max(1000).describe("Description of the form field").optional(),
  helpText: z.string().max(1000).describe("Help text for the form field").optional(),
  placeholder: z.string().max(1000).describe("Placeholder text for the form field").optional(),
  isRequired: z.boolean().describe("Whether the form field is required").optional(),
  isHidden: z.boolean().describe("Whether the form field is hidden").optional(),
  isDisabled: z.boolean().describe("Whether the form field is disabled").optional(),
  stepNumber: z.number().int().positive().describe("Step number for multi-step forms").optional(),
  sortOrder: z.number().int().describe("Sort order of the form field").optional(),
  defaultValue: z.json().describe("Default value for the form field").optional(),
  options: z.json().describe("Options for select, multi_select, radio, checkbox fields").optional(),
  validation: z.json().describe("Validation rules for the form field").optional(),
  settings: z.json().describe("Additional settings for the form field").optional(),
  dependsOnFieldId: z.string().describe("ID of the form field this field depends on").optional(),
  conditionalLogic: z
    .json()
    .describe("Value of the dependent field that triggers this field")
    .optional(),
});

export type UpdateFormFieldInputType = z.infer<typeof updateFormFieldInput>;
