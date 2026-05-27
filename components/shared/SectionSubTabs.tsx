"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export interface SubTab {
  id: string;
  label: string;
  path: string;
}

interface SectionSubTabsProps {
  tabs: SubTab[];
}

export function SectionSubTabs({ tabs }: SectionSubTabsProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--nos-bg-elevated)] border border-[var(--border)] w-fit mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path || (tab.path.endsWith("/social") && pathname === "/content");
        return (
          <Link key={tab.id} href={tab.path} className="relative">
            {isActive && (
              <motion.div
                layoutId="sectionSubTab"
                className="absolute inset-0 rounded-md bg-[var(--nos-bg-surface)] border border-[var(--border)] shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span
              className={`relative z-10 block px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? "text-[var(--nos-text-primary)]"
                  : "text-[var(--nos-text-muted)] hover:text-[var(--nos-text-secondary)]"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
