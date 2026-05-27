"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

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
  return `${prefix}${n.toLocaleString()}${suffix}`;
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(formatNumber(Math.round(v), prefix, suffix)),
    });
    return controls.stop;
  }, [value, prefix, suffix, motionVal]);

  return <span>{display}</span>;
}

export function KPICard({
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
  const sparkData = sparkline.map((v, i) => ({ i, v }));

  const trendColor = isNeutral
    ? "text-[var(--nos-text-muted)]"
    : isPositive
    ? "text-[var(--nos-positive)]"
    : "text-[var(--nos-negative)]";

  const sparkColor = isPositive
    ? "var(--nos-positive)"
    : isNeutral
    ? "var(--nos-text-muted)"
    : "var(--nos-negative)";

  return (
    <motion.div
      className={`nos-card group cursor-default select-none ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-label-caps">{label}</span>
          <Tooltip>
          <TooltipTrigger render={<button className="text-[var(--nos-text-muted)] hover:text-[var(--nos-text-secondary)] transition-colors" />}>
            <Info size={13} />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-[200px] text-xs bg-[var(--nos-bg-overlay)] border-[var(--nos-bg-elevated)]"
          >
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Value + trend */}
      <div className="flex items-end justify-between gap-2">
        <div className="font-mono-metric text-[var(--nos-text-primary)]">
          <AnimatedNumber
            value={value}
            prefix={formatValue ? "" : prefix}
            suffix={formatValue ? "" : suffix}
          />
        </div>
        <div className={`flex items-center gap-0.5 text-sm font-medium ${trendColor} mb-1`}>
          {isNeutral ? (
            <Minus size={14} />
          ) : isPositive ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mt-3" style={{ height: 32 }}>
        <ResponsiveContainer width="100%" height={32}>
          <AreaChart data={sparkData}>
            <defs>
              <linearGradient id={`spark-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={sparkColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={sparkColor}
              strokeWidth={1.5}
              fill={`url(#spark-${label.replace(/\s/g, "")})`}
              dot={false}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sub-label */}
      <p className="mt-1 text-[10px] text-[var(--nos-text-muted)]">
        vs. prior period: {change >= 0 ? "+" : ""}{change}%
      </p>
    </motion.div>
  );
}
