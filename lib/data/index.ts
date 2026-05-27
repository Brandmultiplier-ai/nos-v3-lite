"use client";

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

export function useClientData(): ClientData {
  const { activeClient, dateRange } = useNOSStore();
  return allData[activeClient][dateRange];
}

export function getClientData(clientId: string, range: "7d" | "30d" | "90d"): ClientData {
  return allData[clientId]?.[range] ?? nexusData["30d"];
}

export { type ClientData };
