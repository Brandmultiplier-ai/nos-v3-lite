"use client";

import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import { PipelineBridge } from "@/components/cards/PipelineBridge";
import { InsightCard } from "@/components/cards/InsightCard";
import { BrandHealthGauge } from "@/components/charts/BrandHealthGauge";
import { PipelineFunnel } from "@/components/charts/PipelineFunnel";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { Progress } from "@/components/ui/progress";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function BrandIntel() {
  const data = useClientData();
  const { brand, pipelineBridge } = data;
  const sov = brand.shareOfVoice;
  const maxSov = Math.max(...sov.map((s) => s.value));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <PipelineBridge
        attributed={pipelineBridge.attributed}
        deals={pipelineBridge.deals}
        velocity={pipelineBridge.velocity}
        section="Brand Intelligence"
        info="Pipeline attributed to brand-building activities — content, social, and narrative presence."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <DashboardCard
            info="Composite 0–100 score from brand sentiment, reach, story consistency, and share of voice vs. competitors."
          >
            <BrandHealthGauge score={brand.healthScore} size={200} />
          </DashboardCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DashboardCard
            title="Story Consistency"
            subtitle="Per channel narrative alignment score"
            info="How consistently your core brand narrative appears across each marketing channel."
          >
            <div className="space-y-3">
              {brand.storyConsistency.map((ch) => (
                <div key={ch.channel}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[var(--nos-text-secondary)]">{ch.channel}</span>
                    <span className="text-xs font-semibold text-[var(--nos-text-primary)]">{ch.score}/100</span>
                  </div>
                  <Progress value={ch.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </DashboardCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DashboardCard
            title="Share of Voice"
            subtitle="Narrative presence vs. competitors"
            info="Your brand's share of total narrative mentions and content visibility compared to key competitors."
          >
            <div className="space-y-3">
              {sov.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${s.isClient ? "font-semibold text-[var(--nos-accent)]" : "text-[var(--nos-text-secondary)]"}`}>
                      {s.name} {s.isClient && "✦"}
                    </span>
                    <span className="text-xs font-semibold text-[var(--nos-text-primary)]">{s.value}%</span>
                  </div>
                  <div className="h-2 bg-[var(--nos-bg-elevated)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.value / maxSov) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: s.isClient ? "var(--nos-accent)" : "var(--nos-bg-overlay)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <DashboardCard
          info="How top-of-funnel content impressions convert through engagement to pipeline value."
        >
          <PipelineFunnel
            data={brand.attributionFunnel}
            title="Content-to-Pipeline Attribution Funnel"
            subtitle="Top-of-funnel impressions through to pipeline value"
            prefix="$"
          />
        </DashboardCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <InsightCard text={brand.aiInsight} />
      </motion.div>
    </motion.div>
  );
}
