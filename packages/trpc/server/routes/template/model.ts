import z from "zod";

const themeEnum = z.enum(["default", "movie", "terminal", "startup", "game", "anime", "os"]);
const formTypeEnum = z.enum(["single_step", "multi_step"]);

// ─── share as template ─────────────────────────────────────────────────────
export const shareAsTemplateInputModel = z.object({
  formId: z.string().uuid().describe("ID of the form to share as a template"),
});

export const shareAsTemplateOutputModel = z.object({
  templateId: z.string().uuid().describe("ID of the newly created template"),
});

// ─── unshare template ──────────────────────────────────────────────────────
export const unshareTemplateInputModel = z.object({
  templateId: z.string().uuid().describe("ID of the template to remove"),
});

export const unshareTemplateOutputModel = z.object({
  success: z.boolean(),
});

// ─── list all templates (public browsing) ─────────────────────────────────
export const listTemplatesOutputModel = z.array(
  z.object({
    id: z.string().uuid().describe("Template ID"),
    title: z.string().describe("Template title"),
    description: z.string().nullable().describe("Template description"),
    formId: z.string().uuid().describe("Source form ID"),
    creator: z.string().describe("Creator user ID"),
    totalForks: z.number().int().describe("How many times this template has been forked"),
    theme: themeEnum.describe("Theme of the source form"),
    formType: formTypeEnum.describe("Type of the source form"),
    createdAt: z.date().describe("When the template was shared"),
    updatedAt: z.date().describe("Last update time"),
  }),
);

// ─── get my templates ──────────────────────────────────────────────────────
export const getMyTemplatesOutputModel = listTemplatesOutputModel;

// ─── fork template ─────────────────────────────────────────────────────────
export const forkTemplateInputModel = z.object({
  templateId: z.string().uuid().describe("ID of the template to fork"),
});

export const forkTemplateOutputModel = z.object({
  formId: z.string().uuid().describe("ID of the newly forked form"),
  slug: z.string().describe("Slug of the newly forked form"),
});
