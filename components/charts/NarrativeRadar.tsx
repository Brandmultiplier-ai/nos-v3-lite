"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartSkeleton } from "@/components/shared/ChartSkeleton";
import { useState, useEffect } from "react";

interface NarrativeRadarProps {
  data: { topic: string; score: number }[];
  title?: string;
}

export function NarrativeRadar({ data, title = "Topic Authority Radar" }: NarrativeRadarProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  if (!ready) return <ChartSkeleton height={240} />;

  const chartData = data.map((d) => ({ subject: d.topic, A: d.score }));

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-0.5">{title}</p>
      <p className="text-xs text-[var(--nos-text-muted)] mb-2">GEO topic coverage strength (0–100)</p>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="var(--border)" strokeDasharray="4 4" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "var(--nos-text-muted)", fontSize: 8 }}
            axisLine={false}
            tickCount={4}
          />
          <Radar
            name="Authority"
            dataKey="A"
            stroke="#6366F1"
            strokeWidth={2}
            fill="#6366F1"
            fillOpacity={0.15}
            animationBegin={300}
            animationDuration={900}
          />
          <Tooltip
            contentStyle={{
              background: "var(--nos-bg-overlay)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              fontSize: 12,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
