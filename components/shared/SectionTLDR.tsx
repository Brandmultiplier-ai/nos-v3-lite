"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SectionTldr } from "@/lib/data/types";

interface SectionTLDRProps {
  tldr: SectionTldr;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function SectionTLDR({ tldr }: SectionTLDRProps) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {/* AI Channel Summary */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-xl border overflow-hidden p-5"
        style={{
          background: "linear-gradient(135deg, rgba(124,127,255,0.06) 0%, rgba(167,139,250,0.03) 100%)",
          border: "1px solid var(--nos-accent-border)",
        }}
      >
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--nos-accent), var(--nos-accent-2), transparent)",
            opacity: 0.45,
          }}
        />
        <div className="flex gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "var(--nos-accent-muted)" }}
          >
            <Sparkles size={13} style={{ color: "var(--nos-accent)" }} />
          </div>
          <div>
            <p
              className="text-label-caps mb-2"
              style={{
                background: "linear-gradient(90deg, var(--nos-accent) 0%, var(--nos-accent-2) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI Channel Summary
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--nos-text-secondary)" }}>
              {tldr.summary}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recommended Actions */}
      <motion.div variants={itemVariants}>
        <h3 className="text-label-caps mb-3">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tldr.actions.map((action, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="nos-card flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold leading-snug" style={{ color: "var(--nos-text-primary)" }}>
                  {action.title}
                </p>
                <Badge
                  className={`text-[10px] shrink-0 ${
                    action.priority === "high"
                      ? "bg-[var(--nos-signal-hot)] bg-opacity-15 text-[var(--nos-signal-hot)] border-[var(--nos-signal-hot)] border-opacity-30"
                      : "bg-[var(--nos-signal-warm)] bg-opacity-15 text-[var(--nos-signal-warm)] border-[var(--nos-signal-warm)] border-opacity-30"
                  }`}
                >
                  {capitalize(action.priority)}
                </Badge>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--nos-text-muted)" }}>
                {action.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
