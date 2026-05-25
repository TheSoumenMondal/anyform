import { TRPCError } from "@trpc/server";
import { zodUndefinedModel } from "../../schema";
import { analyticsService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { analyticsOutputSchema } from "./model";

const analyticsTags = ["Analytics"];

export const analyticsRouter = router({
  getDashboardAnalyticsData: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/analytics/dashboard",
        tags: analyticsTags,
        protect: true,
      },
    })
    .input(zodUndefinedModel)
    .output(analyticsOutputSchema)
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user.id;
        const analyticsData = await analyticsService.asyncGetAnalytics({ userId });
        return analyticsData;
      } catch (error) {
        console.error("TRPC Error in getDashboardAnalyticsData:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch analytics data",
          cause: error,
        });
      }
    }),
});
