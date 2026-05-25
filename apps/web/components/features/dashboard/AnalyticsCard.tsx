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
    <div className="w-full h-auto border-r last:border-r-0 pb-2">
      <div className="flex flex-col px-6 pt-4">
        <div className="h-20 w-full mb-4">
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            animationDuration={1100}
            animationEasing="cubic-bezier(0.85, 0, 0.15, 1)"
            aspectRatio="none"
            className="h-full"
          >
            <Grid vertical={false} horizontal={false} />
            <Area
              dataKey="value"
              curve={curveNatural}
              fillOpacity={0.2}
              strokeWidth={2}
              fadeEdges={false}
              gradientToOpacity={0}
              showLine={true}
              showHighlight={false}
            />
          </AreaChart>
        </div>
        <div className="flex items-center gap-2 mb-1">
          {typeof Icon === "function" ? <Icon className="size-3.5 text-muted-foreground" /> : null}
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-2xl font-mono font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mb-4">{subTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
