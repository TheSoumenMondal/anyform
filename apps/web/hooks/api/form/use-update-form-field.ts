import { trpc } from "~/trpc/client";

export const useUpdateFormField = () => {
  const {
    mutateAsync: updateFormFieldAsync,
    mutate: updateFormField,
    error: updateFormFieldError,
    failureCount: updateFormFieldFailureCount,
    isError: updateFormFieldIsError,
    isIdle: updateFormFieldIsIdle,
    isPending: updateFormFieldIsPending,
    isSuccess: updateFormFieldIsSuccess,
    status: updateFormFieldStatus,
  } = trpc.form.updateFormField.useMutation({
    onSuccess: () => {
      // We don't invalidate here by default to prevent UI flashing during typing.
      // We can invalidate specific queries manually when needed.
    },
  });

  return {
    updateFormFieldAsync,
    updateFormField,
    updateFormFieldError,
    updateFormFieldFailureCount,
    updateFormFieldIsError,
    updateFormFieldIsIdle,
    updateFormFieldIsPending,
    updateFormFieldIsSuccess,
    updateFormFieldStatus,
  };
};
