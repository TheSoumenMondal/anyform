import { z, zodUndefinedModel } from "../../schema";
import { publicProcedure, router } from "../../trpc";

export const healthRouter = router({
  getHealth: publicProcedure
    .meta({ openapi: { method: "GET", path: "/health" } })
    .input(zodUndefinedModel)
    .output(
      z.object({
        uptime: z.number().describe("uptime of the server in seconds"),
        status: z.literal("healthy").describe("status of the server"),
        timestamp: z.number().describe("current timestamp in milliseconds"),
      }),
    )
    .query(async () => {
      return {
        uptime: process.uptime(),
        timestamp: Date.now(),
        status: "healthy",
      };
    }),
});
