"use client";

import { createContext, useContext, useMemo } from "react";
import { useNOSStore } from "@/lib/store";
import { nexusData } from "./client-nexus";
import { meridianData } from "./client-meridian";
import { apexData } from "./client-apex";
import type { ClientData, ClientDataByRange } from "./types";

const allData: Record<string, ClientDataByRange> = {
  nexus: nexusData,
  meridian: meridianData,
  apex: apexData,
};

const ClientDataContext = createContext<ClientData | null>(null);

export function ClientDataProvider({ children }: { children: React.ReactNode }) {
  const activeClient = useNOSStore((s) => s.activeClient);
  const dateRange = useNOSStore((s) => s.dateRange);

  const data = useMemo(
    () => allData[activeClient][dateRange],
    [activeClient, dateRange],
  );

  return (
    <ClientDataContext.Provider value={data}>
      {children}
    </ClientDataContext.Provider>
  );
}

export function useClientDataContext(): ClientData {
  const data = useContext(ClientDataContext);
  if (!data) {
    throw new Error("useClientData must be used within ClientDataProvider");
  }
  return data;
}
