"use client";

import { curveNatural } from "@visx/curve";
import React from "react";
import AreaChart, { Area } from "~/components/charts/area-chart";
import Grid from "~/components/charts/grid";
import { LucideIcon } from "lucide-react";

type IconSvgObject =
  | [
      string,
      {
        [key: string]: string | number;
      },
    ][]
  | readonly (readonly [
      string,
      {
        readonly [key: string]: string | number;
      },
    ])[];

type AnalyticsCardProps = {
  title: string;
  subTitle: string;
  value: string;
  tooltip: string;
  icon: IconSvgObject | LucideIcon;
  trendData: { date: string; value: number }[];
};

const AnalyticsCard = ({ title, subTitle, value, icon: Icon, trendData }: AnalyticsCardProps) => {
  return (
    <div className="w-full h-auto border-r last:border-r-0 pb-4">
      <div className="flex flex-col px-6 pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {typeof Icon === "function" ? <Icon className="size-4 text-muted-foreground" /> : null}
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-2xl font-mono font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subTitle}</p>
          </div>
          <div className="h-[40px] w-24">
            <AreaChart
              data={trendData}
              margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
              animationDuration={1100}
              animationEasing="cubic-bezier(0.85, 0, 0.15, 1)"
              aspectRatio="none"
              className="h-full"
            >
              <Grid vertical={false} horizontal={false} />
              <Area
                dataKey="value"
                curve={curveNatural}
                fillOpacity={0.1}
                strokeWidth={1.5}
                fadeEdges={false}
                gradientToOpacity={0}
                showLine={true}
                showHighlight={false}
              />
            </AreaChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
