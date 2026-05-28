"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface InsightCardProps {
  text: string;
  className?: string;
}

export function InsightCard({ text, className = "" }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={`relative rounded-xl p-5 overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(124,127,255,0.06) 0%, rgba(167,139,250,0.03) 100%)",
        border: "1px solid var(--nos-accent-border)",
      }}
    >
      {/* Animated scan line shimmer */}
      <div
        className="absolute inset-y-0 w-20 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(124,127,255,0.08), transparent)",
          animation: "scanLine 4s ease-in-out infinite",
        }}
      />

      {/* Top gradient border */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, var(--nos-accent), var(--nos-accent-2), transparent)",
          opacity: 0.6,
        }}
      />

      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
        style={{
          background: "radial-gradient(circle at top right, rgba(167,139,250,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex gap-3">
        <div
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(124,127,255,0.15) 0%, rgba(167,139,250,0.1) 100%)",
            border: "1px solid var(--nos-accent-border)",
            boxShadow: "0 0 12px var(--nos-accent-glow)",
          }}
        >
          <Sparkles size={14} style={{ color: "var(--nos-accent)" }} />
        </div>
        <div>
          <p
            className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
            style={{
              background: "linear-gradient(90deg, var(--nos-accent), var(--nos-accent-2))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI Narrative Intelligence
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--nos-text-secondary)" }}
          >
            {text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
