import { trpc } from "~/trpc/client";

export const useIndividualFormAnalytics = (slug: string) => {
  const {
    data: analyticsData,
    error: analyticsError,
    failureCount: analyticsFailureCount,
    isError: analyticsIsError,
    isLoading: analyticsIsLoading,
    isPending: analyticsIsPending,
    isSuccess: analyticsIsSuccess,
    refetch: refetchAnalytics,
    status: analyticsStatus,
  } = trpc.analytics.getIndividualFormAnalyticsData.useQuery(
    { slug },
    {
      enabled: !!slug,
    },
  );

  return {
    analyticsData,
    analyticsError,
    analyticsFailureCount,
    analyticsIsError,
    analyticsIsLoading,
    analyticsIsPending,
    analyticsIsSuccess,
    refetchAnalytics,
    analyticsStatus,
  };
};
