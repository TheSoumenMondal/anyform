"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { BarChart3, Text } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { DataTable } from "~/components/data-table/data-table";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar";
import { useDataTable } from "~/hooks/use-data-table";
import { Button } from "~/components/ui/button";
import Link from "next/link";

import { cn } from "~/lib/utils";
import LineChart, { Line } from "~/components/charts/line-chart";
import Grid from "~/components/charts/grid";
import XAxis from "~/components/charts/x-axis";
import { ChartTooltip } from "~/components/charts/tooltip";
import { PatternLines } from "@visx/pattern";
import { Gauge } from "~/components/charts/gauge";
import { BadgeAdditional } from "~/components/ui/badge-1";

interface FormRow {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  submissions: number;
  submissionsTrend: { date: Date; submissions: number }[];
  completionRate: number;
  lastResponseAt: Date;
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (diffMinutes < 60) {
    const v = Math.max(1, diffMinutes);
    return {
      label: `${v} min${v === 1 ? "" : "s"} ago`,
      tone: "text-destructive",
    };
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return {
      label: `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`,
      tone: "text-amber-500",
    };
  }

  const diffDays = Math.round(diffHours / 24);
  return {
    label: `${diffDays} day${diffDays === 1 ? "" : "s"} ago`,
    tone: "text-muted-foreground",
  };
}

function completionFill(rate: number) {
  if (rate < 40) return "var(--chart-4)";
  if (rate < 70) return "var(--chart-3)";
  return "var(--chart-2)";
}

interface FormRecordsProps {
  data: {
    title: string;
    status: "draft" | "published" | "archived" | "deleted";
    submissions: number;
    completion_rate: number | null;
    last_response: string | null;
    form_id: string;
    slug: string;
    trend?: { date: string; value: number }[];
  }[];
}

export function FormRecords({ data }: FormRecordsProps) {
  const [title] = useQueryState("title", parseAsString.withDefault(""));
  const [status] = useQueryState("status", parseAsArrayOf(parseAsString).withDefault([]));

  const mappedData = React.useMemo<FormRow[]>(() => {
    return data.map((item) => {
      const submissionsTrend = (item.trend || []).map((t: { date: string; value: number }) => ({
        date: new Date(t.date),
        submissions: t.value,
      }));

      return {
        id: item.form_id,
        slug: item.slug,
        title: item.title,
        status: item.status === "published" ? "published" : "draft",
        submissions: item.submissions,
        submissionsTrend,
        completionRate: item.completion_rate ?? 0,
        lastResponseAt: item.last_response ? new Date(item.last_response) : new Date(0),
      };
    });
  }, [data]);

  const filteredData = React.useMemo(() => {
    return mappedData.filter((form) => {
      const matchesTitle = title === "" || form.title.toLowerCase().includes(title.toLowerCase());
      const matchesStatus = status.length === 0 || status.includes(form.status);

      return matchesTitle && matchesStatus;
    });
  }, [mappedData, title, status]);

  const columns = React.useMemo<ColumnDef<FormRow>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }: { column: Column<FormRow, unknown> }) => (
          <div className="flex justify-center w-full">
            <DataTableColumnHeader column={column} label="Title" />
          </div>
        ),
        cell: ({ cell }) => (
          <div className="font-medium text-center">{cell.getValue<FormRow["title"]>()}</div>
        ),
        meta: {
          label: "Title",
          placeholder: "Search titles...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<FormRow, unknown> }) => (
          <div className="flex justify-center w-full">
            <DataTableColumnHeader column={column} label="Status" />
          </div>
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<FormRow["status"]>();

          return (
            <div className="flex justify-center w-full">
              <BadgeAdditional
                variant={status === "published" ? "success" : "warning"}
                size={"xs"}
                className="capitalize"
              >
                {status}
              </BadgeAdditional>
            </div>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "submissions",
        accessorKey: "submissions",
        header: ({ column }: { column: Column<FormRow, unknown> }) => (
          <div className="flex justify-center w-full">
            <DataTableColumnHeader column={column} label="Submissions" />
          </div>
        ),
        cell: ({ cell }) => {
          const trend =
            (cell.row.original.submissionsTrend as FormRow["submissionsTrend"] | undefined) ?? [];

          return (
            <div className="flex justify-center w-full">
              <div className="w-36 [&_.text-chart-label]:hidden">
                <LineChart
                  aspectRatio="3 / 1"
                  data={trend}
                  margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <Grid horizontal numTicksRows={3} strokeOpacity={0.6} />
                  <Line dataKey="submissions" stroke="var(--chart-1)" strokeWidth={2.5} />
                  <XAxis numTicks={3} />
                  <ChartTooltip
                    className="text-xs"
                    rows={(point) => [
                      {
                        color: "var(--chart-1)",
                        label: "Submissions",
                        value: (point.submissions as number) ?? 0,
                      },
                    ]}
                    showDatePill={false}
                    showDots={false}
                  />
                </LineChart>
              </div>
            </div>
          );
        },
      },
      {
        id: "completionRate",
        accessorKey: "completionRate",
        header: ({ column }: { column: Column<FormRow, unknown> }) => (
          <div className="flex justify-center w-full">
            <DataTableColumnHeader column={column} label="Completion Rate" />
          </div>
        ),
        cell: ({ cell }) => {
          const rate = cell.getValue<FormRow["completionRate"]>();
          const patternId = `completion-pattern-${cell.row.original.id}`;

          return (
            <div className="flex justify-center">
              <Gauge
                activeFill={completionFill(rate)}
                centerValue={rate}
                defaultLabel=""
                height={32}
                hideCenterValue
                inactiveFill={`url(#${patternId})`}
                inactiveFillOpacity={0.35}
                notchCornerRadius={2}
                notchLengthPercent={60}
                spacing={22}
                startAngle={0}
                totalNotches={44}
                uniformWidth
                value={rate}
                width={32}
              >
                <PatternLines
                  background="transparent"
                  height={6}
                  id={patternId}
                  orientation={["diagonal"]}
                  stroke="var(--border)"
                  strokeWidth={1}
                  width={6}
                />
              </Gauge>
            </div>
          );
        },
        size: 180,
      },
      {
        id: "lastResponseAt",
        accessorKey: "lastResponseAt",
        header: ({ column }: { column: Column<FormRow, unknown> }) => (
          <div className="flex justify-center w-full">
            <DataTableColumnHeader column={column} label="Last Response" />
          </div>
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<FormRow["lastResponseAt"]>();
          if (value.getTime() === 0) {
            return <div className="text-center text-muted-foreground">Never</div>;
          }
          const { label, tone } = formatRelativeTime(value);
          return <div className={cn("whitespace-nowrap text-center", tone)}>{label}</div>;
        },
      },
      {
        id: "analytics",
        header: ({ column }: { column: Column<FormRow, unknown> }) => (
          <div className="flex justify-center w-full">
            <DataTableColumnHeader column={column} label="Action" />
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="flex justify-center w-full">
              <Link href={`/analytics/${row.original.slug}`}>
                <Button variant="info" size="sm" className="gap-2">
                  <BarChart3 className="size-4" />
                  Analytics
                  <span className="sr-only">{row.original.title}</span>
                </Button>
              </Link>
            </div>
          );
        },
        enableSorting: false,
        size: 140,
      },
    ],
    [],
  );

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    clearOnDefault: true,
    initialState: {
      sorting: [{ id: "title", desc: true }],
      columnPinning: { right: ["analytics"] },
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    getRowId: (row) => row.id,
  });

  React.useEffect(() => {
    if (table.getState().pagination.pageSize !== 10) table.setPageSize(10);
    if (table.getState().pagination.pageIndex !== 0) table.setPageIndex(0);
  }, [table]);

  return (
    <div className="flex flex-col w-full">
      <DataTable table={table}>
        <div className="px-4 py-3 border-b">
          <DataTableToolbar table={table} />
        </div>
      </DataTable>
      <div className="flex justify-center items-center py-2 border-t">
        <Button variant="link" size="sm" className="cursor-pointer">
          View more
        </Button>
      </div>
    </div>
  );
}
