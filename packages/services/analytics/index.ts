import db, { sql } from "@repo/database";
import {
  getAnalyticsInput,
  GetAnalyticsInputType,
  AnalyticsOutput,
  analyticsOutputSchema,
  YearlyDailyAnalyticsOutput,
  yearlyDailyAnalyticsOutputSchema,
  getIndividualFormAnalyticsInput,
  GetIndividualFormAnalyticsInputType,
  IndividualFormAnalyticsOutput,
  individualFormAnalyticsOutputSchema,
} from "./model";
import { form, formField, formResponse, formSubmission } from "@repo/database/schema";
import { eq, inArray, desc } from "@repo/database";

class AnalyticsService {
  public async asyncGetAnalytics(payload: GetAnalyticsInputType): Promise<AnalyticsOutput> {
    try {
      const { userId } = await getAnalyticsInput.parseAsync(payload);
      const analytics = await db.execute(sql`
        WITH 
        active_forms_def AS (
          SELECT id, title, slug, form_status, form_expiry, created_at
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
            f.slug,
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
                'slug', fc.slug,
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
        throw parsed.error;
      }

      return parsed.data;
    } catch (error) {
      throw error;
    }
  }

  public async asyncGetYearlyDailyAnalytics(
    payload: GetAnalyticsInputType,
  ): Promise<YearlyDailyAnalyticsOutput> {
    try {
      const { userId } = await getAnalyticsInput.parseAsync(payload);
      const analytics = await db.execute(sql`
        WITH 
        yearly_daily_series AS (
          SELECT day_start
          FROM generate_series(
            date_trunc('day', now() - interval '364 days'),
            date_trunc('day', now()),
            interval '1 day'
          ) AS day_start
        ),
        active_forms_def AS (
          SELECT id
          FROM ${form}
          WHERE form_status != 'deleted'
            AND created_by = ${userId} 
        ),
        daily_submissions AS (
          SELECT 
            date_trunc('day', fs.submitted_at) AS day_start,
            COUNT(*) AS submission_count
          FROM ${formSubmission} fs
          WHERE fs.status = 'submitted'
            AND fs.submitted_at >= date_trunc('day', now() - interval '364 days')
            AND fs.form_id IN (SELECT id FROM active_forms_def)
          GROUP BY date_trunc('day', fs.submitted_at)
        )
        SELECT jsonb_build_object(
          'daily_activity', (
            SELECT COALESCE(jsonb_agg(
              jsonb_build_object(
                'date', to_char(ys.day_start, 'YYYY-MM-DD'),
                'count', COALESCE(ds.submission_count, 0)
              ) ORDER BY ys.day_start
            ), '[]'::jsonb)
            FROM yearly_daily_series ys
            LEFT JOIN daily_submissions ds ON ys.day_start = ds.day_start
          )
        ) AS dashboard_data
      `);

      const result = analytics.rows[0]?.dashboard_data;
      if (!result) {
        return {
          daily_activity: [],
        };
      }

      const parsed = yearlyDailyAnalyticsOutputSchema.safeParse(result);
      if (!parsed.success) {
        throw parsed.error;
      }

      return parsed.data;
    } catch (error) {
      throw error;
    }
  }

  public async asyncGetIndividualFormAnalytics(
    payload: GetIndividualFormAnalyticsInputType,
  ): Promise<IndividualFormAnalyticsOutput> {
    try {
      const { userId, slug } = await getIndividualFormAnalyticsInput.parseAsync(payload);

      // Verify form ownership
      const formData = await db
        .select({ id: form.id })
        .from(form)
        .where(eq(form.slug, slug))
        .limit(1);

      if (!formData[0]) {
        throw new Error("Form not found");
      }
      const formId = formData[0].id;

      // 1. Heatmap Data (Hour vs Day of week)
      // dayOfWeek: 0 = Sunday, 1 = Monday, etc. PostgreSQL EXTRACT(DOW) returns 0-6 where 0=Sunday
      const heatmapQuery = await db.execute(sql`
        SELECT 
          EXTRACT(HOUR FROM submitted_at)::int AS hour,
          EXTRACT(DOW FROM submitted_at)::int AS day_of_week,
          COUNT(*)::int AS count
        FROM ${formSubmission}
        WHERE form_id = ${formId} AND status = 'submitted'
        GROUP BY hour, day_of_week
      `);

      const heatmap = heatmapQuery.rows.map((row) => ({
        hour: Number(row.hour),
        dayOfWeek: Number(row.day_of_week),
        count: Number(row.count),
      }));

      // 2. Trend Data (Daily submissions over last 30 days)
      const trendQuery = await db.execute(sql`
        WITH daily_series AS (
          SELECT day_start
          FROM generate_series(
            date_trunc('day', now() - interval '29 days'),
            date_trunc('day', now()),
            interval '1 day'
          ) AS day_start
        ),
        daily_submissions AS (
          SELECT 
            date_trunc('day', submitted_at) AS day_start,
            COUNT(*) AS count
          FROM ${formSubmission}
          WHERE form_id = ${formId} AND status = 'submitted'
            AND submitted_at >= date_trunc('day', now() - interval '29 days')
          GROUP BY date_trunc('day', submitted_at)
        )
        SELECT 
          to_char(ds.day_start, 'YYYY-MM-DD') AS date,
          COALESCE(sub.count, 0)::int AS value
        FROM daily_series ds
        LEFT JOIN daily_submissions sub ON ds.day_start = sub.day_start
        ORDER BY ds.day_start ASC
      `);

      const trend = trendQuery.rows.map((row) => ({
        date: String(row.date),
        value: Number(row.value),
      }));

      // 3. Form Fields
      const formFields = await db
        .select({
          id: formField.id,
          label: formField.label,
          key: formField.labelKey,
        })
        .from(formField)
        .where(eq(formField.formId, formId))
        .orderBy(formField.sortOrder);

      // 4. Form Responses (Pivot)
      const submissions = await db
        .select({
          id: formSubmission.id,
          submittedAt: formSubmission.submittedAt,
        })
        .from(formSubmission)
        .where(eq(formSubmission.formId, formId))
        .orderBy(desc(formSubmission.submittedAt));

      const responsesData: Record<string, any>[] = [];

      if (submissions.length > 0) {
        const submissionIds = submissions.map((s) => s.id);
        const responses = await db
          .select({
            submissionId: formResponse.submissionId,
            fieldId: formResponse.fieldId,
            value: formResponse.value,
          })
          .from(formResponse)
          .where(inArray(formResponse.submissionId, submissionIds));

        // Group responses by submission
        const responsesBySubmission = responses.reduce(
          (acc, curr) => {
            if (!acc[curr.submissionId]) {
              acc[curr.submissionId] = {};
            }
            acc[curr.submissionId]![curr.fieldId] = curr.value;
            return acc;
          },
          {} as Record<string, Record<string, any>>,
        );

        for (const sub of submissions) {
          const row: Record<string, any> = {
            id: sub.id,
            submittedAt: sub.submittedAt?.toISOString(),
          };

          const subResponses = responsesBySubmission[sub.id] || {};

          // Map field IDs to field keys
          for (const field of formFields) {
            row[field.key] = subResponses[field.id] ?? null;
          }

          responsesData.push(row);
        }
      }

      const result = {
        heatmap,
        trend,
        fields: formFields,
        responses: responsesData,
      };

      const parsed = individualFormAnalyticsOutputSchema.safeParse(result);
      if (!parsed.success) {
        throw parsed.error;
      }

      return parsed.data;
    } catch (error) {
      throw error;
    }
  }
}

export default AnalyticsService;
