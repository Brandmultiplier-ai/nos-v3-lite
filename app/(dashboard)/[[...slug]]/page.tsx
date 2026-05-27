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
  newsletter: "Newsletter",
};

const OUTREACH_TAB_LABELS: Record<string, string> = {
  email: "Email",
  linkedin: "LinkedIn",
};

export default function DashboardPage() {
  const params = useParams();
  const slug = params?.slug as string | string[] | undefined;
  const sectionId = getSectionId(slug);
  const subTab = getSubTab(slug);
  const meta = getSectionMeta(slug);

  let breadcrumb = meta.breadcrumb;
  if (sectionId === "content" && subTab) {
    breadcrumb = `${meta.breadcrumb} / ${CONTENT_TAB_LABELS[subTab] ?? subTab}`;
  }
  if (sectionId === "outreach" && subTab) {
    breadcrumb = `${meta.breadcrumb} / ${OUTREACH_TAB_LABELS[subTab] ?? subTab}`;
  }

  const sectionKey = subTab ? `${sectionId}-${subTab}` : sectionId;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] text-[var(--nos-text-muted)] mb-4">
        <span>Dashboard</span>
        <span>/</span>
        <span className="text-[var(--nos-text-secondary)]">{breadcrumb}</span>
      </div>

      <h1 className="text-xl font-semibold text-[var(--nos-text-primary)] mb-1">{meta.title}</h1>
      <p className="text-xs text-[var(--nos-text-muted)] mb-6">
        Real-time signal to pipeline intelligence
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={sectionKey}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {sectionId === "narrative" && <NarrativeIntel />}
          {sectionId === "brand" && <BrandIntel />}
          {sectionId === "positioning" && <Positioning />}
          {sectionId === "search" && <SearchIntel />}
          {sectionId === "website" && <WebsiteSignals />}
          {sectionId === "content" && (
            <ContentMarketing tab={(subTab as "social" | "linkedin" | "newsletter") ?? "social"} />
          )}
          {sectionId === "outreach" && (
            <ColdOutreach tab={(subTab as "email" | "linkedin") ?? "email"} />
          )}
          {sectionId === "integrations" && <Integrations />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
