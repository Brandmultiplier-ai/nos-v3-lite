"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import {
  Brain, BarChart3, Target, Search, Globe, FileText, Mail, DollarSign, Puzzle, Lock,
} from "lucide-react";
import { useState } from "react";

const sections = [
  {
    id: "narrative",
    icon: Brain,
    label: "Narrative Intel",
    path: "/",
    kpiLabel: "CAC",
    getKPI: (data: ReturnType<typeof useClientData>) => `$${(data.kpis.cac.value / 1000).toFixed(1)}k`,
    getChange: (data: ReturnType<typeof useClientData>) => data.kpis.cac.change,
    invertChange: true,
  },
  {
    id: "brand",
    icon: BarChart3,
    label: "Brand Intel",
    path: "/brand",
    kpiLabel: "Brand Score",
    getKPI: (data: ReturnType<typeof useClientData>) => `${data.brand.brandScore}/100`,
    getChange: (data: ReturnType<typeof useClientData>) => data.brand.brandScoreChange,
    invertChange: false,
  },
  {
    id: "positioning",
    icon: Target,
    label: "Positioning",
    path: "/positioning",
    kpiLabel: "Quadrant",
    getKPI: () => "Leader",
    getChange: () => 5,
    invertChange: false,
  },
  {
    id: "search",
    icon: Search,
    label: "Search Intel",
    path: "/search/seo",
    kpiLabel: "GEO Visibility",
    getKPI: (data: ReturnType<typeof useClientData>) =>
      `${data.search.geo.visibilityScore}%`,
    getChange: (data: ReturnType<typeof useClientData>) => data.search.geo.visibilityChange,
    invertChange: false,
  },
  {
    id: "website",
    icon: Globe,
    label: "Website Signals",
    path: "/website",
    kpiLabel: "Hot Accounts",
    getKPI: (data: ReturnType<typeof useClientData>) =>
      String(Math.round(data.website.hotAccounts.value)),
    getChange: (data: ReturnType<typeof useClientData>) => data.website.hotAccounts.change,
    invertChange: false,
  },
  {
    id: "content",
    icon: FileText,
    label: "Content Marketing",
    path: "/content/social",
    kpiLabel: "Pipeline",
    getKPI: (data: ReturnType<typeof useClientData>) => {
      const total = data.content.socialOverview.reduce((a, r) => a + r.pipeline, 0);
      return total >= 1000000 ? `$${(total / 1000000).toFixed(1)}M` : `$${(total / 1000).toFixed(0)}k`;
    },
    getChange: () => 18,
    invertChange: false,
  },
  {
    id: "outreach",
    icon: Mail,
    label: "Cold Outreach",
    path: "/outreach/email",
    kpiLabel: "Email Pipeline",
    getKPI: (data: ReturnType<typeof useClientData>) => {
      const v = data.outreach.emailPipeline.value;
      return v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}k`;
    },
    getChange: (data: ReturnType<typeof useClientData>) => data.outreach.emailPipeline.change,
    invertChange: false,
  },
  {
    id: "paid-media",
    icon: DollarSign,
    label: "Paid Media",
    path: "/paid-media",
    kpiLabel: "Blended ROAS",
    getKPI: (data: ReturnType<typeof useClientData>) => `${data.paidMedia.roas.value.toFixed(1)}×`,
    getChange: (data: ReturnType<typeof useClientData>) => data.paidMedia.roas.change,
    invertChange: false,
  },
  {
    id: "integrations",
    icon: Puzzle,
    label: "Integrations",
    path: "/integrations",
    kpiLabel: "Connected",
    getKPI: (data: ReturnType<typeof useClientData>) => {
      const connected = data.integrations.filter((i) => i.connected).length;
      return `${connected}/${data.integrations.length}`;
    },
    getChange: () => 0,
    invertChange: false,
  },
];

function getActiveSection(pathname: string) {
  if (pathname.includes("/brand")) return "brand";
  if (pathname.includes("/positioning")) return "positioning";
  if (pathname.includes("/search")) return "search";
  if (pathname.includes("/website")) return "website";
  if (pathname.includes("/content")) return "content";
  if (pathname.includes("/outreach")) return "outreach";
  if (pathname.includes("/paid-media")) return "paid-media";
  if (pathname.includes("/integrations")) return "integrations";
  return "narrative";
}

export function SectionList() {
  const pathname = usePathname();
  const active = getActiveSection(pathname);
  const data = useClientData();
  const [lockedTooltip, setLockedTooltip] = useState<string | null>(null);

  const isEnterprise = data.meta.stage === "Enterprise";
  const connectedIntegrations = data.integrations.filter((i) => i.connected);

  return (
    <aside className="w-[272px] shrink-0 h-full flex flex-col overflow-hidden relative" style={{ background: "var(--nos-bg-canvas)" }}>
      {/* Right border with gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent" />

      {/* Section header */}
      <div className="px-4 py-3.5 border-b border-[var(--border)]">
        <p className="text-[10px] text-label-caps" style={{ color: "var(--nos-text-muted)" }}>
          Intelligence Modules
        </p>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = active === section.id;
          const isLocked = section.id === "paid-media" && !isEnterprise;
          const showTooltip = lockedTooltip === section.id;

          return (
            <div key={section.id}>
              <div className="relative mb-0.5">
                {/* Active background glow */}
                {isActive && !isLocked && (
                  <motion.div
                    layoutId="splitNavActive"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, var(--nos-accent-muted) 0%, rgba(167,139,250,0.05) 100%)",
                      border: "1px solid var(--nos-accent-border)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                {/* Active left accent */}
                {isActive && !isLocked && (
                  <div
                    className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-r-full"
                    style={{ background: "linear-gradient(180deg, var(--nos-accent) 0%, var(--nos-accent-2) 100%)" }}
                  />
                )}

                <div className="relative flex items-center">
                  {isLocked ? (
                    /* Locked state — not clickable as a link */
                    <button
                      className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left w-full cursor-not-allowed opacity-50"
                      onClick={() => setLockedTooltip(showTooltip ? null : section.id)}
                      onBlur={() => setLockedTooltip(null)}
                      aria-label={`${section.label} — Enterprise only`}
                    >
                      <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0">
                        <Icon size={13} style={{ color: "var(--nos-text-muted)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "var(--nos-text-muted)" }}>
                          {section.label}
                        </p>
                        <p className="text-[10px] mt-0.5 truncate" style={{ color: "var(--nos-text-muted)" }}>
                          {section.kpiLabel}
                        </p>
                      </div>
                      <Lock size={11} style={{ color: "var(--nos-text-muted)" }} className="shrink-0" />
                    </button>
                  ) : (
                    <Link
                      href={section.path}
                      className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                    >
                      {/* Icon container */}
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                        style={{
                          background: isActive ? "var(--nos-accent-muted)" : "transparent",
                        }}
                      >
                        <Icon
                          size={13}
                          style={{ color: isActive ? "var(--nos-accent)" : "var(--nos-text-muted)" }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-medium truncate"
                          style={{
                            color: isActive ? "var(--nos-text-primary)" : "var(--nos-text-secondary)",
                          }}
                        >
                          {section.label}
                        </p>
                        <p
                          className="text-[10px] mt-0.5 truncate"
                          style={{ color: "var(--nos-text-muted)" }}
                        >
                          {section.kpiLabel}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>

                {/* Lock tooltip */}
                {isLocked && showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-full top-0 ml-2 z-50 w-56 rounded-xl p-3 shadow-xl"
                    style={{
                      background: "var(--nos-bg-card)",
                      border: "1px solid var(--border)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <Lock size={13} className="mt-0.5 shrink-0" style={{ color: "var(--nos-neutral)" }} />
                      <div>
                        <p className="text-xs font-semibold text-[var(--nos-text-primary)] mb-1">Enterprise plan required</p>
                        <p className="text-[11px] text-[var(--nos-text-muted)] leading-relaxed">
                          Paid Media analytics is available on the Enterprise plan.{" "}
                          <span className="font-medium" style={{ color: "var(--nos-text-secondary)" }}>
                            {data.meta.name}
                          </span>{" "}
                          is currently on the <span className="font-medium" style={{ color: "var(--nos-neutral)" }}>{data.meta.stage}</span> plan. Upgrade to unlock cross-platform ad intelligence.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration health footer */}
      <div className="px-4 py-3 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-label-caps">Integrations</p>
          <span className="text-[10px]" style={{ color: "var(--nos-text-muted)" }}>
            {connectedIntegrations.length}/{data.integrations.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--nos-bg-elevated)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(connectedIntegrations.length / data.integrations.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--nos-accent) 0%, var(--nos-positive) 100%)" }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2 items-center">
          {data.integrations.map((integ) => (
            <div
              key={integ.id}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: integ.connected ? "var(--nos-positive)" : "var(--nos-bg-elevated)",
              }}
              title={`${integ.name}: ${integ.connected ? "Connected" : "Disconnected"}`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
