import { z } from "zod";

export const getAnalyticsInput = z.object({
  userId: z.string(),
});

export const getIndividualFormAnalyticsInput = z.object({
  userId: z.string(),
  slug: z.string(),
});

export type GetAnalyticsInputType = z.infer<typeof getAnalyticsInput>;
export type GetIndividualFormAnalyticsInputType = z.infer<typeof getIndividualFormAnalyticsInput>;

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
  slug: z.string(),
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

const yearlyDailyActivityItemSchema = z.object({
  date: z.string(),
  count: z.coerce.number().int().nonnegative(),
});

export const yearlyDailyAnalyticsOutputSchema = z.object({
  daily_activity: z.array(yearlyDailyActivityItemSchema),
});

export type YearlyDailyAnalyticsOutput = z.infer<typeof yearlyDailyAnalyticsOutputSchema>;

const heatmapItemSchema = z.object({
  hour: z.coerce.number().int().min(0).max(23),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  count: z.coerce.number().int().nonnegative(),
});

const fieldSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  key: z.string(),
});

export const individualFormAnalyticsOutputSchema = z.object({
  heatmap: z.array(heatmapItemSchema),
  trend: z.array(trendItemSchema),
  fields: z.array(fieldSchema),
  responses: z.array(z.record(z.string(), z.any())),
});

export type IndividualFormAnalyticsOutput = z.infer<typeof individualFormAnalyticsOutputSchema>;
