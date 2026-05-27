"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { PositionPoint } from "@/lib/data/types";

interface GartnerQuadrantProps {
  data: PositionPoint[];
}

const QUADRANTS = [
  { label: "Visionaries", x: 0, y: 50, w: 50, h: 50, color: "rgba(99,102,241,0.06)" },
  { label: "Leaders", x: 50, y: 50, w: 50, h: 50, color: "rgba(34,197,94,0.07)" },
  { label: "Niche", x: 0, y: 0, w: 50, h: 50, color: "rgba(113,113,122,0.05)" },
  { label: "Challengers", x: 50, y: 0, w: 50, h: 50, color: "rgba(245,158,11,0.06)" },
];

const PAD = 48;
const W = 520;
const H = 380;
const PLOT_W = W - PAD * 2;
const PLOT_H = H - PAD * 2 - 20;

function toSvgX(v: number) {
  return PAD + (v / 100) * PLOT_W;
}

function toSvgY(v: number) {
  return PAD + PLOT_H - (v / 100) * PLOT_H;
}

export function GartnerQuadrant({ data }: GartnerQuadrantProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const clientPoint = data.find((d) => d.isClient);
  const competitors = data.filter((d) => !d.isClient);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[var(--nos-text-primary)]">
            Positioning Quadrant
          </p>
          <p className="text-xs text-[var(--nos-text-muted)] mt-0.5">
            Market Presence vs. Narrative Strength
          </p>
        </div>
        {clientPoint && (
          <div className="text-right">
            <p className="text-[10px] text-label-caps text-[var(--nos-text-muted)]">Your position</p>
            <p className="text-xs font-semibold text-[var(--nos-accent)]">{clientPoint.name}</p>
            <p className="text-[10px] text-[var(--nos-text-muted)]">
              Presence {clientPoint.x} · Strength {clientPoint.y}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--nos-bg-elevated)] overflow-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Positioning quadrant chart"
        >
          {/* Quadrant backgrounds */}
          {QUADRANTS.map((q) => (
            <g key={q.label}>
              <rect
                x={toSvgX(q.x)}
                y={toSvgY(q.y + q.h)}
                width={(q.w / 100) * PLOT_W}
                height={(q.h / 100) * PLOT_H}
                fill={q.color}
              />
              <text
                x={toSvgX(q.x + q.w / 2)}
                y={toSvgY(q.y + q.h / 2)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[var(--nos-text-muted)] opacity-40"
                style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em" }}
              >
                {q.label.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Grid lines */}
          {[25, 50, 75].map((v) => (
            <g key={v}>
              <line
                x1={toSvgX(v)}
                y1={PAD}
                x2={toSvgX(v)}
                y2={PAD + PLOT_H}
                stroke="var(--border)"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              <line
                x1={PAD}
                y1={toSvgY(v)}
                x2={PAD + PLOT_W}
                y2={toSvgY(v)}
                stroke="var(--border)"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            </g>
          ))}

          {/* Axis midlines */}
          <line
            x1={toSvgX(50)}
            y1={PAD}
            x2={toSvgX(50)}
            y2={PAD + PLOT_H}
            stroke="var(--nos-text-muted)"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
          <line
            x1={PAD}
            y1={toSvgY(50)}
            x2={PAD + PLOT_W}
            y2={toSvgY(50)}
            stroke="var(--nos-text-muted)"
            strokeOpacity={0.3}
            strokeWidth={1}
          />

          {/* Axis labels */}
          {[0, 25, 50, 75, 100].map((v) => (
            <text
              key={`x-${v}`}
              x={toSvgX(v)}
              y={H - 6}
              textAnchor="middle"
              className="fill-[var(--nos-text-muted)]"
              style={{ fontSize: 9 }}
            >
              {v}
            </text>
          ))}
          {[0, 25, 50, 75, 100].map((v) => (
            <text
              key={`y-${v}`}
              x={PAD - 8}
              y={toSvgY(v) + 3}
              textAnchor="end"
              className="fill-[var(--nos-text-muted)]"
              style={{ fontSize: 9 }}
            >
              {v}
            </text>
          ))}

          <text
            x={PAD + PLOT_W / 2}
            y={H - 18}
            textAnchor="middle"
            className="fill-[var(--nos-text-secondary)]"
            style={{ fontSize: 10 }}
          >
            Market Presence →
          </text>
          <text
            x={14}
            y={PAD + PLOT_H / 2}
            textAnchor="middle"
            transform={`rotate(-90, 14, ${PAD + PLOT_H / 2})`}
            className="fill-[var(--nos-text-secondary)]"
            style={{ fontSize: 10 }}
          >
            Narrative Strength →
          </text>

          {/* Competitor dots */}
          {competitors.map((comp) => {
            const cx = toSvgX(comp.x);
            const cy = toSvgY(comp.y);
            const isHovered = hovered === comp.name;
            return (
              <g
                key={comp.name}
                onMouseEnter={() => setHovered(comp.name)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-default"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4.5}
                  fill="var(--nos-bg-overlay)"
                  stroke="var(--nos-text-muted)"
                  strokeWidth={1.5}
                  opacity={isHovered ? 1 : 0.7}
                />
                <text
                  x={cx + 8}
                  y={cy - 6}
                  className="fill-[var(--nos-text-muted)]"
                  style={{ fontSize: 9 }}
                >
                  {comp.name}
                </text>
              </g>
            );
          })}

          {/* Client dot */}
          {clientPoint && (
            <g>
              <motion.circle
                cx={toSvgX(clientPoint.x)}
                cy={toSvgY(clientPoint.y)}
                r={14}
                fill="var(--nos-accent)"
                fillOpacity={0.12}
                animate={{ r: [14, 18, 14] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <circle
                cx={toSvgX(clientPoint.x)}
                cy={toSvgY(clientPoint.y)}
                r={7}
                fill="var(--nos-accent)"
                stroke="var(--nos-bg-surface)"
                strokeWidth={2}
              />
              <text
                x={toSvgX(clientPoint.x) + 12}
                y={toSvgY(clientPoint.y) - 10}
                className="fill-[var(--nos-text-primary)]"
                style={{ fontSize: 11, fontWeight: 600 }}
              >
                {clientPoint.name}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--nos-text-muted)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--nos-accent)]" />
          Your brand
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--nos-text-muted)]">
          <span className="w-2.5 h-2.5 rounded-full border border-[var(--nos-text-muted)] bg-[var(--nos-bg-overlay)]" />
          Competitors
        </div>
      </div>
    </div>
  );
}
