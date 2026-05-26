import { trpc } from "~/trpc/client";

export const useTemplates = () => {
  const {
    data,
    error: templatesError,
    isError: templatesIsError,
    isLoading: templatesIsLoading,
    refetch: refetchTemplates,
  } = trpc.template.listTemplates.useQuery();

  return {
    templates: data ?? [],
    templatesError,
    templatesIsError,
    templatesIsLoading,
    refetchTemplates,
  };
};

export const useMyTemplates = () => {
  const {
    data,
    error: myTemplatesError,
    isError: myTemplatesIsError,
    isLoading: myTemplatesIsLoading,
  } = trpc.template.getMyTemplates.useQuery();

  return {
    myTemplates: data ?? [],
    myTemplatesError,
    myTemplatesIsError,
    myTemplatesIsLoading,
  };
};
