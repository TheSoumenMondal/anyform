import { trpc } from "~/trpc/client";

export const useArchiveForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: archiveFormAsync,
    mutate: archiveForm,
    isPending: archiveFormIsPending,
    isError: archiveFormIsError,
    isSuccess: archiveFormIsSuccess,
  } = trpc.form.archiveForm.useMutation({
    onSuccess: () => {
      utils.form.getFormsByUserId.invalidate();
      utils.form.getFormBySlug.invalidate();
    },
  });

  return {
    archiveFormAsync,
    archiveForm,
    archiveFormIsPending,
    archiveFormIsError,
    archiveFormIsSuccess,
  };
};
