import { z } from "zod";

export const createFormInput = z.object({
  createdBy: z.string().describe("ID of the user creating the form"),
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
  expiry: z.date().describe("Expiry date of the form"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const getFormByUserId = z.object({
  userId: z.string().describe("ID of the user whose forms are to be retrieved"),
});

export type GetFormByUserIdType = z.infer<typeof getFormByUserId>;

export const updateFormInput = z.object({
  userId: z.string().describe("ID of the user updating the form"),
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
  expiry: z.date().describe("Expiry date of the form").optional(),
});

export type UpdateFormInputType = z.infer<typeof updateFormInput>;
