"use client";

import Link from "next/link";
import { ClientSwitcher } from "@/components/shared/ClientSwitcher";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Zap } from "lucide-react";

export function ContextStrip() {

  return (
    <header className="h-13 shrink-0 relative flex items-center px-4 gap-3 border-b border-[var(--border)] bg-[var(--nos-bg-glass)] backdrop-blur-xl">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--nos-accent)] to-transparent opacity-30 pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2 group">
        <div className="relative w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
          {/* Gradient background */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #7C7FFF 0%, #A78BFA 100%)",
            }}
          />
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-80 transition-opacity"
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
            }}
          />
          <Zap size={13} className="text-white relative z-10" />
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-[11px] font-bold text-[var(--nos-text-primary)] tracking-wide">
            NOS
          </span>
          <span className="text-label-caps">
            Intelligence
          </span>
        </div>
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
