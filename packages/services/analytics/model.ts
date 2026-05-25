import { z } from "zod";

export const getAnalyticsInput = z.object({
  userId: z.string(),
});

export type GetAnalyticsInputType = z.infer<typeof getAnalyticsInput>;

const monthlyActivityItemSchema = z.object({
  month: z.string(),
  count: z.coerce.number().int().nonnegative(),
});

const trendItemSchema = z.object({
  date: z.string(),
  value: z.coerce.number().nonnegative(),
});

const formRecordSchema = z.object({
  title: z.string(),
  status: z.enum(["draft", "published", "archived", "deleted"]),
  submissions: z.coerce.number().int().nonnegative(),
  completion_rate: z.coerce.number().nullable(),
  last_response: z.string().nullable(),
  form_id: z.string().uuid(),
  trend: z.array(trendItemSchema).optional(),
});

export const analyticsOutputSchema = z.object({
  metrics: z.object({
    total_submissions: z.coerce.number().int().nonnegative(),
    avg_completion_rate: z.coerce.number().nullable(),
    active_forms: z.coerce.number().int().nonnegative(),
    abandoned_responses: z.coerce.number().int().nonnegative(),
  }),
  metrics_trends: z.object({
    total_submissions: z.array(trendItemSchema),
    avg_completion_rate: z.array(trendItemSchema),
    active_forms: z.array(trendItemSchema),
    abandoned_responses: z.array(trendItemSchema),
  }),
  monthly_activity: z.array(monthlyActivityItemSchema),
  form_records: z.array(formRecordSchema),
});

export type AnalyticsOutput = z.infer<typeof analyticsOutputSchema>;
