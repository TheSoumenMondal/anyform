import { trpc } from "~/trpc/client";

export const useSignUp = () => {
  const {
    mutateAsync: createAccountWithEmailAndPasswordAsync,
    mutate: createAccountWithEmailAndPassword,
    error: createAccountWithEmailAndPasswordError,
    failureCount: createAccountWithEmailAndPasswordFailureCount,
    isError: createAccountWithEmailAndPasswordIsError,
    isIdle: createAccountWithEmailAndPasswordIsIdle,
    isSuccess: createAccountWithEmailAndPasswordIsSuccess,
    status: createAccountWithEmailAndPasswordStatus,
  } = trpc.auth.createAccountWithEmailAndPassword.useMutation();

  return {
    createAccountWithEmailAndPasswordAsync: createAccountWithEmailAndPasswordAsync,
    createAccountWithEmailAndPassword: createAccountWithEmailAndPassword,
    createAccountWithEmailAndPasswordError: createAccountWithEmailAndPasswordError,
    createAccountWithEmailAndPasswordFailureCount: createAccountWithEmailAndPasswordFailureCount,
    createAccountWithEmailAndPasswordIsError: createAccountWithEmailAndPasswordIsError,
    createAccountWithEmailAndPasswordIsIdle: createAccountWithEmailAndPasswordIsIdle,
    createAccountWithEmailAndPasswordIsSuccess: createAccountWithEmailAndPasswordIsSuccess,
    createAccountWithEmailAndPasswordStatus: createAccountWithEmailAndPasswordStatus,
  };
};
