import { trpc } from "~/trpc/client";

export const usePublicFormFields = (formId: string) => {
  const {
    data: formFields,
    error: formFieldsError,
    isLoading: formFieldsIsLoading,
    isError: formFieldsIsError,
    refetch: refetchFormFields,
  } = trpc.form.getPublicFormFieldsByFormId.useQuery(
    { formId },
    {
      enabled: !!formId,
      retry: (failureCount, error) => {
        if (error.data?.code === "UNAUTHORIZED") return false;
        return failureCount < 3;
      },
    },
  );

  return {
    formFields: formFields ?? [],
    formFieldsError,
    formFieldsIsLoading,
    formFieldsIsError,
    refetchFormFields,
  };
};
