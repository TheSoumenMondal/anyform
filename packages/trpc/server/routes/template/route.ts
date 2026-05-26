import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { zodUndefinedModel } from "../../schema";
import { templateService } from "../../services";
import {
  forkTemplateInputModel,
  forkTemplateOutputModel,
  getMyTemplatesOutputModel,
  listTemplatesOutputModel,
  shareAsTemplateInputModel,
  shareAsTemplateOutputModel,
  unshareTemplateInputModel,
  unshareTemplateOutputModel,
} from "./model";

const templateTags = ["Template"];

export const templateRouter = router({
  shareAsTemplate: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/template/share",
        tags: templateTags,
        protect: true,
      },
    })
    .input(shareAsTemplateInputModel)
    .output(shareAsTemplateOutputModel)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const result = await templateService.shareAsTemplate({
        formId: input.formId,
        userId,
      });
      return result;
    }),

  unshareTemplate: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/template/unshare",
        tags: templateTags,
        protect: true,
      },
    })
    .input(unshareTemplateInputModel)
    .output(unshareTemplateOutputModel)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const result = await templateService.unshareTemplate({
        templateId: input.templateId,
        userId,
      });
      return result;
    }),

  listTemplates: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/template/list",
        tags: templateTags,
      },
    })
    .input(zodUndefinedModel)
    .output(listTemplatesOutputModel)
    .query(async () => {
      const result = await templateService.listTemplates();
      return result;
    }),

  getMyTemplates: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/template/mine",
        tags: templateTags,
        protect: true,
      },
    })
    .input(zodUndefinedModel)
    .output(getMyTemplatesOutputModel)
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      const result = await templateService.getTemplatesByUserId(userId);
      return result;
    }),

  forkTemplate: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/template/fork",
        tags: templateTags,
        protect: true,
      },
    })
    .input(forkTemplateInputModel)
    .output(forkTemplateOutputModel)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const result = await templateService.forkTemplate({
        templateId: input.templateId,
        userId,
      });
      return result;
    }),
});
