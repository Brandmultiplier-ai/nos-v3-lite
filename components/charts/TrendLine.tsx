"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { ChartAxisLabels } from "./ChartAxisLabels";
import { memo } from "react";

interface TrendLineProps {
  data: { date: string; value: number }[];
  title: string;
  subtitle?: string;
  color?: string;
  prefix?: string;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const TrendLine = memo(function TrendLine({
  data,
  title,
  subtitle,
  color = "#6366F1",
  prefix = "",
  height = 200,
  xAxisLabel = "Date",
  yAxisLabel = "Value",
}: TrendLineProps) {
  const chartKey = data.length
    ? `${data[0].date}-${data[data.length - 1].date}-${data[data.length - 1].value}-${data.length}`
    : "empty";

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-0.5">{title}</p>
      {subtitle && <p className="text-xs text-[var(--nos-text-muted)] mb-2">{subtitle}</p>}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer key={chartKey} width="100%" height={height}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }}
              tickFormatter={(v) => v.slice(5)}
              interval="preserveStartEnd"
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip prefix={prefix} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ChartAxisLabels xLabel={xAxisLabel} yLabel={yAxisLabel} />
    </div>
  );
});
