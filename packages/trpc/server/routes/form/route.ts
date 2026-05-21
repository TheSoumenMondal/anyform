import { zodUndefinedModel } from "../../schema";
import { formService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import {
  createFormInputModel,
  createFormOutputModel,
  getFormByUserIdOutputModel,
  updateFormInputModel,
  updateFormOutputType,
} from "./model";

const formTags = ["Form"];

export const formRouter = router({
  createForm: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/createForm",
        tags: formTags,
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const {
        title,
        description,
        formType,
        isPublic,
        isProtected,
        password,
        maxSubmissionLimit,
        expiry,
      } = input;
      const result = await formService.createForm({
        createdBy: userId,
        title,
        description,
        formType,
        isPublic,
        isProtected,
        password,
        maxSubmissionLimit,
        expiry,
      });
      return {
        id: result.id,
      };
    }),

  getFormsByUserId: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/getFormsByUserId",
        tags: formTags,
      },
    })
    .input(zodUndefinedModel)
    .output(getFormByUserIdOutputModel)
    .query(async ({ ctx }) => {
      const { user } = ctx;
      const result = await formService.getFormsByUserId({
        userId: user.id,
      });
      return result;
    }),

  updateForm: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/updateForm",
        tags: formTags,
        protect: true,
      },
    })
    .input(updateFormInputModel)
    .output(updateFormOutputType)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const {
        formId,
        title,
        description,
        formType,
        isPublic,
        isProtected,
        password,
        maxSubmissionLimit,
        expiry,
      } = input;

      const result = await formService.updateForm({
        userId,
        formId,
        title,
        description,
        formType,
        isPublic,
        isProtected,
        password,
        maxSubmissionLimit,
        expiry,
      });
      return {
        id: result.id,
      };
    }),
});
