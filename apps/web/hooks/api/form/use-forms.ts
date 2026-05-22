import { trpc } from "~/trpc/client";

export const useForms = () => {
  const {
    data: forms,
    error: formsError,
    failureCount: formsFailureCount,
    isError: formsIsError,
    isLoading: formsIsLoading,
    isPending: formsIsPending,
    isSuccess: formsIsSuccess,
    refetch: refetchForms,
    status: formsStatus,
  } = trpc.form.getFormsByUserId.useQuery();

  return {
    forms: forms ?? [],
    formsError: formsError,
    formsFailureCount: formsFailureCount,
    formsIsError: formsIsError,
    formsIsLoading: formsIsLoading,
    formsIsPending: formsIsPending,
    formsIsSuccess: formsIsSuccess,
    refetchForms: refetchForms,
    formsStatus: formsStatus,
  };
};
