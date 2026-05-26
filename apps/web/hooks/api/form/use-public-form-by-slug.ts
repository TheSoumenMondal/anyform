import { trpc } from "~/trpc/client";

export const usePublicFormBySlug = (slug: string) => {
  const {
    data: form,
    error: formError,
    isLoading: formIsLoading,
    isError: formIsError,
  } = trpc.form.getPublicFormBySlug.useQuery({ slug }, { enabled: !!slug });

  return {
    form: form ?? null,
    formError,
    formIsLoading,
    formIsError,
  };
};
