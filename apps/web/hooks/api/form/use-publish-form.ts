import { trpc } from "~/trpc/client";

export const usePublishForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: publishFormAsync,
    mutate: publishForm,
    error: publishFormError,
    failureCount: publishFormFailureCount,
    isError: publishFormIsError,
    isIdle: publishFormIsIdle,
    isPending: publishFormIsPending,
    isSuccess: publishFormIsSuccess,
    status: publishFormStatus,
  } = trpc.form.publishForm.useMutation({
    onSuccess: () => {
      utils.form.getFormsByUserId.invalidate();
      utils.form.getFormBySlug.invalidate();
    },
  });

  return {
    publishFormAsync,
    publishForm,
    publishFormError,
    publishFormFailureCount,
    publishFormIsError,
    publishFormIsIdle,
    publishFormIsPending,
    publishFormIsSuccess,
    publishFormStatus,
  };
};
