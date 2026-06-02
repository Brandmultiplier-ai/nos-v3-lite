"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { ChartSkeleton } from "@/components/shared/ChartSkeleton";
import { useState, useEffect } from "react";

const CHART_COLORS = [
  "#6366F1", "#34D399", "#FBBF24", "#FF4455", "#0A66C2",
  "#A78BFA", "#E1306C", "#1877F2", "#0EA5E9",
];

interface DonutChartProps {
  data: { name: string; value: number }[];
  title: string;
  subtitle?: string;
  height?: number;
}

export function DonutChart({ data, title, subtitle, height = 200 }: DonutChartProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  if (!ready) return <ChartSkeleton height={height} />;

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-0.5">{title}</p>
      {subtitle && <p className="text-xs text-[var(--nos-text-muted)] mb-2">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={height * 0.28}
            outerRadius={height * 0.42}
            paddingAngle={2}
            dataKey="value"
            animationBegin={300}
            animationDuration={900}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip suffix="%" />} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 11, color: "var(--nos-text-muted)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
