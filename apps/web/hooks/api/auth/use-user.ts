"use client";

import { TRPCClientError } from "@repo/trpc/client";
import { usePathname } from "next/navigation";

import { shouldCheckSession } from "~/lib/auth/routes";
import { trpc } from "~/trpc/client";

const isUnauthorizedError = (error: unknown) =>
  error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED";

export const useUser = () => {
  const pathname = usePathname();
  const enabled = shouldCheckSession(pathname);

  const query = trpc.auth.getUserInfo.useQuery(undefined, {
    enabled,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error)) {
        return false;
      }

      return failureCount < 1;
    },
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  const isUnauthorized = query.isError && isUnauthorizedError(query.error);
  const isSessionError = query.isError && !isUnauthorized;

  return {
    user: query.data ?? null,
    isAuthenticated: Boolean(query.data),
    isUnauthorized,
    isSessionPending: enabled && query.isLoading,
    isSessionError,
    refetchSession: query.refetch,
    enabled,
  };
};
