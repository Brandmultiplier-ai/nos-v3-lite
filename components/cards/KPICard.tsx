"use client";

import { memo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CardInfoButton } from "@/components/shared/CardInfoButton";
import { MiniSparkline } from "@/components/charts/MiniSparkline";

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
}

function formatNumber(n: number, prefix = "", suffix = ""): string {
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M${suffix}`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(0)}k${suffix}`;
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
}: KPICardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const trendColor = isNeutral
    ? "var(--nos-text-muted)"
    : isPositive
    ? "var(--nos-positive)"
    : "var(--nos-negative)";

  const sparkColor = isPositive
    ? "var(--nos-positive)"
    : isNeutral
    ? "var(--nos-text-muted)"
    : "var(--nos-negative)";

  const trendBg = isPositive
    ? "rgba(52,211,153,0.08)"
    : isNeutral
    ? "var(--nos-bg-elevated)"
    : "rgba(255,68,85,0.08)";

  const display = formatValue ? formatValue(value) : formatNumber(value, prefix, suffix);

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
        <MiniSparkline data={sparkline} color={sparkColor} />
      </div>
    </div>
  );
});
