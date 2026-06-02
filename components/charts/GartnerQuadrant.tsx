"use client";

import { motion } from "framer-motion";
import { ChartAxisLabels } from "./ChartAxisLabels";
import type { PositionPoint } from "@/lib/data/types";

interface GartnerQuadrantProps {
  data: PositionPoint[];
}

function getQuadrantLabel(x: number, y: number): string {
  if (x >= 50 && y >= 50) return "Leaders";
  if (x < 50 && y >= 50) return "Visionaries";
  if (x >= 50 && y < 50) return "Challengers";
  return "Niche";
}

function getQuadrantColor(label: string): string {
  switch (label) {
    case "Leaders": return "var(--nos-positive)";
    case "Visionaries": return "var(--nos-accent)";
    case "Challengers": return "var(--nos-signal-warm)";
    default: return "var(--nos-text-muted)";
  }
}

export function GartnerQuadrant({ data }: GartnerQuadrantProps) {
  const clientPoint = data.find((d) => d.isClient);
  const sorted = [...data].sort((a, b) => (b.x + b.y) / 2 - (a.x + a.y) / 2);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--nos-text-primary)" }}>
            Positioning Quadrant
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--nos-text-muted)" }}>
            Market Presence vs. Narrative Strength
          </p>
        </div>
        {clientPoint && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: "var(--nos-accent-muted)", border: "1px solid var(--nos-accent-border)" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--nos-accent)" }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--nos-accent)" }}>
                {clientPoint.name}
              </p>
              <p className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>
                {getQuadrantLabel(clientPoint.x, clientPoint.y)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Score legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm" style={{ background: "var(--nos-accent)" }} />
          <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>Narrative Strength</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm" style={{ background: "var(--nos-ch-search)" }} />
          <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>Market Presence</span>
        </div>
      </div>

      {/* Ranked rows */}
      <div className="space-y-3">
        {sorted.map((point, i) => {
          const isClient = point.isClient;
          const quadrant = getQuadrantLabel(point.x, point.y);
          const quadColor = getQuadrantColor(quadrant);

          return (
            <div
              key={point.name}
              className="rounded-xl p-3"
              style={{
                background: isClient
                  ? "linear-gradient(135deg, rgba(124,127,255,0.08) 0%, rgba(167,139,250,0.04) 100%)"
                  : "var(--nos-bg-elevated)",
                border: isClient
                  ? "1px solid var(--nos-accent-border)"
                  : "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold w-5 text-right shrink-0"
                    style={{ color: "var(--nos-text-muted)" }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: isClient ? "var(--nos-text-primary)" : "var(--nos-text-secondary)" }}
                  >
                    {point.name}
                    {isClient && (
                      <span className="ml-1.5 text-[9px] font-normal" style={{ color: "var(--nos-accent)" }}>
                        You
                      </span>
                    )}
                  </p>
                </div>
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                  style={{
                    background: `color-mix(in srgb, ${quadColor} 12%, transparent)`,
                    color: quadColor,
                  }}
                >
                  {quadrant}
                </span>
              </div>

              <div className="space-y-1.5">
                {/* Narrative Strength */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] w-24 shrink-0" style={{ color: "var(--nos-text-muted)" }}>
                    Narrative
                  </span>
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--nos-bg-surface)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${point.y}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.04 }}
                      className="h-full rounded-full"
                      style={{ background: "var(--nos-accent)" }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-bold w-7 text-right shrink-0 font-mono"
                    style={{ color: isClient ? "var(--nos-accent)" : "var(--nos-text-secondary)" }}
                  >
                    {point.y}
                  </span>
                </div>

                {/* Market Presence */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] w-24 shrink-0" style={{ color: "var(--nos-text-muted)" }}>
                    Market Presence
                  </span>
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--nos-bg-surface)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${point.x}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.04 + 0.05 }}
                      className="h-full rounded-full"
                      style={{ background: "var(--nos-ch-search)" }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-bold w-7 text-right shrink-0 font-mono"
                    style={{ color: isClient ? "var(--nos-ch-search)" : "var(--nos-text-secondary)" }}
                  >
                    {point.x}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChartAxisLabels xLabel="Score (0–100)" yLabel="Brand / competitor" />
    </div>
  );
}
