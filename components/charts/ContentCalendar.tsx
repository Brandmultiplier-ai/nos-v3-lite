"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { CalendarPost } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";

const CHANNEL_COLORS: Record<string, string> = {
  linkedin: "#0A66C2",
  instagram: "#E1306C",
  facebook: "#1877F2",
  x: "#FFFFFF",
  newsletter: "var(--nos-ch-newsletter)",
};

interface ContentCalendarProps {
  posts: CalendarPost[];
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

export function ContentCalendar({ posts }: ContentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Build February 2026 grid
  const year = 2026;
  const month = 1; // February
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return posts.filter((p) => p.date === dateStr);
  };

  const selectedPosts = selectedDate ? posts.filter((p) => p.date === selectedDate) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[var(--nos-text-primary)]">Content Calendar</p>
          <p className="text-xs text-[var(--nos-text-muted)]">February 2026 · Click a day to view posts</p>
        </div>
        {/* Channel legend */}
        <div className="flex items-center gap-3">
          {Object.entries(CHANNEL_COLORS).map(([ch, color]) => (
            <div key={ch} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[10px] text-[var(--nos-text-muted)] capitalize">{ch}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="text-center text-[10px] text-[var(--nos-text-muted)] py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dayPosts = getPostsForDay(day);
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          return (
            <motion.button
              key={day}
              onClick={() => {
                if (dayPosts.length > 0) {
                  setSelectedDate(dateStr);
                  setSheetOpen(true);
                }
              }}
              whileHover={{ scale: dayPosts.length > 0 ? 1.04 : 1 }}
              className={`relative min-h-[56px] rounded-lg p-1.5 text-left transition-colors ${
                dayPosts.length > 0
                  ? "bg-[var(--nos-bg-elevated)] hover:bg-[var(--nos-bg-overlay)] cursor-pointer border border-[var(--border)]"
                  : "bg-transparent"
              }`}
            >
              <span className="text-xs text-[var(--nos-text-muted)]">{day}</span>
              {dayPosts.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-1">
                  {dayPosts.map((post, idx) => (
                    <div
                      key={idx}
                      className="w-2 h-2 rounded-full"
                      style={{ background: CHANNEL_COLORS[post.channel] ?? "#6366F1" }}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Sheet drawer for post detail */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-[400px] bg-[var(--nos-bg-surface)] border-[var(--border)]"
        >
          <SheetHeader>
            <SheetTitle className="text-[var(--nos-text-primary)]">
              Posts on {selectedDate}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-4 overflow-y-auto">
            {selectedPosts.map((post, i) => (
              <div key={i} className="nos-card">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: CHANNEL_COLORS[post.channel] ?? "#6366F1" }}
                  />
                  <Badge
                    className="text-[10px] capitalize"
                    style={{
                      background: `${CHANNEL_COLORS[post.channel]}20`,
                      color: CHANNEL_COLORS[post.channel],
                      border: `1px solid ${CHANNEL_COLORS[post.channel]}40`,
                    }}
                  >
                    {post.channel}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-[var(--nos-text-primary)] mb-1">{post.title}</p>
                <p className="text-xs text-[var(--nos-text-muted)] mb-3 leading-relaxed">{post.content}</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-[var(--nos-text-muted)]">Reach</p>
                    <p className="text-sm font-semibold text-[var(--nos-text-primary)]">
                      {post.reach >= 1000 ? `${(post.reach / 1000).toFixed(0)}k` : post.reach}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--nos-text-muted)]">Engagement</p>
                    <p className="text-sm font-semibold text-[var(--nos-text-primary)]">{post.engagementRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--nos-text-muted)]">Pipeline</p>
                    <p className="text-sm font-semibold text-[var(--nos-positive)]">{fmt(post.pipeline)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
