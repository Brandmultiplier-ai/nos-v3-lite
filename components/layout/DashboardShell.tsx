"use client";

import { ClientDataProvider, useDataKey } from "@/lib/data";
import { ContextStrip } from "@/components/nav/ContextStrip";
import { SectionList } from "@/components/nav/SectionList";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const dataKey = useDataKey();

  return (
    <ClientDataProvider>
      <div className="hidden md:flex flex-col h-screen overflow-hidden bg-[var(--nos-bg-canvas)]">
        <ContextStrip />
        <div className="flex flex-1 overflow-hidden min-h-0">
          <SectionList key={`nav-${dataKey}`} />
          <main className="flex-1 overflow-y-auto min-w-0">
            <div key={`content-${dataKey}`} className="max-w-[1200px] mx-auto p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ClientDataProvider>
  );
}
