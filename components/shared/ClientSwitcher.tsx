"use client";

import { useNOSStore, type ClientId } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

const clients: { id: ClientId; name: string; type: string; stage: string; initials: string }[] = [
  { id: "nexus", name: "Nexfinity", type: "SaaS", stage: "Series B", initials: "NX" },
  { id: "meridian", name: "Meridian Brands", type: "D2C-adjacent B2B", stage: "Growth", initials: "MB" },
  { id: "apex", name: "Apex Systems", type: "Enterprise B2B", stage: "Enterprise", initials: "AS" },
];

interface ClientSwitcherProps {
  compact?: boolean;
}

export function ClientSwitcher({ compact = false }: ClientSwitcherProps) {
  const activeClient = useNOSStore((s) => s.activeClient);
  const setClient = useNOSStore((s) => s.setClient);
  const current = clients.find((c) => c.id === activeClient)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={`inline-flex items-center gap-2 rounded-lg font-medium text-[var(--nos-text-primary)] bg-[var(--nos-bg-elevated)] border border-[var(--border)] hover:border-[var(--nos-accent-border)] transition-colors focus:outline-none whitespace-nowrap ${
              compact ? "h-8 px-2.5 text-xs max-w-[140px]" : "h-9 px-3 text-sm"
            }`}
          />
        }
      >
        <span className="w-5 h-5 rounded-md bg-[var(--nos-accent)] flex items-center justify-center shrink-0 text-[9px] font-bold text-white">
          {current.initials}
        </span>
        <span className="truncate">{current.name}</span>
        <ChevronDown size={12} className="text-[var(--nos-text-muted)] shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 bg-[var(--nos-bg-surface)] border-[var(--border)]"
      >
        <div className="px-3 py-2 border-b border-[var(--border)]">
          <p className="text-[10px] text-label-caps text-[var(--nos-text-muted)]">Workspace</p>
        </div>
        <DropdownMenuRadioGroup
          value={activeClient}
          onValueChange={(value) => setClient(value as ClientId)}
        >
          {clients.map((client) => (
            <DropdownMenuRadioItem
              key={client.id}
              value={client.id}
              closeOnClick
              className={`gap-3 cursor-pointer py-2.5 ${
                client.id === activeClient ? "bg-[var(--nos-accent-muted)]" : ""
              }`}
            >
              <span className="w-8 h-8 rounded-lg bg-[var(--nos-accent-muted)] flex items-center justify-center shrink-0 text-[10px] font-bold text-[var(--nos-accent)]">
                {client.initials}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--nos-text-primary)]">{client.name}</p>
                <p className="text-xs text-[var(--nos-text-muted)]">
                  {client.type} · {client.stage}
                </p>
              </div>
              {client.id === activeClient && (
                <Check size={14} className="text-[var(--nos-accent)] shrink-0" />
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
