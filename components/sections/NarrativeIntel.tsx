"use client";

import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import { PipelineBridge } from "@/components/cards/PipelineBridge";
import { InsightCard } from "@/components/cards/InsightCard";
import { NRIScoreCard } from "@/components/cards/NRIScoreCard";
import { PhaseToMetricStrip } from "@/components/sections/PhaseToMetricStrip";
import { SignalAreaChart } from "@/components/charts/SignalAreaChart";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { CardInfoButton } from "@/components/shared/CardInfoButton";
import { MiniSparkline } from "@/components/charts/MiniSparkline";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Target, Search } from "lucide-react";
import type { KPIMetric } from "@/lib/data/types";

function fmtHero(value: number, prefix = "", suffix = "") {
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M${suffix}`;
  if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(0)}k${suffix}`;
  if (Number.isInteger(value)) return `${prefix}${value.toLocaleString()}${suffix}`;
  return `${prefix}${value.toFixed(1)}${suffix}`;
}

function HeroKPICard({
  label,
  field,
  tooltip,
  invertChange = false,
}: {
  label: string;
  field: KPIMetric;
  tooltip: string;
  invertChange?: boolean;
}) {
  const { value, change, sparkline, prefix = "", suffix = "" } = field;
  const isNeutral = change === 0;
  const isGood = invertChange ? change < 0 : change > 0;
  const trendColor = isNeutral
    ? "var(--nos-text-muted)"
    : isGood
    ? "var(--nos-positive)"
    : "var(--nos-negative)";
  const sparkColor = isNeutral
    ? "var(--nos-text-muted)"
    : isGood
    ? "var(--nos-positive)"
    : "var(--nos-negative)";
  const trendBg = isNeutral
    ? "var(--nos-bg-elevated)"
    : isGood
    ? "rgba(52,211,153,0.08)"
    : "rgba(255,68,85,0.08)";

  return (
    <div className="nos-card flex flex-col items-center text-center gap-3 py-6 px-4 relative group">
      <div
        className="absolute top-0 left-8 right-8 h-px rounded-full pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${sparkColor}, transparent)`,
          opacity: 0.5,
        }}
      />
      <div className="absolute top-3 right-3">
        <CardInfoButton description={tooltip} />
      </div>
      <p className="text-label-caps text-center w-full">{label}</p>
      <p
        className="font-mono-metric"
        style={{ color: "var(--nos-text-primary)" }}
      >
        {fmtHero(value, prefix, suffix)}
      </p>
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: trendBg, color: trendColor }}
        >
          {isNeutral ? (
            <Minus size={11} />
          ) : isGood ? (
            <TrendingUp size={11} />
          ) : (
            <TrendingDown size={11} />
          )}
          <span>
            {change >= 0 ? "+" : ""}
            {change}%
          </span>
        </div>
        <MiniSparkline data={sparkline} color={sparkColor} width={64} height={24} />
      </div>
    </div>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp size={16} />,
  Target: <Target size={16} />,
  Search: <Search size={16} />,
  Mail: <Target size={16} />,
  Instagram: <Target size={16} />,
  BarChart: <TrendingUp size={16} />,
  Building2: <Target size={16} />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

interface SectionProps {
  variant?: "a" | "b" | "c";
}

export function NarrativeIntel({ variant = "a" }: SectionProps) {
  const data = useClientData();
  const { kpis, signalTimeline, aiNarrative, recommendedActions, pipelineBridge } = data;

  const heroKPIs = [
    { key: "cac", label: "Customer Acq. Cost", field: kpis.cac, tooltip: "Average cost to acquire a new customer, attributed to narrative marketing activities.", invertChange: true },
    { key: "ltv", label: "Customer LTV", field: kpis.ltv, tooltip: "Average lifetime value of customers acquired through narrative marketing channels.", invertChange: false },
    { key: "avgDealSize", label: "Avg Deal Size", field: kpis.avgDealSize, tooltip: "Average closed-won deal value for opportunities influenced by narrative marketing.", invertChange: false },
    { key: "dealVelocity", label: "Sales Velocity", field: kpis.dealVelocity, tooltip: "Average days from first signal touch to closed-won deal for narrative-sourced leads.", invertChange: true },
    { key: "attributedRevenue", label: "Revenue", field: kpis.attributedRevenue, tooltip: "Revenue closed-won where narrative marketing was attributed as an influence factor.", invertChange: false },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <PipelineBridge
        attributed={pipelineBridge.attributed}
        deals={pipelineBridge.deals}
        velocity={pipelineBridge.velocity}
        section="All Channels"
        info="Total pipeline attributed across all narrative marketing channels in the selected period."
      />

      {/* NRI Score Card */}
      <motion.div variants={itemVariants}>
        <NRIScoreCard />
      </motion.div>

      {/* Hero KPI Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {heroKPIs.map((kpi) => (
          <HeroKPICard
            key={kpi.key}
            label={kpi.label}
            field={kpi.field}
            tooltip={kpi.tooltip}
            invertChange={kpi.invertChange}
          />
        ))}
      </motion.div>

      {/* Phase-to-Metric Strip */}
      <motion.div variants={itemVariants}>
        <PhaseToMetricStrip />
      </motion.div>

      {/* Signal Area Chart */}
      <motion.div variants={itemVariants}>
        <DashboardCard info="Composite signal strength across LinkedIn, website intent, email, search, and content channels over time.">
          <SignalAreaChart data={signalTimeline} />
        </DashboardCard>
      </motion.div>

      {/* AI Narrative */}
      <motion.div variants={itemVariants}>
        <InsightCard text={aiNarrative} />
      </motion.div>

      {/* Recommended Actions */}
      <motion.div variants={itemVariants}>
        <h3 className="text-label-caps mb-3">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recommendedActions.map((action, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="nos-card flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--nos-accent-muted)] flex items-center justify-center text-[var(--nos-accent)] shrink-0">
                  {iconMap[action.icon] ?? <Target size={16} />}
                </div>
                <Badge
                  className={`text-[10px] shrink-0 ${
                    action.priority === "high"
                      ? "bg-[var(--nos-signal-hot)] bg-opacity-15 text-[var(--nos-signal-hot)] border-[var(--nos-signal-hot)] border-opacity-30"
                      : "bg-[var(--nos-signal-warm)] bg-opacity-15 text-[var(--nos-signal-warm)] border-[var(--nos-signal-warm)] border-opacity-30"
                  }`}
                >
                  {action.priority.charAt(0).toUpperCase() + action.priority.slice(1).toLowerCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-1">{action.title}</p>
                <p className="text-xs text-[var(--nos-text-muted)] leading-relaxed">{action.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
