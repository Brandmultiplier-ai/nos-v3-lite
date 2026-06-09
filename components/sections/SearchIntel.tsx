"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientData } from "@/lib/data";
import { KPICard } from "@/components/cards/KPICard";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { SectionSubTabs } from "@/components/shared/SectionSubTabs";
import { SectionTLDR } from "@/components/shared/SectionTLDR";
import { PhaseSecondaryKPI } from "@/components/cards/PhaseSecondaryKPI";
import { TrendLine } from "@/components/charts/TrendLine";
import { VelocityLine } from "@/components/charts/VelocityLine";
import { NarrativeRadar } from "@/components/charts/NarrativeRadar";
import { SeoTrafficGlobe } from "@/components/charts/SeoTrafficGlobe";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Radar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartAxisLabels } from "@/components/charts/ChartAxisLabels";

const SEARCH_TABS = [
  { id: "seo", label: "SEO", path: "/search/seo" },
  { id: "geo", label: "GEO", path: "/search/geo" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const intentColors: Record<string, string> = {
  informational: "#7C7FFF",
  commercial: "#FBBF24",
  transactional: "#34D399",
};

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
function fmtChange(n: number) {
  const abs = Math.abs(n);
  const s = abs >= 1000 ? `${(abs / 1000).toFixed(1)}K` : String(abs);
  return `${n >= 0 ? "+" : "−"}${s}`;
}

// ── Shared sub-components ─────────────────────────────────────────────────────
function HealthScoreCircle({ score }: { score: number }) {
  const color = score >= 90 ? "var(--nos-positive)" : score >= 70 ? "var(--nos-signal-warm)" : "var(--nos-negative)";
  const r = 28; const circ = 2 * Math.PI * r; const filled = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-label-caps mb-1" style={{ color: "var(--nos-text-muted)" }}>Health</p>
      <svg width={72} height={72}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="var(--nos-bg-elevated)" strokeWidth={6} />
        <motion.circle cx={36} cy={36} r={r} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`} strokeDashoffset={circ / 4}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${filled} ${circ}` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        <text x="36" y="41" textAnchor="middle" style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-geist-mono)", fill: color }}>{score}</text>
      </svg>
    </div>
  );
}
function DRBadge({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-label-caps mb-1" style={{ color: "var(--nos-text-muted)" }}>Domain Rating</p>
      <div className="w-16 h-16 rounded-xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, var(--nos-accent-muted) 0%, rgba(167,139,250,0.06) 100%)", border: "1px solid var(--nos-accent-border)" }}>
        <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-accent)" }}>{value}</span>
      </div>
    </div>
  );
}
function StatCol({ label, value, change, positiveIsGood = true, prefix = "" }: { label: string; value: number; change: number; positiveIsGood?: boolean; prefix?: string }) {
  const isPos = change > 0; const isGood = positiveIsGood ? isPos : !isPos;
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-label-caps" style={{ color: "var(--nos-text-muted)" }}>{label}</p>
      <p className="text-lg font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{prefix}{fmtNum(value)}</p>
      <p className="text-[10px] font-semibold" style={{ color: isGood ? "var(--nos-positive)" : "var(--nos-negative)" }}>
        {isPos ? "+" : ""}{fmtNum(change)}
      </p>
    </div>
  );
}
function KeywordBuckets({ buckets }: { buckets: { bucket: string; label: string; count: number; change: number }[] }) {
  const bucketColors: Record<string, string> = { "1-3": "var(--nos-positive)", "4-10": "var(--nos-accent)", "11-50": "var(--nos-signal-warm)", "51-100": "var(--nos-text-muted)" };
  return (
    <div className="flex gap-3 flex-wrap">
      {buckets.map((b) => {
        const color = bucketColors[b.bucket] ?? "var(--nos-text-muted)";
        const isPos = b.change > 0;
        return (
          <div key={b.bucket} className="flex flex-col items-center min-w-[52px]">
            <span className="text-[10px] font-semibold mb-1" style={{ color: "var(--nos-text-muted)" }}>{b.label}</span>
            <span className="text-base font-bold" style={{ fontFamily: "var(--font-geist-mono)", color }}>{fmtNum(b.count)}</span>
            <span className="text-[10px] font-semibold" style={{ color: isPos ? "var(--nos-positive)" : "var(--nos-negative)" }}>
              {isPos ? "▲" : "▼"}{Math.abs(b.change)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2.5 text-xs space-y-1" style={{ background: "var(--nos-bg-overlay)", border: "1px solid var(--nos-accent-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
      <p className="font-semibold mb-1.5" style={{ color: "var(--nos-text-secondary)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--nos-text-muted)" }}>{p.name}</span>
          <span className="font-bold ml-auto" style={{ color: "var(--nos-text-primary)" }}>{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
};

// ── SEO Tab ───────────────────────────────────────────────────────────────────
function SEOTab() {
  const data = useClientData();
  const { search } = data;
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const highlightedCountry = hoveredCountry ?? activeCountry;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Site overview — Ahrefs style */}
      <motion.div variants={itemVariants}>
        <DashboardCard info="Site-level SEO health metrics: Health Score (crawlability), Domain Rating (backlink authority), organic traffic, keywords, and referring domains.">
          <div className="flex flex-wrap items-start gap-6 md:gap-10">
            <HealthScoreCircle score={search.healthScore} />
            <DRBadge value={search.domainRating} />
            <div className="h-16 w-px hidden md:block self-center" style={{ background: "var(--border)" }} />
            <StatCol label="Organic Traffic" value={search.organicSessions[search.organicSessions.length - 1]?.value ?? 0} change={search.pipelineFromOrganic.change} />
            <StatCol label="Traffic Value" value={search.trafficValue.value} change={search.trafficValue.change} prefix="$" />
            <StatCol label="Organic Keywords" value={search.organicKeywordsTotal.value} change={search.organicKeywordsTotal.change} />
            <StatCol label="Backlinks" value={search.backlinks.value} change={search.backlinks.change} />
            <StatCol label="Referring Domains" value={search.referringDomains.value} change={search.referringDomains.change} />
            <div className="h-16 w-px hidden lg:block self-center" style={{ background: "var(--border)" }} />
            <div className="flex flex-col gap-1.5">
              <p className="text-label-caps" style={{ color: "var(--nos-text-muted)" }}>Tracked Keywords</p>
              <KeywordBuckets buckets={search.keywordBuckets} />
            </div>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 nos-card">
          <TrendLine data={search.organicSessions} title="Organic Traffic" subtitle="Monthly sessions from organic search" color="var(--nos-accent)" height={200} xAxisLabel="Month" yAxisLabel="Organic sessions" />
        </div>
        <div className="nos-card">
          <TrendLine data={search.referringDomainsTrend} title="Referring Domains" subtitle="Unique domains linking to you" color="var(--nos-positive)" height={200} xAxisLabel="Month" yAxisLabel="Referring domains" />
        </div>
      </motion.div>

      {/* Keywords + Intent */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardCard title="Top Keywords" subtitle="Ranking · Volume · Position change · Intent" info="Tracked keywords sorted by ranking. Position changes vs. prior period shown as ▲▼.">
            <div className="scroll-fade-bottom max-h-80 overflow-y-auto mt-3">
              <table className="w-full text-sm">
                <thead className="sticky top-0" style={{ background: "var(--nos-bg-surface)" }}>
                  <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                    {["Keyword", "Rank", "Volume", "Change", "Intent"].map((h) => (
                      <th key={h} className="text-left pb-2 pr-4 text-label-caps" style={{ color: "var(--nos-text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {search.keywords.map((kw, i) => (
                    <tr key={i} className="border-b last:border-0 transition-colors" style={{ borderColor: "var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--nos-bg-elevated)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <td className="py-2.5 pr-4 font-medium" style={{ color: "var(--nos-text-primary)" }}>{kw.keyword}</td>
                      <td className="py-2.5 pr-4">
                        <span className="text-sm font-bold px-1.5 py-0.5 rounded-md" style={{
                          fontFamily: "var(--font-geist-mono)",
                          color: kw.ranking <= 3 ? "var(--nos-positive)" : kw.ranking <= 10 ? "var(--nos-accent)" : "var(--nos-text-muted)",
                          background: kw.ranking <= 3 ? "rgba(52,211,153,0.1)" : kw.ranking <= 10 ? "var(--nos-accent-muted)" : "var(--nos-bg-elevated)",
                        }}>#{kw.ranking}</span>
                      </td>
                      <td className="py-2.5 pr-4 text-xs" style={{ color: "var(--nos-text-secondary)" }}>{kw.volume >= 1000 ? `${(kw.volume / 1000).toFixed(0)}K` : kw.volume}</td>
                      <td className="py-2.5 pr-4">
                        <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: kw.change > 0 ? "var(--nos-positive)" : kw.change < 0 ? "var(--nos-negative)" : "var(--nos-text-muted)" }}>
                          {kw.change > 0 ? <TrendingUp size={11} /> : kw.change < 0 ? <TrendingDown size={11} /> : null}
                          {kw.change > 0 ? "+" : ""}{kw.change}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <Badge className="text-[9px] capitalize" style={{ background: `${intentColors[kw.intent]}18`, color: intentColors[kw.intent], border: `1px solid ${intentColors[kw.intent]}40` }}>
                          {kw.intent}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
        <div className="flex flex-col gap-4">
          <KPICard label="Pipeline from Organic" value={search.pipelineFromOrganic.value} change={search.pipelineFromOrganic.change} sparkline={search.pipelineFromOrganic.sparkline} prefix="$" tooltip="CRM pipeline attributed to organic search traffic in this period." />
          <DashboardCard title="Search Intent" subtitle="Traffic by query intent type" info="Commercial queries signal purchase consideration; transactional queries signal buying intent." className="flex-1">
            <div className="space-y-3 mt-3">
              {search.intentBreakdown.map((item) => {
                const color = intentColors[item.name.toLowerCase()] ?? "var(--nos-accent)";
                const total = search.intentBreakdown.reduce((a, b) => a + b.value, 0);
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: "var(--nos-text-secondary)" }}>{item.name}</span>
                      <span className="text-xs font-bold" style={{ color }}>{item.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / total) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full rounded-full" style={{ background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        </div>
      </motion.div>

      {/* Globe + Country table */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <DashboardCard title="Organic Search Markets" subtitle="Interactive globe — SEO traffic by country" info="Drag to rotate. Hover a market dot to inspect traffic and period change. Click to pin." className="lg:col-span-3">
          <SeoTrafficGlobe countries={search.countryBreakdown} activeCode={activeCountry} onCountryHover={setHoveredCountry} onCountrySelect={setActiveCountry} />
        </DashboardCard>
        <DashboardCard title="Traffic by Country" subtitle="Ahrefs-style market breakdown" info="Organic visitors by country — synced with globe." className="lg:col-span-2">
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm min-w-[280px]">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["Country", "Traffic", "Change"].map((h) => (
                    <th key={h} className="text-left pb-2 pr-4 text-label-caps" style={{ color: "var(--nos-text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {search.countryBreakdown.map((country, i) => {
                  const isGrowing = country.trafficChange >= 0;
                  const maxT = Math.max(...search.countryBreakdown.map((c) => c.traffic));
                  const isHighlighted = highlightedCountry === country.code;
                  return (
                    <motion.tr key={country.code} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="border-b last:border-0 cursor-pointer transition-colors" style={{ borderColor: "var(--border)", background: isHighlighted ? "var(--nos-accent-muted)" : "transparent" }}
                      onMouseEnter={() => setHoveredCountry(country.code)} onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => setActiveCountry(activeCountry === country.code ? null : country.code)}>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{country.flag}</span>
                          <span className="text-xs font-semibold" style={{ color: "var(--nos-text-primary)" }}>{country.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{fmtNum(country.traffic)}</span>
                          <div className="hidden sm:block w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(country.traffic / maxT) * 100}%` }} transition={{ duration: 0.7, delay: 0.1 + i * 0.04 }} className="h-full rounded-full" style={{ background: "var(--nos-accent)" }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span className="text-xs font-bold flex items-center gap-1" style={{ color: isGrowing ? "var(--nos-positive)" : "var(--nos-negative)" }}>
                          {isGrowing ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {fmtChange(country.trafficChange)}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </motion.div>
    </motion.div>
  );
}

// ── GEO Tab ───────────────────────────────────────────────────────────────────
function GEOTab() {
  const data = useClientData();
  const { search } = data;
  const geo = search.geo;

  const scoreColor = geo.visibilityScore >= 50 ? "var(--nos-positive)" : geo.visibilityScore >= 35 ? "var(--nos-accent)" : "var(--nos-signal-warm)";

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      {/* ── Row 1: Visibility Score + AI KPIs ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Big visibility score */}
        <DashboardCard info="Visibility Score: how often your brand appears in AI-generated answers across all monitored engines, expressed as a percentage of all tracked prompts." className="lg:col-span-2 flex flex-col justify-center">
          <p className="text-label-caps mb-2" style={{ color: "var(--nos-text-muted)" }}>AI Visibility Score</p>
          <div className="flex items-end gap-3 mb-1">
            <span className="font-bold" style={{ fontFamily: "var(--font-geist-mono)", fontSize: "3.5rem", lineHeight: 1, color: "var(--nos-text-primary)" }}>
              {geo.visibilityScore}%
            </span>
            <span className="mb-2 text-sm font-bold px-2 py-0.5 rounded-full" style={{
              color: geo.visibilityChange >= 0 ? "var(--nos-positive)" : "var(--nos-negative)",
              background: geo.visibilityChange >= 0 ? "rgba(52,211,153,0.1)" : "rgba(255,68,85,0.1)",
            }}>
              {geo.visibilityChange >= 0 ? "+" : ""}{geo.visibilityChange}%
            </span>
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--nos-text-muted)" }}>How often you appear in AI-generated answers</p>
          {/* Progress arc */}
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${geo.visibilityScore}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full" style={{ background: `linear-gradient(90deg, var(--nos-accent), ${scoreColor})`, boxShadow: `0 0 8px ${scoreColor}` }} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>Share of Voice</span>
            <span className="text-[10px] font-bold" style={{ color: "var(--nos-accent)" }}>{geo.shareOfVoice}% <span style={{ color: geo.shareOfVoiceChange >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}>{geo.shareOfVoiceChange >= 0 ? "+" : ""}{geo.shareOfVoiceChange}%</span></span>
          </div>
        </DashboardCard>

        {/* 4 AI KPIs */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-3">
          <KPICard label="All Bot Visits" value={geo.allBotVisits.value} change={geo.allBotVisits.change} sparkline={geo.allBotVisits.sparkline} tooltip="Total visits from AI crawlers (ChatGPT, Anthropic, Perplexity, Google, Microsoft, etc.) in this period." />
          <KPICard label="AI Citations" value={geo.aiCitations.value} change={geo.aiCitations.change} sparkline={geo.aiCitations.sparkline} tooltip="Times your content was cited in an AI-generated answer." />
          <KPICard label="AI Training" value={geo.aiTraining.value} change={geo.aiTraining.change} sparkline={geo.aiTraining.sparkline} tooltip="Visits from AI model training crawlers — indicates your content is being used to train AI models." />
          <KPICard label="AI Indexing" value={geo.aiIndexing.value} change={geo.aiIndexing.change} sparkline={geo.aiIndexing.sparkline} tooltip="Visits from AI indexing bots — indicates your content is being added to AI knowledge bases." />
        </div>
      </motion.div>

      {/* ── Row 2: Visibility trend + Competitor scoreboard ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Trend chart */}
        <DashboardCard title="Visibility Score Trend" subtitle="Current period vs. previous period" info="Tracks how often your brand appears in AI answers over time vs. the prior period baseline." className="lg:col-span-3">
          <div style={{ height: 220, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={geo.visibilityTrend}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => { const d = new Date(v); return `${d.toLocaleString("default", { month: "short" })} ${d.getDate()}`; }} />
                <YAxis tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "var(--nos-text-muted)" }} />
                <Line type="monotone" dataKey="client" name="Current Period" stroke="var(--nos-accent)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="prev" name="Previous Period" stroke="var(--nos-text-muted)" strokeWidth={1.5} dot={false} strokeDasharray="5 4" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ChartAxisLabels xLabel="Date" yLabel="GEO visibility score (%)" />
        </DashboardCard>

        {/* Competitor scoreboard — Profound style */}
        <DashboardCard title="Visibility Score Rank" subtitle="Your brand vs. competitors" info="Competitor brand visibility ranking in AI-generated answers. Scores show percentage of tracked prompts where each brand appears." className="lg:col-span-2">
          <div className="mt-3 space-y-0">
            {geo.competitors.map((comp, i) => (
              <motion.div key={comp.name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                <span className="text-xs font-bold w-4 shrink-0" style={{ color: "var(--nos-text-muted)", fontFamily: "var(--font-geist-mono)" }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {comp.isClient && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--nos-accent)", boxShadow: "0 0 6px var(--nos-accent-glow)" }} />}
                    {!comp.isClient && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--nos-bg-overlay)" }} />}
                    <p className={`text-xs truncate ${comp.isClient ? "font-bold" : "font-medium"}`}
                      style={{ color: comp.isClient ? "var(--nos-accent)" : "var(--nos-text-primary)" }}>
                      {comp.name}
                      {comp.isClient && <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--nos-accent-muted)", color: "var(--nos-accent)", border: "1px solid var(--nos-accent-border)" }}>YOU</span>}
                    </p>
                  </div>
                  {/* Mini sparkline */}
                  <div className="mt-1 flex items-end gap-px h-4">
                    {comp.trend.map((v, ti) => {
                      const max = Math.max(...comp.trend);
                      return <div key={ti} className="flex-1 rounded-sm" style={{ height: `${(v / max) * 100}%`, background: comp.isClient ? "var(--nos-accent)" : "var(--nos-bg-overlay)", opacity: comp.isClient ? 0.7 : 0.5 }} />;
                    })}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{comp.visibilityScore}%</p>
                  <p className="text-[10px] font-bold" style={{ color: comp.change >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}>
                    {comp.change >= 0 ? "+" : ""}{comp.change}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </motion.div>

      {/* ── Row 3: Platform breakdown + Citation domains ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Per-platform visibility */}
        <DashboardCard title="Visibility by AI Platform" subtitle="How often you appear per engine" info="Per-engine visibility score — how often your brand appears when users query each AI platform about your category." className="lg:col-span-2">
          <div className="space-y-3 mt-4">
            {geo.platforms.map((p) => {
              const isPos = p.change >= 0;
              return (
                <div key={p.platform} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-24 shrink-0" style={{ color: "var(--nos-text-secondary)" }}>{p.platform}</span>
                  <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${p.visibilityPct}%` }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-lg flex items-center px-3 justify-between"
                      style={{ background: `linear-gradient(90deg, ${p.color}aa, ${p.color})` }}>
                      <span className="text-xs font-bold text-white">{p.visibilityPct}%</span>
                    </motion.div>
                  </div>
                  <span className="text-xs font-bold w-10 text-right shrink-0" style={{ color: isPos ? "var(--nos-positive)" : "var(--nos-negative)" }}>
                    {isPos ? "+" : ""}{p.change}%
                  </span>
                </div>
              );
            })}
          </div>
        </DashboardCard>

        {/* Citation domains */}
        <DashboardCard title="Top Citation Domains" subtitle="Where AI engines source your mentions" info="The websites AI engines cite when referencing your brand. These are your GEO authority signals — pages on these domains link back to you in AI answers.">
          <div className="mt-3 space-y-0">
            {geo.citationDomains.map((d, i) => {
              const isPos = d.change >= 0;
              const catColors: Record<string, string> = { "Own Site": "var(--nos-accent)", "Analyst": "var(--nos-positive)", "Review": "var(--nos-signal-warm)", "Media": "#0EA5E9", "Social": "#E1306C", "Community": "var(--nos-text-muted)" };
              const catColor = catColors[d.category] ?? "var(--nos-text-muted)";
              return (
                <motion.div key={d.domain} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <span className="text-xs font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-muted)", minWidth: 14 }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "var(--nos-text-primary)" }}>{d.domain}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}30` }}>{d.category}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{d.citations}</p>
                    <p className="text-[10px] font-semibold" style={{ color: isPos ? "var(--nos-positive)" : "var(--nos-negative)" }}>
                      {isPos ? "+" : ""}{d.change}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </DashboardCard>
      </motion.div>

      {/* ── AI Insight ── */}
      <motion.div variants={itemVariants}>
        <div className="relative rounded-xl p-5 overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(124,127,255,0.06) 0%, rgba(167,139,250,0.03) 100%)", border: "1px solid var(--nos-accent-border)" }}>
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--nos-accent), var(--nos-accent-2), transparent)", opacity: 0.6 }} />
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(124,127,255,0.15) 0%, rgba(167,139,250,0.1) 100%)", border: "1px solid var(--nos-accent-border)" }}>
              <Radar size={14} style={{ color: "var(--nos-accent)" }} />
            </div>
            <div>
              <p className="text-label-caps mb-1.5" style={{ background: "linear-gradient(90deg, var(--nos-accent), var(--nos-accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                AI GEO Intelligence
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--nos-text-secondary)" }}>{geo.aiInsight}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
type SearchTab = "seo" | "geo";
interface SearchIntelProps { tab?: SearchTab; }

export function SearchIntel({ tab = "seo" }: SearchIntelProps) {
  const data = useClientData();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      <SectionTLDR tldr={data.search.tldr} />

      {/* Phase 2 — Insight: Lead conversion + Engagement time */}
      <PhaseSecondaryKPI phase={2} pair={data.narrativeIntel.phaseMetrics.phase2} />

      <SectionSubTabs tabs={SEARCH_TABS} />

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
          {tab === "seo" ? <SEOTab /> : <GEOTab />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
