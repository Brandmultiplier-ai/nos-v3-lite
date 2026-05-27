"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartSkeleton } from "@/components/shared/ChartSkeleton";
import { useState, useEffect } from "react";

interface HeatmapCell {
  day: string;
  hour: string;
  value: number;
}

interface HeatmapGridProps {
  data: HeatmapCell[];
  title?: string;
  subtitle?: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];

function getColor(value: number, max: number) {
  const norm = value / max;
  if (norm > 0.8) return "#6366F1";
  if (norm > 0.6) return "rgba(99,102,241,0.7)";
  if (norm > 0.4) return "rgba(99,102,241,0.45)";
  if (norm > 0.2) return "rgba(99,102,241,0.25)";
  return "var(--nos-bg-elevated)";
}

export function HeatmapGrid({ data, title = "Intent Signal Heatmap", subtitle = "Visitor intent score by day & hour" }: HeatmapGridProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  if (!ready) return <ChartSkeleton height={180} />;

  const max = Math.max(...data.map((d) => d.value));
  const getCellValue = (day: string, hour: string) =>
    data.find((d) => d.day === day && d.hour === hour)?.value ?? 0;

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-0.5">{title}</p>
      <p className="text-xs text-[var(--nos-text-muted)] mb-3">{subtitle}</p>
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Hour headers */}
          <div className="flex items-center gap-1 mb-1 ml-10">
            {HOURS.map((h) => (
              <div key={h} className="flex-1 text-center text-[9px] text-[var(--nos-text-muted)]">{h}</div>
            ))}
          </div>
          {/* Grid */}
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <span className="w-10 text-[10px] text-[var(--nos-text-muted)] text-right pr-2 shrink-0">{day}</span>
              {HOURS.map((hour) => {
                const val = getCellValue(day, hour);
                return (
                  <Tooltip key={`${day}-${hour}`}>
                    <TooltipTrigger render={<div className="flex-1 h-7 rounded-sm transition-all duration-150 cursor-default hover:opacity-80" style={{ background: getColor(val, max) }} />}>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {day} {hour}: intent score {Math.round(val)}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 ml-10">
            <span className="text-[9px] text-[var(--nos-text-muted)]">Low</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
              <div key={v} className="w-5 h-3 rounded-sm" style={{ background: getColor(v * max, max) }} />
            ))}
            <span className="text-[9px] text-[var(--nos-text-muted)]">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
