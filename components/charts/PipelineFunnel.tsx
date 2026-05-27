"use client";

import { motion } from "framer-motion";

interface FunnelStage {
  stage: string;
  value: number;
}

interface PipelineFunnelProps {
  data: FunnelStage[];
  title?: string;
  subtitle?: string;
  prefix?: string;
}

function fmt(n: number, prefix = "") {
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(0)}k`;
  return `${prefix}${n.toLocaleString()}`;
}

export function PipelineFunnel({ data, title = "Attribution Funnel", subtitle = "Content to pipeline", prefix = "" }: PipelineFunnelProps) {
  const max = data[0]?.value ?? 1;

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-0.5">{title}</p>
      <p className="text-xs text-[var(--nos-text-muted)] mb-4">{subtitle}</p>
      <div className="flex flex-col gap-2">
        {data.map((stage, i) => {
          const pct = (stage.value / max) * 100;
          const conversionRate = i > 0 ? Math.round((stage.value / data[i - 1].value) * 100) : null;
          return (
            <div key={stage.stage}>
              {conversionRate !== null && (
                <div className="flex items-center gap-1 mb-1 ml-2">
                  <div className="w-px h-3 bg-[var(--border)]" />
                  <span className="text-[10px] text-[var(--nos-text-muted)]">{conversionRate}% conversion</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--nos-text-muted)] w-24 shrink-0 text-right">{stage.stage}</span>
                <div className="flex-1 h-8 bg-[var(--nos-bg-elevated)] rounded-md overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-md flex items-center pl-3"
                    style={{
                      background: `linear-gradient(90deg, var(--nos-accent), rgba(99,102,241,0.6))`,
                      opacity: 1 - i * 0.12,
                    }}
                  >
                    <span className="text-xs font-semibold text-white whitespace-nowrap">
                      {fmt(stage.value, prefix)}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
