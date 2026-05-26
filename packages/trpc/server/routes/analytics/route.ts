import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { zodUndefinedModel } from "../../schema";
import { analyticsService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import {
  analyticsOutputSchema,
  yearlyDailyAnalyticsOutputSchema,
  individualFormAnalyticsOutputSchema,
} from "./model";
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
  getYearlyDailyAnalyticsData: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/analytics/yearly-daily",
        tags: analyticsTags,
        protect: true,
      },
    })
    .input(zodUndefinedModel)
    .output(yearlyDailyAnalyticsOutputSchema)
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user.id;
        const analyticsData = await analyticsService.asyncGetYearlyDailyAnalytics({ userId });
        return analyticsData;
      } catch (error) {
        console.error("TRPC Error in getYearlyDailyAnalyticsData:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to fetch yearly daily analytics data",
          cause: error,
        });
      }
    }),
  getIndividualFormAnalyticsData: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/analytics/form/{slug}",
        tags: analyticsTags,
        protect: true,
      },
    })
    .input(z.object({ slug: z.string() }))
    .output(individualFormAnalyticsOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const analyticsData = await analyticsService.asyncGetIndividualFormAnalytics({
          userId,
          slug: input.slug,
        });
        return analyticsData;
      } catch (error) {
        console.error("TRPC Error in getIndividualFormAnalyticsData:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch individual form analytics data",
          cause: error,
        });
      }
    }),
});
