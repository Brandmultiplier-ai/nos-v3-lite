"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useClientData } from "@/lib/data";
import {
  Brain, BarChart3, Target, Search, Globe, FileText, Mail, Puzzle,
  ChevronRight,
} from "lucide-react";

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
    kpiLabel: "Health Score",
    getKPI: (data: ReturnType<typeof useClientData>) => `${data.brand.healthScore}/100`,
    getChange: () => 8,
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
    path: "/search",
    kpiLabel: "GEO Citations",
    getKPI: (data: ReturnType<typeof useClientData>) =>
      `+${data.search.geoEngines.reduce((a, e) => a + e.citations, 0)}`,
    getChange: () => 34,
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
    subItems: [
      { label: "Social Channels", path: "/content/social" },
      { label: "LinkedIn Content", path: "/content/linkedin" },
      { label: "Newsletter", path: "/content/newsletter" },
    ],
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
    subItems: [
      { label: "Email", path: "/outreach/email" },
      { label: "LinkedIn", path: "/outreach/linkedin" },
    ],
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
  if (pathname.includes("/integrations")) return "integrations";
  return "narrative";
}

function isSubItemActive(pathname: string, path: string) {
  return pathname === path;
}

export function SectionList() {
  const pathname = usePathname();
  const active = getActiveSection(pathname);
  const data = useClientData();
  const [expanded, setExpanded] = useState<string[]>(["content", "outreach"]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const connectedIntegrations = data.integrations.filter((i) => i.connected);

  return (
    <aside className="w-[280px] shrink-0 h-full bg-[var(--nos-bg-surface)] border-r border-[var(--border)] flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <p className="text-[10px] text-label-caps text-[var(--nos-text-muted)]">Sections</p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = active === section.id;
          const hasSubItems = section.subItems && section.subItems.length > 0;
          const isExpanded = expanded.includes(section.id);
          const kpiValue = section.getKPI(data);
          const kpiChange = section.getChange(data);
          const isPositive = section.invertChange ? kpiChange < 0 : kpiChange > 0;

          return (
            <div key={section.id}>
              <div className="relative mx-2 mb-0.5">
                {isActive && (
                  <motion.div
                    layoutId="splitNavActive"
                    className="absolute inset-0 rounded-lg bg-[var(--nos-accent-muted)]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-[var(--nos-accent)]" />
                )}
                <div className="relative flex items-center gap-0">
                  <Link
                    href={section.path}
                    className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                  >
                    <Icon
                      size={15}
                      style={{ color: isActive ? "var(--nos-accent)" : "var(--nos-text-muted)" }}
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${
                          isActive
                            ? "text-[var(--nos-text-primary)]"
                            : "text-[var(--nos-text-secondary)]"
                        }`}
                      >
                        {section.label}
                      </p>
                      <p className="text-[10px] text-[var(--nos-text-muted)] flex items-center gap-1 mt-0.5">
                        <span>{section.kpiLabel}:</span>
                        <span
                          className={`font-medium ${
                            isPositive
                              ? "text-[var(--nos-positive)]"
                              : kpiChange === 0
                                ? "text-[var(--nos-text-secondary)]"
                                : "text-[var(--nos-negative)]"
                          }`}
                        >
                          {kpiValue}
                        </span>
                        {kpiChange !== 0 && (
                          <span
                            className={
                              isPositive
                                ? "text-[var(--nos-positive)]"
                                : "text-[var(--nos-negative)]"
                            }
                          >
                            {isPositive ? "↑" : "↓"}
                            {Math.abs(kpiChange)}%
                          </span>
                        )}
                      </p>
                    </div>
                  </Link>
                  {hasSubItems && (
                    <button
                      onClick={() => toggleExpand(section.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--nos-bg-elevated)] mr-1 transition-colors"
                    >
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ChevronRight size={12} className="text-[var(--nos-text-muted)]" />
                      </motion.div>
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {hasSubItems && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-8 mr-2 mb-1">
                      {section.subItems!.map((sub) => {
                        const subActive = isSubItemActive(pathname, sub.path);
                        return (
                          <Link
                            key={sub.label}
                            href={sub.path}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] transition-colors ${
                              subActive
                                ? "text-[var(--nos-accent)] bg-[var(--nos-accent-muted)] font-medium"
                                : "text-[var(--nos-text-muted)] hover:text-[var(--nos-text-primary)] hover:bg-[var(--nos-bg-elevated)]"
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full ${subActive ? "bg-[var(--nos-accent)]" : "bg-current opacity-40"}`} />
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-[var(--border)]">
        <p className="text-[10px] text-label-caps mb-2">Integration Health</p>
        <div className="flex flex-wrap gap-1.5 items-center">
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
          <span className="text-[10px] text-[var(--nos-text-muted)]">
            {connectedIntegrations.length}/{data.integrations.length} active
          </span>
        </div>
      </div>
    </aside>
  );
}
