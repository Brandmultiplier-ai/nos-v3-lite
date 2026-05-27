"use client";

import Link from "next/link";
import { useNOSStore } from "@/lib/store";
import { ClientSwitcher } from "@/components/shared/ClientSwitcher";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Bell, Command, Search, Zap } from "lucide-react";

export function ContextStrip() {
  const { setCommandOpen } = useNOSStore();

  return (
    <header className="h-12 shrink-0 bg-[var(--nos-bg-surface)] border-b border-[var(--border)] flex items-center px-4 gap-3">
      <Link href="/" className="flex items-center gap-2 shrink-0 mr-1">
        <div className="w-7 h-7 rounded-lg bg-[var(--nos-accent)] flex items-center justify-center">
          <Zap size={13} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-[var(--nos-text-primary)] hidden sm:block">
          NOS
        </span>
      </Link>

      <div className="h-5 w-px bg-[var(--border)] shrink-0" />

      <ClientSwitcher compact />

      <DateRangePicker compact />

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={() => setCommandOpen(true)}
          className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg border border-[var(--border)] bg-[var(--nos-bg-elevated)] text-xs text-[var(--nos-text-muted)] hover:text-[var(--nos-text-primary)] hover:border-[var(--nos-accent-border)] transition-colors"
        >
          <Search size={12} />
          <span>Search</span>
          <kbd className="text-[10px] opacity-50 border border-[var(--border)] rounded px-1 py-0.5">
            ⌘K
          </kbd>
        </button>
        <button
          onClick={() => setCommandOpen(true)}
          className="sm:hidden w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--nos-bg-elevated)] flex items-center justify-center"
        >
          <Command size={13} className="text-[var(--nos-text-muted)]" />
        </button>
        <ThemeToggle />
        <button className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--nos-bg-elevated)] flex items-center justify-center hover:border-[var(--nos-accent-border)] transition-colors">
          <Bell size={13} className="text-[var(--nos-text-muted)]" />
        </button>
      </div>
    </header>
  );
}
