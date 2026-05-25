import { trpc } from "~/trpc/client";

export const useDashboardAnalytics = () => {
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
  } = trpc.analytics.getDashboardAnalyticsData.useQuery();

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
