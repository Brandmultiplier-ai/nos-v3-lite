"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNOSStore } from "@/lib/store";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Brain,
  BarChart3,
  Target,
  Search,
  Globe,
  FileText,
  Mail,
  DollarSign,
  Puzzle,
  Building2,
} from "lucide-react";

const sections = [
  { id: "narrative", label: "Narrative Intel", icon: Brain, path: "/" },
  { id: "brand", label: "Brand Intel", icon: BarChart3, path: "/brand" },
  { id: "positioning", label: "Positioning", icon: Target, path: "/positioning" },
  { id: "search", label: "Search Intel", icon: Search, path: "/search" },
  { id: "website", label: "Website Signals", icon: Globe, path: "/website" },
  { id: "content", label: "Content Marketing", icon: FileText, path: "/content/social" },
  { id: "outreach", label: "Cold Outreach", icon: Mail, path: "/outreach/email" },
  { id: "paid-media", label: "Paid Media", icon: DollarSign, path: "/paid-media" },
  { id: "integrations", label: "Integrations", icon: Puzzle, path: "/integrations" },
];

const clients = [
  { id: "nexus", label: "Nexfinity", type: "SaaS · Series B" },
  { id: "meridian", label: "Meridian Brands", type: "D2C-adjacent B2B" },
  { id: "apex", label: "Apex Systems", type: "Enterprise B2B" },
];

export function CommandPalette() {
  const commandOpen = useNOSStore((s) => s.commandOpen);
  const setCommandOpen = useNOSStore((s) => s.setCommandOpen);
  const setClient = useNOSStore((s) => s.setClient);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [commandOpen, setCommandOpen]);

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search sections, clients..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Sections">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <CommandItem
                key={s.id}
                value={s.label}
                onSelect={() => {
                  router.push(s.path);
                  setCommandOpen(false);
                }}
                className="gap-2 cursor-pointer"
              >
                <Icon size={14} className="text-[var(--nos-text-muted)]" />
                <span>{s.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Switch Workspace">
          {clients.map((c) => (
            <CommandItem
              key={c.id}
              value={c.label}
              onSelect={() => {
                setClient(c.id as "nexus" | "meridian" | "apex");
                setCommandOpen(false);
              }}
              className="gap-2 cursor-pointer"
            >
              <Building2 size={14} className="text-[var(--nos-text-muted)]" />
              <span>{c.label}</span>
              <span className="ml-auto text-xs text-[var(--nos-text-muted)]">{c.type}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
