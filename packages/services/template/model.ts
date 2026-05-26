import { z } from "zod";

export const shareAsTemplateInput = z.object({
  formId: z.string().uuid().describe("ID of the form to share as a template"),
  userId: z.string().describe("ID of the user sharing the form"),
});

export type ShareAsTemplateInputType = z.infer<typeof shareAsTemplateInput>;

export const unshareTemplateInput = z.object({
  templateId: z.string().uuid().describe("ID of the template to remove"),
  userId: z.string().describe("ID of the user who owns the template"),
});

export type UnshareTemplateInputType = z.infer<typeof unshareTemplateInput>;

export const forkTemplateInput = z.object({
  templateId: z.string().uuid().describe("ID of the template to fork"),
  userId: z.string().describe("ID of the user forking the template"),
});

export type ForkTemplateInputType = z.infer<typeof forkTemplateInput>;
