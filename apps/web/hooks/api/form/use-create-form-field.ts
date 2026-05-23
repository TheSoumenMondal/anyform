import { trpc } from "~/trpc/client";

export const useCreateFormField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFormFieldAsync,
    mutate: createFormField,
    error: createFormFieldError,
    failureCount: createFormFieldFailureCount,
    isError: createFormFieldIsError,
    isIdle: createFormFieldIsIdle,
    isPending: createFormFieldIsPending,
    isSuccess: createFormFieldIsSuccess,
    status: createFormFieldStatus,
  } = trpc.form.createFormField.useMutation({
    onSuccess: (_data, variables) => {
      utils.form.getFormFieldsByFormId.invalidate({ formId: variables.formId });
    },
  });

  return {
    createFormFieldAsync,
    createFormField,
    createFormFieldError,
    createFormFieldFailureCount,
    createFormFieldIsError,
    createFormFieldIsIdle,
    createFormFieldIsPending,
    createFormFieldIsSuccess,
    createFormFieldStatus,
  };
};
