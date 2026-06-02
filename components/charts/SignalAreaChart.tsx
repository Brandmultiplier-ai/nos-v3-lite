"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { ChartAxisLabels } from "./ChartAxisLabels";
import type { SignalPoint } from "@/lib/data/types";
import { ChartSkeleton } from "@/components/shared/ChartSkeleton";
import { useState, useEffect } from "react";

const channels = [
  { key: "linkedin", label: "LinkedIn Signal",   color: "var(--nos-ch-linkedin)" },
  { key: "website",  label: "Website Intent",    color: "var(--nos-ch-website)" },
  { key: "email",    label: "Email Engagement",  color: "var(--nos-ch-email)" },
  { key: "search",   label: "Search Visibility", color: "var(--nos-ch-search)" },
  { key: "content",  label: "Content Velocity",  color: "var(--nos-ch-newsletter)" },
];

interface SignalAreaChartProps {
  data: SignalPoint[];
}

export function SignalAreaChart({ data }: SignalAreaChartProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  if (!ready) return <ChartSkeleton height={280} />;

  const xInterval = data.length <= 7 ? 0 : Math.ceil(data.length / 6) - 1;
  const dateRange = data.length > 0
    ? `${data[0].date.slice(5)} – ${data[data.length - 1].date.slice(5)}`
    : "";

  return (
    <div>
      <div className="mb-1">
        <p className="text-sm font-semibold text-[var(--nos-text-primary)]">Composite Signal Intelligence</p>
        <p className="text-xs text-[var(--nos-text-muted)]">All channels · Signal strength 0–100 · {dateRange}</p>
      </div>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <defs>
              {channels.map((ch) => (
                <linearGradient key={ch.key} id={`grad-${ch.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ch.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={ch.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }}
              tickFormatter={(v) => v.slice(5)}
              interval={xInterval}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }}
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}`}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ fontSize: 11, color: "var(--nos-text-muted)" }}
            />
            {channels.map((ch) => (
              <Area
                key={ch.key}
                type="monotone"
                dataKey={ch.key}
                name={ch.label}
                stroke={ch.color}
                strokeWidth={1.5}
                fill={`url(#grad-${ch.key})`}
                animationBegin={300}
                animationDuration={1000}
                dot={false}
                activeDot={{ r: 4, fill: ch.color, stroke: "var(--nos-bg-canvas)", strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <ChartAxisLabels xLabel="Date" yLabel="Signal strength (0–100)" />
    </div>
  );
}
