import { trpc } from "~/trpc/client";

export const useDeleteFormField = () => {
  const {
    mutateAsync: deleteFormFieldAsync,
    mutate: deleteFormField,
    error: deleteFormFieldError,
    failureCount: deleteFormFieldFailureCount,
    isError: deleteFormFieldIsError,
    isIdle: deleteFormFieldIsIdle,
    isPending: deleteFormFieldIsPending,
    isSuccess: deleteFormFieldIsSuccess,
    status: deleteFormFieldStatus,
  } = trpc.form.deleteFormField.useMutation({
    onSuccess: () => {
      // We will invalidate manually or optimistically update UI
    },
  });

  return {
    deleteFormFieldAsync,
    deleteFormField,
    deleteFormFieldError,
    deleteFormFieldFailureCount,
    deleteFormFieldIsError,
    deleteFormFieldIsIdle,
    deleteFormFieldIsPending,
    deleteFormFieldIsSuccess,
    deleteFormFieldStatus,
  };
};
