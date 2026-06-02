"use client";

import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import { PhaseMetricCard } from "@/components/cards/PhaseMetricCard";
import { CardInfoButton } from "@/components/shared/CardInfoButton";

const INFO_TEXT =
  "What: The Phase-to-Metric Mapping links each phase of the 5-Phase Storyline Architecture™ to a measurable business outcome (Growth Metric) and its corresponding emotional signal (Emotional Indicator).\n\nHow: Growth Metrics are tracked through your CRM and analytics integrations. Emotional Indicators are derived from engagement data, NPS surveys, and audience behavior signals across your connected channels.\n\nWhy: This is BrandMultiplier's proprietary proof that narrative investment drives business results — not just impressions. Every story phase has a corresponding number that proves it's working.";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function PhaseToMetricStrip() {
  const data = useClientData();
  const { phaseMetrics } = data.narrativeIntel;

  const phases = [
    { phase: 1 as const, pair: phaseMetrics.phase1 },
    { phase: 2 as const, pair: phaseMetrics.phase2 },
    { phase: 3 as const, pair: phaseMetrics.phase3 },
    { phase: 4 as const, pair: phaseMetrics.phase4 },
    { phase: 5 as const, pair: phaseMetrics.phase5 },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-3">
        <div>
          <p className="text-label-caps">Narrative Performance — Phase-to-Metric Mapping</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--nos-text-muted)" }}>
            5-Phase Storyline Architecture™ — Growth Metrics paired with Emotional Indicators
          </p>
        </div>
        <CardInfoButton description={INFO_TEXT} />
      </motion.div>

      {/* 5-card grid: 3 on first row, 2 on second (or 5-col on wide screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {phases.map(({ phase, pair }) => (
          <motion.div key={phase} variants={itemVariants} className="h-full">
            <PhaseMetricCard phase={phase} pair={pair} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
