"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientData } from "@/lib/data";
import { SectionTLDR } from "@/components/shared/SectionTLDR";
import { GartnerQuadrant } from "@/components/charts/GartnerQuadrant";
import { PositioningQuadrantDots } from "@/components/charts/PositioningQuadrantDots";
import { TrendLine } from "@/components/charts/TrendLine";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { PhaseSecondaryKPI } from "@/components/cards/PhaseSecondaryKPI";
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

type QuadrantView = "bars" | "dots";

export function Positioning() {
  const data = useClientData();
  const { positioning } = data;
  const [quadrantView, setQuadrantView] = useState<QuadrantView>("bars");

  const movementData = positioning.movementTimeline.map((p) => ({
    date: p.date,
    value: Math.round(((p.x + p.y) / 2) * 10) / 10,
  }));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      <SectionTLDR tldr={positioning.tldr} />

      {/* Phase 1 — Anchor: Market perception + Sentiment score */}
      <motion.div variants={itemVariants}>
        <PhaseSecondaryKPI phase={1} pair={data.narrativeIntel.phaseMetrics.phase1} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <DashboardCard
            info="Maps your brand vs. competitors on market presence (x-axis) and narrative strength (y-axis). 'Bars' shows ranked bar comparison; 'Dots' shows the Gartner-style scatter plot."
          >
            {/* Bar / Dot toggle — same pattern as SEO/GEO tabs */}
            <div className="flex items-center gap-1 mb-4 p-0.5 rounded-lg w-fit" style={{ background: "var(--nos-bg-elevated)" }}>
              {(["bars", "dots"] as QuadrantView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setQuadrantView(v)}
                  className="relative px-3 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors"
                  style={{
                    background: quadrantView === v ? "var(--nos-bg-card)" : "transparent",
                    color: quadrantView === v ? "var(--nos-text-primary)" : "var(--nos-text-muted)",
                    boxShadow: quadrantView === v ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
                  }}
                >
                  {v === "bars" ? "Bars" : "Dots"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={quadrantView}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {quadrantView === "bars"
                  ? <GartnerQuadrant data={positioning.quadrant} />
                  : <PositioningQuadrantDots data={positioning.quadrant} />
                }
              </motion.div>
            </AnimatePresence>
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
                          <div className="h-full rounded-full" style={{ width: `${comp.marketPresence}%`, background: "#F59E0B" }} />
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
