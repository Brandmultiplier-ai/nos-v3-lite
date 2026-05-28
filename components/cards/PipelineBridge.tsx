"use client";

import { TrendingUp, Zap, Clock, ArrowRight } from "lucide-react";
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
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-wrap items-center gap-4 px-5 py-3 rounded-xl mb-6 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(124,127,255,0.08) 0%, rgba(167,139,250,0.04) 100%)",
        border: "1px solid var(--nos-accent-border)",
      }}
    >
      {/* Animated scan line */}
      <div
        className="absolute inset-y-0 w-16 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(124,127,255,0.12), transparent)",
          animation: "scanLine 3s ease-in-out infinite",
        }}
      />

      {/* Top gradient border */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, var(--nos-accent), var(--nos-accent-2), transparent)",
          opacity: 0.5,
        }}
      />

      {/* Label */}
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide" style={{ color: "var(--nos-text-muted)" }}>
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: "var(--nos-accent-muted)" }}
        >
          <Zap size={11} style={{ color: "var(--nos-accent)" }} />
        </div>
        <span>Pipeline Bridge</span>
      </div>

      <div className="h-3.5 w-px" style={{ background: "var(--nos-accent-border)" }} />

      {/* Stats */}
      <div className="flex items-center gap-1.5">
        <TrendingUp size={13} style={{ color: "var(--nos-positive)" }} />
        <span className="text-sm font-bold" style={{ color: "var(--nos-text-primary)" }}>{fmt(attributed)}</span>
        <span className="text-xs" style={{ color: "var(--nos-text-muted)" }}>attributed</span>
      </div>

      <ArrowRight size={12} style={{ color: "var(--nos-text-muted)" }} />

      <div className="flex items-center gap-1.5">
        <span className="text-sm font-bold" style={{ color: "var(--nos-text-primary)" }}>{Math.round(deals)}</span>
        <span className="text-xs" style={{ color: "var(--nos-text-muted)" }}>deals influenced</span>
      </div>

      <div className="h-3.5 w-px" style={{ background: "var(--nos-accent-border)" }} />

      <div className="flex items-center gap-1.5">
        <Clock size={12} style={{ color: "var(--nos-text-muted)" }} />
        <span className="text-sm font-bold" style={{ color: "var(--nos-text-primary)" }}>{velocity}d</span>
        <span className="text-xs" style={{ color: "var(--nos-text-muted)" }}>avg velocity</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs italic hidden sm:inline" style={{ color: "var(--nos-text-muted)" }}>
          via {section}
        </span>
        {info && <CardInfoButton description={info} />}
      </div>
    </motion.div>
  );
}
