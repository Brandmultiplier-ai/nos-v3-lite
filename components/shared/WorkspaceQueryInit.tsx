"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useNOSStore, isClientId, WORKSPACE_STORAGE_KEY, type ClientId } from "@/lib/store";

/** Maps human-friendly ?ws= values to internal client ids. */
const WS_PARAM_MAP: Record<string, ClientId> = {
  apex: "apex",
  nexfinity: "nexus",
  nexus: "nexus",
  meridian: "meridian",
};

/**
 * Runs once on mount, client-side only. Resolves the active workspace in
 * priority order: ?ws= query param > localStorage > store default (apex).
 * Deliberately not read at store-init time to avoid SSR hydration mismatches.
 */
function WorkspaceQueryInitInner() {
  const searchParams = useSearchParams();
  const setClient = useNOSStore((s) => s.setClient);

  useEffect(() => {
    const wsParam = searchParams.get("ws")?.toLowerCase();
    const fromQuery = wsParam ? WS_PARAM_MAP[wsParam] : undefined;

    if (fromQuery) {
      setClient(fromQuery);
      return;
    }

    try {
      const stored = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (isClientId(stored)) {
        setClient(stored);
      }
    } catch {
      // localStorage unavailable — keep default
    }
    // Runs once on mount; intentionally not re-running on searchParams changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function WorkspaceQueryInit() {
  return <WorkspaceQueryInitInner />;
}
