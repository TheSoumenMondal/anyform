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
