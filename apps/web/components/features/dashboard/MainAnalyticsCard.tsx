import { BarChart } from "~/components/charts/bar-chart";

import React from "react";
import Grid from "~/components/charts/grid";
import Bar from "~/components/charts/bar";
import BarXAxis from "~/components/charts/bar-x-axis";
import { ChartTooltip } from "~/components/charts/tooltip";

interface MainAnalyticsCardProps {
  data: {
    month: string;
    count: number;
  }[];
}

const MainAnalyticsCard = ({ data }: MainAnalyticsCardProps) => {
  return (
    <div className="w-full border rounded-lg bg-accent overflow-hidden">
      <p className="text-2xl font-instrumental-serif px-4 py-2">Your past 1 year activity</p>
      <BarChart
        className="w-full max-h-56 bg-card mx-0 rounded-t-xl border-t"
        data={data}
        xDataKey="month"
        animationDuration={1100}
        animationEasing="cubic-bezier(0.85, 0, 0.15, 1)"
        barGap={0.3}
        margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
      >
        <Grid horizontal />
        <Bar
          dataKey="count"
          lineCap="round"
          fill="var(--chart-1)"
          fadedOpacity={0.3}
          groupGap={4}
        />
        <BarXAxis />
        <ChartTooltip showCrosshair={false} />
      </BarChart>
    </div>
  );
};

export default MainAnalyticsCard;
