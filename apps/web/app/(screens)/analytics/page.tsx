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
      <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto bg-background/50">
        <div className="w-full mx-auto space-y-6 animate-pulse">
          {/* Skeleton for Top Area Chart */}
          <div className="w-full h-[350px] bg-muted/50 rounded-xl border border-dashed"></div>

          {/* Skeleton for Bottom Table */}
          <div className="bg-accent/30 border border-dashed rounded-xl flex flex-col shadow-sm overflow-hidden min-h-[400px]">
            <div className="w-full h-[52px] bg-accent/50 border-b border-dashed"></div>
            <div className="w-full flex-1 p-4 md:p-6 space-y-4 bg-card/50">
              <div className="w-full h-12 bg-muted/40 rounded-lg"></div>
              <div className="w-full h-12 bg-muted/40 rounded-lg"></div>
              <div className="w-full h-12 bg-muted/40 rounded-lg"></div>
              <div className="w-full h-12 bg-muted/40 rounded-lg"></div>
              <div className="w-full h-12 bg-muted/40 rounded-lg"></div>
            </div>
          </div>
        </div>
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
