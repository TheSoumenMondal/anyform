"use client";

import AnalyticsCard from "./AnalyticsCard";
import { ActivityIcon, CheckCircleIcon, FileTextIcon, MessageCircleIcon } from "lucide-react";
import MainAnalyticsCard from "./MainAnalyticsCard";
import { FormRecords } from "./FormRecords";
import { useDashboardAnalytics } from "~/hooks/api/analytics/use-dashboard-analytics";

export const Dashboard = () => {
  const { analyticsData, analyticsIsLoading } = useDashboardAnalytics();

  if (analyticsIsLoading || !analyticsData) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { metrics, monthly_activity, form_records, metrics_trends } = analyticsData;

  return (
    <div className="w-full h-full flex gap-4 flex-col p-4">
      <div className="w-full flex flex-col bg-accent/50 border rounded-xl overflow-hidden shadow-sm">
        <p className="text-xl font-instrumental-serif px-6 py-3 tracking-wide border-b bg-card/50">
          Your Activity
        </p>
        <div className="w-full h-auto flex bg-card">
          <AnalyticsCard
            title="Total Submissions"
            subTitle="All time responses"
            icon={MessageCircleIcon}
            value={`${metrics.total_submissions}`}
            tooltip="Total number of submissions across all forms"
            trendData={metrics_trends.total_submissions}
          />
          <AnalyticsCard
            title="Avg. Completion"
            subTitle="Submission rate"
            icon={CheckCircleIcon}
            value={`${metrics.avg_completion_rate ?? 0}%`}
            tooltip="Average completion rate of your forms"
            trendData={metrics_trends.avg_completion_rate}
          />
          <AnalyticsCard
            title="Active Forms"
            subTitle="Live right now"
            icon={FileTextIcon}
            value={`${metrics.active_forms}`}
            tooltip="Number of currently published and active forms"
            trendData={metrics_trends.active_forms}
          />
          <AnalyticsCard
            title="Abandoned"
            subTitle="Draft responses"
            icon={ActivityIcon}
            value={`${metrics.abandoned_responses}`}
            tooltip="Number of responses started but not submitted"
            trendData={metrics_trends.abandoned_responses}
          />
        </div>
      </div>
      <MainAnalyticsCard data={monthly_activity} />
      <div className="bg-accent/50 border rounded-xl flex flex-col shadow-sm overflow-hidden">
        <p className="text-xl font-instrumental-serif px-6 py-3 tracking-wide border-b bg-card/50">
          Recent Forms
        </p>
        <div className="w-full h-auto bg-card">
          <FormRecords data={form_records} />
        </div>
      </div>
    </div>
  );
};
