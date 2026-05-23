import { zodUndefinedModel } from "../../schema";
import { formFieldService, formService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import z from "zod";
import {
  createFormFieldInputModel,
  createFormFieldOutputModel,
  createFormInputModel,
  createFormOutputModel,
  deleteFormFieldInputType,
  deleteFormFieldOutputType,
  deleteFormInputModel,
  deleteFormOutputModel,
  getFormByUserIdOutputModel,
  updateFormFieldInputModel,
  updateFormFieldOutputModel,
  updateFormInputModel,
  updateFormOutputType,
} from "./model";

const formTags = ["Form"];

const toJsonOutput = (
  value: unknown,
): z.infer<typeof createFormFieldOutputModel>["defaultValue"] => {
  return value as z.infer<typeof createFormFieldOutputModel>["defaultValue"];
};

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

  deleteForm: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/deleteForm",
        tags: formTags,
        protect: true,
      },
    })
    .input(deleteFormInputModel)
    .output(deleteFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const { formId } = input;

      const result = await formService.deleteForm({
        userId,
        formId,
      });
      return result;
    }),

  createFormField: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/createFormField",
        tags: formTags,
        protect: true,
      },
    })
    .input(createFormFieldInputModel)
    .output(createFormFieldOutputModel)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const result = await formFieldService.createFormField({
        userId,
        formId: input.formId,
        label: input.label,
        description: input.description,
        helpText: input.helpText,
        placeholder: input.placeholder,
        fieldType: input.fieldType,
        isRequired: input.isRequired,
        isHidden: input.isHidden,
        isDisabled: input.isDisabled,
        sortOrder: input.sortOrder,
        defaultValue: input.defaultValue,
        options: input.options,
        validation: input.validation,
        settings: input.settings,
        conditionalLogic: input.conditionalLogic,
        dependsOnFieldId: input.dependsOnFieldId ?? undefined,
        stepNumber: input.stepNumber,
      });

      if (!result) {
        throw new Error("Failed to create form field");
      }

      return {
        id: result.id,
        label: result.label,

        description: result.description ?? undefined,
        helpText: result.helpText ?? undefined,
        placeholder: result.placeholder ?? undefined,

        fieldType: result.fieldType,

        isRequired: result.isRequired,
        isHidden: result.isHidden,
        isDisabled: result.isDisabled,

        sortOrder: result.sortOrder,
        defaultValue: toJsonOutput(result.defaultValue),

        options: toJsonOutput(result.options),
        validation: toJsonOutput(result.validation),
        settings: toJsonOutput(result.settings),
        conditionalLogic: toJsonOutput(result.conditionalLogic),

        dependsOnFieldId: result.dependsOnFieldId ?? undefined,
        stepNumber: result.stepNumber ?? undefined,
      };
    }),

  updateFormField: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/updateFormField",
        tags: formTags,
        protect: true,
      },
    })
    .input(updateFormFieldInputModel)
    .output(updateFormFieldOutputModel)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const {
        fieldId,
        label,
        description,
        helpText,
        placeholder,
        isRequired,
        isHidden,
        isDisabled,
        options,
        settings,
        sortOrder,
        stepNumber,
        validation,
        defaultValue,
        dependsOnFieldId,
        conditionalLogic,
      } = input;

      const result = await formFieldService.updateFormField({
        userId,
        fieldId,
        label,
        description,
        helpText,
        placeholder,
        isRequired,
        isHidden,
        isDisabled,
        options,
        settings,
        sortOrder,
        stepNumber,
        validation,
        defaultValue,
        dependsOnFieldId: dependsOnFieldId ?? undefined,
        conditionalLogic,
      });

      if (!result) {
        throw new Error("Failed to update form field");
      }

      return {
        fieldId: result.id,
        label: result.label,

        description: result.description ?? undefined,
        helpText: result.helpText ?? undefined,
        placeholder: result.placeholder ?? undefined,

        fieldType: result.fieldType,

        isRequired: result.isRequired,
        isHidden: result.isHidden,
        isDisabled: result.isDisabled,

        sortOrder: result.sortOrder,
        defaultValue: toJsonOutput(result.defaultValue),

        options: toJsonOutput(result.options),
        validation: toJsonOutput(result.validation),
        settings: toJsonOutput(result.settings),
        conditionalLogic: toJsonOutput(result.conditionalLogic),

        dependsOnFieldId: result.dependsOnFieldId ?? undefined,
        stepNumber: result.stepNumber ?? undefined,
      };
    }),

  deleteFormField: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/deleteFormField",
        tags: formTags,
        protect: true,
      },
    })
    .input(deleteFormFieldInputType)
    .output(deleteFormFieldOutputType)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const { formFieldId } = input;

      const result = await formFieldService.deleteFormField({ userId, fieldId: formFieldId });

      if (!result) {
        throw new Error("Failed to delete form field");
      }

      return { success: true };
    }),
});
