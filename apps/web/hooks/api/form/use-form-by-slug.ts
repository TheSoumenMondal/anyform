import { trpc } from "~/trpc/client";

export const useFormBySlug = (slug: string) => {
  const {
    data: form,
    error: formError,
    failureCount: formFailureCount,
    isError: formIsError,
    isLoading: formIsLoading,
    isPending: formIsPending,
    isSuccess: formIsSuccess,
    refetch: refetchForm,
    status: formStatus,
  } = trpc.form.getFormBySlug.useQuery({ slug });

  return {
    form: form ?? null,
    formError,
    formFailureCount,
    formIsError,
    formIsLoading,
    formIsPending,
    formIsSuccess,
    refetchForm,
    formStatus,
  };
};
