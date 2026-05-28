"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientData } from "@/lib/data";
import { PipelineBridge } from "@/components/cards/PipelineBridge";
import { KPICard } from "@/components/cards/KPICard";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { SectionSubTabs } from "@/components/shared/SectionSubTabs";
import { Badge } from "@/components/ui/badge";
import { MiniSparkline } from "@/components/charts/MiniSparkline";
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { CustomTooltip } from "@/components/charts/CustomTooltip";
import { Flame, Shield, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type { EmailCampaign, InboxHealth, SalesloftData } from "@/lib/data/types";

const OUTREACH_TABS = [
  { id: "email",    label: "Email",    path: "/outreach/email" },
  { id: "linkedin", label: "LinkedIn", path: "/outreach/linkedin" },
];

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}
function fmtMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const ChartTip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2.5 text-xs space-y-1" style={{ background: "var(--nos-bg-overlay)", border: "1px solid var(--nos-accent-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
      <p className="font-semibold mb-1.5" style={{ color: "var(--nos-text-secondary)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--nos-text-muted)" }}>{p.name}</span>
          <span className="font-bold ml-auto" style={{ color: "var(--nos-text-primary)" }}>{fmtNum(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const statusBadge = (status: string) => {
  const map: Record<string, { color: string; label: string }> = {
    active:    { color: "#22C55E", label: "Active" },
    paused:    { color: "#F59E0B", label: "Paused" },
    completed: { color: "#71717A", label: "Done" },
  };
  const cfg = map[status] ?? { color: "#71717A", label: status };
  return <Badge className="text-[9px]" style={{ background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }}>{cfg.label}</Badge>;
};

// ── Campaign row with expandable step breakdown ────────────────────────────
function CampaignRow({ campaign }: { campaign: EmailCampaign }) {
  const [open, setOpen] = useState(false);
  const maxOpen = Math.max(...campaign.sequenceSteps.map((s) => s.opened));

  return (
    <>
      <tr
        className="border-b transition-colors cursor-pointer"
        style={{ borderColor: "var(--border)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--nos-bg-elevated)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        onClick={() => setOpen((v) => !v)}
      >
        <td className="py-3 pr-4">
          <div className="flex items-center gap-2.5">
            <button className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--nos-bg-elevated)", color: "var(--nos-text-muted)" }}>
              {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
            <div>
              <p className="text-xs font-semibold max-w-[180px] truncate" style={{ color: "var(--nos-text-primary)" }}>{campaign.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {statusBadge(campaign.status)}
                <span className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>{campaign.sequenceSteps.length} steps</span>
              </div>
            </div>
          </div>
        </td>
        {/* Campaign stats */}
        <td className="py-3 pr-4 text-center">
          <p className="text-xs font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{fmtNum(campaign.sent)}</p>
          <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>contacted</p>
        </td>
        <td className="py-3 pr-4 text-center">
          <p className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "#0EA5E9" }}>{campaign.openRate.toFixed(1)}%</p>
          <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>open</p>
        </td>
        <td className="py-3 pr-4 text-center">
          <p className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "#22C55E" }}>{campaign.replyRate.toFixed(1)}%</p>
          <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>reply</p>
        </td>
        <td className="py-3 pr-4 text-center">
          <p className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "#A78BFA" }}>{campaign.positiveReplyRate.toFixed(1)}%</p>
          <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>positive</p>
        </td>
        <td className="py-3 pr-4 text-center">
          <p className="text-xs font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: campaign.bounceRate > 3 ? "var(--nos-negative)" : "var(--nos-text-muted)" }}>{campaign.bounceRate.toFixed(1)}%</p>
          <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>bounce</p>
        </td>
        <td className="py-3 text-right">
          <p className="text-xs font-bold" style={{ color: "var(--nos-positive)" }}>{fmtMoney(campaign.pipeline)}</p>
          <div className="flex items-center justify-end mt-1">
            <MiniSparkline data={campaign.trend.map((t) => t.replies)} color="var(--nos-positive)" width={52} height={20} />
          </div>
        </td>
      </tr>

      {/* Expandable step-by-step breakdown */}
      <AnimatePresence>
        {open && (
          <tr>
            <td colSpan={7}>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 py-4" style={{ background: "var(--nos-bg-elevated)", borderBottom: `1px solid var(--border)` }}>
                  {/* Campaign stat pills */}
                  <div className="flex items-center gap-6 mb-4 text-xs">
                    {[
                      { label: "Leads", value: fmtNum(campaign.leads), color: "var(--nos-text-secondary)" },
                      { label: "Completed", value: fmtNum(campaign.completed), color: "#22C55E" },
                      { label: "Bounced", value: fmtNum(campaign.bounced), color: "#FBBF24" },
                      { label: "Unsubscribed", value: fmtNum(campaign.unsubscribed), color: "var(--nos-negative)" },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-[9px] text-label-caps mb-0.5" style={{ color: "var(--nos-text-muted)" }}>{s.label}</p>
                        <p className="font-bold" style={{ color: s.color }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Sequence steps */}
                  <p className="text-[9px] text-label-caps mb-2" style={{ color: "var(--nos-text-muted)" }}>Sequence performance by step</p>
                  <div className="space-y-2">
                    {campaign.sequenceSteps.map((step, i) => (
                      <div key={step.step} className="grid gap-2" style={{ gridTemplateColumns: "60px 1fr 1fr 60px 60px" }}>
                        <span className="text-[10px] font-semibold pt-1" style={{ color: "var(--nos-text-muted)" }}>{step.step}</span>
                        {/* Open bar */}
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>Opened</span>
                            <span className="text-[9px] font-semibold" style={{ color: "#0EA5E9" }}>{step.openRate.toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-surface)" }}>
                            <div className="h-full rounded-full" style={{ width: `${step.openRate}%`, background: "#0EA5E9", opacity: 0.8 }} />
                          </div>
                        </div>
                        {/* Reply bar */}
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>Replied</span>
                            <span className="text-[9px] font-semibold" style={{ color: "#22C55E" }}>{step.replyRate.toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-surface)" }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.min(step.replyRate * 6, 100)}%`, background: "#22C55E", opacity: 0.8 }} />
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-right pt-1" style={{ color: "var(--nos-text-secondary)" }}>{fmtNum(step.sent)}</span>
                        <span className="text-[10px] font-mono text-right pt-1" style={{ color: "var(--nos-text-muted)" }}>sent</span>
                      </div>
                    ))}
                  </div>

                  {/* Mini trend chart */}
                  <div className="mt-4">
                    <p className="text-[9px] text-label-caps mb-2" style={{ color: "var(--nos-text-muted)" }}>Last 7 days activity</p>
                    <div style={{ height: 80 }}>
                      <ResponsiveContainer width="100%" height={80}>
                        <AreaChart data={campaign.trend} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
                          <XAxis dataKey="date" tick={{ fill: "var(--nos-text-muted)", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(8)} />
                          <YAxis hide />
                          <Tooltip content={<ChartTip />} />
                          <Area type="monotone" dataKey="sent" name="Sent" stroke="#0EA5E9" fill="rgba(14,165,233,0.1)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                          <Area type="monotone" dataKey="opens" name="Opens" stroke="#22C55E" fill="rgba(34,197,94,0.08)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                          <Area type="monotone" dataKey="replies" name="Replies" stroke="#A78BFA" fill="rgba(167,139,250,0.08)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Inbox health card ──────────────────────────────────────────────────────
function InboxHealthCard({ inbox }: { inbox: InboxHealth }) {
  const statusCfg = {
    healthy:  { color: "#22C55E", label: "Healthy",  icon: <Shield size={11} /> },
    warming:  { color: "#FBBF24", label: "Warming",  icon: <Flame size={11} /> },
    "at-risk":{ color: "#FF4455", label: "At Risk",  icon: <AlertTriangle size={11} /> },
  }[inbox.status];

  return (
    <div className="rounded-xl p-3.5" style={{ background: "var(--nos-bg-elevated)", border: "1px solid var(--border)" }}>
      {/* Email + status */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-medium truncate max-w-[160px]" style={{ color: "var(--nos-text-primary)" }}>{inbox.email}</p>
        <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: `${statusCfg.color}18`, color: statusCfg.color, border: `1px solid ${statusCfg.color}30` }}>
          {statusCfg.icon}{statusCfg.label}
        </span>
      </div>

      {/* Score gauges */}
      <div className="space-y-2">
        {[
          { label: "Deliverability", value: inbox.deliverabilityScore, color: "#22C55E" },
          { label: "Warmup Score",   value: inbox.warmupScore,        color: "#0EA5E9" },
        ].map((g) => (
          <div key={g.label}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>{g.label}</span>
              <span className="text-[10px] font-bold" style={{ color: g.color, fontFamily: "var(--font-geist-mono)" }}>{g.value}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-surface)" }}>
              <div className="h-full rounded-full" style={{ width: `${g.value}%`, background: g.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between mt-2.5 text-[9px]" style={{ color: "var(--nos-text-muted)" }}>
        <span>Spam score: <strong style={{ color: inbox.spamScore > 3 ? "var(--nos-negative)" : "var(--nos-positive)" }}>{inbox.spamScore.toFixed(1)}</strong></span>
        <span><Flame size={9} className="inline mr-0.5" style={{ color: "#FBBF24" }} />{inbox.daysWarmedUp}d warmed</span>
      </div>
    </div>
  );
}

// ── Email Tab ──────────────────────────────────────────────────────────────
function EmailTab() {
  const { outreach } = useClientData();

  return (
    <div className="space-y-6">
      {/* Master KPI strip — Instantly.ai style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard label="Total Sent"     value={outreach.totalSent.value}         change={outreach.totalSent.change}         sparkline={outreach.totalSent.sparkline}         tooltip="Total emails sent across all active and recently completed campaigns." />
        <KPICard label="Open Rate"      value={outreach.openRate.value}           change={outreach.openRate.change}           sparkline={outreach.openRate.sparkline}           suffix="%" tooltip="Average open rate across all campaigns — unique opens ÷ delivered." />
        <KPICard label="Click Rate"     value={outreach.clickRate.value}          change={outreach.clickRate.change}          sparkline={outreach.clickRate.sparkline}          suffix="%" tooltip="Average click-through rate across campaigns." />
        <KPICard label="Reply Rate"     value={outreach.replyRate.value}          change={outreach.replyRate.change}          sparkline={outreach.replyRate.sparkline}          suffix="%" tooltip="Average reply rate — any reply ÷ sent." />
        <KPICard label="Opportunities"  value={outreach.opportunitiesCount.value} change={outreach.opportunitiesCount.change} sparkline={outreach.opportunitiesCount.sparkline} tooltip="Positive replies flagged as sales opportunities in the connected CRM." />
      </div>

      {/* Master trend chart — Sent / Opens / Unique Opens / Replies */}
      <DashboardCard title="Campaign Activity" subtitle="Sent · Opens · Unique opens · Replies over time" info="Master trend across all active campaigns — shows your overall email engine health over time.">
        <div style={{ height: 220, marginTop: 12 }}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={outreach.masterTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => fmtNum(v)} />
              <Tooltip content={<ChartTip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "var(--nos-text-muted)" }} />
              <Area type="monotone" dataKey="sent"        name="Sent"         stroke="#0EA5E9" fill="rgba(14,165,233,0.12)"  strokeWidth={2}   dot={false} isAnimationActive={false} />
              <Area type="monotone" dataKey="opens"       name="Total Opens"  stroke="#FBBF24" fill="rgba(251,191,36,0.08)"  strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Area type="monotone" dataKey="uniqueOpens" name="Unique Opens" stroke="#22C55E" fill="rgba(34,197,94,0.07)"   strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Area type="monotone" dataKey="replies"     name="Replies"      stroke="#A78BFA" fill="rgba(167,139,250,0.07)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Two funnels side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Email engagement funnel — Instantly.ai style */}
        <DashboardCard
          title="Email Engagement Funnel"
          subtitle="Contacted → Opened → Clicked → Replied → Meetings → Opps"
          info="Step-by-step email funnel showing how prospects convert through each engagement stage. Each row shows absolute count and conversion rate vs. the previous step."
        >
          <div className="mt-4 space-y-1.5">
            {outreach.emailFunnel.map((step, i) => {
              const maxW = outreach.emailFunnel[0].count;
              const barPct = (step.count / maxW) * 100;
              return (
                <div key={step.stage}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 ml-[108px] mb-1">
                      <div className="h-3 w-px" style={{ background: "var(--border)" }} />
                      <span className="text-[9px] font-semibold" style={{ color: "var(--nos-text-muted)" }}>↓ {step.rate.toFixed(1)}% converted</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-medium w-[100px] shrink-0 text-right" style={{ color: "var(--nos-text-muted)" }}>{step.stage}</span>
                    <div className="flex-1 relative h-8 rounded-lg overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                      <div
                        className="h-full rounded-lg flex items-center justify-between px-3 transition-all duration-700"
                        style={{ width: `${barPct}%`, background: `${step.color}22`, borderLeft: `3px solid ${step.color}` }}
                      >
                        <span className="text-xs font-bold" style={{ color: step.color, fontFamily: "var(--font-geist-mono)", whiteSpace: "nowrap" }}>
                          {fmtNum(step.count)}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold w-12 text-right shrink-0" style={{ color: step.color }}>
                      {i === 0 ? "100%" : `${step.rate.toFixed(1)}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardCard>

        {/* CRM pipeline funnel — Pipeline CRM Deals Analysis style */}
        <DashboardCard
          title="Sales Pipeline Funnel"
          subtitle="Deal stages · Pipeline value · Deal count"
          info="CRM pipeline funnel showing deal value at each stage. The funnel shape visualises how opportunities narrow from top-of-funnel to close."
        >
          <div className="mt-3 flex gap-4">
            {/* Funnel shape */}
            <div className="flex-1 flex flex-col items-center gap-0.5">
              {outreach.crmPipelineFunnel.map((stage, i) => {
                const minW = 30;
                const w = minW + stage.pct * (100 - minW) / 100;
                return (
                  <div key={stage.stage} className="w-full flex flex-col items-center">
                    {i > 0 && <div className="h-1 w-1 rounded-full mb-0.5" style={{ background: "var(--border)" }} />}
                    <div
                      className="rounded-sm flex items-center justify-center transition-all duration-500"
                      style={{ width: `${w}%`, height: 28, background: `${stage.color}22`, border: `1px solid ${stage.color}55` }}
                    >
                      <span className="text-[10px] font-bold" style={{ color: stage.color }}>{stage.pct.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right-side value table */}
            <div className="shrink-0 w-[160px] flex flex-col justify-around py-0.5">
              {outreach.crmPipelineFunnel.map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: stage.color }} />
                    <span className="text-[10px] font-medium truncate" style={{ color: "var(--nos-text-secondary)" }}>{stage.stage}</span>
                  </div>
                  <div className="text-right ml-2 shrink-0">
                    <p className="text-[10px] font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: stage.stage === "Won" ? "var(--nos-positive)" : stage.stage === "Lost" ? "var(--nos-negative)" : "var(--nos-text-primary)" }}>
                      {fmtMoney(stage.value)}
                    </p>
                    <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>{stage.deals} deals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Campaign table with expandable steps */}
      <DashboardCard title="Campaigns" subtitle="Click a row to see step-by-step breakdown" info="Each campaign shows overall rates. Expand to see sequence step performance — where prospects open, reply, or drop off.">
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Campaign", "Contacted", "Open Rate", "Reply Rate", "+Reply Rate", "Bounce", "Pipeline"].map((h) => (
                  <th key={h} className={`pb-2 text-label-caps ${h === "Pipeline" ? "text-right" : "text-center"} ${h === "Campaign" ? "text-left pr-4" : "pr-4"}`} style={{ color: "var(--nos-text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outreach.emailCampaigns.map((c) => (
                <CampaignRow key={c.id} campaign={c} />
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* Inbox health + Top subject lines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="Inbox Deliverability" subtitle="Per-account warmup health · spam score · blacklist" info="Instantly.ai-style per-inbox health monitoring. Deliverability score, warmup progress, SpamAssassin score, and blacklist status for each sending account.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {outreach.inboxHealth.map((inbox) => (
              <InboxHealthCard key={inbox.email} inbox={inbox} />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Top Subject Lines" subtitle="Ranked by reply rate" info="Subject lines that generated the highest reply rates across all campaigns. Use these patterns for future sequences.">
          <div className="space-y-3 mt-3">
            {outreach.topSubjectLines.map((sl, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs font-bold mt-0.5 w-4 shrink-0" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-accent)" }}>{i + 1}</span>
                <div className="flex-1">
                  <p className="text-xs leading-relaxed mb-1.5" style={{ color: "var(--nos-text-primary)" }}>{sl.subject}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(sl.replyRate / 40) * 100}%`, background: "var(--nos-positive)" }} />
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color: "var(--nos-positive)" }}>{sl.replyRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

// ── Salesloft Sankey Flow Chart ───────────────────────────────────────────
function SankeyFlowChart({ flow }: { flow: SalesloftData["dealFlow"] }) {
  const W = 560;
  const H = 260;
  const BAR_W = 14;
  const LEFT_X = 110;
  const RIGHT_X = W - 110;
  const GAP = 5;

  const total = Math.max(
    flow.sources.reduce((a, s) => a + s.value, 0),
    flow.destinations.reduce((a, d) => a + d.value, 0),
  );

  // Build rects
  let y = 0;
  const srcRects = flow.sources.map((s) => {
    const h = Math.max(6, (s.value / total) * (H - GAP * (flow.sources.length - 1)));
    const r = { ...s, y, h };
    y += h + GAP;
    return r;
  });

  y = 0;
  const dstRects = flow.destinations.map((d) => {
    const h = Math.max(6, (d.value / total) * (H - GAP * (flow.destinations.length - 1)));
    const r = { ...d, y, h };
    y += h + GAP;
    return r;
  });

  // Track used offsets per source/dest for band placement
  const srcOffset: Record<string, number> = {};
  const dstOffset: Record<string, number> = {};
  srcRects.forEach((s) => (srcOffset[s.label] = 0));
  dstRects.forEach((d) => (dstOffset[d.label] = 0));

  const bands: { d: string; color: string; opacity: number }[] = [];
  for (const link of flow.links) {
    const src = srcRects.find((s) => s.label === link.from);
    const dst = dstRects.find((d) => d.label === link.to);
    if (!src || !dst) continue;
    const srcH = (link.value / total) * (H - GAP * (flow.sources.length - 1));
    const dstH = (link.value / total) * (H - GAP * (flow.destinations.length - 1));
    const y0 = src.y + srcOffset[src.label];
    const y1 = dst.y + dstOffset[dst.label];
    srcOffset[src.label] += srcH;
    dstOffset[dst.label] += dstH;
    const x0 = LEFT_X + BAR_W;
    const x1 = RIGHT_X;
    const cx = (x0 + x1) / 2;
    const pathD = `M${x0},${y0} C${cx},${y0} ${cx},${y1} ${x1},${y1} L${x1},${y1 + dstH} C${cx},${y1 + dstH} ${cx},${y0 + srcH} ${x0},${y0 + srcH} Z`;
    bands.push({ d: pathD, color: src.color, opacity: 0.22 });
  }

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* Bands */}
      {bands.map((b, i) => (
        <path key={i} d={b.d} fill={b.color} opacity={b.opacity} />
      ))}
      {/* Source bars */}
      {srcRects.map((s) => (
        <g key={s.label}>
          <rect x={LEFT_X} y={s.y} width={BAR_W} height={s.h} rx={3} fill={s.color} />
          <text x={LEFT_X - 6} y={s.y + s.h / 2 + 4} textAnchor="end" fontSize={9} fill="var(--nos-text-muted)" fontFamily="var(--font-geist-mono)">{s.label}</text>
          <text x={LEFT_X - 6} y={s.y + s.h / 2 + 14} textAnchor="end" fontSize={8} fill={s.color} fontFamily="var(--font-geist-mono)">{fmtMoney(s.value)}</text>
        </g>
      ))}
      {/* Dest bars */}
      {dstRects.map((d) => (
        <g key={d.label}>
          <rect x={RIGHT_X} y={d.y} width={BAR_W} height={d.h} rx={3} fill={d.color} />
          <text x={RIGHT_X + BAR_W + 6} y={d.y + d.h / 2 + 4} textAnchor="start" fontSize={9} fill="var(--nos-text-muted)" fontFamily="var(--font-geist-mono)">{d.label}</text>
          <text x={RIGHT_X + BAR_W + 6} y={d.y + d.h / 2 + 14} textAnchor="start" fontSize={8} fill={d.color} fontFamily="var(--font-geist-mono)">{fmtMoney(d.value)}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Outcome Gauge ─────────────────────────────────────────────────────────
function OutcomeGauge({ label, current, goal, projection, unit, color, byRep }: SalesloftData["outcomes"][0]) {
  const pct = Math.min(100, (current / goal) * 100);
  const projPct = Math.min(100, (projection / goal) * 100);
  const r = 38;
  const circ = 2 * Math.PI * r;
  const angle = (pct / 100) * circ;
  const projAngle = (projPct / 100) * circ;
  const fmt = unit === "money" ? fmtMoney : fmtNum;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        {/* Gauge */}
        <div className="relative shrink-0">
          <svg width={100} height={100} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={r} fill="none" stroke="var(--nos-bg-elevated)" strokeWidth={7} />
            {/* Projection arc (lighter) */}
            <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={7} strokeOpacity={0.25}
              strokeDasharray={`${projAngle} ${circ - projAngle}`} strokeLinecap="round"
              transform="rotate(-90 50 50)" />
            {/* Current arc */}
            <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={7}
              strokeDasharray={`${angle} ${circ - angle}`} strokeLinecap="round"
              transform="rotate(-90 50 50)" />
            <text x={50} y={46} textAnchor="middle" fontSize={13} fontWeight="700" fill="var(--nos-text-primary)" fontFamily="var(--font-geist-mono)">
              {fmt(current)}
            </text>
            <text x={50} y={58} textAnchor="middle" fontSize={8} fill="var(--nos-text-muted)">
              of {fmt(goal)}
            </text>
          </svg>
        </div>
        {/* Rep breakdown */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {byRep.map((r) => {
            const barPct = (r.value / byRep[0].value) * 100;
            return (
              <div key={r.name} className="flex items-center gap-2">
                <span className="text-[9px] font-mono w-6 shrink-0" style={{ color: "var(--nos-text-muted)" }}>{r.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                  <div className="h-full rounded-full" style={{ width: `${barPct}%`, background: color }} />
                </div>
                <span className="text-[9px] font-mono w-10 text-right shrink-0" style={{ color: "var(--nos-text-secondary)" }}>{fmt(r.value)}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold" style={{ color: "var(--nos-text-primary)" }}>{label}</p>
        <p className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>
          Proj: <span style={{ color }}>{fmt(projection)}</span>
        </p>
      </div>
    </div>
  );
}

// ── LinkedIn Tab ───────────────────────────────────────────────────────────
function LinkedInTab() {
  const { outreach } = useClientData();
  const sl = outreach.salesloft;
  const cm = sl.cadenceMetrics;

  return (
    <div className="space-y-5">

      {/* ── Rhythm AI + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rhythm workspace */}
        <DashboardCard
          title="Today's Rhythm"
          subtitle="Conductor AI prioritized actions"
          info="Salesloft Rhythm AI surfaces the highest-priority actions daily based on live prospect signals — contract views, email opens, LinkedIn activity."
          className="lg:col-span-1"
        >
          <div className="mt-3 space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[34px] font-black leading-none" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-accent)" }}>
                  {sl.rhythm.prioritizedActions}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--nos-text-muted)" }}>Prioritized actions</p>
              </div>
              <div className="h-10 w-px" style={{ background: "var(--border)" }} />
              <div className="text-center">
                <p className="text-[28px] font-bold leading-none" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-positive)" }}>
                  {sl.rhythm.completed}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--nos-text-muted)" }}>Completed</p>
              </div>
            </div>
            <div className="rounded-lg p-3 space-y-2" style={{ background: "var(--nos-bg-elevated)" }}>
              <p className="text-[10px] font-semibold text-label-caps" style={{ color: "var(--nos-text-muted)" }}>Today & Overdue — prioritized by Conductor AI</p>
              {[
                { icon: "📄", title: "DocuSign: Contract Viewed by Kylie Watson", sub: "Spectrocall · $300K · Negotiation", score: 82, time: "Today" },
                { icon: "📊", title: "Cross-Sell: Health Score from Yellow to Green", sub: "Newsaro · $55K · Qualification", score: 80, time: "Today" },
                { icon: "💬", title: "Respond to Dylan Jones", sub: "Replied to email on Aug 29, 2024", score: 79, time: "Yesterday" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <span className="text-sm mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium leading-tight truncate" style={{ color: "var(--nos-text-primary)" }}>{item.title}</p>
                    <p className="text-[9px] mt-0.5 truncate" style={{ color: "var(--nos-text-muted)" }}>{item.sub}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border" style={{ borderColor: item.score > 80 ? "var(--nos-positive)" : "var(--nos-accent)", color: item.score > 80 ? "var(--nos-positive)" : "var(--nos-accent)" }}>{item.score}</span>
                    <span className="text-[8px]" style={{ color: "var(--nos-text-muted)" }}>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        {/* All Activities trend */}
        <DashboardCard
          title="All Activities"
          subtitle={`${fmtNum(sl.rhythm.allActivitiesMonth)} this month`}
          info="Total sales activities (calls, emails, LinkedIn steps, integrations) logged this month with daily trend."
          className="lg:col-span-2"
        >
          <div className="mt-2" style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={sl.rhythm.activityTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 9 }}
                  tickFormatter={(v: string) => v.slice(5)} interval="preserveStartEnd" />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Activities" fill="#6366F1" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* ── Outcomes gauges ── */}
      <DashboardCard title="Outcomes" subtitle="This quarter vs goal · with projection" info="Salesloft Outcomes view — Opportunities Created, Weighted Pipeline, and Closed Won vs target. Projection uses current pace extrapolated to period end.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 divide-x" style={{ borderColor: "var(--border)" }}>
          {sl.outcomes.map((o) => (
            <div key={o.label} className="px-2 first:pl-0 last:pr-0">
              <OutcomeGauge {...o} />
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* ── Analytics 2×2 grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Call Results */}
        <DashboardCard title="Call Results" subtitle="Total calls logged this period" info="Cadence call analytics — total calls logged, voicemails, live conversations, and positive outcomes.">
          <div className="mt-2 flex gap-4">
            <div className="shrink-0">
              <p className="text-[28px] font-black leading-none" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{fmtNum(cm.callsLogged)}</p>
              <div className="mt-1" style={{ height: 48 }}>
                <ResponsiveContainer width={100} height={48}>
                  <AreaChart data={cm.callTrend.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <Area type="monotone" dataKey="v" stroke="#6366F1" fill="#6366F118" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: "Total Calls Logged", value: fmtNum(cm.callsLogged), chg: cm.callChangePct },
                { label: "Avg Calls Per Day", value: fmtNum(cm.callsPerDay), chg: cm.callChangePct },
                { label: "Voicemails", value: fmtNum(cm.voicemails), chg: 6 },
                { label: "Conversations", value: fmtNum(cm.conversations), chg: 8 },
                { label: "Positive Conversations", value: fmtNum(cm.positiveConversations), chg: 10 },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between py-0.5 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>{r.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold" style={{ color: "var(--nos-text-primary)" }}>{r.value}</span>
                    <span className="text-[9px] font-semibold" style={{ color: r.chg >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}>
                      {r.chg >= 0 ? "+" : ""}{r.chg}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        {/* Email Results */}
        <DashboardCard title="Email Results — Cadence & One-off" subtitle="Total emails sent this period" info="Email cadence analytics — personalization rate, open rate, click rate, and reply rate across all cadences and one-off sends.">
          <div className="mt-2 flex gap-4">
            <div className="shrink-0">
              <p className="text-[28px] font-black leading-none" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{fmtNum(cm.emailsSent)}</p>
              <div className="mt-1" style={{ height: 48 }}>
                <ResponsiveContainer width={100} height={48}>
                  <AreaChart data={cm.emailTrend.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <Area type="monotone" dataKey="v" stroke="#8B5CF6" fill="#8B5CF618" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: "% Personalized", value: `${cm.pctPersonalized}%`, chg: 7 },
                { label: "% Opened", value: `${cm.pctOpened}%`, chg: 7 },
                { label: "% Clicked", value: `${cm.pctClicked}%`, chg: 11 },
                { label: "% Replied", value: `${cm.pctReplied}%`, chg: cm.emailChangePct },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between py-0.5 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>{r.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold" style={{ color: "var(--nos-text-primary)" }}>{r.value}</span>
                    <span className="text-[9px] font-semibold" style={{ color: r.chg >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}>
                      {r.chg >= 0 ? "+" : ""}{r.chg}%
                    </span>
                  </div>
                </div>
              ))}
              {/* Email personalization bar chart visual */}
              <div className="mt-2 flex items-end gap-1 h-10">
                {[5, 15, 28, 32, 12, 8].map((v, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / 32) * 100}%`, background: i < 3 ? "#6366F1" : "#8B5CF6", opacity: 0.6 + i * 0.06 }} />
                ))}
              </div>
              <p className="text-[8px]" style={{ color: "var(--nos-text-muted)" }}>Personalization distribution</p>
            </div>
          </div>
        </DashboardCard>

        {/* Account Activity */}
        <DashboardCard title="Account Activity" subtitle="Total touches this period" info="Combined account-level touch activity — includes calls, emails, LinkedIn steps, and integration touchpoints across all active accounts.">
          <div className="mt-2 space-y-3">
            <div className="flex items-end gap-3">
              <div>
                <p className="text-[28px] font-black leading-none" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{fmtNum(cm.totalTouches)}</p>
                <p className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>Total Touches</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[20px] font-bold leading-none" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-positive)" }}>{fmtNum(cm.totalMeetings)}</p>
                <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>Meetings <span style={{ color: "var(--nos-positive)" }}>+{cm.meetingChangePct}%</span></p>
              </div>
              <div className="text-right">
                <p className="text-[20px] font-bold leading-none" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-accent)" }}>{cm.effectivenessScore}</p>
                <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>Eff. Score <span style={{ color: "var(--nos-accent)" }}>+{cm.effectivenessChangePct}%</span></p>
              </div>
            </div>
            {/* Activity by cadence stacked bars */}
            {[
              { label: "Inbound Hot L...", calls: 46, emails: 60, li: 32, other: 14 },
              { label: "TMENT Main P...", calls: 38, emails: 52, li: 28, other: 12 },
              { label: "Q1 – EMEA SMB", calls: 28, emails: 38, li: 20, other: 9 },
              { label: "Q2 – 2021 S...", calls: 22, emails: 30, li: 15, other: 7 },
              { label: "Sales Leader C...", calls: 16, emails: 22, li: 10, other: 5 },
            ].map((row) => {
              const total = row.calls + row.emails + row.li + row.other;
              return (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="text-[9px] w-28 shrink-0 truncate" style={{ color: "var(--nos-text-muted)" }}>{row.label}</span>
                  <div className="flex-1 h-3 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(row.calls / total) * 100}%`, background: "#6366F1" }} />
                    <div style={{ width: `${(row.emails / total) * 100}%`, background: "#8B5CF6" }} />
                    <div style={{ width: `${(row.li / total) * 100}%`, background: "#0A66C2" }} />
                    <div style={{ width: `${(row.other / total) * 100}%`, background: "#64748B" }} />
                  </div>
                  <span className="text-[9px] font-mono w-8 text-right shrink-0" style={{ color: "var(--nos-text-secondary)" }}>{total}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-3 pt-1">
              {[{ color: "#6366F1", label: "Calls" }, { color: "#8B5CF6", label: "Emails" }, { color: "#0A66C2", label: "LinkedIn" }, { color: "#64748B", label: "Other" }].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                  <span className="text-[8px]" style={{ color: "var(--nos-text-muted)" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        {/* LinkedIn Results */}
        <DashboardCard title="LinkedIn Results" subtitle="LinkedIn completed steps" info="LinkedIn-specific cadence step analytics — research, introductions, connection requests, and InMail activity.">
          <div className="mt-2">
            <p className="text-[28px] font-black leading-none mb-3" style={{ fontFamily: "var(--font-geist-mono)", color: "#0A66C2" }}>{fmtNum(cm.linkedinSteps)}</p>
            <div style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart
                  data={[
                    { name: "Research", value: cm.linkedinResearch, fill: "#0A66C2" },
                    { name: "Intros", value: cm.linkedinIntroductions, fill: "#1D6FB8" },
                    { name: "Connects", value: cm.linkedinConnections, fill: "#2E77AE" },
                    { name: "InMail", value: cm.linkedinInMail, fill: "#3F7FA4" },
                  ]}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 9 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--nos-text-muted)", fontSize: 9 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Steps" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                    {["#0A66C2", "#1D6FB8", "#2E77AE", "#3F7FA4"].map((fill, i) => (
                      <Cell key={i} fill={fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {[
                { label: "LinkedIn Research", value: cm.linkedinResearch, chg: -28 },
                { label: "LinkedIn Introductions", value: cm.linkedinIntroductions, chg: -24 },
                { label: "LinkedIn Connections", value: cm.linkedinConnections, chg: -25 },
                { label: "LinkedIn InMail", value: cm.linkedinInMail, chg: -15 },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>{r.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold" style={{ color: "var(--nos-text-secondary)" }}>{fmtNum(r.value)}</span>
                    <span className="text-[9px]" style={{ color: r.chg >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}>{r.chg >= 0 ? "+" : ""}{r.chg}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* ── Content Performance — Cadences ── */}
      <DashboardCard
        title="Content Performance — Cadences"
        subtitle="Cadence results · Steps · Plays · Templates"
        info="Salesloft Content Performance view — per-cadence results showing opportunities created, meetings booked, successes, and effectiveness score."
      >
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Cadence", "Opportunities", "Meetings", "Successes", "Eff. Score", "Δ Opp"].map((h, i) => (
                  <th key={h} className={`pb-2 text-label-caps ${i === 0 ? "text-left pr-4" : "text-right pr-4"}`} style={{ color: "var(--nos-text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sl.topCadences.map((c) => (
                <tr key={c.name} className="border-b last:border-0 transition-colors"
                  style={{ borderColor: "var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--nos-bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="py-2.5 pr-4 text-xs font-medium max-w-[180px] truncate" style={{ color: "var(--nos-text-primary)" }}>{c.name}</td>
                  <td className="py-2.5 pr-4 text-xs text-right font-mono" style={{ color: "var(--nos-text-secondary)" }}>{fmtNum(c.opportunities)}</td>
                  <td className="py-2.5 pr-4 text-xs text-right font-mono" style={{ color: "var(--nos-text-secondary)" }}>{fmtNum(c.meetings)}</td>
                  <td className="py-2.5 pr-4 text-xs text-right font-mono font-semibold" style={{ color: "var(--nos-positive)" }}>{fmtNum(c.successes)}</td>
                  <td className="py-2.5 pr-4 text-xs text-right">
                    <span className="font-bold font-mono" style={{ color: "var(--nos-accent)" }}>{c.effectivenessScore.toFixed(1)}</span>
                    <span className="text-[9px] ml-0.5" style={{ color: "var(--nos-text-muted)" }}>/10</span>
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-right">
                    <span style={{ color: c.oppChangePct >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}>
                      {c.oppChangePct >= 0 ? "↑" : "↓"} {Math.abs(c.oppChangePct)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* ── Top Reps ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="Top Reps by Outcomes" subtitle="Successes · Meetings · Opportunities" info="Rankings by cadence outcomes — successes closed, meetings booked, and opportunities created per rep this period.">
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["Rep", "Successes", "Meetings", "Opps"].map((h, i) => (
                    <th key={h} className={`pb-2 text-label-caps ${i === 0 ? "text-left pr-4" : "text-right pr-3"}`} style={{ color: "var(--nos-text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sl.topReps.map((rep, i) => (
                  <tr key={rep.name} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="py-2 pr-4 text-xs font-medium" style={{ color: "var(--nos-text-primary)" }}>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0" style={{ background: "var(--nos-bg-elevated)", color: "var(--nos-accent)" }}>{i + 1}</span>
                        {rep.name}
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-xs text-right font-mono font-semibold" style={{ color: "var(--nos-positive)" }}>{fmtNum(rep.successes)}</td>
                    <td className="py-2 pr-3 text-xs text-right font-mono" style={{ color: "var(--nos-text-secondary)" }}>{fmtNum(rep.meetings)}</td>
                    <td className="py-2 text-xs text-right font-mono" style={{ color: "var(--nos-accent)" }}>{fmtNum(rep.opportunities)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard title="Top Reps by Activity" subtitle="Emails · Calls · Integration Steps" info="Activity volume per rep — total emails sent, calls logged, and integration steps completed. High activity reps who may need coaching on quality.">
          <div className="mt-3 space-y-2">
            {sl.topReps.map((rep, i) => {
              const max = sl.topReps[0].totalActivity;
              return (
                <div key={rep.name} className="flex items-center gap-3">
                  <span className="text-[9px] font-bold w-4 shrink-0" style={{ color: "var(--nos-text-muted)" }}>{i + 1}</span>
                  <span className="text-[10px] w-28 shrink-0 truncate" style={{ color: "var(--nos-text-secondary)" }}>{rep.name}</span>
                  <div className="flex-1 flex h-4 rounded-full overflow-hidden gap-px">
                    <div style={{ width: `${(rep.emailsSent / max) * 80}%`, background: "#8B5CF6", minWidth: 2 }} className="rounded-l-full" />
                    <div style={{ width: `${(rep.callsLogged / max) * 60}%`, background: "#F59E0B", minWidth: 2 }} />
                    <div style={{ width: `${(rep.integrationSteps / max) * 40}%`, background: "#0A66C2", minWidth: 2 }} className="rounded-r-full" />
                  </div>
                  <span className="text-[9px] font-mono w-10 text-right shrink-0" style={{ color: "var(--nos-text-muted)" }}>{fmtNum(rep.totalActivity)}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-3 pt-1">
              {[{ color: "#8B5CF6", label: "Emails" }, { color: "#F59E0B", label: "Calls" }, { color: "#0A66C2", label: "Integration" }].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: l.color }} />
                  <span className="text-[8px]" style={{ color: "var(--nos-text-muted)" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* ── Deals Flow Chart (Sankey-style) ── */}
      <DashboardCard
        title="Deals Flow Chart"
        subtitle={`${sl.dealFlow.startPeriod} → ${sl.dealFlow.endPeriod} · ${fmtMoney(sl.dealFlow.startTotal)} → ${fmtMoney(sl.dealFlow.endTotal)} (↑${fmtMoney(sl.dealFlow.delta)})`}
        info="Sankey-style pipeline flow showing how deal value moves from pipeline stages (Pipeline, Best Case, Commit, Pulled In, New) into outcomes (Won, Idle, Pushed Out, Lost) over the period."
      >
        <div className="mt-4 px-2">
          <SankeyFlowChart flow={sl.dealFlow} />
        </div>
        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          {sl.dealFlow.destinations.map((d) => (
            <div key={d.label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.color }} />
              <span className="text-[10px] font-medium" style={{ color: "var(--nos-text-secondary)" }}>{d.label}</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: d.color }}>{fmtMoney(d.value)}</span>
            </div>
          ))}
        </div>
      </DashboardCard>

    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────
type OutreachTab = "email" | "linkedin";
interface ColdOutreachProps { tab?: OutreachTab; }

export function ColdOutreach({ tab = "email" }: ColdOutreachProps) {
  const { pipelineBridge } = useClientData();

  return (
    <div className="space-y-6">
      <PipelineBridge attributed={pipelineBridge.attributed} deals={pipelineBridge.deals} velocity={pipelineBridge.velocity} section="Cold Outreach" info="Pipeline influenced by cold outreach sequences — email and LinkedIn — in the selected period." />
      <SectionSubTabs tabs={OUTREACH_TABS} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
          {tab === "email"    && <EmailTab />}
          {tab === "linkedin" && <LinkedInTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
