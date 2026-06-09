"use client";

import Link from "next/link";
import { ClientSwitcher } from "@/components/shared/ClientSwitcher";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function ContextStrip() {

  return (
    <header className="h-13 shrink-0 relative flex items-center px-4 gap-3 border-b border-[var(--border)] bg-[var(--nos-bg-glass)] backdrop-blur-xl">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--nos-accent)] to-transparent opacity-30 pointer-events-none" />

      {/* Logo */}
      <Link href="/" aria-label="NOS — Narrative Operating System" className="flex items-center shrink-0 mr-2 group">
        {/* NOS wordmark — the O is the eclipse (BrandMultiplier purple→indigo) */}
        <span className="flex items-center text-[20px] font-bold tracking-[-0.03em] leading-none text-[var(--nos-text-primary)]">
          N
          <svg viewBox="0 0 100 100" aria-hidden="true" className="transition-transform group-hover:scale-105" style={{ width: "0.78em", height: "0.78em", marginInline: "0.01em" }}>
            <defs>
              <linearGradient id="nosEclipseGrad" x1="20" y1="14" x2="82" y2="88" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A855F7" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
              <mask id="nosEclipseMask">
                <circle cx="50" cy="50" r="42" fill="#fff" />
                <circle cx="61" cy="39" r="35" fill="#000" />
              </mask>
            </defs>
            <rect width="100" height="100" fill="url(#nosEclipseGrad)" mask="url(#nosEclipseMask)" />
          </svg>
          S
        </span>
      </Link>

      <div className="h-5 w-px bg-[var(--border)] shrink-0" />

      <ClientSwitcher compact />
      <DateRangePicker compact />

      {/* Live indicator */}
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--nos-bg-elevated)] border border-[var(--border)]">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[var(--nos-positive)]"
          style={{ animation: "pulseGlow 2s ease-in-out infinite" }}
        />
        <span className="text-[10px] font-medium text-[var(--nos-text-muted)]">Live</span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
      </div>
    </header>
  );
}
