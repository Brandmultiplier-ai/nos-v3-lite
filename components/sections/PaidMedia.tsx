"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { useClientData } from "@/lib/data";
import { SectionTLDR } from "@/components/shared/SectionTLDR";
import { PhaseSecondaryKPI } from "@/components/cards/PhaseSecondaryKPI";
import { ChartAxisLabels } from "@/components/charts/ChartAxisLabels";
import { CardInfoButton } from "@/components/shared/CardInfoButton";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  ChevronUp,
  ChevronDown,
  Minus,
  DollarSign,
  Target,
  Zap,
  Users,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { PaidMediaCampaign } from "@/lib/data/types";
import { formatCompact } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const PLATFORM_COLORS: Record<string, string> = {
  "Meta Ads": "#1877F2",
  "Google Ads": "#4285F4",
  "Google Search": "#4285F4",
  "LinkedIn Ads": "#0A66C2",
  "TikTok Ads": "#FF0050",
  "X Ads": "#1DA1F2",
  "Reddit Ads": "#FF4500",
  "Programmatic ABM": "#8B5CF6",
  "Analyst and Trade Media": "#64748B",
  "G2 & Capterra": "#FF492C",
  "Instagram": "#E1306C",
  "Facebook": "#1877F2",
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}
const fmtNum = formatCompact;

type SortKey = keyof Pick<PaidMediaCampaign, "spend" | "revenue" | "roas" | "conversions" | "cpa" | "cpc">;

function CardHeaderWithInfo({
  title,
  subtitle,
  info,
  trailing,
}: {
  title: string;
  subtitle?: string;
  info: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--nos-text-primary)]">{title}</p>
        {subtitle && <p className="text-xs text-[var(--nos-text-muted)] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {trailing}
        <CardInfoButton description={info} />
      </div>
    </div>
  );
}

/* ─── Hero metric tile (RedTrack style: big number + change + sparkbar) ─── */
function MetricTile({
  label,
  value,
  change,
  prefix = "",
  suffix = "",
  icon: Icon,
  color,
  tooltip,
  invertChange = false,
}: {
  label: string;
  value: number;
  change: number;
  prefix?: string;
  suffix?: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
  tooltip: string;
  /** When true, a negative change is "good" (green) — for lower-is-better metrics (CAC, CPC, CPA). */
  invertChange?: boolean;
}) {
  const isPos = change > 0;
  const isNeg = change < 0;
  // Metric-aware: is this change a good thing?
  const isGood = invertChange ? change < 0 : change > 0;
  const formatted = prefix === "$"
    ? fmt(value).replace("$", "")
    : suffix === "×"
    ? value.toFixed(1)
    : fmtNum(value);

  return (
    <motion.div variants={itemVariants} className="nos-card relative overflow-hidden">
      <div className="absolute top-3 right-3 z-10">
        <CardInfoButton description={tooltip} />
      </div>
      <div className="flex items-start justify-between mb-3 pr-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18` }}
        >
          <Icon size={16} className="shrink-0" style={{ color }} />
        </div>
        <div
          className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: isPos || isNeg
              ? isGood
                ? "rgba(52,211,153,0.1)"
                : "rgba(248,113,113,0.1)"
              : "rgba(251,191,36,0.1)",
            color: isPos || isNeg
              ? isGood
                ? "var(--nos-positive)"
                : "var(--nos-negative)"
              : "var(--nos-neutral)",
          }}
        >
          {isPos ? <ArrowUpRight size={10} /> : isNeg ? <ArrowDownRight size={10} /> : null}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        {prefix === "$" && <span className="text-sm text-[var(--nos-text-muted)]">$</span>}
        <span className="text-2xl font-bold tracking-tight text-[var(--nos-text-primary)]">{formatted}</span>
        {suffix && <span className="text-sm text-[var(--nos-text-muted)]">{suffix}</span>}
      </div>
      <p className="text-[11px] text-[var(--nos-text-muted)] mt-1">{label}</p>
      {/* Subtle color underline bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl" style={{ background: color, opacity: 0.4 }} />
    </motion.div>
  );
}

/* ─── Platform badge ─── */
function PlatformBadge({ platform }: { platform: string }) {
  const color = PLATFORM_COLORS[platform] ?? "#888";
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>{platform}</span>
    </div>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: PaidMediaCampaign["status"] }) {
  if (status === "active")
    return <Badge className="text-[9px] bg-[var(--nos-positive)] bg-opacity-15 text-[var(--nos-positive)] border-[var(--nos-positive)] border-opacity-30">Active</Badge>;
  if (status === "paused")
    return <Badge className="text-[9px] bg-[var(--nos-neutral)] bg-opacity-15 text-[var(--nos-neutral)] border-[var(--nos-neutral)] border-opacity-30">Paused</Badge>;
  return <Badge className="text-[9px] bg-[var(--nos-bg-elevated)] text-[var(--nos-text-muted)] border-[var(--border)]">Completed</Badge>;
}

/* ─── ROAS colour ─── */
function roasColor(roas: number) {
  if (roas >= 4) return "var(--nos-positive)";
  if (roas >= 1) return "var(--nos-neutral)";
  return "var(--nos-negative)";
}

interface SectionProps {
  variant?: "a" | "b" | "c";
}

export function PaidMedia({ variant = "a" }: SectionProps) {
  const data = useClientData();
  const { paidMedia } = data;

  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortAsc, setSortAsc] = useState(false);

  const sortedCampaigns = [...paidMedia.campaigns].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortAsc ? diff : -diff;
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(false); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <Minus size={10} className="text-[var(--nos-text-muted)]" />;
    return sortAsc
      ? <ChevronUp size={10} className="text-[var(--nos-accent)]" />
      : <ChevronDown size={10} className="text-[var(--nos-accent)]" />;
  }

  const spendTrend = paidMedia.spendTrend.map((d) => ({
    ...d,
    dateLabel: d.date.slice(5),
  }));

  const platformBreakdown = paidMedia.platformBreakdown.filter((p) => p.spend > 0);

  /* Radial ROAS data */
  const radialData = platformBreakdown.map((p) => ({
    name: p.platform,
    roas: Math.round(p.roas * 10) / 10,
    fill: PLATFORM_COLORS[p.platform] ?? "#888",
  }));

  /* Top 3 performing campaigns for leaderboard */
  const topCampaigns = [...paidMedia.campaigns]
    .sort((a, b) => b.roas - a.roas)
    .slice(0, 3);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">

      {/* AI TLDR */}
      <motion.div variants={itemVariants}>
        <SectionTLDR tldr={paidMedia.tldr} />
      </motion.div>

      {/* Phase 5 — Realization: LTV:CAC + Advocacy rate */}
      <motion.div variants={itemVariants}>
        <PhaseSecondaryKPI phase={5} pair={data.narrativeIntel.phaseMetrics.phase5} />
      </motion.div>

      {/* ── Row 1: Hero KPI tiles (RedTrack style) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricTile
          label="Total Ad Spend"
          value={paidMedia.totalSpend.value}
          change={paidMedia.totalSpend.change}
          prefix="$"
          icon={DollarSign}
          color="#6366F1"
          tooltip="Total ad spend across all connected paid media platforms in the selected period."
        />
        <MetricTile
          label="Attributed Revenue"
          value={paidMedia.totalRevenue.value}
          change={paidMedia.totalRevenue.change}
          prefix="$"
          icon={TrendingUp}
          color="var(--nos-positive)"
          tooltip="Total revenue attributed to paid media campaigns in the selected period."
        />
        <MetricTile
          label="Blended ROAS"
          value={paidMedia.roas.value}
          change={paidMedia.roas.change}
          suffix="×"
          icon={Target}
          color="#F59E0B"
          tooltip="Return on Ad Spend — total attributed revenue divided by total ad spend across all platforms."
        />
        <MetricTile
          label="Paid CAC"
          value={paidMedia.cac.value}
          change={paidMedia.cac.change}
          prefix="$"
          invertChange
          icon={Users}
          color="#EC4899"
          tooltip="Customer Acquisition Cost from paid media — ad spend divided by new customers acquired from paid campaigns."
        />
      </div>

      {/* ── Row 2: Spend vs Revenue trend + ROAS by platform radial ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Trend chart — 2/3 width */}
        <motion.div variants={itemVariants} className="nos-card md:col-span-2 relative">
          <CardHeaderWithInfo
            title="Spend vs. Revenue"
            subtitle="Rolling trend — ad spend deployed vs. attributed revenue"
            info="Compares daily ad spend deployed against attributed revenue over the selected period. Use this to spot whether spend increases are driving proportional revenue growth."
            trailing={
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 rounded-full inline-block" style={{ background: "#6366F1" }} />
                  <span className="text-[10px] text-[var(--nos-text-muted)]">Spend</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 rounded-full inline-block" style={{ background: "var(--nos-positive)" }} />
                  <span className="text-[10px] text-[var(--nos-text-muted)]">Revenue</span>
                </div>
              </div>
            }
          />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={spendTrend} margin={{ top: 4, right: 6, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="pmSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pmRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--nos-positive)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="var(--nos-positive)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 9, fill: "var(--nos-text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "var(--nos-text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
              <Tooltip
                contentStyle={{ background: "var(--nos-bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [fmt(Number(value)), name === "spend" ? "Ad Spend" : "Revenue"] as [string, string]}
              />
              <Area type="monotone" dataKey="spend" stroke="#6366F1" strokeWidth={2} fill="url(#pmSpend)" dot={false} name="spend" />
              <Area type="monotone" dataKey="revenue" stroke="var(--nos-positive)" strokeWidth={2} fill="url(#pmRevenue)" dot={false} name="revenue" />
            </AreaChart>
          </ResponsiveContainer>
          <ChartAxisLabels xLabel="Date" yLabel="Value (USD)" />
        </motion.div>

        {/* ROAS by platform — 1/3 width */}
        <motion.div variants={itemVariants} className="nos-card flex flex-col relative">
          <CardHeaderWithInfo
            title="ROAS by Platform"
            subtitle="Return on ad spend per channel"
            info="Return on ad spend for each connected platform, ranked relative to the top performer. Values above 4× indicate strong profitability; below 1× means spend exceeds attributed revenue."
          />
          {platformBreakdown.length === 0 ? (
            <p className="text-xs text-[var(--nos-text-muted)] py-8 text-center">No data</p>
          ) : (
            <div className="space-y-2.5 flex-1">
              {platformBreakdown.map((p) => {
                const maxRoas = Math.max(...platformBreakdown.map((x) => x.roas), 1);
                const pct = Math.round((p.roas / maxRoas) * 100);
                return (
                  <div key={p.platform}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                        <span className="text-[10px] text-[var(--nos-text-secondary)]">{p.platform}</span>
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: roasColor(p.roas) }}>
                        {p.roas.toFixed(1)}×
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: p.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Row 3: Platform spend breakdown + Top performing campaigns leaderboard ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Platform spend bar chart */}
        <motion.div variants={itemVariants} className="nos-card relative">
          <CardHeaderWithInfo
            title="Spend by Platform"
            subtitle="Ad spend distribution across connected channels"
            info="Shows how total ad spend is distributed across connected paid media platforms for the selected period. Helps identify budget concentration and reallocation opportunities."
          />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={platformBreakdown} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 9, fill: "var(--nos-text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
              <YAxis type="category" dataKey="platform" tick={{ fontSize: 9, fill: "var(--nos-text-muted)" }} axisLine={false} tickLine={false} width={76} />
              <Tooltip
                contentStyle={{ background: "var(--nos-bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [fmt(Number(value)), "Ad Spend"] as [string, string]}
              />
              <Bar dataKey="spend" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {platformBreakdown.map((p) => (
                  <Cell key={p.platform} fill={PLATFORM_COLORS[p.platform] ?? "#888"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <ChartAxisLabels xLabel="Ad Spend (USD)" yLabel="Platform" />
        </motion.div>

        {/* Campaign leaderboard (Triple Whale / RedTrack style) */}
        <motion.div variants={itemVariants} className="nos-card relative">
          <CardHeaderWithInfo
            title="Top Campaigns by ROAS"
            info="Top three campaigns ranked by ROAS, plus best-performing individual ads by attributed revenue and click-through rate. Use this to identify which campaigns and creatives to scale."
            trailing={<Zap size={14} className="text-[#F59E0B]" />}
          />
          <div className="space-y-3">
            {topCampaigns.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: "var(--nos-bg-elevated)" }}>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold"
                  style={{
                    background: i === 0 ? "rgba(245,158,11,0.15)" : "var(--nos-bg-canvas)",
                    color: i === 0 ? "#F59E0B" : "var(--nos-text-muted)",
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--nos-text-primary)] truncate">{c.name}</p>
                  <PlatformBadge platform={c.platform} />
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold" style={{ color: roasColor(c.roas) }}>{c.roas.toFixed(1)}×</p>
                  <p className="text-[10px] text-[var(--nos-text-muted)]">{fmt(c.revenue)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={13} className="text-[var(--nos-accent)]" />
              <p className="text-xs font-semibold text-[var(--nos-text-primary)]">Best Performing Ads</p>
            </div>
            <div className="space-y-2">
              {paidMedia.bestAds.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] w-4 text-[var(--nos-text-muted)] font-mono shrink-0">{i + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PLATFORM_COLORS[a.platform] ?? "#888" }} />
                  <p className="text-[11px] text-[var(--nos-text-secondary)] flex-1 truncate">{a.name}</p>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-semibold text-[var(--nos-positive)]">{fmt(a.revenue)}</p>
                    <p className="text-[9px] text-[var(--nos-text-muted)]">{a.ctr.toFixed(1)}% CTR</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Row 4: Sortable campaign table ── */}
      <motion.div variants={itemVariants} className="nos-card overflow-x-auto relative">
        <CardHeaderWithInfo
          title="All Campaigns"
          subtitle={`Click a column header to sort · ${paidMedia.campaigns.length} campaigns`}
          info="Full campaign performance table across all connected platforms. Sort by spend, revenue, ROAS, conversions, CPA, or CPC to find top performers or underperforming campaigns to pause."
          trailing={
            <div className="flex items-center gap-2">
              {["active", "paused"].map((s) => {
                const count = paidMedia.campaigns.filter((c) => c.status === s).length;
                return (
                  <Badge
                    key={s}
                    className="text-[9px]"
                    style={{
                      background: s === "active" ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)",
                      color: s === "active" ? "var(--nos-positive)" : "var(--nos-neutral)",
                      border: "none",
                    }}
                  >
                    {count} {s}
                  </Badge>
                );
              })}
            </div>
          }
        />
        <table className="w-full text-xs border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-2 pr-3 text-[var(--nos-text-muted)] font-medium text-[10px] tracking-wide w-[200px]">Campaign</th>
              <th className="text-left py-2 pr-3 text-[var(--nos-text-muted)] font-medium text-[10px] tracking-wide">Platform</th>
              <th className="text-left py-2 pr-3 text-[var(--nos-text-muted)] font-medium text-[10px] tracking-wide">Status</th>
              {(["spend", "revenue", "roas", "conversions", "cpa", "cpc"] as SortKey[]).map((col) => (
                <th
                  key={col}
                  className="text-right py-2 pr-3 text-[var(--nos-text-muted)] font-medium text-[10px] tracking-wide cursor-pointer hover:text-[var(--nos-text-primary)] select-none whitespace-nowrap"
                  onClick={() => handleSort(col)}
                >
                  <span className="flex items-center justify-end gap-1">
                    {col === "spend" ? "Spend" : col === "revenue" ? "Revenue" : col === "roas" ? "ROAS" : col === "conversions" ? "Conversions" : col === "cpa" ? "Cost / Conversion" : col.toUpperCase()}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns.map((c, idx) => (
              <tr
                key={c.id}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--nos-bg-elevated)] transition-colors"
              >
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1 h-8 rounded-full shrink-0"
                      style={{ background: idx < 3 ? "var(--nos-positive)" : "var(--nos-bg-elevated)" }}
                    />
                    <span className="text-[var(--nos-text-primary)] font-medium text-[11px] truncate max-w-[180px] block">{c.name}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-3"><PlatformBadge platform={c.platform} /></td>
                <td className="py-2.5 pr-3"><StatusBadge status={c.status} /></td>
                <td className="py-2.5 pr-3 text-right font-mono text-[11px] text-[var(--nos-text-secondary)]">{fmt(c.spend)}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-[11px] font-semibold text-[var(--nos-positive)]">{fmt(c.revenue)}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-[11px] font-bold" style={{ color: roasColor(c.roas) }}>
                  {c.roas.toFixed(1)}×
                </td>
                <td className="py-2.5 pr-3 text-right text-[11px] text-[var(--nos-text-secondary)]">{fmtNum(c.conversions)}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-[11px] text-[var(--nos-text-secondary)]">{fmt(c.cpa)}</td>
                <td className="py-2.5 text-right font-mono text-[11px] text-[var(--nos-text-secondary)]">${c.cpc.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex flex-wrap items-center gap-4 pt-3 border-t border-[var(--border)]">
          <p className="text-[10px] text-[var(--nos-text-muted)]">
            <span className="font-medium text-[var(--nos-text-secondary)]">X-axis:</span> Campaign name
          </p>
          <p className="text-[10px] text-[var(--nos-text-muted)]">
            <span className="font-medium text-[var(--nos-text-secondary)]">Columns:</span> Spend · Revenue · ROAS · Conversions · Cost / Conversion · CPC
          </p>
        </div>
        <p className="mt-2 text-[10px] text-[var(--nos-text-muted)]">
          Conversions are marketing-qualified actions—demo requests, content downloads, engaged accounts. Paid CAC above reflects closed-won customers sourced by paid.
        </p>
      </motion.div>
    </motion.div>
  );
}
