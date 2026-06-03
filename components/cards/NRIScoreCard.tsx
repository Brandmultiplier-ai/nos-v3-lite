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

/** Renders the step tracker SVG for fractional NRI values */
function NRIStepTracker({ current }: { current: number }) {
  const _levels = NRI_LEVELS.length; // 7 points (0–6)
  const W = 420;
  const H = 60;
  const PAD_X = 14;
  const DOT_Y = 20;
  const segment = (W - PAD_X * 2) / 6; // spacing between integer steps

  function xFor(lvl: number) { return PAD_X + lvl * segment; }

  const floorLevel = Math.floor(current);
  const fraction = current - floorLevel;
  const fracX = xFor(floorLevel) + fraction * segment;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 60 }} aria-label="NRI step tracker">
      {/* Background line (full grey track) */}
      <line x1={xFor(0)} y1={DOT_Y} x2={xFor(6)} y2={DOT_Y}
        stroke="var(--nos-bg-elevated)" strokeWidth={3} strokeLinecap="round" />

      {/* Colored progress line from 0 to fracX */}
      <motion.line
        x1={xFor(0)} y1={DOT_Y} x2={fracX} y2={DOT_Y}
        stroke={nriColor(floorLevel)}
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ x2: xFor(0) }}
        animate={{ x2: fracX }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {/* Integer level dots */}
      {NRI_LEVELS.map((lvl) => {
        const ix = xFor(lvl.level);
        const reached = lvl.level <= floorLevel;
        const isGoal = lvl.level === 6;
        const dotColor = isGoal
          ? "var(--nos-accent)"
          : reached
          ? nriColor(lvl.level)
          : "var(--nos-bg-elevated)";
        const strokeColor = isGoal
          ? "var(--nos-accent)"
          : reached
          ? nriColor(lvl.level)
          : "var(--nos-text-muted)";

        return (
          <g key={lvl.level}>
            <circle
              cx={ix} cy={DOT_Y} r={7}
              fill={dotColor}
              stroke={strokeColor}
              strokeWidth={1.5}
              fillOpacity={reached || isGoal ? 1 : 0.3}
            />
            {/* Number label below */}
            <text
              x={ix} y={DOT_Y + 18}
              textAnchor="middle" fontSize={9}
              fontWeight={reached || isGoal ? 600 : 400}
              fill={reached || isGoal ? dotColor : "var(--nos-text-muted)"}
            >
              {lvl.level}
            </text>
            {/* Level name on first/last or current-attained */}
            {(lvl.level === 0 || lvl.level === 6 || lvl.level === floorLevel) && (
              <text
                x={ix} y={DOT_Y + 28}
                textAnchor={lvl.level === 0 ? "start" : lvl.level === 6 ? "end" : "middle"}
                fontSize={8}
                fill="var(--nos-text-muted)"
              >
                {lvl.name}
              </text>
            )}
          </g>
        );
      })}

      {/* Fractional dot — only if not exactly an integer */}
      {fraction > 0.01 && (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ transformOrigin: `${fracX}px ${DOT_Y}px` }}
        >
          {/* Glow */}
          <circle cx={fracX} cy={DOT_Y} r={9} fill={nriColor(floorLevel)} fillOpacity={0.2} />
          {/* Dot */}
          <circle
            cx={fracX} cy={DOT_Y} r={5}
            fill={nriColor(floorLevel)}
            stroke="white"
            strokeWidth={1.5}
          />
          {/* Fractional value label */}
          <text
            x={fracX} y={DOT_Y - 12}
            textAnchor="middle" fontSize={9}
            fontWeight={700}
            fill={nriColor(floorLevel)}
          >
            {current.toFixed(1)}
          </text>
        </motion.g>
      )}
    </svg>
  );
}

export function NRIScoreCard() {
  const data = useClientData();
  const { nri } = data.narrativeIntel;
  const current = nri.current; // may be fractional e.g. 2.7
  const floorLevel = Math.floor(current);
  const levelData = NRI_LEVELS[floorLevel];
  const color = nriColor(floorLevel);
  const bg = nriBg(floorLevel);
  const onTarget = current >= nri.target;

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
              {current.toFixed(1)}
            </span>
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight" style={{ color }}>
              {floorLevel} — {levelData.name.toUpperCase()}
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
        <div className="flex-1 min-w-0 pt-2">
          <NRIStepTracker current={current} />
        </div>
      </div>
    </motion.div>
  );
}
