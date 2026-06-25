"use client";

import Link from "next/link";
import { ClientSwitcher } from "@/components/shared/ClientSwitcher";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LogoutButton } from "@/components/shared/LogoutButton";

export function ContextStrip() {
  return (
    <header className="h-13 shrink-0 relative flex items-center px-4 gap-3 border-b border-[var(--border)] bg-[var(--nos-bg-glass)] backdrop-blur-xl min-w-0">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--nos-accent)] to-transparent opacity-30 pointer-events-none" />

      <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
        <Link href="/" aria-label="NOS — Narrative Operating System" className="flex items-center shrink-0 mr-1 group">
          <span className="flex items-center text-[20px] font-bold tracking-[0.04em] leading-none text-[var(--nos-text-primary)]">
            N
            <svg viewBox="0 0 100 100" aria-hidden="true" className="transition-transform group-hover:scale-105" style={{ width: "0.92em", height: "0.92em", marginInline: "0.02em", overflow: "visible" }}>
              <defs>
                <linearGradient id="nosEclipseGrad" x1="18" y1="14" x2="84" y2="88" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A855F7" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <radialGradient id="nosEclipseCore" cx="42%" cy="38%" r="70%">
                  <stop offset="0" stopColor="#1a1830" />
                  <stop offset="1" stopColor="#08070d" />
                </radialGradient>
                <filter id="nosEclipseGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="2.4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle cx="50" cy="50" r="30" fill="url(#nosEclipseCore)" />
              <circle cx="50" cy="50" r="35.5" fill="none" stroke="url(#nosEclipseGrad)" strokeWidth="6" filter="url(#nosEclipseGlow)" />
              <circle cx="73" cy="27" r="4.6" fill="#fff" filter="url(#nosEclipseGlow)" />
            </svg>
            S
          </span>
        </Link>

        <div className="h-5 w-px bg-[var(--border)] shrink-0" />

        <ClientSwitcher compact />
        <DateRangePicker compact />

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--nos-bg-elevated)] border border-[var(--border)] shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[var(--nos-positive)]"
            style={{ animation: "pulseGlow 2s ease-in-out infinite" }}
          />
          <span className="text-[10px] font-medium text-[var(--nos-text-muted)]">Live</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <ThemeToggle />
        <LogoutButton variant="header" />
      </div>
    </header>
  );
}
