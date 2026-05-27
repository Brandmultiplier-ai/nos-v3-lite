"use client";

import { motion } from "framer-motion";

interface BrandHealthGaugeProps {
  score: number;
  size?: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
}

export function BrandHealthGauge({ score, size = 200 }: BrandHealthGaugeProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2 - 4;
  const cx = size / 2;
  const cy = size / 2 + 8;

  // Semicircle arc: left (180°) to right (0°) through bottom
  const startX = cx - radius;
  const startY = cy;
  const endX = cx + radius;
  const endY = cy;
  const bgPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  const circumference = Math.PI * radius;
  const filledLength = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-sm font-semibold text-[var(--nos-text-primary)] self-start mb-0.5">
        Brand Health Score
      </p>
      <p className="text-xs text-[var(--nos-text-muted)] self-start mb-4">
        0–100 composite index
      </p>

      <div className="relative" style={{ width: size, height: size * 0.62 }}>
        <svg width={size} height={size * 0.62} className="overflow-visible">
          {/* Background track */}
          <path
            d={bgPath}
            fill="none"
            stroke="var(--nos-bg-elevated)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Filled track */}
          <motion.path
            d={bgPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${filledLength} ${circumference}`}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${filledLength} ${circumference}` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </svg>

        {/* Center score */}
        <div
          className="absolute inset-x-0 flex flex-col items-center"
          style={{ bottom: size * 0.08 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="font-mono-metric tabular-nums"
            style={{ color, fontSize: size * 0.24, lineHeight: 1 }}
          >
            {score}
          </motion.span>
          <span
            className="text-xs font-medium mt-1 px-2 py-0.5 rounded-full"
            style={{
              color,
              background: `${color}18`,
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
