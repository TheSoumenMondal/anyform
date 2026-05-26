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
        <div className="flex items-center gap-2 mb-1">
          {typeof Icon === "function" ? <Icon className="size-3.5 text-muted-foreground" /> : null}
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-2xl font-mono font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mb-4">{subTitle}</p>
          <div className="h-16 w-full -ml-1 mt-auto">
            <AreaChart
              data={trendData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
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
