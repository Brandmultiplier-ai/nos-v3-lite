"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientData } from "@/lib/data";
import { PipelineBridge } from "@/components/cards/PipelineBridge";
import { KPICard } from "@/components/cards/KPICard";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { TrendLine } from "@/components/charts/TrendLine";
import { DonutChart } from "@/components/charts/DonutChart";
import { SeoTrafficGlobe } from "@/components/charts/SeoTrafficGlobe";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ExternalLink, Play, AlertTriangle, MousePointerClick, ArrowLeft, Bug, Monitor, Smartphone, Tablet } from "lucide-react";
import type { CompanySignal, SessionRecording } from "@/lib/data/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const intentBadge = (intent: CompanySignal["intent"]) => {
  const map = {
    hot: { label: "Hot", color: "var(--nos-signal-hot)" },
    warm: { label: "Warm", color: "var(--nos-signal-warm)" },
    cold: { label: "Cold", color: "var(--nos-signal-cold)" },
  };
  const cfg = map[intent];
  return (
    <Badge className="text-[9px]" style={{ background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
      {cfg.label}
    </Badge>
  );
};

const flagColors: Record<SessionRecording["flags"][number], { label: string; color: string; icon: React.ReactNode }> = {
  "rage-click":  { label: "Rage Click",  color: "#FF4455", icon: <MousePointerClick size={9} /> },
  "dead-click":  { label: "Dead Click",  color: "#FBBF24", icon: <MousePointerClick size={9} /> },
  "quick-back":  { label: "Quick-Back",  color: "#A78BFA", icon: <ArrowLeft size={9} /> },
  "js-error":    { label: "JS Error",    color: "#FF6B4A", icon: <Bug size={9} /> },
};

const deviceIcon = (d: SessionRecording["device"]) => {
  if (d === "mobile") return <Smartphone size={12} />;
  if (d === "tablet") return <Tablet size={12} />;
  return <Monitor size={12} />;
};

// ── Funnel bar chart ──────────────────────────────────────────────────────────
function FunnelChart({ steps }: { steps: { label: string; sessions: number; dropoffPct: number }[] }) {
  const maxSessions = steps[0]?.sessions ?? 1;
  return (
    <div className="flex flex-col gap-3 mt-4">
      {steps.map((step, i) => {
        const widthPct = (step.sessions / maxSessions) * 100;
        const isFirst = i === 0;
        return (
          <div key={step.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium" style={{ color: "var(--nos-text-secondary)" }}>{step.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{fmtNum(step.sessions)}</span>
                {!isFirst && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(255,68,85,0.1)", color: "var(--nos-negative)" }}>
                    -{step.dropoffPct}%
                  </span>
                )}
              </div>
            </div>
            <div className="h-8 rounded-lg overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-lg"
                style={{
                  background: isFirst
                    ? "linear-gradient(90deg, var(--nos-accent), var(--nos-accent-2))"
                    : `linear-gradient(90deg, rgba(124,127,255,${0.85 - i * 0.12}), rgba(124,127,255,${0.6 - i * 0.08}))`,
                  boxShadow: isFirst ? "0 0 10px var(--nos-accent-glow)" : "none",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Session Recordings feed ───────────────────────────────────────────────────
function RecordingRow({ rec }: { rec: SessionRecording }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 py-2.5 border-b last:border-0 group cursor-pointer transition-colors"
      style={{ borderColor: "var(--border)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--nos-bg-elevated)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Play icon */}
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 group-hover:opacity-100 opacity-60 transition-opacity"
        style={{ background: "var(--nos-accent-muted)", border: "1px solid var(--nos-accent-border)" }}>
        <Play size={10} style={{ color: "var(--nos-accent)" }} />
      </div>

      {/* Page + flags */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: "var(--nos-text-primary)" }}>{rec.page}</p>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {rec.flags.map((f) => {
            const cfg = flagColors[f];
            return (
              <span key={f} className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                {cfg.icon}{cfg.label}
              </span>
            );
          })}
          {rec.flags.length === 0 && <span className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>No issues</span>}
        </div>
      </div>

      {/* Duration + meta */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-secondary)" }}>{rec.duration}</span>
        <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>{rec.country}</span>
        <span style={{ color: "var(--nos-text-muted)" }}>{deviceIcon(rec.device)}</span>
      </div>
    </motion.div>
  );
}

// ── Company Signal row ────────────────────────────────────────────────────────
function SignalRow({ signal, expanded, onToggle }: { signal: CompanySignal; expanded: boolean; onToggle: () => void }) {
  return (
    <>
      <tr className="border-b border-[var(--border)] hover:bg-[var(--nos-bg-elevated)] transition-colors cursor-pointer" onClick={onToggle}>
        <td className="py-2.5 pr-4 font-medium" style={{ color: "var(--nos-text-primary)" }}>{signal.company}</td>
        <td className="py-2.5 pr-4 text-xs" style={{ color: "var(--nos-text-muted)" }}>{signal.industry}</td>
        <td className="py-2.5 pr-4">
          <span className="text-sm font-bold" style={{ color: "var(--nos-accent)", fontFamily: "var(--font-geist-mono)" }}>{signal.signalScore}</span>
        </td>
        <td className="py-2.5 pr-4 text-xs" style={{ color: "var(--nos-text-secondary)" }}>{signal.pagesVisited}</td>
        <td className="py-2.5 pr-4 text-xs" style={{ color: "var(--nos-text-secondary)" }}>{signal.timeOnSite}</td>
        <td className="py-2.5 pr-4 text-xs" style={{ color: "var(--nos-text-secondary)" }}>{signal.source}</td>
        <td className="py-2.5 pr-4">{intentBadge(signal.intent)}</td>
        <td className="py-2.5">
          <ChevronDown size={14} className={`transition-transform`} style={{ color: "var(--nos-text-muted)", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={8}>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 py-3 flex items-start gap-8" style={{ background: "var(--nos-bg-elevated)" }}>
                  <div>
                    <p className="text-[10px] text-label-caps mb-1">Pages Visited</p>
                    <div className="flex flex-wrap gap-1">
                      {signal.pages.map((page) => (
                        <span key={page} className="text-xs px-2 py-0.5 rounded-md" style={{ color: "var(--nos-accent)", background: "var(--nos-accent-muted)" }}>{page}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-label-caps mb-1">Company Size</p>
                    <p className="text-sm" style={{ color: "var(--nos-text-primary)" }}>{signal.companySize} employees</p>
                  </div>
                  <a href={signal.linkedinUrl} className="flex items-center gap-1 text-xs mt-4 hover:underline" style={{ color: "var(--nos-accent)" }}>
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

// ── Main export ───────────────────────────────────────────────────────────────
export function WebsiteSignals() {
  const data = useClientData();
  const { website, pipelineBridge } = data;

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [intentFilter, setIntentFilter] = useState<"all" | "hot" | "warm" | "cold">("all");
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const highlightedCountry = hoveredCountry ?? activeCountry;

  const filteredSignals = intentFilter === "all" ? website.signals : website.signals.filter((s) => s.intent === intentFilter);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <PipelineBridge attributed={pipelineBridge.attributed} deals={pipelineBridge.deals} velocity={pipelineBridge.velocity} section="Website Signals" info="Pipeline attributed to identified website visitors, intent signals, and behavioral events." />

      {/* ── Behavioral KPI strip ─────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard label="Sessions" value={website.sessions.value} change={website.sessions.change} sparkline={website.sessions.sparkline} tooltip="Total sessions recorded in this period, including anonymous and identified visitors." />
        <KPICard label="Rage Clicks" value={website.rageclickRate.value} change={website.rageclickRate.change} sparkline={website.rageclickRate.sparkline} suffix="%" tooltip="Sessions where a user clicked the same element 3+ times in rapid succession — indicates frustration or broken UI." />
        <KPICard label="Dead Clicks" value={website.deadclickRate.value} change={website.deadclickRate.change} sparkline={website.deadclickRate.sparkline} suffix="%" tooltip="Clicks on elements that have no action — hidden elements, non-linked text, or disabled buttons." />
        <KPICard label="Quick-Backs" value={website.quickBackRate.value} change={website.quickBackRate.change} sparkline={website.quickBackRate.sparkline} suffix="%" tooltip="Sessions where a user returned to the previous page within 3 seconds — a strong exit-intent signal." />
        <KPICard label="Scroll Depth" value={website.scrollDepth.value} change={website.scrollDepth.change} sparkline={website.scrollDepth.sparkline} suffix="%" tooltip="Average percentage of page scrolled per session. Higher = more content engagement." />
        <KPICard label="JS Errors" value={website.jsErrors.value} change={website.jsErrors.change} sparkline={website.jsErrors.sparkline} tooltip="JavaScript errors recorded per period. Decreasing errors = better code stability." />
      </motion.div>

      {/* ── Visitor trend + Traffic sources + Reading behavior ─────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 nos-card">
          <TrendLine data={website.visitorTrend} title="Session Trend" subtitle="Weekly sessions" color="#7C7FFF" height={200} />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Reading behavior */}
          <DashboardCard title="Reading Behavior" subtitle="Session engagement depth" info="Clarity's engagement classification — Casual (< 1 min), Serious (1–3 min), Reader (> 3 min engaged scroll).">
            <div className="mt-3 space-y-3">
              {website.readingBehavior.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: "var(--nos-text-secondary)" }}>{b.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>{fmtNum(b.sessions)} sessions</span>
                      <span className="text-xs font-bold" style={{ color: b.color }}>{b.pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full" style={{ background: b.color, boxShadow: `0 0 6px ${b.color}60` }} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Traffic sources donut */}
          <div className="nos-card flex-1">
            <DonutChart data={website.trafficSources} title="Traffic Sources" subtitle="Session origin breakdown" height={160} />
          </div>
        </div>
      </motion.div>

      {/* ── Globe + Country + Top Pages ──────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <DashboardCard title="Visitor Geography" subtitle="Session traffic by country — drag to rotate" info="Real-time visitor geography powered by IP-resolution. Drag the globe, hover a dot to inspect country-level session data." className="lg:col-span-3">
          <SeoTrafficGlobe
            countries={website.visitorCountries}
            activeCode={activeCountry}
            onCountryHover={setHoveredCountry}
            onCountrySelect={setActiveCountry}
          />
        </DashboardCard>

        <DashboardCard title="Top Pages" subtitle="Sessions · Scroll depth · Exit rate" info="Highest-traffic pages ranked by sessions. Scroll depth and exit rate reveal content engagement quality." className="lg:col-span-2">
          <div className="mt-3 space-y-0">
            {website.topPages.map((page, i) => {
              const isHighlighted = false;
              return (
                <motion.div key={page.url} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="py-2.5 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium truncate max-w-[130px]" style={{ color: "var(--nos-accent)" }}>{page.url}</span>
                    <span className="text-xs font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>{fmtNum(page.sessions)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>Scroll</span>
                        <span className="text-[9px] font-semibold" style={{ color: "var(--nos-positive)" }}>{page.scrollDepth}%</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${page.scrollDepth}%` }} transition={{ duration: 0.7, delay: 0.1 + i * 0.04 }} className="h-full rounded-full" style={{ background: "var(--nos-positive)" }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>Exit </span>
                      <span className="text-[9px] font-bold" style={{ color: page.exitRate > 40 ? "var(--nos-negative)" : "var(--nos-text-secondary)" }}>{page.exitRate}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {/* Country mini-table below pages */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-label-caps mb-2" style={{ color: "var(--nos-text-muted)" }}>Sessions by Country</p>
            <div className="space-y-1">
              {website.visitorCountries.slice(0, 4).map((c) => {
                const isGrowing = c.trafficChange >= 0;
                const maxT = Math.max(...website.visitorCountries.map((x) => x.traffic));
                const isHighlighted = highlightedCountry === c.code;
                return (
                  <div key={c.code} className="flex items-center gap-2 cursor-pointer rounded-md px-1 py-0.5 transition-colors"
                    style={{ background: isHighlighted ? "var(--nos-accent-muted)" : "transparent" }}
                    onMouseEnter={() => setHoveredCountry(c.code)} onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => setActiveCountry(activeCountry === c.code ? null : c.code)}>
                    <span className="text-sm">{c.flag}</span>
                    <span className="text-xs flex-1" style={{ color: "var(--nos-text-secondary)" }}>{c.name}</span>
                    <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(c.traffic / maxT) * 100}%` }} transition={{ duration: 0.7 }} className="h-full rounded-full" style={{ background: "var(--nos-accent)" }} />
                    </div>
                    <span className="text-[10px] font-bold w-8 text-right" style={{ color: isGrowing ? "var(--nos-positive)" : "var(--nos-negative)" }}>
                      {isGrowing ? "+" : ""}{c.trafficChange}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </DashboardCard>
      </motion.div>

      {/* ── Session Recordings + Funnel ───────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DashboardCard title="Session Recordings" subtitle="Latest recorded sessions with behavior flags" info="Behavioral recordings flagged by Clarity-style AI. Rage clicks, dead clicks, quick-backs, and JS errors are auto-detected." className="lg:col-span-2">
          <div className="mt-2">
            <div className="flex items-center gap-3 mb-3 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
              {(["rage-click", "dead-click", "quick-back", "js-error"] as const).map((f) => {
                const cfg = flagColors[f];
                return (
                  <div key={f} className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: cfg.color }}>
                    {cfg.icon}<span>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
            {website.sessionRecordings.map((rec) => (
              <RecordingRow key={rec.id} rec={rec} />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Conversion Funnel" subtitle="Drop-off analysis" info="Session funnel from homepage to conversion — drop-off percentage at each step shows where visitors exit the journey.">
          <FunnelChart steps={website.funnelSteps} />
        </DashboardCard>
      </motion.div>

      {/* ── Company Signal Feed ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="nos-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--nos-text-primary)" }}>Identified Company Signal Feed</p>
            <p className="text-xs" style={{ color: "var(--nos-text-muted)" }}>Companies identified by IP resolution — sorted by intent signal score</p>
          </div>
          <div className="flex gap-1">
            {(["all", "hot", "warm", "cold"] as const).map((f) => (
              <button key={f} onClick={() => setIntentFilter(f)} className="text-xs px-3 py-1 rounded-full transition-colors capitalize"
                style={{ background: intentFilter === f ? "var(--nos-accent)" : "var(--nos-bg-elevated)", color: intentFilter === f ? "white" : "var(--nos-text-muted)" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead className="sticky top-0" style={{ background: "var(--nos-bg-surface)" }}>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["Company", "Industry", "Signal Score", "Pages", "Time on Site", "Source", "Intent", ""].map((h) => (
                    <th key={h} className="text-left pb-2 pr-4 text-label-caps" style={{ color: "var(--nos-text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSignals.map((signal) => (
                  <SignalRow key={signal.id} signal={signal} expanded={expandedRow === signal.id} onToggle={() => setExpandedRow(expandedRow === signal.id ? null : signal.id)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
