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
import { ChartSkeleton } from "@/components/shared/ChartSkeleton";
import { useState, useEffect } from "react";

interface TrendLineProps {
  data: { date: string; value: number }[];
  title: string;
  subtitle?: string;
  color?: string;
  prefix?: string;
  height?: number;
}

export function TrendLine({ data, title, subtitle, color = "#6366F1", prefix = "", height = 200 }: TrendLineProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  if (!ready) return <ChartSkeleton height={height} />;

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-0.5">{title}</p>
      {subtitle && <p className="text-xs text-[var(--nos-text-muted)] mb-2">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`area-${title.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
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
            activeDot={{ r: 4, fill: color, stroke: "var(--nos-bg-canvas)", strokeWidth: 2 }}
            animationBegin={300}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
