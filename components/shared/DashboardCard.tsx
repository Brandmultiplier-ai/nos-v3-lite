"use client";

import { cn } from "@/lib/utils";
import { CardInfoButton } from "./CardInfoButton";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  info?: string;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function DashboardCard({
  title,
  subtitle,
  info,
  children,
  className,
  glow = false,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "nos-card relative",
        glow && "glow-accent",
        className
      )}
    >
      {(title || subtitle) && (
        <div className={cn("mb-3", info && "pr-8")}>
          {title && (
            <p className="text-sm font-semibold" style={{ color: "var(--nos-text-primary)" }}>
              {title}
            </p>
          )}
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: "var(--nos-text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}

      {info && (
        <div className="absolute top-3.5 right-3.5 z-30 pointer-events-auto">
          <CardInfoButton description={info} />
        </div>
      )}
    </div>
  );
}
