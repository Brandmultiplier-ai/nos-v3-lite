"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PhaseMetricPair } from "@/lib/data/types";

const PHASE_NAMES: Record<number, string> = {
  1: "Anchor",
  2: "Insight",
  3: "Shift",
  4: "Unification",
  5: "Realization",
};

interface PhaseSecondaryKPIProps {
  phase: 1 | 2 | 3 | 4 | 5;
  pair: PhaseMetricPair;
}

function TrendIcon({ change }: { change: number }) {
  if (change > 0) return <TrendingUp size={11} style={{ color: "var(--nos-positive)" }} />;
  if (change < 0) return <TrendingDown size={11} style={{ color: "var(--nos-negative)" }} />;
  return <Minus size={11} style={{ color: "var(--nos-neutral)" }} />;
}

function changeColor(change: number, invert = false): string {
  if (change === 0) return "var(--nos-neutral)";
  const isGood = invert ? change < 0 : change > 0;
  return isGood ? "var(--nos-positive)" : "var(--nos-negative)";
}

export function PhaseSecondaryKPI({ phase, pair }: PhaseSecondaryKPIProps) {
  const phaseName = PHASE_NAMES[phase];
  const { growthMetric, emotionalIndicator } = pair;
  const growthInvert = growthMetric.name === "Pipeline velocity";

  return (
    <div
      className="nos-card"
      style={{
        borderLeft: "3px solid var(--nos-accent)",
        background: "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, transparent 60%)",
      }}
    >
      {/* Phase badge */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide"
          style={{
            background: "var(--nos-accent-muted)",
            color: "var(--nos-accent)",
            border: "1px solid var(--nos-accent-border)",
          }}
        >
          Phase {phase} · {phaseName}
        </div>
        <p className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>
          5-Phase Storyline Architecture™
        </p>
      </div>

      {/* Two metrics side by side */}
      <div className="flex items-stretch gap-6">
        {/* Growth Metric */}
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--nos-text-muted)" }}>
            {growthMetric.name}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-bold" style={{ color: "var(--nos-text-primary)" }}>
              {growthMetric.value}
            </span>
            <div className="flex items-center gap-0.5">
              <TrendIcon change={growthMetric.change} />
              <span className="text-[10px] font-semibold" style={{ color: changeColor(growthMetric.change, growthInvert) }}>
                {growthMetric.change > 0 ? "+" : ""}{growthMetric.change}%
              </span>
            </div>
          </div>
          <p className="text-[9px] mt-0.5" style={{ color: "var(--nos-text-muted)" }}>Growth Metric</p>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch" style={{ background: "var(--border)" }} />

        {/* Emotional Indicator */}
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "var(--nos-text-muted)" }}>
            {emotionalIndicator.name}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-bold" style={{ color: "var(--nos-text-secondary)" }}>
              {emotionalIndicator.value}
            </span>
            {emotionalIndicator.change !== 0 && (
              <div className="flex items-center gap-0.5">
                <TrendIcon change={emotionalIndicator.change} />
                <span className="text-[10px]" style={{ color: changeColor(emotionalIndicator.change) }}>
                  {emotionalIndicator.change > 0 ? "+" : ""}{emotionalIndicator.change}%
                </span>
              </div>
            )}
          </div>
          <p className="text-[9px] mt-0.5" style={{ color: "var(--nos-text-muted)" }}>Emotional Indicator</p>
        </div>
      </div>
    </div>
  );
}
