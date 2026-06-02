"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { useClientData } from "@/lib/data";
import { CardInfoButton } from "@/components/shared/CardInfoButton";

const NRI_LEVELS = [
  { level: 0, name: "Invisible",   definition: "Market is unaware of the narrative" },
  { level: 1, name: "Noticed",     definition: "Narrative registered but not processed" },
  { level: 2, name: "Consumed",    definition: "Audience engages with and processes the narrative" },
  { level: 3, name: "Remembered",  definition: "Audience recalls the narrative unprompted" },
  { level: 4, name: "Shared",      definition: "Audience proactively shares the narrative with peers" },
  { level: 5, name: "Referenced",  definition: "Industry cites the narrative as authoritative" },
  { level: 6, name: "Identified",  definition: "The company IS the narrative — category synonymy achieved" },
] as const;

function nriColor(level: number): string {
  if (level <= 1) return "var(--nos-signal-cold)";
  if (level <= 3) return "var(--nos-signal-warm)";
  if (level <= 5) return "var(--nos-positive)";
  return "var(--nos-accent)";
}

function nriBg(level: number): string {
  if (level <= 1) return "rgba(113,113,122,0.1)";
  if (level <= 3) return "rgba(251,191,36,0.1)";
  if (level <= 5) return "rgba(52,211,153,0.1)";
  return "rgba(99,102,241,0.1)";
}

const INFO_TEXT =
  "What: The NRI measures how deeply your narrative penetrates market consciousness. It is BrandMultiplier's proprietary 0–6 scale.\n\nHow: Measured through engagement signals, social sharing, inbound citations, and brand recall surveys across your active channels.\n\nWhy: NRI ≥ 4 means your audience is voluntarily amplifying your narrative — the point where story becomes self-sustaining growth.";

export function NRIScoreCard() {
  const data = useClientData();
  const { nri } = data.narrativeIntel;
  const levelData = NRI_LEVELS[nri.current];
  const color = nriColor(nri.current);
  const bg = nriBg(nri.current);
  const onTarget = nri.current >= nri.target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="nos-card relative"
    >
      {/* Top accent line matching NRI color */}
      <div
        className="absolute top-0 left-8 right-8 h-px rounded-full pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0.5,
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <p className="text-label-caps">Narrative Resonance Index (NRI)™</p>
        <CardInfoButton description={INFO_TEXT} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Left: score + name + definition */}
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="flex items-center justify-center rounded-2xl shrink-0"
            style={{
              width: 72,
              height: 72,
              background: bg,
              border: `2px solid ${color}`,
            }}
          >
            <span
              className="font-mono text-3xl font-bold leading-none"
              style={{ color }}
            >
              {nri.current}
            </span>
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight" style={{ color }}>
              {nri.current} — {levelData.name.toUpperCase()}
            </p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--nos-text-muted)" }}>
              "{levelData.definition}"
            </p>
            {/* Target badge */}
            <div className="flex items-center gap-1.5 mt-2">
              {onTarget ? (
                <CheckCircle2 size={12} style={{ color: "var(--nos-positive)" }} />
              ) : (
                <Clock size={12} style={{ color: "var(--nos-neutral)" }} />
              )}
              <span
                className="text-[10px] font-medium"
                style={{ color: onTarget ? "var(--nos-positive)" : "var(--nos-neutral)" }}
              >
                Target: ≥{nri.target} ({NRI_LEVELS[nri.target].name}) within 90 days —{" "}
                {onTarget ? "On Track" : "In Progress"}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ background: bg, color }}
              >
                {nri.tier}
              </span>
            </div>
          </div>
        </div>

        {/* Right: step tracker */}
        <div className="flex-1 min-w-0">
          {/* Step dots */}
          <div className="flex items-center gap-0">
            {NRI_LEVELS.map((lvl, i) => {
              const isPast = i < nri.current;
              const isCurrent = i === nri.current;
              const isFuture = i > nri.current;
              const dotColor = isFuture ? "var(--nos-bg-elevated)" : nriColor(i);
              return (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  {/* Connecting line before dot */}
                  {i > 0 && (
                    <div
                      className="h-0.5 flex-1 min-w-0"
                      style={{ background: isPast || isCurrent ? nriColor(i - 1) : "var(--nos-bg-elevated)" }}
                    />
                  )}
                  {/* Dot */}
                  <div
                    className="shrink-0 rounded-full flex items-center justify-center transition-all"
                    style={{
                      width: isCurrent ? 22 : 14,
                      height: isCurrent ? 22 : 14,
                      background: isFuture ? "var(--nos-bg-card)" : dotColor,
                      border: `2px solid ${isFuture ? "var(--nos-bg-elevated)" : dotColor}`,
                      boxShadow: isCurrent ? `0 0 10px ${dotColor}60` : undefined,
                    }}
                  >
                    {isCurrent && (
                      <div
                        className="rounded-full"
                        style={{ width: 8, height: 8, background: "white", opacity: 0.9 }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Labels */}
          <div className="flex items-start justify-between mt-1.5">
            <div className="text-left">
              <p className="text-[10px] font-semibold" style={{ color: nriColor(0) }}>0</p>
              <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>Invisible</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-semibold" style={{ color: nriColor(3) }}>3</p>
              <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>Remembered</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold" style={{ color: nriColor(6) }}>6</p>
              <p className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>Identified</p>
            </div>
          </div>
          {/* Full scale labels */}
          <div className="flex items-start gap-1 mt-3 flex-wrap">
            {NRI_LEVELS.map((lvl) => (
              <div
                key={lvl.level}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px]"
                style={{
                  background: lvl.level === nri.current ? nriBg(lvl.level) : "transparent",
                  color: lvl.level <= nri.current ? nriColor(lvl.level) : "var(--nos-text-muted)",
                  fontWeight: lvl.level === nri.current ? 600 : 400,
                  border: lvl.level === nri.current ? `1px solid ${nriColor(lvl.level)}40` : "1px solid transparent",
                }}
              >
                <span className="font-mono">{lvl.level}</span>
                <span>{lvl.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
