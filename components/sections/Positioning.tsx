"use client";

import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import { SectionTLDR } from "@/components/shared/SectionTLDR";
import { GartnerQuadrant } from "@/components/charts/GartnerQuadrant";
import { TrendLine } from "@/components/charts/TrendLine";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const trendIcon = (t: string) =>
  t === "up" ? <TrendingUp size={12} className="text-[var(--nos-positive)]" /> :
  t === "down" ? <TrendingDown size={12} className="text-[var(--nos-negative)]" /> :
  <Minus size={12} className="text-[var(--nos-text-muted)]" />;

export function Positioning() {
  const data = useClientData();
  const { positioning } = data;

  const movementData = positioning.movementTimeline.map((p) => ({
    date: p.date,
    value: Math.round(((p.x + p.y) / 2) * 10) / 10,
  }));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      <SectionTLDR tldr={positioning.tldr} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <DashboardCard
            info="Maps your brand vs. competitors on market presence (x-axis) and narrative strength (y-axis). Your position in the Leaders quadrant indicates strong market narrative."
          >
            <GartnerQuadrant data={positioning.quadrant} />
          </DashboardCard>
        </motion.div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <motion.div variants={itemVariants}>
            <DashboardCard
              info="Tracks how your composite positioning score (market presence + narrative strength) has changed over the last 6 months."
            >
              <TrendLine
                data={movementData}
                title="Positioning Movement"
                subtitle="Composite score trajectory (6 months)"
                color="#6366F1"
                height={160}
                xAxisLabel="Month"
                yAxisLabel="Composite positioning score"
              />
            </DashboardCard>
          </motion.div>
          <motion.div variants={itemVariants} className="flex-1">
            <DashboardCard
              title="Keyword Ownership"
              subtitle="Top narrative themes owned"
              info="How strongly you own key narrative themes vs. competitors — higher scores mean you dominate that conversation."
            >
              <div className="space-y-2">
                {positioning.keywordOwnership.map((kw) => (
                  <div key={kw.keyword} className="flex items-center gap-2">
                    <div className="flex-1 truncate text-xs text-[var(--nos-text-secondary)]">{kw.keyword}</div>
                    <div className="w-16 h-1.5 bg-[var(--nos-bg-elevated)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${kw.score}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full bg-[var(--nos-accent)]"
                      />
                    </div>
                    <span className="text-xs font-semibold text-[var(--nos-text-primary)] w-7 text-right">{kw.score}</span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>
        </div>
      </div>

      <motion.div variants={itemVariants}>
        <DashboardCard
          title="Competitor Intelligence"
          subtitle="Narrative and market presence benchmarks"
          info="Side-by-side comparison of competitor narrative scores, market presence, and recent trend direction."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {["Company", "Narrative Score", "Market Presence", "Last Seen", "Trend"].map((h) => (
                    <th key={h} className="text-left pb-2 text-[10px] text-label-caps text-[var(--nos-text-muted)] pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {positioning.competitors.map((comp) => (
                  <tr key={comp.name} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--nos-bg-elevated)] transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-[var(--nos-text-primary)]">{comp.name}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-[var(--nos-bg-elevated)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-[var(--nos-accent)]" style={{ width: `${comp.narrativeScore}%` }} />
                        </div>
                        <span className="text-xs text-[var(--nos-text-secondary)]">{comp.narrativeScore}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-[var(--nos-bg-elevated)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${comp.marketPresence}%`, background: "var(--nos-ch-search)" }} />
                        </div>
                        <span className="text-xs text-[var(--nos-text-secondary)]">{comp.marketPresence}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-muted)]">{comp.lastSeen}</td>
                    <td className="py-2.5">{trendIcon(comp.trend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </motion.div>
    </motion.div>
  );
}
