import z from "zod";
import { formFieldTypeEnum } from "@repo/services/form-fields/model";

const dateTimeInputModel = z.union([z.date(), z.iso.datetime()]).transform((value) => {
  return typeof value === "string" ? new Date(value) : value;
});

export const createFormInputModel = z.object({
  title: z.string().min(3).max(255).describe("Title of the form"),
  description: z.string().max(1000).describe("Description of the form").optional(),
  formType: z
    .enum(["single_step", "multi_step"])
    .default("single_step")
    .describe("Type of the form"),
  isPublic: z.boolean().default(false).describe("Whether the form is public"),
  isProtected: z.boolean().default(false).describe("Whether the form is password protected"),
  password: z.string().max(255).describe("Password for protected form").optional(),
  maxSubmissionLimit: z
    .number()
    .int()
    .positive()
    .default(100)
    .describe("Maximum number of submissions allowed"),
  expiry: dateTimeInputModel.describe("Expiry date of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("ID of the created form"),
});

export const getFormByUserIdOutputModel = z.array(
  z.object({
    id: z.string().describe("ID of the form"),
    slug: z.string().describe("Slug of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().nullable().describe("Description of the form"),
    formType: z.enum(["single_step", "multi_step"]).describe("Type of the form"),
    formStatus: z
      .enum(["draft", "published", "archived", "deleted"])
      .describe("Status of the form"),
    isPublic: z.boolean().describe("Whether the form is public"),
    isProtected: z.boolean().describe("Whether the form is password protected"),
    maxSubmissionLimit: z
      .number()
      .int()
      .positive()
      .describe("Maximum number of submissions allowed")
      .nullable(),
    expiry: z.date().describe("Expiry date of the form"),
    createdAt: z.date().describe("Creation date of the form"),
    updatedAt: z.date().describe("Last update date of the form"),
  }),
);

export const updateFormInputModel = z.object({
  formId: z.string().describe("ID of the form to be updated"),
  title: z.string().min(3).max(255).describe("Title of the form").optional(),
  description: z.string().max(1000).describe("Description of the form").optional(),
  formType: z.enum(["single_step", "multi_step"]).describe("Type of the form").optional(),
  isPublic: z.boolean().describe("Whether the form is public").optional(),
  isProtected: z.boolean().describe("Whether the form is password protected").optional(),
  password: z.string().max(255).describe("Password for protected form").optional(),
  maxSubmissionLimit: z
    .number()
    .int()
    .positive()
    .describe("Maximum number of submissions allowed")
    .optional(),
  expiry: dateTimeInputModel.describe("Expiry date of the form").optional(),
});

export const updateFormOutputType = z.object({
  id: z.string().describe("ID of the updated form"),
});

const formFieldBaseModel = z.object({
  label: z.string().min(1).max(150).describe("Label of the form field"),
  description: z.string().max(1000).describe("Description of the form field").optional(),
  helpText: z.string().max(1000).describe("Help text for the form field").optional(),
  placeholder: z.string().max(1000).describe("Placeholder text for the form field").optional(),
  fieldType: formFieldTypeEnum.describe("Type of the form field"),
  isRequired: z.boolean().default(false).describe("Whether the form field is required"),
  isHidden: z.boolean().default(false).describe("Whether the form field is hidden"),
  isDisabled: z.boolean().default(false).describe("Whether the form field is disabled"),
  stepNumber: z.number().int().positive().describe("Step number for the form field").optional(),
  sortOrder: z.number().int().describe("Sort order for the form field"),
  defaultValue: z.json().optional().describe("Default value for the form field"),
  options: z.json().optional().describe("Options for the form field"),
  validation: z.json().optional().describe("Validation rules for the form field"),
  settings: z.json().optional().describe("Settings for the form field"),
  dependsOnFieldId: z
    .string()
    .nullable()
    .describe("ID of the field this field depends on")
    .optional(),
  conditionalLogic: z.json().describe("Conditional logic for the form field").optional(),
});

export const createFormFieldInputModel = formFieldBaseModel.extend({
  formId: z.string().describe("ID of the form to which the field belongs"),
});

export const createFormFieldOutputModel = formFieldBaseModel.extend({
  id: z.string().describe("ID of the created form field"),
});

export const updateFormFieldInputModel = z.object({
  fieldId: z.string().describe("ID of the form field"),
  label: z.string().min(1).max(150).describe("Label of the form field").optional(),
  description: z.string().max(1000).describe("Description of the form field").optional(),
  helpText: z.string().max(1000).describe("Help text for the form field").optional(),
  placeholder: z.string().max(1000).describe("Placeholder text for the form field").optional(),
  fieldType: formFieldTypeEnum.describe("Type of the form field").optional(),
  isRequired: z.boolean().default(false).describe("Whether the form field is required").optional(),
  isHidden: z.boolean().default(false).describe("Whether the form field is hidden").optional(),
  isDisabled: z.boolean().default(false).describe("Whether the form field is disabled").optional(),
  stepNumber: z.number().int().positive().describe("Step number for the form field").optional(),
  sortOrder: z.number().int().describe("Sort order for the form field").optional(),
  defaultValue: z.json().optional().describe("Default value for the form field").optional(),
  options: z.json().optional().describe("Options for the form field").optional(),
  validation: z.json().optional().describe("Validation rules for the form field").optional(),
  settings: z.json().optional().describe("Settings for the form field").optional(),
  dependsOnFieldId: z
    .string()
    .nullable()
    .describe("ID of the field this field depends on")
    .optional(),
  conditionalLogic: z.json().describe("Conditional logic for the form field").optional(),
});

export const updateFormFieldOutputModel = updateFormFieldInputModel;

export const deleteFormFieldInputType = z.object({
  formFieldId: z.string().describe("ID of the form field to be created"),
});

export const deleteFormFieldOutputType = z.object({
  success: z.boolean().describe("Whether the form field was successfully deleted"),
});
