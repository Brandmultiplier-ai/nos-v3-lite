"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { GEOEngine } from "@/lib/data/types";
import { CustomTooltip } from "./CustomTooltip";
import { ChartAxisLabels } from "./ChartAxisLabels";
import { ChartSkeleton } from "@/components/shared/ChartSkeleton";
import { useState, useEffect } from "react";

const ENGINE_COLORS: Record<string, string> = {
  ChatGPT: "#34D399",
  Perplexity: "#0EA5E9",
  Gemini: "#F59E0B",
  Copilot: "#8B5CF6",
};

interface VelocityLineProps {
  engines: GEOEngine[];
  title?: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export function VelocityLine({
  engines,
  title = "GEO Citation Trend",
  subtitle = "Brand mentions per AI engine",
  xAxisLabel = "Week",
  yAxisLabel = "Brand mentions",
}: VelocityLineProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  if (!ready) return <ChartSkeleton height={220} />;

  const maxLen = Math.max(...engines.map((e) => e.trend.length));
  const chartData = Array.from({ length: maxLen }, (_, i) => {
    const obj: Record<string, number | string> = { week: `W${i + 1}` };
    engines.forEach((e) => { obj[e.engine] = e.trend[i] ?? 0; });
    return obj;
  });

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-0.5">{title}</p>
      <p className="text-xs text-[var(--nos-text-muted)] mb-3">{subtitle}</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 11, color: "var(--nos-text-muted)" }} />
          {engines.map((engine) => (
            <Line
              key={engine.engine}
              type="monotone"
              dataKey={engine.engine}
              stroke={ENGINE_COLORS[engine.engine] ?? "#6366F1"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "var(--nos-bg-canvas)", strokeWidth: 2 }}
              animationBegin={300}
              animationDuration={1000}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <ChartAxisLabels xLabel={xAxisLabel} yLabel={yAxisLabel} />
    </div>
  );
}
