import { trpc } from "~/trpc/client";

export const useSignIn = () => {
  const {
    mutateAsync: signInWithEmailAndPasswordAsync,
    mutate: signInWithEmailAndPassword,
    error: signInWithEmailAndPasswordError,
    failureCount: signInWithEmailAndPasswordFailureCount,
    isError: signInWithEmailAndPasswordIsError,
    isIdle: signInWithEmailAndPasswordIsIdle,
    isSuccess: signInWithEmailAndPasswordIsSuccess,
    status: signInWithEmailAndPasswordStatus,
  } = trpc.auth.signInWithEmailAndPassword.useMutation();

  return {
    signInWithEmailAndPasswordAsync: signInWithEmailAndPasswordAsync,
    signInWithEmailAndPassword: signInWithEmailAndPassword,
    signInWithEmailAndPasswordError: signInWithEmailAndPasswordError,
    signInWithEmailAndPasswordFailureCount: signInWithEmailAndPasswordFailureCount,
    signInWithEmailAndPasswordIsError: signInWithEmailAndPasswordIsError,
    signInWithEmailAndPasswordIsIdle: signInWithEmailAndPasswordIsIdle,
    signInWithEmailAndPasswordIsSuccess: signInWithEmailAndPasswordIsSuccess,
    signInWithEmailAndPasswordStatus: signInWithEmailAndPasswordStatus,
  };
};
