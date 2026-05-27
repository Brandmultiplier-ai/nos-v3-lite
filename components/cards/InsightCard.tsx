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
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`relative rounded-xl border border-[var(--nos-accent-border)] bg-[var(--nos-accent-muted)] p-5 overflow-hidden ${className}`}
    >
      {/* Gradient accent top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--nos-accent)] to-transparent opacity-50" />

      <div className="flex gap-3">
        <div className="shrink-0 w-7 h-7 rounded-lg bg-[var(--nos-accent)] bg-opacity-20 flex items-center justify-center">
          <Sparkles size={14} className="text-[var(--nos-accent)]" />
        </div>
        <div>
          <p className="text-[10px] text-label-caps text-[var(--nos-accent)] mb-1">
            AI Narrative Intelligence
          </p>
          <p className="text-sm text-[var(--nos-text-secondary)] leading-relaxed">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}
