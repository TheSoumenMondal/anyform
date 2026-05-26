import { trpc } from "~/trpc/client";

export const useDeletedForms = () => {
  const {
    data: deletedForms,
    error: deletedFormsError,
    failureCount: deletedFormsFailureCount,
    isError: deletedFormsIsError,
    isLoading: deletedFormsIsLoading,
    isPending: deletedFormsIsPending,
    isSuccess: deletedFormsIsSuccess,
    refetch: refetchDeletedForms,
    status: deletedFormsStatus,
  } = trpc.form.getDeletedForms.useQuery();

  return {
    deletedForms: deletedForms ?? [],
    deletedFormsError,
    deletedFormsFailureCount,
    deletedFormsIsError,
    deletedFormsIsLoading,
    deletedFormsIsPending,
    deletedFormsIsSuccess,
    refetchDeletedForms,
    deletedFormsStatus,
  };
};
