"use client";

import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import { PipelineBridge } from "@/components/cards/PipelineBridge";
import { KPICard } from "@/components/cards/KPICard";
import { TrendLine } from "@/components/charts/TrendLine";
import { VelocityLine } from "@/components/charts/VelocityLine";
import { NarrativeRadar } from "@/components/charts/NarrativeRadar";
import { DonutChart } from "@/components/charts/DonutChart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const intentColors: Record<string, string> = {
  informational: "#6366F1",
  commercial: "#F59E0B",
  transactional: "#22C55E",
};

interface SectionProps {
  variant?: "a" | "b" | "c";
}

export function SearchIntel({ variant = "a" }: SectionProps) {
  const data = useClientData();
  const { search, pipelineBridge } = data;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <PipelineBridge
        attributed={pipelineBridge.attributed}
        deals={pipelineBridge.deals}
        velocity={pipelineBridge.velocity}
        section="Search Intelligence"
      />

      {/* SEO Section */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xs text-label-caps mb-3 text-[var(--nos-accent)]">SEO Intelligence</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 nos-card">
            <TrendLine
              data={search.organicSessions}
              title="Organic Sessions"
              subtitle="Search-driven website traffic trend"
              color="#8B5CF6"
              height={200}
            />
          </div>
          <div className="flex flex-col gap-4">
            <KPICard
              label="Pipeline from Organic"
              value={search.pipelineFromOrganic.value}
              change={search.pipelineFromOrganic.change}
              sparkline={search.pipelineFromOrganic.sparkline}
              prefix="$"
              tooltip="CRM pipeline attributed to organic search traffic in this period."
              className="flex-1"
            />
            <div className="nos-card">
              <DonutChart
                data={search.intentBreakdown}
                title="Search Intent"
                subtitle="Traffic by query intent type"
                height={160}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Keywords Table */}
      <motion.div variants={itemVariants} className="nos-card">
        <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-0.5">Top Keywords</p>
        <p className="text-xs text-[var(--nos-text-muted)] mb-3">Ranking · Volume · Change · Intent</p>
        <div className="overflow-x-auto">
          <div className="scroll-fade-bottom max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[var(--nos-bg-surface)]">
                <tr className="border-b border-[var(--border)]">
                  {["Keyword", "Rank", "Volume", "Change", "Intent"].map((h) => (
                    <th key={h} className="text-left pb-2 text-[10px] text-label-caps text-[var(--nos-text-muted)] pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {search.keywords.map((kw, i) => (
                  <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--nos-bg-elevated)] transition-colors">
                    <td className="py-2.5 pr-4 text-[var(--nos-text-primary)] font-medium">{kw.keyword}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-sm font-semibold ${kw.ranking <= 3 ? "text-[var(--nos-positive)]" : kw.ranking <= 10 ? "text-[var(--nos-text-primary)]" : "text-[var(--nos-text-muted)]"}`}>
                        #{kw.ranking}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">
                      {kw.volume >= 1000 ? `${(kw.volume / 1000).toFixed(0)}k` : kw.volume}
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className={`flex items-center gap-1 text-xs ${kw.change > 0 ? "text-[var(--nos-positive)]" : kw.change < 0 ? "text-[var(--nos-negative)]" : "text-[var(--nos-text-muted)]"}`}>
                        {kw.change > 0 ? <TrendingUp size={11} /> : kw.change < 0 ? <TrendingDown size={11} /> : null}
                        {kw.change > 0 ? "+" : ""}{kw.change}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <Badge
                        className="text-[9px] capitalize"
                        style={{
                          background: `${intentColors[kw.intent]}20`,
                          color: intentColors[kw.intent],
                          border: `1px solid ${intentColors[kw.intent]}40`,
                        }}
                      >
                        {kw.intent}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* GEO Section */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xs text-label-caps mb-3 text-[var(--nos-positive)]">GEO — Generative Engine Optimization</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Engine citations bar */}
            <div className="nos-card">
              <p className="text-sm font-semibold text-[var(--nos-text-primary)] mb-0.5">Brand Citations by AI Engine</p>
              <p className="text-xs text-[var(--nos-text-muted)] mb-3">Total mentions in AI-generated responses</p>
              <div className="space-y-3">
                {search.geoEngines.map((engine) => {
                  const engineColors: Record<string, string> = {
                    ChatGPT: "#22C55E",
                    Perplexity: "#0EA5E9",
                    Gemini: "#F59E0B",
                    Copilot: "#8B5CF6",
                  };
                  const color = engineColors[engine.engine] ?? "#6366F1";
                  const max = Math.max(...search.geoEngines.map((e) => e.citations));
                  return (
                    <div key={engine.engine} className="flex items-center gap-3">
                      <span className="text-xs text-[var(--nos-text-secondary)] w-20 shrink-0">{engine.engine}</span>
                      <div className="flex-1 h-6 bg-[var(--nos-bg-elevated)] rounded-md overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(engine.citations / max) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full rounded-md flex items-center pl-3"
                          style={{ background: color }}
                        >
                          <span className="text-xs font-semibold text-white">{engine.citations}</span>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="nos-card">
              <VelocityLine engines={search.geoEngines} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <KPICard
              label="GEO Pipeline"
              value={search.geoPipelineKPI.value}
              change={search.geoPipelineKPI.change}
              sparkline={search.geoPipelineKPI.sparkline}
              prefix="$"
              tooltip="CRM pipeline attributed to inbound leads who discovered the brand via AI-generated search results."
            />
            <div className="nos-card flex-1">
              <NarrativeRadar data={search.topicAuthority} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
