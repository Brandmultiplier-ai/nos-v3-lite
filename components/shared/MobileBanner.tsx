"use client";

import { Monitor } from "lucide-react";

export function MobileBanner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--nos-bg-canvas)] p-8 md:hidden">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-[var(--nos-accent-muted)] flex items-center justify-center">
          <Monitor size={28} className="text-[var(--nos-accent)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--nos-text-primary)] mb-2">
            Best experienced on desktop
          </h2>
          <p className="text-sm text-[var(--nos-text-muted)] leading-relaxed">
            NOS is a command-center dashboard designed for large screens. Please open on a desktop or laptop for the full experience.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--nos-accent-border)] bg-[var(--nos-accent-muted)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--nos-accent)] animate-pulse" />
          <span className="text-xs text-[var(--nos-accent)] font-medium">NOS — Narrative Operating System</span>
        </div>
      </div>
    </div>
  );
}
