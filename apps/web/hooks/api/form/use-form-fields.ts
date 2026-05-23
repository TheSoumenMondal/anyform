import { trpc } from "~/trpc/client";

export const useFormFields = (formId: string) => {
  const {
    data: formFields,
    error: formFieldsError,
    failureCount: formFieldsFailureCount,
    isError: formFieldsIsError,
    isLoading: formFieldsIsLoading,
    isPending: formFieldsIsPending,
    isSuccess: formFieldsIsSuccess,
    refetch: refetchFormFields,
    status: formFieldsStatus,
  } = trpc.form.getFormFieldsByFormId.useQuery({ formId }, { enabled: !!formId });

  return {
    formFields,
    formFieldsError,
    formFieldsFailureCount,
    formFieldsIsError,
    formFieldsIsLoading,
    formFieldsIsPending,
    formFieldsIsSuccess,
    refetchFormFields,
    formFieldsStatus,
  };
};
