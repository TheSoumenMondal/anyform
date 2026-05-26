"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useIndividualFormAnalytics } from "~/hooks/api/analytics/use-individual-form-analytics";
import { HeatmapChart } from "~/components/charts/heatmap-chart";
import LineChart, { Line } from "~/components/charts/line-chart";
import Grid from "~/components/charts/grid";
import XAxis from "~/components/charts/x-axis";
import { ChartTooltip } from "~/components/charts/tooltip";
import { useDataTable } from "~/hooks/use-data-table";
import { DataTable } from "~/components/data-table/data-table";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";

export default function IndividualFormAnalyticsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { analyticsData, analyticsIsLoading, analyticsIsError } = useIndividualFormAnalytics(slug);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => {
    if (!analyticsData?.fields) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseColumns: ColumnDef<Record<string, any>>[] = [
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
        cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return (
            <Badge variant={val === "submitted" ? "default" : "secondary"}>
              {val === "submitted" ? "Submitted" : "Draft"}
            </Badge>
          );
        },
      },
      {
        id: "submittedAt",
        accessorKey: "submittedAt",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Submitted At" />,
        cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return val ? new Date(val).toLocaleString() : "Unknown";
        },
      },
    ];

    const fieldColumns = analyticsData.fields.map((field) => ({
      id: field.key,
      accessorKey: field.key,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      header: ({ column }: any) => <DataTableColumnHeader column={column} label={field.label} />,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ cell }: any) => {
        const val = cell.getValue();
        if (typeof val === "object" && val !== null) return JSON.stringify(val);
        return String(val || "");
      },
    }));

    return [...baseColumns, ...fieldColumns];
  }, [analyticsData?.fields]);

  const { table } = useDataTable({
    data: analyticsData?.responses || [],
    columns,
    pageCount: 1,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    getRowId: (row) => row.id,
  });

  if (analyticsIsLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 mt-4 text-muted-foreground font-medium">
          Loading form analytics...
        </span>
      </div>
    );
  }

  if (analyticsIsError || !analyticsData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[500px]">
        <span className="text-destructive font-medium">Failed to load analytics</span>
      </div>
    );
  }

  const { heatmap, trend } = analyticsData;

  const chartTrendData = trend.map((t) => ({
    ...t,
    parsedDate: new Date(t.date),
  }));

  return (
    <div className="flex flex-col p-4 md:p-6 lg:p-8 bg-background/50 min-w-0">
      <div className="w-full mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Heatmap Card */}
          <div className="bg-accent border rounded-xl flex flex-col shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 bg-accent text-foreground">
              <h2 className="text-xl font-instrumental-serif">Peak Submission Time</h2>
              <p className="text-xs text-muted-foreground">Identify the busiest submission hours</p>
            </div>
            <div className="p-6 bg-card flex-1 flex items-center justify-center">
              <HeatmapChart data={heatmap} />
            </div>
          </div>

          {/* Line Chart Card */}
          <div className="bg-accent border rounded-xl flex flex-col shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 bg-accent text-foreground">
              <h2 className="text-xl font-instrumental-serif">Submission Trend</h2>
              <p className="text-xs text-muted-foreground">
                Track form submissions over time (last 30 days)
              </p>
            </div>
            <div className="p-6 bg-card flex-1">
              <LineChart
                className="w-full h-64"
                data={chartTrendData}
                xDataKey="parsedDate"
                animationDuration={1500}
                margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
              >
                <Grid horizontal numTicksRows={4} strokeOpacity={0.15} />
                <Line dataKey="value" stroke="var(--chart-1)" strokeWidth={3} />
                <XAxis numTicks={5} tickMode="domain" />
                <ChartTooltip showCrosshair={true} />
              </LineChart>
            </div>
          </div>
        </div>

        {/* Responses Table */}
        <div className="bg-accent border rounded-xl flex flex-col shadow-sm overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-border/50 bg-accent text-foreground">
            <h2 className="text-xl font-instrumental-serif">Form Responses</h2>
            <p className="text-xs text-muted-foreground">All submission data for this form</p>
          </div>
          <div className="bg-card w-full overflow-x-auto p-4">
            <DataTable table={table} />
          </div>
        </div>
      </div>
    </div>
  );
}
