"use client";

import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import { KPICard } from "@/components/cards/KPICard";
import { PipelineBridge } from "@/components/cards/PipelineBridge";
import { InsightCard } from "@/components/cards/InsightCard";
import { SignalAreaChart } from "@/components/charts/SignalAreaChart";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { CardInfoButton } from "@/components/shared/CardInfoButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Search, ArrowRight } from "lucide-react";

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

  const kpiDefs = [
    { key: "cac", label: "Customer Acq. Cost", field: kpis.cac, tooltip: "Average cost to acquire a new customer, attributed to narrative marketing activities." },
    { key: "pipeline", label: "Pipeline Value", field: kpis.pipeline, tooltip: "Total CRM pipeline value attributed to narrative marketing channels in the selected period." },
    { key: "dealVelocity", label: "Deal Velocity", field: kpis.dealVelocity, tooltip: "Average days from first signal touch to closed-won deal for narrative-sourced leads." },
    { key: "dealsCreated", label: "Deals Created", field: kpis.dealsCreated, tooltip: "New CRM opportunities created, attributed to narrative signals in this period." },
    { key: "closedWon", label: "Closed Won", field: kpis.closedWon, tooltip: "Deals closed-won in this period where narrative marketing was a contributing factor." },
    { key: "attributedRevenue", label: "Attributed Revenue", field: kpis.attributedRevenue, tooltip: "Revenue closed-won where narrative marketing was attributed as an influence factor." },
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

      {/* KPI Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpiDefs.map((kpi) => (
          <KPICard
            key={kpi.key}
            label={kpi.label}
            value={kpi.field.value}
            change={kpi.field.change}
            sparkline={kpi.field.sparkline}
            prefix={kpi.field.prefix}
            suffix={kpi.field.suffix}
            tooltip={kpi.tooltip}
          />
        ))}
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
        <h3 className="text-xs text-label-caps mb-3">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recommendedActions.map((action, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="nos-card relative flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2 pr-8">
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
                  {action.priority.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-1">{action.title}</p>
                <p className="text-xs text-[var(--nos-text-muted)] leading-relaxed">{action.description}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="mt-auto self-start gap-1.5 text-xs text-[var(--nos-accent)] hover:bg-[var(--nos-accent-muted)] p-0 h-auto"
              >
                {action.cta} <ArrowRight size={11} />
              </Button>
              <div className="absolute top-3.5 right-3.5 z-30 pointer-events-auto">
                <CardInfoButton description={action.description} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
