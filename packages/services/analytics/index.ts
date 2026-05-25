import db, { sql } from "@repo/database";
import {
  getAnalyticsInput,
  GetAnalyticsInputType,
  AnalyticsOutput,
  analyticsOutputSchema,
} from "./model";
import { form, formSubmission } from "@repo/database/schema";
import { logger } from "@repo/logger";

class AnalyticsService {
  public async asyncGetAnalytics(payload: GetAnalyticsInputType): Promise<AnalyticsOutput> {
    try {
      const { userId } = await getAnalyticsInput.parseAsync(payload);

      logger.debug("Running analytics query for user", { userId });

      // Using Drizzle's sql template correctly with table objects
      const analytics = await db.execute(sql`
        WITH 
        active_forms_def AS (
          SELECT id, title, form_status, form_expiry, created_at
          FROM ${form}
          WHERE form_status != 'deleted'
            AND created_by = ${userId} 
        ),
        submission_stats AS (
          SELECT 
            form_id,
            COUNT(*) FILTER (WHERE status = 'submitted') AS submitted_count,
            COUNT(*) FILTER (WHERE status = 'draft') AS draft_count,
            MAX(submitted_at) AS last_submitted_at
          FROM ${formSubmission}
          WHERE form_id IN (SELECT id FROM active_forms_def)
          GROUP BY form_id
        ),
        form_completion AS (
          SELECT 
            f.id,
            f.title,
            f.form_status,
            f.form_expiry,
            COALESCE(s.submitted_count, 0) AS submitted_count,
            COALESCE(s.draft_count, 0) AS draft_count,
            s.last_submitted_at,
            CASE 
              WHEN (COALESCE(s.submitted_count,0) + COALESCE(s.draft_count,0)) = 0 THEN NULL
              ELSE (COALESCE(s.submitted_count,0)::float / 
                    (COALESCE(s.submitted_count,0) + COALESCE(s.draft_count,0))) * 100
            END AS completion_rate
          FROM active_forms_def f
          LEFT JOIN submission_stats s ON f.id = s.form_id
        ),
        daily_series AS (
          SELECT day_start
          FROM generate_series(
            date_trunc('day', now() - interval '13 days'),
            date_trunc('day', now()),
            interval '1 day'
          ) AS day_start
        ),
        monthly_series AS (
          SELECT month_start
          FROM generate_series(
            date_trunc('month', now() - interval '11 months'),
            date_trunc('month', now()),
            interval '1 month'
          ) AS month_start
        ),
        monthly_submissions AS (
          SELECT 
            date_trunc('month', fs.submitted_at) AS month_start,
            COUNT(*) AS submission_count
          FROM ${formSubmission} fs
          WHERE fs.status = 'submitted'
            AND fs.submitted_at >= date_trunc('month', now() - interval '11 months')
            AND fs.form_id IN (SELECT id FROM active_forms_def)
          GROUP BY date_trunc('month', fs.submitted_at)
        ),
        daily_submissions_all AS (
          SELECT 
            date_trunc('day', fs.submitted_at) AS day_start,
            COUNT(*) AS count
          FROM ${formSubmission} fs
          WHERE fs.status = 'submitted'
            AND fs.submitted_at >= date_trunc('day', now() - interval '13 days')
            AND fs.form_id IN (SELECT id FROM active_forms_def)
          GROUP BY date_trunc('day', fs.submitted_at)
        ),
        daily_abandoned_all AS (
          SELECT 
            date_trunc('day', fs.created_at) AS day_start,
            COUNT(*) AS count
          FROM ${formSubmission} fs
          WHERE fs.status = 'draft'
            AND fs.created_at >= date_trunc('day', now() - interval '13 days')
            AND fs.form_id IN (SELECT id FROM active_forms_def)
          GROUP BY date_trunc('day', fs.created_at)
        ),
        daily_completion_all AS (
          SELECT 
            date_trunc('day', fs.created_at) AS day_start,
            COUNT(*) FILTER (WHERE status = 'submitted') AS submitted,
            COUNT(*) AS total
          FROM ${formSubmission} fs
          WHERE fs.created_at >= date_trunc('day', now() - interval '13 days')
            AND fs.form_id IN (SELECT id FROM active_forms_def)
          GROUP BY date_trunc('day', fs.created_at)
        ),
        daily_active_forms_all AS (
          SELECT 
            ds.day_start,
            COUNT(f.id) AS count
          FROM daily_series ds
          LEFT JOIN active_forms_def f ON f.created_at <= ds.day_start + interval '1 day' - interval '1 second'
            AND f.form_status = 'published'
            AND f.form_expiry > ds.day_start
          GROUP BY ds.day_start
        ),
        form_daily_trend AS (
          SELECT 
            f.id AS form_id,
            ds.day_start,
            COALESCE(COUNT(fs.id), 0) AS count
          FROM active_forms_def f
          CROSS JOIN daily_series ds
          LEFT JOIN ${formSubmission} fs ON fs.form_id = f.id 
            AND date_trunc('day', fs.submitted_at) = ds.day_start
            AND fs.status = 'submitted'
          GROUP BY f.id, ds.day_start
        )
        SELECT jsonb_build_object(
          'metrics', jsonb_build_object(
            'total_submissions', (
              SELECT COALESCE(SUM(submitted_count), 0)
              FROM form_completion
            ),
            'avg_completion_rate', (
              SELECT ROUND(AVG(completion_rate)::numeric, 1)
              FROM form_completion
              WHERE completion_rate IS NOT NULL
            ),
            'active_forms', (
              SELECT COUNT(*)
              FROM active_forms_def
              WHERE form_status = 'published'
                AND form_expiry > now()
            ),
            'abandoned_responses', (
              SELECT COALESCE(SUM(draft_count), 0)
              FROM form_completion
            )
          ),
          'metrics_trends', jsonb_build_object(
            'total_submissions', (
              SELECT jsonb_agg(jsonb_build_object('date', ds.day_start, 'value', COALESCE(d.count, 0)) ORDER BY ds.day_start)
              FROM daily_series ds
              LEFT JOIN daily_submissions_all d ON d.day_start = ds.day_start
            ),
            'avg_completion_rate', (
              SELECT jsonb_agg(jsonb_build_object('date', ds.day_start, 'value', 
                CASE WHEN COALESCE(d.total, 0) = 0 THEN 0 
                ELSE ROUND((d.submitted::float / d.total * 100)::numeric, 1) END) ORDER BY ds.day_start)
              FROM daily_series ds
              LEFT JOIN daily_completion_all d ON d.day_start = ds.day_start
            ),
            'active_forms', (
              SELECT jsonb_agg(jsonb_build_object('date', ds.day_start, 'value', COALESCE(d.count, 0)) ORDER BY ds.day_start)
              FROM daily_series ds
              LEFT JOIN daily_active_forms_all d ON d.day_start = ds.day_start
            ),
            'abandoned_responses', (
              SELECT jsonb_agg(jsonb_build_object('date', ds.day_start, 'value', COALESCE(d.count, 0)) ORDER BY ds.day_start)
              FROM daily_series ds
              LEFT JOIN daily_abandoned_all d ON d.day_start = ds.day_start
            )
          ),
          'monthly_activity', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'month', to_char(ms.month_start, 'Mon'),
                'count', COALESCE(m.submission_count, 0)
              ) ORDER BY ms.month_start
            )
            FROM monthly_series ms
            LEFT JOIN monthly_submissions m ON ms.month_start = m.month_start
          ),
          'form_records', (
            SELECT COALESCE(jsonb_agg(
              jsonb_build_object(
                'title', fc.title,
                'status', fc.form_status,
                'submissions', fc.submitted_count,
                'completion_rate', ROUND(fc.completion_rate::numeric, 1),
                'last_response', 
                  CASE 
                    WHEN fc.last_submitted_at IS NOT NULL 
                    THEN to_char(fc.last_submitted_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI:SS')
                    ELSE NULL
                  END,
                'form_id', fc.id,
                'trend', (
                  SELECT jsonb_agg(jsonb_build_object('date', fdt.day_start, 'value', fdt.count) ORDER BY fdt.day_start)
                  FROM form_daily_trend fdt
                  WHERE fdt.form_id = fc.id
                )
              ) ORDER BY fc.last_submitted_at DESC NULLS LAST
            ), '[]'::jsonb)
            FROM form_completion fc
          )
        ) AS dashboard_data
      `);

      logger.debug("Analytics query raw result", { rows: analytics.rows });

      const result = analytics.rows[0]?.dashboard_data;
      if (!result) {
        return {
          metrics: {
            total_submissions: 0,
            avg_completion_rate: null,
            active_forms: 0,
            abandoned_responses: 0,
          },
          metrics_trends: {
            total_submissions: [],
            avg_completion_rate: [],
            active_forms: [],
            abandoned_responses: [],
          },
          monthly_activity: [],
          form_records: [],
        };
      }

      const parsed = analyticsOutputSchema.safeParse(result);
      if (!parsed.success) {
        logger.error("Analytics validation failed", {
          errors: parsed.error.format(),
          data: result,
        });
        throw parsed.error;
      }

      return parsed.data;
    } catch (error) {
      logger.error("Error in asyncGetAnalytics", error);
      throw error;
    }
  }
}

export default AnalyticsService;
