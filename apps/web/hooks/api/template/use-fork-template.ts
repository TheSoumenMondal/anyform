import { trpc } from "~/trpc/client";

export const useForkTemplate = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: forkTemplateAsync,
    mutate: forkTemplate,
    error: forkTemplateError,
    isPending: forkTemplateIsPending,
    isSuccess: forkTemplateIsSuccess,
    isError: forkTemplateIsError,
  } = trpc.template.forkTemplate.useMutation({
    onSuccess: () => {
      // invalidate the user's forms list so the new forked form shows up
      utils.form.getFormsByUserId.invalidate();
      utils.template.listTemplates.invalidate();
    },
  });

  return {
    forkTemplateAsync,
    forkTemplate,
    forkTemplateError,
    forkTemplateIsPending,
    forkTemplateIsSuccess,
    forkTemplateIsError,
  };
};
