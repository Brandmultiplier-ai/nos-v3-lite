"use client";

import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getSectionMeta } from "@/lib/section-meta";
import { NarrativeIntel } from "@/components/sections/NarrativeIntel";
import { BrandIntel } from "@/components/sections/BrandIntel";
import { Positioning } from "@/components/sections/Positioning";
import { SearchIntel } from "@/components/sections/SearchIntel";
import { WebsiteSignals } from "@/components/sections/WebsiteSignals";
import { ContentMarketing } from "@/components/sections/ContentMarketing";
import { ColdOutreach } from "@/components/sections/ColdOutreach";
import { Integrations } from "@/components/sections/Integrations";
import { PaidMedia } from "@/components/sections/PaidMedia";
import { ChevronRight } from "lucide-react";
import { useNOSStore } from "@/lib/store";

function getSectionId(slug?: string | string[]): string {
  if (!slug) return "narrative";
  const s = Array.isArray(slug) ? slug[0] : slug;
  return s || "narrative";
}

function getSubTab(slug?: string | string[]): string | undefined {
  if (!slug || !Array.isArray(slug)) return undefined;
  return slug[1];
}

const CONTENT_TAB_LABELS: Record<string, string> = {
  social: "Social Channels",
  linkedin: "LinkedIn Content",
  blog: "Blog & Content",
  newsletter: "Newsletter",
};

const OUTREACH_TAB_LABELS: Record<string, string> = {
  email: "Email",
  linkedin: "LinkedIn",
};

const SEARCH_TAB_LABELS: Record<string, string> = {
  seo: "SEO",
  geo: "GEO",
};

export default function DashboardPage() {
  const params = useParams();
  const activeClient = useNOSStore((s) => s.activeClient);
  const dateRange = useNOSStore((s) => s.dateRange);
  const slug = params?.slug as string | string[] | undefined;
  const sectionId = getSectionId(slug);
  const subTab = getSubTab(slug);
  const meta = getSectionMeta(slug);

  let tabLabel: string | undefined;
  if (sectionId === "content" && subTab) tabLabel = CONTENT_TAB_LABELS[subTab] ?? subTab;
  if (sectionId === "outreach" && subTab) tabLabel = OUTREACH_TAB_LABELS[subTab] ?? subTab;
  if (sectionId === "search" && subTab) tabLabel = SEARCH_TAB_LABELS[subTab] ?? subTab;

  const sectionKey = `${activeClient}-${dateRange}-${subTab ? `${sectionId}-${subTab}` : sectionId}`;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-[10px] mb-5" style={{ color: "var(--nos-text-muted)" }}>
        <span>Dashboard</span>
        <ChevronRight size={10} />
        <span style={{ color: "var(--nos-text-secondary)" }}>{meta.breadcrumb}</span>
        {tabLabel && (
          <>
            <ChevronRight size={10} />
            <span style={{ color: "var(--nos-accent)" }}>{tabLabel}</span>
          </>
        )}
      </div>

      {/* Page title */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold mb-1 tracking-tight"
              style={{
                background: "linear-gradient(135deg, var(--nos-text-primary) 40%, var(--nos-accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {meta.title}
            </h1>
            <p className="text-xs" style={{ color: "var(--nos-text-muted)" }}>
              Real-time signal to pipeline intelligence
            </p>
          </div>

          {/* Live status */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
            style={{
              background: "rgba(52,211,153,0.06)",
              border: "1px solid rgba(52,211,153,0.15)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--nos-positive)", animation: "pulseGlow 2s ease-in-out infinite" }}
            />
            <span className="text-[10px] font-medium" style={{ color: "var(--nos-positive)" }}>
              Synced
            </span>
          </div>
        </div>

        {/* Divider with glow */}
        <div className="mt-4 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent)" }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={sectionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {sectionId === "narrative" && <NarrativeIntel />}
          {sectionId === "brand" && <BrandIntel />}
          {sectionId === "positioning" && <Positioning />}
          {sectionId === "search" && <SearchIntel tab={(subTab as "seo" | "geo") ?? "seo"} />}
          {sectionId === "website" && <WebsiteSignals />}
          {sectionId === "content" && (
            <ContentMarketing tab={(subTab as "social" | "linkedin" | "blog" | "newsletter") ?? "social"} />
          )}
          {sectionId === "outreach" && (
            <ColdOutreach tab={(subTab as "email" | "linkedin") ?? "email"} />
          )}
          {sectionId === "paid-media" && <PaidMedia />}
          {sectionId === "integrations" && <Integrations />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
