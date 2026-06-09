"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useClientData, useDataKey } from "@/lib/data";
import { KPICard } from "@/components/cards/KPICard";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { SectionSubTabs } from "@/components/shared/SectionSubTabs";
import { SectionTLDR } from "@/components/shared/SectionTLDR";
import { PhaseSecondaryKPI } from "@/components/cards/PhaseSecondaryKPI";
import { TrendLine } from "@/components/charts/TrendLine";
import { ChartAxisLabels } from "@/components/charts/ChartAxisLabels";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ExternalLink, Zap, CheckCircle, Clock } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { LinkedInPost, ContentExperiment } from "@/lib/data/types";

const CONTENT_TABS = [
  { id: "social",    label: "Social Channels",   path: "/content/social" },
  { id: "linkedin",  label: "LinkedIn Content",  path: "/content/linkedin" },
  { id: "blog",      label: "Blog & Content",    path: "/content/blog" },
  { id: "newsletter",label: "Newsletter",        path: "/content/newsletter" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } };
const itemVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } };

const CHANNEL_COLORS: Record<string, string> = {
  LinkedIn: "var(--nos-ch-linkedin)",
  Instagram: "var(--nos-ch-instagram)",
  Facebook: "var(--nos-ch-facebook)",
  Email: "var(--nos-ch-email)",
  Newsletter: "var(--nos-ch-newsletter)",
  "X / Twitter": "var(--nos-ch-x)",
  YouTube: "#FF0000",
};


const GROWTH_SERIES = [
  { key: "linkedin" as const, label: "LinkedIn", color: "var(--nos-ch-linkedin)" },
  { key: "instagram" as const, label: "Instagram", color: "var(--nos-ch-instagram)" },
  { key: "facebook" as const, label: "Facebook", color: "var(--nos-ch-facebook)" },
  { key: "x" as const, label: "X", color: "var(--nos-ch-x)" },
];

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(Math.round(n));
}
function fmtMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
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

// ── Social Tab (Sprout Social) ────────────────────────────────────────────────
function SocialTab() {
  const { content } = useClientData();
  const { platformStats, audienceGrowthStacked, sentiment } = content;
  const sentimentTotal = sentiment.positive + sentiment.neutral + sentiment.negative;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Platform stat cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {platformStats.map((p) => (
          <DashboardCard key={p.platform} info={`${p.platform} stats: followers, reach, engagement rate, and published posts.`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: CHANNEL_COLORS[p.platform] ?? "var(--nos-accent)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--nos-text-primary)" }}>{p.platform}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 pr-6">
              <div>
                <p className="text-label-caps mb-0.5" style={{ color: "var(--nos-text-muted)" }}>Followers</p>
                <p className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{fmtNum(p.followers)}</p>
                <p className="text-[9px] font-semibold" style={{ color: p.followersChange >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}>
                  {p.followersChange >= 0 ? "+" : ""}{p.followersChange}%
                </p>
              </div>
              <div>
                <p className="text-label-caps mb-0.5" style={{ color: "var(--nos-text-muted)" }}>Eng. Rate</p>
                <p className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-positive)" }}>{p.engagementRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-label-caps mb-0.5" style={{ color: "var(--nos-text-muted)" }}>Reach</p>
                <p className="text-xs font-semibold" style={{ color: "var(--nos-text-secondary)" }}>{fmtNum(p.reach)}</p>
              </div>
              {p.reelsWatchTime && (
                <div>
                  <p className="text-label-caps mb-0.5" style={{ color: "var(--nos-text-muted)" }}>Watch Time</p>
                  <p className="text-xs font-semibold" style={{ color: "var(--nos-accent)" }}>{p.reelsWatchTime}s</p>
                </div>
              )}
              {p.hookRate && (
                <div>
                  <p className="text-label-caps mb-0.5" style={{ color: "var(--nos-text-muted)" }}>Hook Rate</p>
                  <p className="text-xs font-semibold" style={{ color: "var(--nos-accent)" }}>{p.hookRate}%</p>
                </div>
              )}
            </div>
          </DashboardCard>
        ))}
      </motion.div>

      {/* Audience growth stacked + Sentiment */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DashboardCard title="Audience Growth" subtitle="Followers by platform — stacked area" info="Cross-network follower growth on a unified timeline. Shows which channel is growing fastest this period." className="lg:col-span-2">
          <div style={{ height: 240, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={audienceGrowthStacked} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => fmtNum(v)} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "var(--nos-text-muted)" }} />
                {GROWTH_SERIES.map((s) => (
                  <Area key={s.key} type="monotone" dataKey={s.key} name={s.label}
                    stroke={s.color} fill={`${s.color}18`}
                    strokeWidth={1.5} dot={false} stackId="1" isAnimationActive={false} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <ChartAxisLabels xLabel="Date" yLabel="Followers by platform" />
        </DashboardCard>

        {/* Sentiment gauge */}
        <DashboardCard title="Social Listening" subtitle="Brand sentiment + conversation volume" info="Sentiment analysis across mentions, comments, and organic brand conversations — positive / neutral / negative with top conversation themes.">
          <div className="mt-4">
            {/* Big sentiment number */}
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-positive)" }}>{sentiment.positive}%</span>
              <span className="text-xs mb-1.5 font-semibold" style={{ color: "var(--nos-positive)" }}>positive</span>
            </div>
            {/* Bar breakdown */}
            <div className="flex h-3 rounded-full overflow-hidden mb-3 gap-0.5">
              <div className="rounded-l-full" style={{ width: `${sentiment.positive}%`, background: "var(--nos-positive)" }} />
              <div style={{ width: `${sentiment.neutral}%`, background: "var(--nos-text-muted)" }} />
              <div className="rounded-r-full" style={{ width: `${sentiment.negative}%`, background: "var(--nos-negative)" }} />
            </div>
            <div className="flex items-center gap-4 mb-4 text-[10px]">
              {[{ label: "Positive", v: sentiment.positive, c: "var(--nos-positive)" }, { label: "Neutral", v: sentiment.neutral, c: "var(--nos-text-muted)" }, { label: "Negative", v: sentiment.negative, c: "var(--nos-negative)" }].map((s) => (
                <div key={s.label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.c }} />
                  <span style={{ color: "var(--nos-text-muted)" }}>{s.label}</span>
                  <span className="font-bold" style={{ color: s.c }}>{s.v}%</span>
                </div>
              ))}
            </div>
            {/* Themes */}
            <div className="space-y-1.5">
              {sentiment.themes.map((t) => (
                <div key={t.theme} className="flex items-center gap-2 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: t.sentiment === "positive" ? "var(--nos-positive)" : t.sentiment === "negative" ? "var(--nos-negative)" : "var(--nos-text-muted)" }} />
                  <span className="flex-1 truncate" style={{ color: "var(--nos-text-secondary)" }}>{t.theme}</span>
                  <span className="font-semibold" style={{ color: "var(--nos-text-muted)" }}>{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Cross-channel table */}
      <motion.div variants={itemVariants}>
        <DashboardCard title="Cross-Channel Performance" subtitle="Posts · Reach · Engagement · Pipeline" info="Unified view of all social channels — compare volume, reach, engagement rate, and pipeline generated across all platforms.">
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["Channel", "Posts", "Reach", "Engagement Rate", "Pipeline"].map((h) => (
                    <th key={h} className="text-left pb-2 text-label-caps pr-6" style={{ color: "var(--nos-text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.socialOverview.map((row) => (
                  <tr key={row.channel} className="border-b last:border-0 hover:bg-[var(--nos-bg-elevated)] transition-colors" style={{ borderColor: "var(--border)" }}>
                    <td className="py-2.5 pr-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: CHANNEL_COLORS[row.channel] ?? "var(--nos-accent)" }} />
                        <span className="font-medium" style={{ color: "var(--nos-text-primary)" }}>{row.channel}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-6 text-xs" style={{ color: "var(--nos-text-secondary)" }}>{Math.round(row.posts)}</td>
                    <td className="py-2.5 pr-6 text-xs" style={{ color: "var(--nos-text-secondary)" }}>{fmtNum(Math.round(row.reach))}</td>
                    <td className="py-2.5 pr-6">
                      <span className="text-xs font-semibold" style={{ color: "var(--nos-positive)" }}>{row.engagementRate.toFixed(1)}%</span>
                    </td>
                    <td className="py-2.5 font-semibold text-xs" style={{ color: "var(--nos-positive)" }}>{fmtMoney(Math.round(row.pipeline))}</td>
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

// ── LinkedIn Tab (Taplio) ─────────────────────────────────────────────────────
function LinkedInTab() {
  const { content } = useClientData();
  const { linkedinKPIs: kpis, linkedinPosts, linkedinFollowerGrowth, contentCalendar } = content;

  const kpiGrid = [
    { label: "Followers",     metric: kpis.followers,    prefix: "" },
    { label: "Impressions",   metric: kpis.impressions,  prefix: "" },
    { label: "Engagements",   metric: kpis.engagements,  prefix: "" },
    { label: "Posts",         metric: kpis.posts,        prefix: "" },
    { label: "Comments",      metric: kpis.comments,     prefix: "" },
    { label: "Profile Views", metric: kpis.profileViews, prefix: "" },
    { label: "Likes",         metric: kpis.likes,        prefix: "" },
    { label: "Shares",        metric: kpis.shares,       prefix: "" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Taplio-style KPI grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpiGrid.map(({ label, metric }) => (
          <KPICard key={label} label={label} value={metric.value} change={metric.change} sparkline={metric.sparkline} tooltip={`${label} performance vs previous period.`} />
        ))}
      </motion.div>

      {/* Follower growth trend + post feed */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 nos-card">
          <TrendLine data={linkedinFollowerGrowth} title="Follower Growth" subtitle="Organic LinkedIn audience" color="var(--nos-ch-linkedin)" height={200} xAxisLabel="Month" yAxisLabel="LinkedIn followers" />
        </div>

        <DashboardCard title="Post Performance Feed" subtitle="Sorted by impressions — click to expand" info="All LinkedIn posts this period ranked by impressions, with engagement rate, pipeline attribution, and viral flag." className="lg:col-span-2">
          <div className="mt-3 space-y-0 max-h-72 overflow-y-auto">
            {linkedinPosts.map((post: LinkedInPost, i: number) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="py-3 border-b last:border-0 group cursor-pointer" style={{ borderColor: "var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--nos-bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div className="flex items-start gap-3 pr-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>{post.date}</span>
                      {post.isViral && (
                        <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(251,191,36,0.15)", color: "var(--nos-signal-warm)", border: "1px solid rgba(251,191,36,0.3)" }}>
                          <Zap size={8} />VIRAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--nos-text-secondary)" }}>{post.content}</p>
                  </div>
                  <div className="shrink-0 text-right space-y-0.5">
                    <p className="text-xs font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{fmtNum(post.impressions)}</p>
                    <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>impressions</p>
                    <p className="text-[10px] font-bold" style={{ color: "var(--nos-positive)" }}>{post.engagementRate.toFixed(1)}% eng</p>
                    <p className="text-[10px] font-semibold" style={{ color: "var(--nos-accent)" }}>{fmtMoney(post.pipeline)}</p>
                  </div>
                </div>
                {/* Engagement micro-stat row */}
                <div className="flex items-center gap-4 mt-1.5 text-[9px]" style={{ color: "var(--nos-text-muted)" }}>
                  <span>👍 {fmtNum(post.likes)}</span>
                  <span>💬 {post.comments}</span>
                  <span style={{ color: "var(--nos-accent)" }}>Pipeline: {fmtMoney(post.pipeline)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </motion.div>
    </motion.div>
  );
}

// ── Blog Tab (Optimizely) ─────────────────────────────────────────────────────
function SignificanceCurve({ id, significanceCurve, significance, status }: ContentExperiment) {
  const isWon = status === "won";
  const color = isWon ? "var(--nos-positive)" : significance >= 80 ? "var(--nos-signal-warm)" : "var(--nos-accent)";
  const chartKey = `${id}-${significanceCurve.length}-${significanceCurve[significanceCurve.length - 1]?.value ?? 0}`;
  return (
    <div style={{ height: 120 }}>
      <ResponsiveContainer key={chartKey} width="100%" height={120}>
        <LineChart data={significanceCurve} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "var(--nos-text-muted)", fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: "var(--nos-text-muted)", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} strokeDasharray={status === "running" ? "5 3" : undefined} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      <ChartAxisLabels xLabel="Days since experiment start" yLabel="Statistical significance (%)" />
    </div>
  );
}

function BlogTab() {
  const { content } = useClientData();
  const { blogPosts, blogExperiments, blogPageviewsTrend } = content;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Pageviews trend + top pages */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 nos-card">
          <TrendLine data={blogPageviewsTrend} title="Blog Pageviews" subtitle="Monthly sessions across all blog content" color="var(--nos-accent)" height={200} xAxisLabel="Month" yAxisLabel="Blog pageviews" />
        </div>

        <DashboardCard title="Top Blog Posts" subtitle="Pageviews · Attention time · Pipeline" info="Blog posts ranked by pageviews. Attention time measures average engaged reading time. Pipeline shows CRM attribution.">
          <div className="mt-3 space-y-0 max-h-64 overflow-y-auto">
            {blogPosts.map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="py-2.5 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-medium leading-snug mb-1.5 pr-2" style={{ color: "var(--nos-text-primary)" }}>{post.title}</p>
                <div className="flex items-center gap-3 flex-wrap text-[9px]">
                  <span style={{ color: "var(--nos-text-muted)" }}>👁 {fmtNum(post.pageviews)}</span>
                  <span style={{ color: "var(--nos-accent)" }}>⏱ {post.avgAttentionTime}</span>
                  <span style={{ color: "var(--nos-positive)" }}>📊 {post.engagementRate}%</span>
                  <span className="font-bold" style={{ color: "var(--nos-positive)" }}>{fmtMoney(post.pipeline)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </motion.div>

      {/* A/B Experiments (Optimizely-style) */}
      <motion.div variants={itemVariants}>
        <p className="text-label-caps mb-3" style={{ color: "var(--nos-text-muted)" }}>Content Experiments</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {blogExperiments.map((exp) => {
            const isWon = exp.status === "won";
            const isRunning = exp.status === "running";
            const statusColor = isWon ? "var(--nos-positive)" : isRunning ? "var(--nos-signal-warm)" : "var(--nos-text-muted)";
            return (
              <DashboardCard key={exp.id} info={`A/B test: ${exp.name}. ${exp.daysRunning} days running with ${fmtNum(exp.visitors)} visitors. Current significance: ${exp.significance}%.`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3 pr-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      {isWon ? <CheckCircle size={12} style={{ color: statusColor }} /> : <Clock size={12} style={{ color: statusColor }} />}
                      <span className="text-label-caps" style={{ color: statusColor }}>
                        {isWon ? "Winner Found" : "Running"}
                      </span>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: "var(--nos-text-primary)" }}>{exp.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: statusColor }}>{exp.significance}%</p>
                    <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>significance</p>
                  </div>
                </div>

                {/* Variant comparison */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[exp.baseline, exp.variation].map((v, idx) => {
                    const isVariation = idx === 1;
                    const cv = exp.variation;
                    return (
                      <div key={v.label} className="rounded-lg p-2.5" style={{ background: isVariation && isWon ? "rgba(52,211,153,0.06)" : "var(--nos-bg-elevated)", border: `1px solid ${isVariation && isWon ? "rgba(52,211,153,0.2)" : "var(--border)"}` }}>
                        <p className="text-[9px] font-semibold mb-1" style={{ color: isVariation && isWon ? "var(--nos-positive)" : "var(--nos-text-muted)" }}>{v.label}</p>
                        <p className="text-base font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: isVariation && isWon ? "var(--nos-positive)" : "var(--nos-text-primary)" }}>{v.conversionRate.toFixed(2)}%</p>
                        <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>{fmtNum(v.conversions)} / {fmtNum(v.visitors)}</p>
                        {isVariation && "improvement" in cv && (
                          <p className="text-[10px] font-bold mt-0.5" style={{ color: "var(--nos-positive)" }}>+{cv.improvement.toFixed(1)}% improvement</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Significance curve */}
                <div>
                  <p className="text-[9px] mb-1" style={{ color: "var(--nos-text-muted)" }}>Statistical significance over time — dashed line = 95% threshold</p>
                  <SignificanceCurve {...exp} />
                </div>

                <div className="flex items-center gap-4 mt-2 text-[9px]" style={{ color: "var(--nos-text-muted)" }}>
                  <span>{exp.daysRunning} days</span>
                  <span>{fmtNum(exp.visitors)} visitors</span>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Newsletter Tab (Beehiiv) ──────────────────────────────────────────────────
function NewsletterTab() {
  const { content } = useClientData();
  const { activeSubscribers, openRate, clickRate, subscriberGrowth, newsletters, acquisitionSources } = content;

  const maxSubs = Math.max(...acquisitionSources.map((s) => s.subscribers));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Beehiiv-style headline KPIs */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        <KPICard label="Active Subscribers" value={activeSubscribers.value} change={activeSubscribers.change} sparkline={activeSubscribers.sparkline} tooltip="Total active subscribers — people who have opened at least one email in the last 90 days." />
        <KPICard label="Open Rate" value={openRate.value} change={openRate.change} sparkline={openRate.sparkline} suffix="%" tooltip="Average open rate across all sends this period. Industry median is ~28%." />
        <KPICard label="Click Rate" value={clickRate.value} change={clickRate.change} sparkline={clickRate.sparkline} suffix="%" tooltip="Average click-through rate per send. Clicks ÷ delivered." />
      </motion.div>

      {/* Subscriber growth curve (Beehiiv pink) + campaign table */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 nos-card">
          <TrendLine data={subscriberGrowth} title="Subscriber Growth" subtitle="Active list size over time" color="var(--nos-ch-newsletter)" height={200} xAxisLabel="Month" yAxisLabel="Active subscribers" />
        </div>

        <DashboardCard title="Campaign Results" subtitle="Open rate · Click rate · Pipeline per send" info="Newsletter campaign performance — delivery, engagement, and pipeline per edition." className="lg:col-span-2">
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["Subject", "Sent", "Open Rate", "Click Rate", "Pipeline"].map((h) => (
                    <th key={h} className="text-left pb-2 text-label-caps pr-4" style={{ color: "var(--nos-text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {newsletters.map((nl) => (
                  <tr key={nl.id} className="border-b last:border-0 hover:bg-[var(--nos-bg-elevated)] transition-colors" style={{ borderColor: "var(--border)" }}>
                    <td className="py-2.5 pr-4 max-w-[200px] truncate text-xs" style={{ color: "var(--nos-text-primary)" }}>{nl.subject}</td>
                    <td className="py-2.5 pr-4 text-xs" style={{ color: "var(--nos-text-secondary)" }}>{fmtNum(nl.sent)}</td>
                    <td className="py-2.5 pr-4 text-xs font-bold" style={{ color: "var(--nos-positive)" }}>{nl.openRate}%</td>
                    <td className="py-2.5 pr-4 text-xs" style={{ color: "var(--nos-text-secondary)" }}>{nl.clickRate}%</td>
                    <td className="py-2.5 text-xs font-bold" style={{ color: "var(--nos-positive)" }}>{fmtMoney(nl.pipeline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Acquisition sources table (Beehiiv-style) */}
      <motion.div variants={itemVariants}>
        <DashboardCard title="Subscriber Acquisition Sources" subtitle="Where subscribers come from — and how engaged they are" info="Breaks down subscriber acquisition by channel source. Open rate and unsubscribe rate per source reveal which channels deliver the highest-quality list growth.">
          <div className="mt-3 space-y-0">
            {acquisitionSources.map((s, i) => (
              <motion.div key={s.source} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="py-3 border-b last:border-0 grid grid-cols-5 gap-3 items-center" style={{ borderColor: "var(--border)" }}>
                {/* Source name + bar */}
                <div className="col-span-2">
                  <p className="text-[11px] font-medium mb-1.5" style={{ color: "var(--nos-text-primary)" }}>{s.source}</p>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(s.subscribers / maxSubs) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--nos-accent), var(--nos-ch-newsletter))" }} />
                  </div>
                </div>
                {/* Subscribers */}
                <div className="text-right">
                  <p className="text-label-caps mb-0.5" style={{ color: "var(--nos-text-muted)" }}>Subscribers</p>
                  <p className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{fmtNum(s.subscribers)}</p>
                  <p className="text-[9px] font-semibold" style={{ color: "var(--nos-accent)" }}>{s.pct}%</p>
                </div>
                {/* Open rate */}
                <div className="text-right">
                  <p className="text-label-caps mb-0.5" style={{ color: "var(--nos-text-muted)" }}>Open Rate</p>
                  <p className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: s.openRate >= 60 ? "var(--nos-positive)" : "var(--nos-text-primary)" }}>{s.openRate}%</p>
                </div>
                {/* Unsub rate */}
                <div className="text-right">
                  <p className="text-label-caps mb-0.5" style={{ color: "var(--nos-text-muted)" }}>Unsub Rate</p>
                  <p className="text-sm font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: s.unsubscribeRate > 3 ? "var(--nos-negative)" : "var(--nos-positive)" }}>{s.unsubscribeRate}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </motion.div>
    </motion.div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
type ContentTab = "social" | "linkedin" | "blog" | "newsletter";
interface ContentMarketingProps { tab?: ContentTab; }

export function ContentMarketing({ tab = "social" }: ContentMarketingProps) {
  const data = useClientData();
  const dataKey = useDataKey();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      <SectionTLDR tldr={data.content.tldr} />

      {/* Phase 4 — Unification: Deal size + Affinity index */}
      <PhaseSecondaryKPI phase={4} pair={data.narrativeIntel.phaseMetrics.phase4} />

      <SectionSubTabs tabs={CONTENT_TABS} />

      <AnimatePresence mode="wait">
        <motion.div key={`${tab}-${dataKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
          {tab === "social"     && <SocialTab />}
          {tab === "linkedin"   && <LinkedInTab />}
          {tab === "blog"       && <BlogTab />}
          {tab === "newsletter" && <NewsletterTab />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
