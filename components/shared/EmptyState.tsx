"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plug } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  tool: string;
}

export function EmptyState({ title, description, tool }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-48 rounded-xl border border-dashed border-[var(--border)] bg-[var(--nos-bg-surface)] gap-4 px-8 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-[var(--nos-bg-elevated)] flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--nos-text-muted)]">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--nos-text-primary)]">{title}</p>
        <p className="text-xs text-[var(--nos-text-muted)] mt-1">{description}</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="gap-2 border-[var(--nos-accent-border)] text-[var(--nos-accent)] hover:bg-[var(--nos-accent-muted)]"
      >
        <Plug size={12} />
        Connect {tool}
      </Button>
    </motion.div>
  );
}
