import z from "zod";

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
  expiry: z.date().describe("Expiry date of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("ID of the created form"),
});

export const getFormByUserIdOutputModel = z.array(
  z.object({
    id: z.string().describe("ID of the form"),
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
  expiry: z.date().describe("Expiry date of the form").optional(),
});

export const updateFormOutputType = z.object({
  id: z.string().describe("ID of the updated form"),
});
