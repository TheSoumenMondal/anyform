"use client";

import React from "react";
import AreaAnalyticsCard from "~/components/features/analytics/AreaAnalyticsCard";
import { FormRecords } from "~/components/features/dashboard/FormRecords";
import { useDashboardAnalytics } from "~/hooks/api/analytics/use-dashboard-analytics";
import { useYearlyDailyAnalytics } from "~/hooks/api/analytics/use-yearly-daily-analytics";

const AnalyticsPage = () => {
  const { analyticsData, analyticsIsLoading } = useDashboardAnalytics();
  const { analyticsData: yearlyData, analyticsIsLoading: yearlyIsLoading } =
    useYearlyDailyAnalytics();

  if (analyticsIsLoading || yearlyIsLoading || !analyticsData || !yearlyData) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground font-medium">Loading analytics...</span>
      </div>
    );
  }

  const { form_records } = analyticsData;
  const { daily_activity } = yearlyData;

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto bg-background/50">
      <div className="w-full mx-auto space-y-6">
        {/* Top Area Chart for 365 Days Responses */}
        <AreaAnalyticsCard data={daily_activity} />

        {/* Bottom Table for Form Records */}
        <div className="bg-accent border rounded-xl flex flex-col shadow-sm overflow-hidden">
          <p className="text-xl font-instrumental-serif px-6 py-3 tracking-wide border-b bg-accent/50 text-foreground">
            Form Performance
          </p>
          <div className="w-full h-auto bg-card">
            <FormRecords data={form_records} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
