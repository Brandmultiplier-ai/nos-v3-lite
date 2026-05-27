"use client";

import { TrendingUp, Zap, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { CardInfoButton } from "@/components/shared/CardInfoButton";

interface PipelineBridgeProps {
  attributed: number;
  deals: number;
  velocity: number;
  section: string;
  info?: string;
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

export function PipelineBridge({ attributed, deals, velocity, section, info }: PipelineBridgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex items-center gap-6 px-4 py-3 rounded-xl border border-[var(--nos-accent-border)] bg-[var(--nos-accent-muted)] mb-6"
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--nos-text-muted)] uppercase tracking-wider">
        <Zap size={12} className="text-[var(--nos-accent)]" />
        <span>Pipeline Bridge</span>
      </div>

      <div className="h-4 w-px bg-[var(--nos-accent-border)]" />

      <div className="flex items-center gap-1.5">
        <TrendingUp size={14} className="text-[var(--nos-positive)]" />
        <span className="text-sm font-semibold text-[var(--nos-text-primary)]">{fmt(attributed)}</span>
        <span className="text-xs text-[var(--nos-text-muted)]">attributed pipeline</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-[var(--nos-text-primary)]">{Math.round(deals)}</span>
        <span className="text-xs text-[var(--nos-text-muted)]">deals influenced</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Clock size={13} className="text-[var(--nos-text-muted)]" />
        <span className="text-sm font-semibold text-[var(--nos-text-primary)]">{velocity}d</span>
        <span className="text-xs text-[var(--nos-text-muted)]">avg velocity</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-[var(--nos-text-muted)] italic hidden sm:inline">
          from {section}
        </span>
        {info && <CardInfoButton description={info} />}
      </div>
    </motion.div>
  );
}
