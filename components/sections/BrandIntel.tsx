"use client";

import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import { SectionTLDR } from "@/components/shared/SectionTLDR";
import { PhaseSecondaryKPI } from "@/components/cards/PhaseSecondaryKPI";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { KPICard } from "@/components/cards/KPICard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartAxisLabels } from "@/components/charts/ChartAxisLabels";
import { Radar, TrendingUp, TrendingDown, Minus, Users } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const SCORE_LABELS: Record<string, string> = {
  excellent: "Excellent",
  strong: "Strong",
  good: "Good",
  developing: "Developing",
  emerging: "Emerging",
};

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 50) return "Developing";
  return "Emerging";
}

function getScoreColor(score: number) {
  if (score >= 80) return "var(--nos-positive)";
  if (score >= 65) return "var(--nos-accent)";
  if (score >= 50) return "var(--nos-signal-warm)";
  return "var(--nos-signal-hot)";
}

// Score cell in the scoreboard table
function ScoreCell({ score, change }: { score: number; change: number }) {
  const isPos = change > 0;
  const isNeg = change < 0;
  const color = getScoreColor(score);
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-sm font-bold tabular-nums"
        style={{ color: "var(--nos-text-primary)" }}
      >
        {score}
      </span>
      <span
        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
        style={{
          background: isPos
            ? "rgba(52,211,153,0.1)"
            : isNeg
            ? "rgba(255,68,85,0.1)"
            : "var(--nos-bg-elevated)",
          color: isPos
            ? "var(--nos-positive)"
            : isNeg
            ? "var(--nos-negative)"
            : "var(--nos-text-muted)",
        }}
      >
        {change > 0 ? "+" : ""}{change}
      </span>
    </div>
  );
}

// Network icon badge
function NetworkBadge({ network }: { network: string }) {
  const colors: Record<string, string> = {
    linkedin: "#0A66C2",
    instagram: "#E1306C",
    facebook: "#1877F2",
    email: "var(--nos-ch-email)",
    website: "var(--nos-accent)",
    newsletter: "var(--nos-positive)",
  };
  const labels: Record<string, string> = {
    linkedin: "Li",
    instagram: "Ig",
    facebook: "Fb",
    email: "Em",
    website: "Web",
    newsletter: "NL",
  };
  const bg = colors[network] ?? "var(--nos-bg-elevated)";
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-md text-[9px] font-bold text-white shrink-0"
      style={{ background: bg }}
    >
      {labels[network] ?? network.slice(0, 2).toUpperCase()}
    </span>
  );
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const CustomChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2.5 text-xs space-y-1"
      style={{
        background: "var(--nos-bg-overlay)",
        border: "1px solid var(--nos-accent-border)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <p className="font-semibold mb-1.5" style={{ color: "var(--nos-text-secondary)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--nos-text-muted)" }}>{p.name}</span>
          <span className="font-semibold ml-auto" style={{ color: "var(--nos-text-primary)" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function BrandIntel() {
  const data = useClientData();
  const { brand } = data;
  const clientRow = brand.scoreboard.find((r) => r.isClient);
  const scoreColor = getScoreColor(brand.brandScore);
  const scoreLabel = getScoreLabel(brand.brandScore);

  // SVG gauge
  const gaugeSize = 160;
  const cx = gaugeSize / 2;
  const cy = gaugeSize * 0.62;
  const r = gaugeSize * 0.38;
  const strokeW = 14;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const circumference = r * (endAngle - startAngle);
  const filled = (brand.brandScore / 100) * circumference;
  const toX = (angle: number) => cx + r * Math.cos(angle);
  const toY = (angle: number) => cy + r * Math.sin(angle);
  const bgPath = `M ${toX(startAngle)} ${toY(startAngle)} A ${r} ${r} 0 0 1 ${toX(endAngle)} ${toY(endAngle)}`;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      <SectionTLDR tldr={brand.tldr} />

      {/* Phase 1 — Anchor: Market perception + Sentiment score */}
      <motion.div variants={itemVariants}>
        <PhaseSecondaryKPI phase={1} pair={data.narrativeIntel.phaseMetrics.phase1} />
      </motion.div>

      {/* Top row: Brand Score + AI Narrative + Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Brand Score Gauge */}
        <DashboardCard
          className="lg:col-span-2 flex flex-col items-center justify-center text-center"
          info="Composite brand health score (0–100) across Awareness, Impact, and Trust dimensions vs. competitors."
        >
          <p className="text-label-caps mb-3" style={{ color: "var(--nos-text-muted)" }}>Brand Score</p>
          <svg
            width={gaugeSize}
            height={gaugeSize * 0.72}
            className="overflow-visible"
          >
            {/* Track */}
            <path
              d={bgPath}
              fill="none"
              stroke="var(--nos-bg-elevated)"
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
            {/* Filled arc */}
            <motion.path
              d={bgPath}
              fill="none"
              stroke={scoreColor}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circumference}`}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${filled} ${circumference}` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ filter: `drop-shadow(0 0 6px ${scoreColor})` }}
            />
            {/* Score text */}
            <text
              x={cx}
              y={cy - 8}
              textAnchor="middle"
              style={{
                fontSize: 36,
                fontWeight: 700,
                fontFamily: "var(--font-geist-mono)",
                fill: "var(--nos-text-primary)",
              }}
            >
              {brand.brandScore}
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              style={{
                fontSize: 10,
                fill: scoreColor,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {scoreLabel}
            </text>
          </svg>
          {/* Change badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full mt-2 text-sm font-bold"
            style={{
              background:
                brand.brandScoreChange > 0
                  ? "rgba(52,211,153,0.1)"
                  : "rgba(255,68,85,0.1)",
              color:
                brand.brandScoreChange > 0
                  ? "var(--nos-positive)"
                  : "var(--nos-negative)",
            }}
          >
            {brand.brandScoreChange > 0 ? (
              <TrendingUp size={13} />
            ) : (
              <TrendingDown size={13} />
            )}
            {brand.brandScoreChange > 0 ? "+" : ""}
            {brand.brandScoreChange} pts this period
          </div>
          {/* Dimension mini-scores */}
          <div className="mt-4 grid grid-cols-3 gap-2 w-full">
            {(["Awareness", "Impact", "Trust"] as const).map((dim, i) => {
              const row = brand.scoreboard.find((r) => r.isClient);
              const cell = row
                ? dim === "Awareness"
                  ? row.awareness
                  : dim === "Impact"
                  ? row.impact
                  : row.trust
                : { score: 0, change: 0 };
              return (
                <div
                  key={dim}
                  className="rounded-lg py-2 px-1 text-center"
                  style={{ background: "var(--nos-bg-elevated)" }}
                >
                  <p className="text-label-caps mb-1" style={{ color: "var(--nos-text-muted)" }}>
                    {dim}
                  </p>
                  <p className="text-sm font-bold" style={{ color: "var(--nos-text-primary)" }}>
                    {cell.score}
                  </p>
                  <p
                    className="text-[9px] font-semibold"
                    style={{ color: cell.change >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}
                  >
                    {cell.change > 0 ? "+" : ""}{cell.change}
                  </p>
                </div>
              );
            })}
          </div>
        </DashboardCard>

        {/* AI Narrative + Actions */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* AI Narrative */}
          <motion.div
            className="relative rounded-xl p-5 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,127,255,0.06) 0%, rgba(167,139,250,0.03) 100%)",
              border: "1px solid var(--nos-accent-border)",
            }}
          >
            <div
              className="absolute top-0 inset-x-0 h-px pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, var(--nos-accent), var(--nos-accent-2), transparent)",
                opacity: 0.6,
              }}
            />
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(124,127,255,0.15) 0%, rgba(167,139,250,0.1) 100%)",
                  border: "1px solid var(--nos-accent-border)",
                }}
              >
                <Radar size={14} style={{ color: "var(--nos-accent)" }} />
              </div>
              <div>
                <p
                  className="text-label-caps mb-1.5"
                  style={{
                    background: "linear-gradient(90deg, var(--nos-accent), var(--nos-accent-2))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  AI Brand Intelligence
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--nos-text-secondary)" }}>
                  {brand.aiInsight}
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI Action Recommendations */}
          <DashboardCard
            title="Recommended Actions"
            subtitle="AI-generated brand growth priorities"
            info="Actions ranked by potential brand score impact, generated from competitive and audience signal analysis."
          >
            <div className="space-y-2.5 mt-3">
              {brand.aiActions.map((action, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-3 p-2.5 rounded-lg"
                  style={{ background: "var(--nos-bg-elevated)" }}
                >
                  <div
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold text-white mt-0.5"
                    style={{
                      background: "linear-gradient(135deg, var(--nos-accent), var(--nos-accent-2))",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--nos-text-primary)" }}>
                      {action.title}
                    </p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--nos-text-muted)" }}>
                      {action.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </motion.div>

      {/* Competitive Brand Scoreboard */}
      <motion.div variants={itemVariants}>
        <DashboardCard
          title="Competitive Brand Scoreboard"
          subtitle="Your brand vs. competitors across Awareness, Impact & Trust"
          info="Competitive scoring across four brand dimensions. Scores are updated weekly from social listening, content analysis, and share-of-voice data."
        >
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {["Company", "Brand Score", "Awareness", "Impact", "Trust"].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-3 text-label-caps pr-6"
                      style={{ color: "var(--nos-text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brand.scoreboard.map((row, i) => (
                  <motion.tr
                    key={row.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="border-b last:border-0 transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      background: row.isClient ? "rgba(124,127,255,0.04)" : "transparent",
                    }}
                  >
                    {/* Company name */}
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-2.5">
                        {row.isClient && (
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: "var(--nos-accent)", boxShadow: "0 0 6px var(--nos-accent-glow)" }}
                          />
                        )}
                        {!row.isClient && (
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: "var(--nos-bg-overlay)" }}
                          />
                        )}
                        <span
                          className={`text-sm ${row.isClient ? "font-bold" : "font-medium"}`}
                          style={{ color: row.isClient ? "var(--nos-accent)" : "var(--nos-text-primary)" }}
                        >
                          {row.name}
                          {row.isClient && (
                            <span
                              className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{
                                background: "var(--nos-accent-muted)",
                                color: "var(--nos-accent)",
                                border: "1px solid var(--nos-accent-border)",
                              }}
                            >
                              YOU
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-3">
                        <ScoreCell score={row.brandScore.score} change={row.brandScore.change} />
                        {/* Visual bar */}
                        <div className="hidden md:block w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${row.brandScore.score}%` }}
                            transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{
                              background: row.isClient
                                ? `linear-gradient(90deg, var(--nos-accent), var(--nos-accent-2))`
                                : "var(--nos-bg-overlay)",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-6">
                      <ScoreCell score={row.awareness.score} change={row.awareness.change} />
                    </td>
                    <td className="py-3 pr-6">
                      <ScoreCell score={row.impact.score} change={row.impact.change} />
                    </td>
                    <td className="py-3">
                      <ScoreCell score={row.trust.score} change={row.trust.change} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] mt-3" style={{ color: "var(--nos-text-muted)" }}>
            ↑↓ indicates change vs. prior period · Scores 0–100 · Higher is better
          </p>
        </DashboardCard>
      </motion.div>

      {/* Audience Development + Channel Breakdown */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* KPI strip */}
        <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPICard
            label="Total Audience"
            value={brand.audience.total.value}
            change={brand.audience.total.change}
            sparkline={brand.audience.total.sparkline}
            tooltip="Total followers and subscribers across all connected brand channels."
          />
          <KPICard
            label="Net New Followers"
            value={brand.audience.netNew.value}
            change={brand.audience.netNew.change}
            sparkline={brand.audience.netNew.sparkline}
            tooltip="Net new audience additions this period (new followers minus unfollows)."
          />
          {clientRow && (
            <>
              <DashboardCard className="flex flex-col justify-center" info="Current Awareness score from social listening, search, and media analysis.">
                <p className="text-label-caps mb-2">Awareness Score</p>
                <p
                  className="font-mono-metric"
                  style={{ color: "var(--nos-text-primary)" }}
                >
                  {clientRow.awareness.score}
                </p>
                <p
                  className="text-xs font-semibold mt-1"
                  style={{
                    color: clientRow.awareness.change >= 0 ? "var(--nos-positive)" : "var(--nos-negative)",
                  }}
                >
                  {clientRow.awareness.change > 0 ? "+" : ""}
                  {clientRow.awareness.change} this period
                </p>
              </DashboardCard>
              <DashboardCard className="flex flex-col justify-center" info="Trust score derived from review sentiment, NPS signals, and brand mention tone.">
                <p className="text-label-caps mb-2">Trust Score</p>
                <p
                  className="font-mono-metric"
                  style={{ color: "var(--nos-text-primary)" }}
                >
                  {clientRow.trust.score}
                </p>
                <p
                  className="text-xs font-semibold mt-1"
                  style={{
                    color: clientRow.trust.change >= 0 ? "var(--nos-positive)" : "var(--nos-negative)",
                  }}
                >
                  {clientRow.trust.change > 0 ? "+" : ""}
                  {clientRow.trust.change} this period
                </p>
              </DashboardCard>
            </>
          )}
        </div>

        {/* Fan Development Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <DashboardCard
            title="Audience Development"
            subtitle="Fan increase · decrease · paid · organic growth over time"
            info="Tracks how your audience grows and shrinks across four dimensions — organic growth, paid acquisition, new followers, and unfollows — so you can separate earned growth from paid."
          >
            <div style={{ height: 220, marginTop: 12 }}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={brand.audience.development}>
                  <defs>
                    <linearGradient id="grad-increase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="grad-decrease" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--nos-signal-warm)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--nos-signal-warm)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="grad-paid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--nos-negative)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--nos-negative)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="grad-organic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C7FFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C7FFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => {
                      const d = new Date(v);
                      return `${d.toLocaleString("default", { month: "short" })}`;
                    }}
                  />
                  <YAxis tick={{ fill: "var(--nos-text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: "var(--nos-text-muted)" }}
                  />
                  <Area type="monotone" dataKey="increase" name="Fan increase" stroke="#34D399" strokeWidth={2} fill="url(#grad-increase)" dot={false} />
                  <Area type="monotone" dataKey="decrease" name="Fan decrease" stroke="var(--nos-signal-warm)" strokeWidth={2} fill="url(#grad-decrease)" dot={false} />
                  <Area type="monotone" dataKey="paid" name="Paid growth" stroke="var(--nos-negative)" strokeWidth={2} fill="url(#grad-paid)" dot={false} />
                  <Area type="monotone" dataKey="organic" name="Organic growth" stroke="#7C7FFF" strokeWidth={2} fill="url(#grad-organic)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <ChartAxisLabels xLabel="Month" yLabel="Audience change (fans)" />
          </DashboardCard>
        </motion.div>

        {/* Fans by Channel */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <DashboardCard
            title="Audience by Channel"
            subtitle="Total fans, net new, increases & decreases"
            info="Shows how your audience is distributed across channels, and whether growth is coming from organic or paid sources."
            className="h-full"
          >
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs min-w-[280px]">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {["Channel", "Fans", "Net New", "+", "−"].map((h) => (
                      <th
                        key={h}
                        className="text-left pb-2 text-label-caps pr-3"
                        style={{ color: "var(--nos-text-muted)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {brand.audience.byChannel.map((ch, i) => (
                    <motion.tr
                      key={ch.channelName}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className="border-b last:border-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <NetworkBadge network={ch.network} />
                          <span style={{ color: "var(--nos-text-primary)" }} className="font-medium truncate max-w-[80px]">
                            {ch.channelName}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3">
                        <div className="flex flex-col">
                          <span className="font-semibold" style={{ color: "var(--nos-text-primary)" }}>
                            {fmtNum(ch.fans)}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: ch.fansChange >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}
                          >
                            {ch.fansChange > 0 ? "+" : ""}{ch.fansChange}%
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span
                          className="font-semibold"
                          style={{ color: ch.netNew >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}
                        >
                          {ch.netNew > 0 ? "+" : ""}{ch.netNew}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span style={{ color: "var(--nos-positive)" }}>{ch.increase}</span>
                      </td>
                      <td className="py-2.5">
                        <span style={{ color: "var(--nos-negative)" }}>{ch.decrease}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Platform mix */}
            <div className="mt-4 pt-3 border-t border-[var(--border)]">
              <p className="text-label-caps mb-2" style={{ color: "var(--nos-text-muted)" }}>Platform Mix</p>
              <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                {brand.audience.platformMix.map((p) => (
                  <motion.div
                    key={p.platform}
                    initial={{ flex: 0 }}
                    animate={{ flex: p.share }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ background: p.color }}
                    title={`${p.platform}: ${p.share}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                {brand.audience.platformMix.map((p) => (
                  <div key={p.platform} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>
                      {p.platform} {p.share}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
