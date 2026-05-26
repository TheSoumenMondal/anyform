import { trpc } from "~/trpc/client";

export default function useRecoverForm() {
  const utils = trpc.useUtils();

  const {
    mutateAsync: recoverFormAsync,
    mutate: recoverForm,
    error: recoverFormError,
    failureCount: recoverFormFailureCount,
    isError: recoverFormIsError,
    isIdle: recoverFormIsIdle,
    isPending: recoverFormIsPending,
    isSuccess: recoverFormIsSuccess,
    status: recoverFormStatus,
  } = trpc.form.recoverForm.useMutation({
    onSuccess: () => {
      utils.form.getFormsByUserId.invalidate();
      utils.form.getDeletedForms.invalidate();
    },
  });

  return {
    recoverFormAsync,
    recoverForm,
    recoverFormError,
    recoverFormFailureCount,
    recoverFormIsError,
    recoverFormIsIdle,
    recoverFormIsPending,
    recoverFormIsSuccess,
    recoverFormStatus,
  };
}
