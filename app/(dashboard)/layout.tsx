import { ContextStrip } from "@/components/nav/ContextStrip";
import { SectionList } from "@/components/nav/SectionList";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden md:flex flex-col h-screen overflow-hidden bg-[var(--nos-bg-canvas)]">
      <ContextStrip />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <SectionList />
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="max-w-[1200px] mx-auto p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
