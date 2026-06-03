"use client";

import { motion } from "framer-motion";
import type { PositionPoint } from "@/lib/data/types";

interface Props {
  data: PositionPoint[];
}

const QUADRANT_LABELS = [
  { label: "Leaders",     x: 75, y: 15,  color: "var(--nos-positive)" },
  { label: "Visionaries", x: 25, y: 15,  color: "var(--nos-accent)" },
  { label: "Challengers", x: 75, y: 85,  color: "var(--nos-signal-warm)" },
  { label: "Niche",       x: 25, y: 85,  color: "var(--nos-text-muted)" },
] as const;

function getQuadrantColor(point: PositionPoint): string {
  if (point.x >= 50 && point.y >= 50) return "var(--nos-positive)";
  if (point.x < 50 && point.y >= 50) return "var(--nos-accent)";
  if (point.x >= 50 && point.y < 50) return "var(--nos-signal-warm)";
  return "var(--nos-text-muted)";
}

export function PositioningQuadrantDots({ data }: Props) {
  const W = 480;
  const H = 360;
  const PAD = { top: 24, right: 24, bottom: 40, left: 40 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  function toSvgX(val: number) { return PAD.left + (val / 100) * plotW; }
  function toSvgY(val: number) { return PAD.top + ((100 - val) / 100) * plotH; }

  const midX = toSvgX(50);
  const midY = toSvgY(50);

  return (
    <div>
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--nos-text-primary)" }}>
            Positioning Quadrant
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--nos-text-muted)" }}>
            Market Presence vs. Narrative Strength
          </p>
        </div>
        {/* Quadrant legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-end">
          {QUADRANT_LABELS.map((q) => (
            <div key={q.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: q.color }} />
              <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>{q.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG plot */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ maxHeight: 320 }}
          aria-label="Gartner-style positioning quadrant"
        >
          {/* Background quadrants */}
          {([
            { x: PAD.left,  y: PAD.top,  w: plotW / 2, h: plotH / 2, label: "Visionaries", color: "var(--nos-accent)" },
            { x: midX,      y: PAD.top,  w: plotW / 2, h: plotH / 2, label: "Leaders",     color: "var(--nos-positive)" },
            { x: PAD.left,  y: midY,     w: plotW / 2, h: plotH / 2, label: "Niche",       color: "var(--nos-text-muted)" },
            { x: midX,      y: midY,     w: plotW / 2, h: plotH / 2, label: "Challengers", color: "var(--nos-signal-warm)" },
          ] as const).map((q) => (
            <g key={q.label}>
              <rect
                x={q.x} y={q.y} width={q.w} height={q.h}
                fill="var(--nos-bg-elevated)"
                fillOpacity={0.35}
                rx={4}
              />
              <text
                x={q.x + q.w / 2} y={q.y + 14}
                textAnchor="middle"
                fontSize={10}
                fill={q.color}
                fillOpacity={0.6}
                fontWeight={600}
              >
                {q.label}
              </text>
            </g>
          ))}

          {/* Axis dividers */}
          <line x1={midX} y1={PAD.top} x2={midX} y2={PAD.top + plotH}
            stroke="var(--border)" strokeWidth={1.5} strokeDasharray="4 3" />
          <line x1={PAD.left} y1={midY} x2={PAD.left + plotW} y2={midY}
            stroke="var(--border)" strokeWidth={1.5} strokeDasharray="4 3" />

          {/* X axis ticks */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={`x-${v}`}>
              <line
                x1={toSvgX(v)} y1={PAD.top + plotH}
                x2={toSvgX(v)} y2={PAD.top + plotH + 4}
                stroke="var(--nos-text-muted)" strokeWidth={1}
              />
              <text
                x={toSvgX(v)} y={PAD.top + plotH + 14}
                textAnchor="middle" fontSize={9}
                fill="var(--nos-text-muted)"
              >
                {v}
              </text>
            </g>
          ))}

          {/* Y axis ticks */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={`y-${v}`}>
              <line
                x1={PAD.left - 4} y1={toSvgY(v)}
                x2={PAD.left}     y2={toSvgY(v)}
                stroke="var(--nos-text-muted)" strokeWidth={1}
              />
              <text
                x={PAD.left - 7} y={toSvgY(v) + 4}
                textAnchor="end" fontSize={9}
                fill="var(--nos-text-muted)"
              >
                {v}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text
            x={PAD.left + plotW / 2} y={H - 2}
            textAnchor="middle" fontSize={10}
            fill="var(--nos-text-muted)" fontWeight={500}
          >
            Market Presence →
          </text>
          <text
            x={10} y={PAD.top + plotH / 2}
            textAnchor="middle" fontSize={10}
            fill="var(--nos-text-muted)" fontWeight={500}
            transform={`rotate(-90, 10, ${PAD.top + plotH / 2})`}
          >
            Narrative Strength →
          </text>

          {/* Data points */}
          {data.map((point) => {
            const cx = toSvgX(point.x);
            const cy = toSvgY(point.y);
            const color = getQuadrantColor(point);
            const r = point.isClient ? 10 : 6;

            return (
              <motion.g
                key={point.name}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                {/* Glow ring for client */}
                {point.isClient && (
                  <circle cx={cx} cy={cy} r={r + 7} fill={color} fillOpacity={0.15} />
                )}
                {/* Main dot */}
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={color}
                  fillOpacity={point.isClient ? 1 : 0.75}
                  stroke={point.isClient ? "white" : "none"}
                  strokeWidth={point.isClient ? 2 : 0}
                />
                {/* Name label */}
                <text
                  x={cx + r + 5}
                  y={cy + 4}
                  fontSize={9}
                  fontWeight={point.isClient ? 700 : 500}
                  fill={point.isClient ? "var(--nos-text-primary)" : "var(--nos-text-secondary)"}
                >
                  {point.name}
                  {point.isClient ? " ◀" : ""}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Bottom axis caption */}
      <div className="flex justify-between mt-1 px-10">
        <span className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>← Lower market share</span>
        <span className="text-[9px]" style={{ color: "var(--nos-text-muted)" }}>Higher market share →</span>
      </div>
    </div>
  );
}
