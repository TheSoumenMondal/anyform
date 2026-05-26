import { trpc } from "~/trpc/client";

export const useUnshareTemplate = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: unshareTemplateAsync,
    mutate: unshareTemplate,
    error: unshareTemplateError,
    isPending: unshareTemplateIsPending,
    isSuccess: unshareTemplateIsSuccess,
    isError: unshareTemplateIsError,
  } = trpc.template.unshareTemplate.useMutation({
    onSuccess: () => {
      utils.template.listTemplates.invalidate();
      utils.template.getMyTemplates.invalidate();
    },
  });

  return {
    unshareTemplateAsync,
    unshareTemplate,
    unshareTemplateError,
    unshareTemplateIsPending,
    unshareTemplateIsSuccess,
    unshareTemplateIsError,
  };
};
