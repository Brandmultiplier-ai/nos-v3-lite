import { create } from "zustand";

export type ClientId = "nexus" | "meridian" | "apex";
export type DateRange = "7d" | "30d" | "90d";

interface NOSStore {
  activeClient: ClientId;
  dateRange: DateRange;
  setClient: (client: ClientId) => void;
  setDateRange: (range: DateRange) => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
}

export const useNOSStore = create<NOSStore>((set) => ({
  activeClient: "nexus",
  dateRange: "30d",
  setClient: (client) => set({ activeClient: client }),
  setDateRange: (range) => set({ dateRange: range }),
  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
}));
