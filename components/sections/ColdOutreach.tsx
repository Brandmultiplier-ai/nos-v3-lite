"use client";

import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import { PipelineBridge } from "@/components/cards/PipelineBridge";
import { KPICard } from "@/components/cards/KPICard";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { SectionSubTabs } from "@/components/shared/SectionSubTabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "@/components/charts/CustomTooltip";

const OUTREACH_TABS = [
  { id: "email", label: "Email", path: "/outreach/email" },
  { id: "linkedin", label: "LinkedIn", path: "/outreach/linkedin" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

const statusBadge = (status: string) => {
  const map: Record<string, { color: string }> = {
    active: { color: "#22C55E" },
    paused: { color: "#F59E0B" },
    completed: { color: "#71717A" },
  };
  const cfg = map[status] ?? { color: "#71717A" };
  return (
    <Badge className="text-[9px] capitalize" style={{ background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
      {status}
    </Badge>
  );
};

type OutreachTab = "email" | "linkedin";

interface ColdOutreachProps {
  tab?: OutreachTab;
}

export function ColdOutreach({ tab = "email" }: ColdOutreachProps) {
  const data = useClientData();
  const { outreach, pipelineBridge } = data;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <PipelineBridge
        attributed={pipelineBridge.attributed}
        deals={pipelineBridge.deals}
        velocity={pipelineBridge.velocity}
        section="Cold Outreach"
        info="Pipeline influenced by cold outreach sequences — email and LinkedIn — in the selected period."
      />

      <SectionSubTabs tabs={OUTREACH_TABS} />

      {tab === "email" && (
        <>
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <KPICard
              label="Email Pipeline"
              value={outreach.emailPipeline.value}
              change={outreach.emailPipeline.change}
              sparkline={outreach.emailPipeline.sparkline}
              prefix="$"
              tooltip="CRM pipeline attributed to email outreach sequences in this period."
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              title="Email Campaigns"
              subtitle="Active and recent sequences with pipeline attribution"
              info="All email outreach sequences — status, send volume, opens, replies, meetings booked, and pipeline generated."
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {["Campaign", "Status", "Steps", "Sent", "Opens", "Replies", "Meetings", "Pipeline"].map((h) => (
                        <th key={h} className="text-left pb-2 text-[10px] text-label-caps text-[var(--nos-text-muted)] pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outreach.emailCampaigns.map((c) => (
                      <tr key={c.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--nos-bg-elevated)] transition-colors">
                        <td className="py-2.5 pr-4 font-medium text-[var(--nos-text-primary)] max-w-[180px] truncate">{c.name}</td>
                        <td className="py-2.5 pr-4">{statusBadge(c.status)}</td>
                        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">{c.sequence}</td>
                        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">{Math.round(c.sent)}</td>
                        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">{Math.round(c.opens)}</td>
                        <td className="py-2.5 pr-4 text-xs font-medium text-[var(--nos-accent)]">{Math.round(c.replies)}</td>
                        <td className="py-2.5 pr-4 text-xs font-medium text-[var(--nos-positive)]">{Math.round(c.meetings)}</td>
                        <td className="py-2.5 text-xs font-semibold text-[var(--nos-positive)]">{fmt(Math.round(c.pipeline))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <DashboardCard
                title="Reply Rate Waterfall"
                subtitle="Step-by-step sequence drop-off analysis"
                info="Shows how reply rates drop at each step of your email sequence — helps identify where prospects disengage."
              >
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={outreach.replyWaterfall} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="step" tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip suffix="%" />} />
                    <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} animationDuration={900} />
                  </BarChart>
                </ResponsiveContainer>
              </DashboardCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <DashboardCard
                title="Top Subject Lines"
                subtitle="Ranked by reply rate"
                info="Subject lines that generated the highest reply rates — use these patterns to improve future sequences."
              >
                <div className="space-y-3">
                  {outreach.topSubjectLines.map((sl, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-[var(--nos-accent)] mt-0.5 w-3">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-xs text-[var(--nos-text-primary)] leading-relaxed mb-1">{sl.subject}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-[var(--nos-bg-elevated)] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(sl.replyRate / 40) * 100}%` }}
                              transition={{ duration: 0.7, delay: i * 0.1 }}
                              className="h-full rounded-full bg-[var(--nos-positive)]"
                            />
                          </div>
                          <span className="text-xs font-semibold text-[var(--nos-positive)]">{sl.replyRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </motion.div>
          </div>
        </>
      )}

      {tab === "linkedin" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <DashboardCard
                title="Connection Funnel"
                subtitle="Connection → Accept → Reply → Meeting conversion"
                info="LinkedIn outreach funnel from connection requests through to booked meetings — shows conversion at each stage."
              >
                <div className="space-y-3">
                  {outreach.linkedinFunnel.map((stage, i) => {
                    const max = outreach.linkedinFunnel[0].value;
                    const pct = (stage.value / max) * 100;
                    const prev = i > 0 ? outreach.linkedinFunnel[i - 1].value : null;
                    const rate = prev ? Math.round((stage.value / prev) * 100) : null;
                    return (
                      <div key={stage.stage}>
                        {rate !== null && (
                          <p className="text-[10px] text-[var(--nos-text-muted)] ml-2 mb-1">↓ {rate}% conversion</p>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[var(--nos-text-muted)] w-32 shrink-0">{stage.stage}</span>
                          <div className="flex-1 h-7 bg-[var(--nos-bg-elevated)] rounded-md overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
                              className="h-full rounded-md flex items-center pl-3"
                              style={{ background: "#0A66C2", opacity: 1 - i * 0.12 }}
                            >
                              <span className="text-xs font-semibold text-white">{stage.value}</span>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DashboardCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <DashboardCard
                title="ICP Score Distribution"
                subtitle="Lead quality match distribution"
                info="How well your LinkedIn outreach targets match your ideal customer profile — higher scores mean better-fit prospects."
              >
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={outreach.icpScoreDistribution} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="score" tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Leads" fill="#0A66C2" radius={[4, 4, 0, 0]} animationDuration={900} />
                  </BarChart>
                </ResponsiveContainer>
              </DashboardCard>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              title="LinkedIn Campaigns"
              subtitle="Campaign performance and pipeline"
              info="Active LinkedIn outreach campaigns — connection acceptance, reply rates, meetings, and pipeline attributed."
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {["Campaign", "Status", "Sent", "Accepted", "Replied", "Meetings", "Pipeline"].map((h) => (
                        <th key={h} className="text-left pb-2 text-[10px] text-label-caps text-[var(--nos-text-muted)] pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outreach.linkedinCampaigns.map((c) => (
                      <tr key={c.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--nos-bg-elevated)] transition-colors">
                        <td className="py-2.5 pr-4 font-medium text-[var(--nos-text-primary)] max-w-[180px] truncate">{c.name}</td>
                        <td className="py-2.5 pr-4">{statusBadge(c.status)}</td>
                        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">{Math.round(c.sent)}</td>
                        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">{Math.round(c.accepted)}</td>
                        <td className="py-2.5 pr-4 text-xs font-medium text-[var(--nos-accent)]">{Math.round(c.replied)}</td>
                        <td className="py-2.5 pr-4 text-xs font-medium text-[var(--nos-positive)]">{Math.round(c.meetings)}</td>
                        <td className="py-2.5 text-xs font-semibold text-[var(--nos-positive)]">{fmt(Math.round(c.pipeline))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
