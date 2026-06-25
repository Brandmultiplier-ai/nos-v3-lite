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
    <div className="flex justify-center mb-2">
      <div
        className="flex items-center gap-1.5 p-1.5 rounded-2xl"
        style={{
          background: "var(--nos-bg-elevated)",
          border: "1px solid var(--border)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.path.endsWith("/social") && pathname === "/content");
          return (
            <Link key={tab.id} href={tab.path} scroll={false} className="relative">
              {isActive && (
                <motion.div
                  layoutId="sectionSubTab"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, var(--nos-accent-muted) 0%, rgba(167,139,250,0.06) 100%)",
                    border: "1px solid var(--nos-accent-border)",
                    boxShadow: "0 0 12px var(--nos-accent-glow)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span
                className="relative z-10 block px-6 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                style={{
                  color: isActive ? "var(--nos-accent)" : "var(--nos-text-muted)",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
