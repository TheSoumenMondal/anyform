import { trpc } from "~/trpc/client";

export const useSubmitFormResponse = () => {
  const {
    mutateAsync: submitFormResponseAsync,
    mutate: submitFormResponse,
    error: submitFormResponseError,
    isPending: submitFormResponseIsPending,
    isSuccess: submitFormResponseIsSuccess,
  } = trpc.form.submitFormResponse.useMutation();

  const { mutateAsync: createDraftSubmissionAsync, isPending: createDraftSubmissionIsPending } =
    trpc.form.createDraftSubmission.useMutation();

  return {
    submitFormResponseAsync,
    submitFormResponse,
    submitFormResponseError,
    submitFormResponseIsPending,
    submitFormResponseIsSuccess,
    createDraftSubmissionAsync,
    createDraftSubmissionIsPending,
  };
};
