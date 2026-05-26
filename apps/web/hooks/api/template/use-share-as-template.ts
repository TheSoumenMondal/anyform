import { trpc } from "~/trpc/client";

export const useShareAsTemplate = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: shareAsTemplateAsync,
    mutate: shareAsTemplate,
    error: shareAsTemplateError,
    isPending: shareAsTemplateIsPending,
    isSuccess: shareAsTemplateIsSuccess,
    isError: shareAsTemplateIsError,
  } = trpc.template.shareAsTemplate.useMutation({
    onSuccess: () => {
      utils.template.listTemplates.invalidate();
      utils.template.getMyTemplates.invalidate();
    },
  });

  return {
    shareAsTemplateAsync,
    shareAsTemplate,
    shareAsTemplateError,
    shareAsTemplateIsPending,
    shareAsTemplateIsSuccess,
    shareAsTemplateIsError,
  };
};
