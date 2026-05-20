import { formService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { createFormInputModel, createFormOutputModel } from "./model";

export const formRouter = router({
  createForm: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/createForm",
        tags: ["Form"],
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
});
