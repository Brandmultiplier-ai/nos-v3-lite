"use client";

import { useNOSStore } from "@/lib/store";
import { nexusData } from "./client-nexus";
import { meridianData } from "./client-meridian";
import { apexData } from "./client-apex";
import type { ClientData, ClientDataByRange } from "./types";
import { useClientDataContext, ClientDataProvider } from "./context";

const allData: Record<string, ClientDataByRange> = {
  nexus: nexusData,
  meridian: meridianData,
  apex: apexData,
};

export { ClientDataProvider };

export function useClientData(): ClientData {
  return useClientDataContext();
}

export function useDataKey(): string {
  const activeClient = useNOSStore((s) => s.activeClient);
  const dateRange = useNOSStore((s) => s.dateRange);
  return `${activeClient}-${dateRange}`;
}

export function getClientData(clientId: string, range: "7d" | "30d" | "90d"): ClientData {
  return allData[clientId]?.[range] ?? nexusData["30d"];
}

export { type ClientData };
