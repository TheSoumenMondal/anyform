import { trpc } from "~/trpc/client";

export const useUpdateForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateFormAsync,
    mutate: updateForm,
    error: updateFormError,
    failureCount: updateFormFailureCount,
    isError: updateFormIsError,
    isIdle: updateFormIsIdle,
    isPending: updateFormIsPending,
    isSuccess: updateFormIsSuccess,
    status: updateFormStatus,
  } = trpc.form.updateForm.useMutation({
    onSuccess: () => {
      utils.form.getFormsByUserId.invalidate();
    },
  });

  return {
    updateFormAsync,
    updateForm,
    updateFormError,
    updateFormFailureCount,
    updateFormIsError,
    updateFormIsIdle,
    updateFormIsPending,
    updateFormIsSuccess,
    updateFormStatus,
  };
};
