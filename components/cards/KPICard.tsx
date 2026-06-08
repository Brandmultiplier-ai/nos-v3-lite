"use client";

import { memo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CardInfoButton } from "@/components/shared/CardInfoButton";
import { MiniSparkline } from "@/components/charts/MiniSparkline";
import { formatCompact } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: number;
  change: number;
  sparkline: number[];
  prefix?: string;
  suffix?: string;
  tooltip: string;
  className?: string;
  formatValue?: (v: number) => string;
  /** When true, a negative change is "good" (green/up-good) and positive is "bad" (red).
   *  Use for lower-is-better metrics (CAC, churn, CPC, bounce, JS errors, etc.). */
  invertChange?: boolean;
}

function formatNumber(n: number, prefix = "", suffix = ""): string {
  if (n >= 1_000) return `${prefix}${formatCompact(n)}${suffix}`;
  if (Number.isInteger(n)) return `${prefix}${n.toLocaleString()}${suffix}`;
  return `${prefix}${n.toFixed(1)}${suffix}`;
}

export const KPICard = memo(function KPICard({
  label,
  value,
  change,
  sparkline,
  prefix = "",
  suffix = "",
  tooltip,
  className = "",
  formatValue,
  invertChange = false,
}: KPICardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  // Metric-aware "is this change good?" — inverts for lower-is-better metrics.
  const isGood = invertChange ? change < 0 : change > 0;

  const trendColor = isNeutral
    ? "var(--nos-text-muted)"
    : isGood
    ? "var(--nos-positive)"
    : "var(--nos-negative)";

  const sparkColor = isNeutral
    ? "var(--nos-text-muted)"
    : isGood
    ? "var(--nos-positive)"
    : "var(--nos-negative)";

  const trendBg = isNeutral
    ? "var(--nos-bg-elevated)"
    : isGood
    ? "rgba(52,211,153,0.08)"
    : "rgba(255,68,85,0.08)";

  const display = formatValue ? formatValue(value) : formatNumber(value, prefix, suffix);

  // Sparkline visual direction should agree with the change sign so a
  // positive-change card never paints a downward line, and vice-versa.
  const orientedSparkline = (() => {
    if (!sparkline || sparkline.length < 2 || isNeutral) return sparkline;
    const trendsUp = sparkline[sparkline.length - 1] >= sparkline[0];
    // change>0 should trend up; change<0 should trend down (raw sign, not isGood).
    if ((isPositive && !trendsUp) || (!isPositive && trendsUp)) {
      return [...sparkline].reverse();
    }
    return sparkline;
  })();

  return (
    <div className={`nos-card group cursor-default select-none ${className}`}>
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${sparkColor}, transparent)`,
          opacity: 0.4,
        }}
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-label-caps">{label}</span>
        <CardInfoButton description={tooltip} />
      </div>

      <div className="font-mono-metric mb-1" style={{ color: "var(--nos-text-primary)" }}>
        {display}
      </div>

      <div className="flex items-end justify-between gap-2 mt-2">
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: trendBg, color: trendColor }}
        >
          {isNeutral ? <Minus size={11} /> : isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          <span>{change >= 0 ? "+" : ""}{change}%</span>
        </div>
        <MiniSparkline data={orientedSparkline} color={sparkColor} />
      </div>
    </div>
  );
});
