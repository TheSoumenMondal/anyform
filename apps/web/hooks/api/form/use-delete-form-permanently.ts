import { trpc } from "~/trpc/client";

export default function useDeleteFormPermanently() {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteFormPermanentlyAsync,
    mutate: deleteFormPermanently,
    error: deleteFormPermanentlyError,
    failureCount: deleteFormPermanentlyFailureCount,
    isError: deleteFormPermanentlyIsError,
    isIdle: deleteFormPermanentlyIsIdle,
    isPending: deleteFormPermanentlyIsPending,
    isSuccess: deleteFormPermanentlyIsSuccess,
    status: deleteFormPermanentlyStatus,
  } = trpc.form.deleteFormPermanently.useMutation({
    onSuccess: () => {
      utils.form.getFormsByUserId.invalidate();
      utils.form.getDeletedForms.invalidate();
    },
  });

  return {
    deleteFormPermanentlyAsync,
    deleteFormPermanently,
    deleteFormPermanentlyError,
    deleteFormPermanentlyFailureCount,
    deleteFormPermanentlyIsError,
    deleteFormPermanentlyIsIdle,
    deleteFormPermanentlyIsPending,
    deleteFormPermanentlyIsSuccess,
    deleteFormPermanentlyStatus,
  };
}
