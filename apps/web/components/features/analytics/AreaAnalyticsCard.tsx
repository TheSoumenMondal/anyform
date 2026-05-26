import React from "react";
import AreaChart from "~/components/charts/area-chart";
import Area from "~/components/charts/area";
import Grid from "~/components/charts/grid";
import XAxis from "~/components/charts/x-axis";
import { ChartTooltip } from "~/components/charts/tooltip";

interface AreaAnalyticsCardProps {
  data: {
    date: string;
    count: number;
  }[];
}

const AreaAnalyticsCard = ({ data }: AreaAnalyticsCardProps) => {
  // Parse the full ISO date string from the backend (YYYY-MM-DD)
  const chartData = data.map((d) => ({
    ...d,
    parsedDate: new Date(d.date),
  }));

  return (
    <div className="w-full border rounded-lg bg-accent overflow-hidden shadow-sm">
      <p className="text-2xl font-instrumental-serif px-6 py-4 border-b border-border/50 bg-accent text-foreground">
        Your past 1 year activity
      </p>
      <div className="bg-card">
        <AreaChart
          className="w-full h-72 mx-0"
          data={chartData}
          xDataKey="parsedDate"
          animationDuration={1500}
          animationEasing="cubic-bezier(0.16, 1, 0.3, 1)"
          margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
        >
          <Grid horizontal numTicksRows={5} strokeDasharray="4 4" strokeOpacity={0.15} />
          <Area
            dataKey="count"
            fill="var(--chart-1)"
            stroke="var(--chart-1)"
            strokeWidth={3}
            fillOpacity={0.6}
            gradientToOpacity={0.05}
          />
          <XAxis numTicks={6} tickMode="domain" />
          <ChartTooltip showCrosshair={true} />
        </AreaChart>
      </div>
    </div>
  );
};

export default AreaAnalyticsCard;
