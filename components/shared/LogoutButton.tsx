"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LogoutButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
      setOpen(false);
      router.push("/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all hover:bg-[var(--nos-bg-elevated)]"
        style={{
          border: "1px solid var(--border)",
          color: "var(--nos-text-muted)",
        }}
        aria-label="Log out"
      >
        <LogOut size={13} />
        <span className="hidden sm:inline">Log out</span>
      </button>

      <Dialog open={open} onOpenChange={(next) => !loading && setOpen(next)}>
        <DialogContent
          showCloseButton
          overlayClassName="bg-black/75 backdrop-blur-sm"
          className="gap-0 p-0 sm:max-w-[380px] ring-0 shadow-none border border-[var(--border)] !bg-[var(--nos-bg-surface)]"
          style={{
            backgroundColor: "var(--nos-bg-surface)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.65)",
          }}
        >
          <div
            className="p-6 pb-5"
            style={{ backgroundColor: "var(--nos-bg-surface)" }}
          >
            <DialogHeader className="gap-3 text-left">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                style={{
                  background: "rgba(255,68,85,0.12)",
                  border: "1px solid rgba(255,68,85,0.3)",
                }}
              >
                <LogOut size={18} style={{ color: "var(--nos-negative)" }} />
              </div>
              <DialogTitle
                className="text-base font-semibold"
                style={{ color: "var(--nos-text-primary)" }}
              >
                Log out?
              </DialogTitle>
              <DialogDescription
                className="text-sm leading-relaxed"
                style={{ color: "var(--nos-text-muted)" }}
              >
                Are you sure you want to log out? You&apos;ll need your passcode to
                access the dashboard again.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div
            className="flex items-center justify-end gap-2 px-6 py-4"
            style={{
              backgroundColor: "var(--nos-bg-elevated)",
              borderTop: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="rounded-xl px-4 py-2 text-sm font-medium transition-all disabled:opacity-50"
              style={{
                color: "var(--nos-text-secondary)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--nos-bg-surface)",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{
                backgroundColor: "var(--nos-negative)",
                minWidth: 88,
              }}
            >
              {loading ? "Logging out…" : "Log out"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
