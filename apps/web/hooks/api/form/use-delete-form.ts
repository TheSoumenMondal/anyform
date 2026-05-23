import { trpc } from "~/trpc/client";

export default function useDeleteForm() {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteFormAsync,
    mutate: deleteForm,
    error: deleteFormError,
    failureCount: deleteFormFailureCount,
    isError: deleteFormIsError,
    isIdle: deleteFormIsIdle,
    isPending: deleteFormIsPending,
    isSuccess: deleteFormIsSuccess,
    status: deleteFormStatus,
  } = trpc.form.deleteForm.useMutation({
    onSuccess: () => {
      utils.form.getFormsByUserId.invalidate();
    },
  });

  return {
    deleteFormAsync,
    deleteForm,
    deleteFormError,
    deleteFormFailureCount,
    deleteFormIsError,
    deleteFormIsIdle,
    deleteFormIsPending,
    deleteFormIsSuccess,
    deleteFormStatus,
  };
}
