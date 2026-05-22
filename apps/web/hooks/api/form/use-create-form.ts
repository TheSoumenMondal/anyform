import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error: createFormError,
    failureCount: createFormFailureCount,
    isError: createFormIsError,
    isIdle: createFormIsIdle,
    isPending: createFormIsPending,
    isSuccess: createFormIsSuccess,
    status: createFormStatus,
  } = trpc.form.createForm.useMutation({
    onSuccess: () => {
      utils.form.getFormsByUserId.invalidate();
    },
  });

  return {
    createFormAsync: createFormAsync,
    createForm: createForm,
    createFormError: createFormError,
    createFormFailureCount: createFormFailureCount,
    createFormIsError: createFormIsError,
    createFormIsIdle: createFormIsIdle,
    createFormIsPending: createFormIsPending,
    createFormIsSuccess: createFormIsSuccess,
    createFormStatus: createFormStatus,
  };
};
