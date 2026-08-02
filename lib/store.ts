import { create } from "zustand";

export type ClientId = "nexus" | "meridian" | "apex";
export type DateRange = "7d" | "30d" | "90d";

export const WORKSPACE_STORAGE_KEY = "nos.workspace";

export function isClientId(value: string | null | undefined): value is ClientId {
  return value === "nexus" || value === "meridian" || value === "apex";
}

function persistWorkspace(client: ClientId) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, client);
  } catch {
    // ignore write failures (private browsing, quota, etc.)
  }
}

interface NOSStore {
  activeClient: ClientId;
  dateRange: DateRange;
  setClient: (client: ClientId) => void;
  setDateRange: (range: DateRange) => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
}

export const useNOSStore = create<NOSStore>((set) => ({
  // Default is deterministic on server + first client render (avoids hydration
  // mismatch). Actual restore from localStorage/?ws= happens client-side after
  // mount via WorkspaceQueryInit.
  activeClient: "apex",
  dateRange: "30d",
  setClient: (client) => {
    persistWorkspace(client);
    set({ activeClient: client });
  },
  setDateRange: (range) => set({ dateRange: range }),
  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
}));
