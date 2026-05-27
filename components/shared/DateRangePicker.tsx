"use client";

import { useNOSStore, type DateRange } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDays, ChevronDown } from "lucide-react";

const ranges: { id: DateRange; label: string; shortLabel: string }[] = [
  { id: "7d", label: "Last 7 days", shortLabel: "7d" },
  { id: "30d", label: "Last 30 days", shortLabel: "30d" },
  { id: "90d", label: "Last 90 days", shortLabel: "90d" },
];

interface DateRangePickerProps {
  compact?: boolean;
}

export function DateRangePicker({ compact = false }: DateRangePickerProps) {
  const { dateRange, setDateRange } = useNOSStore();
  const current = ranges.find((r) => r.id === dateRange)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={`inline-flex items-center gap-1.5 rounded-lg font-medium text-[var(--nos-text-primary)] bg-[var(--nos-bg-elevated)] border border-[var(--border)] hover:border-[var(--nos-accent-border)] transition-colors focus:outline-none whitespace-nowrap ${
              compact ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm"
            }`}
          />
        }
      >
        <CalendarDays size={compact ? 11 : 13} className="text-[var(--nos-text-muted)] shrink-0" />
        <span>{compact ? current.shortLabel : current.label}</span>
        <ChevronDown size={11} className="text-[var(--nos-text-muted)] shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-44 bg-[var(--nos-bg-surface)] border-[var(--border)]"
      >
        <div className="px-3 py-2 border-b border-[var(--border)]">
          <p className="text-[10px] text-label-caps text-[var(--nos-text-muted)]">Date range</p>
        </div>
        {ranges.map((range) => (
          <DropdownMenuItem
            key={range.id}
            onClick={() => setDateRange(range.id)}
            className={`cursor-pointer text-sm py-2 ${
              range.id === dateRange
                ? "bg-[var(--nos-accent-muted)] text-[var(--nos-accent)]"
                : "text-[var(--nos-text-primary)]"
            }`}
          >
            {range.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
