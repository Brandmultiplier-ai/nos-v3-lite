"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientData } from "@/lib/data";
import { PipelineBridge } from "@/components/cards/PipelineBridge";
import { KPICard } from "@/components/cards/KPICard";
import { TrendLine } from "@/components/charts/TrendLine";
import { DonutChart } from "@/components/charts/DonutChart";
import { HeatmapGrid } from "@/components/charts/HeatmapGrid";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ExternalLink } from "lucide-react";
import type { CompanySignal } from "@/lib/data/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const intentBadge = (intent: CompanySignal["intent"]) => {
  const map = {
    hot: { label: "Hot", color: "var(--nos-signal-hot)" },
    warm: { label: "Warm", color: "var(--nos-signal-warm)" },
    cold: { label: "Cold", color: "var(--nos-signal-cold)" },
  };
  const cfg = map[intent];
  return (
    <Badge
      className="text-[9px] relative"
      style={{ background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }}
    >
      {intent === "hot" && (
        <span className="absolute inset-0 rounded-full" style={{
          background: cfg.color,
          animation: "hotPulse 2s ease infinite",
          opacity: 0.3,
        }} />
      )}
      {cfg.label}
    </Badge>
  );
};

function SignalRow({ signal, expanded, onToggle }: { signal: CompanySignal; expanded: boolean; onToggle: () => void }) {
  return (
    <>
      <tr
        className="border-b border-[var(--border)] hover:bg-[var(--nos-bg-elevated)] transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <td className="py-2.5 pr-4 font-medium text-[var(--nos-text-primary)]">{signal.company}</td>
        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-muted)]">{signal.industry}</td>
        <td className="py-2.5 pr-4">
          <span className="text-sm font-semibold text-[var(--nos-accent)]">{signal.signalScore}</span>
        </td>
        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">{signal.pagesVisited}</td>
        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">{signal.timeOnSite}</td>
        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">{signal.source}</td>
        <td className="py-2.5 pr-4">{intentBadge(signal.intent)}</td>
        <td className="py-2.5">
          <ChevronDown
            size={14}
            className={`text-[var(--nos-text-muted)] transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={8}>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 bg-[var(--nos-bg-elevated)] flex items-start gap-8">
                  <div>
                    <p className="text-[10px] text-label-caps mb-1">Pages Visited</p>
                    <div className="flex flex-wrap gap-1">
                      {signal.pages.map((page) => (
                        <span key={page} className="text-xs text-[var(--nos-accent)] bg-[var(--nos-accent-muted)] px-2 py-0.5 rounded-md">{page}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-label-caps mb-1">Company Size</p>
                    <p className="text-sm text-[var(--nos-text-primary)]">{signal.companySize} employees</p>
                  </div>
                  <a href={signal.linkedinUrl} className="flex items-center gap-1 text-xs text-[var(--nos-accent)] hover:underline mt-4">
                    <ExternalLink size={11} /> View on LinkedIn
                  </a>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

interface SectionProps {
  variant?: "a" | "b" | "c";
}

export function WebsiteSignals({ variant = "a" }: SectionProps) {
  const data = useClientData();
  const { website, pipelineBridge } = data;
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [intentFilter, setIntentFilter] = useState<"all" | "hot" | "warm" | "cold">("all");

  const filteredSignals = intentFilter === "all"
    ? website.signals
    : website.signals.filter((s) => s.intent === intentFilter);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <PipelineBridge
        attributed={pipelineBridge.attributed}
        deals={pipelineBridge.deals}
        velocity={pipelineBridge.velocity}
        section="Website Signals"
      />

      {/* KPI Strip */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPICard label="Visitors" value={website.visitors.value} change={website.visitors.change} sparkline={website.visitors.sparkline} tooltip="Total unique visitors to your website in this period." />
        <KPICard label="Companies ID'd" value={website.companiesIdentified.value} change={website.companiesIdentified.change} sparkline={website.companiesIdentified.sparkline} tooltip="Companies identified through IP resolution and intent data enrichment." />
        <KPICard label="Avg Time on Site" value={website.avgTimeOnSite.value} change={website.avgTimeOnSite.change} sparkline={website.avgTimeOnSite.sparkline} suffix={website.avgTimeOnSite.suffix} tooltip="Average session duration for all identified visitors." />
        <KPICard label="Returning" value={website.returning.value} change={website.returning.change} sparkline={website.returning.sparkline} tooltip="Visitors who have returned to your site 2+ times in this period." />
        <KPICard label="Hot Accounts" value={website.hotAccounts.value} change={website.hotAccounts.change} sparkline={website.hotAccounts.sparkline} tooltip="Companies with a signal score above 80 — high intent, likely in active evaluation." />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visitor Trend */}
        <motion.div variants={itemVariants} className="nos-card lg:col-span-2">
          <TrendLine data={website.visitorTrend} title="Visitor Trend" subtitle="Weekly sessions by identified companies" color="#6366F1" height={200} />
        </motion.div>
        {/* Traffic Sources */}
        <motion.div variants={itemVariants} className="nos-card">
          <DonutChart data={website.trafficSources} title="Traffic Sources" subtitle="Session origin breakdown" height={200} />
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div variants={itemVariants} className="nos-card">
        <HeatmapGrid data={website.intentHeatmap} />
      </motion.div>

      {/* Signal Feed */}
      <motion.div variants={itemVariants} className="nos-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-[var(--nos-text-primary)]">Signal Feed</p>
            <p className="text-xs text-[var(--nos-text-muted)]">Identified companies sorted by intent signal</p>
          </div>
          <div className="flex gap-1">
            {(["all", "hot", "warm", "cold"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setIntentFilter(f)}
                className={`text-xs px-3 py-1 rounded-full transition-colors capitalize ${
                  intentFilter === f
                    ? "bg-[var(--nos-accent)] text-white"
                    : "bg-[var(--nos-bg-elevated)] text-[var(--nos-text-muted)] hover:text-[var(--nos-text-primary)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="scroll-fade-bottom overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="sticky top-0 bg-[var(--nos-bg-surface)]">
                <tr className="border-b border-[var(--border)]">
                  {["Company", "Industry", "Signal Score", "Pages", "Time on Site", "Source", "Intent", ""].map((h) => (
                    <th key={h} className="text-left pb-2 text-[10px] text-label-caps text-[var(--nos-text-muted)] pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSignals.map((signal) => (
                  <SignalRow
                    key={signal.id}
                    signal={signal}
                    expanded={expandedRow === signal.id}
                    onToggle={() => setExpandedRow(expandedRow === signal.id ? null : signal.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
