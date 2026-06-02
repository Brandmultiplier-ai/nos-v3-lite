"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, RefreshCw, Plug, Loader2, X } from "lucide-react";
import type { Integration } from "@/lib/data/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const CATEGORY_ORDER = ["crm", "social", "seo", "outreach", "website-intel", "analytics", "paid-media"];
const CATEGORY_LABELS: Record<string, string> = {
  crm: "CRM",
  social: "Social Channels",
  seo: "SEO & Search",
  outreach: "Outreach Sequencer",
  "website-intel": "Website Intelligence",
  analytics: "Analytics",
  "paid-media": "Paid Media",
};

/* ─── Authentic brand logos ─── */
function BrandLogo({ id, size = 32 }: { id: string; size?: number }) {
  const s = size;
  switch (id) {
    /* HubSpot CRM */
    case "crm":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#FF7A59" />
          <path d="M20.5 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0-1.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="white" />
          <path d="M20.5 13.5v2.3l-5.5 3.2v-2.5l5.5-3z" fill="white" />
          <path d="M14.5 19.2l-4 2.3a2.5 2.5 0 1 0 2 1.1l4-2.3-2-1.1z" fill="white" />
          <circle cx="10.5" cy="23.5" r="1.5" fill="#FF7A59" />
        </svg>
      );
    /* Salesforce */
    case "salesforce":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#00A1E0" />
          <path d="M13.5 10a3.5 3.5 0 0 1 3.2 2.1 3 3 0 0 1 3.8.9 2.5 2.5 0 0 1 3 2.4 2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 9.5 15c0-.8.4-1.5 1-2A3.5 3.5 0 0 1 13.5 10z" fill="white" />
        </svg>
      );
    /* LinkedIn */
    case "linkedin":
    case "linkedin-ads":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#0A66C2" />
          <rect x="8" y="13" width="4" height="11" rx="1" fill="white" />
          <circle cx="10" cy="10" r="2.2" fill="white" />
          <path d="M15 13h3.5v1.6a4 4 0 0 1 3.5-1.8c3 0 4 2 4 4.5V24h-4v-5.5c0-1.3-.5-2.2-1.8-2.2-1.5 0-2.2 1-2.2 2.5V24H15V13z" fill="white" />
        </svg>
      );
    /* Instagram */
    case "instagram":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id={`ig-${s}`} x1="0" y1="32" x2="32" y2="0">
              <stop offset="0%" stopColor="#FED373" />
              <stop offset="25%" stopColor="#F15245" />
              <stop offset="50%" stopColor="#D92E7F" />
              <stop offset="75%" stopColor="#9B36B7" />
              <stop offset="100%" stopColor="#515BD4" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="7" fill={`url(#ig-${s})`} />
          <rect x="8.5" y="8.5" width="15" height="15" rx="4.5" stroke="white" strokeWidth="1.8" fill="none" />
          <circle cx="16" cy="16" r="4" stroke="white" strokeWidth="1.8" fill="none" />
          <circle cx="21" cy="11" r="1.2" fill="white" />
        </svg>
      );
    /* Facebook / Meta */
    case "facebook":
    case "meta-ads":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#1877F2" />
          <path d="M21 8.5h-3a5 5 0 0 0-5 5v2.5H11V20h2v8h4v-8h3l.5-4H17v-2a1 1 0 0 1 1-1h3V8.5z" fill="white" />
        </svg>
      );
    /* TikTok */
    case "tiktok":
    case "tiktok-ads":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#010101" />
          <path d="M22 8v10a5 5 0 1 1-4-4.9V17a1 1 0 1 0 1 1V8h3z" fill="white" />
          <path d="M22 12c1.1.5 2 .8 3 .8v-3c-.7 0-2-.3-3-.8v3z" fill="#69C9D0" />
          <path d="M13 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#EE1D52" />
        </svg>
      );
    /* X / Twitter */
    case "x-twitter":
    case "x-ads":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#000" />
          <path d="M7.5 8h4.2l3.7 5.2L19.2 8H24l-6.3 7.8L24.5 24h-4.3l-4-5.7L12 24H7.3l6.7-8.3L7.5 8z" fill="white" />
        </svg>
      );
    /* Reddit */
    case "reddit":
    case "reddit-ads":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#FF4500" />
          {/* Reddit alien (Snoo) */}
          <circle cx="16" cy="18" r="7" fill="white" />
          <circle cx="13" cy="17" r="1.5" fill="#FF4500" />
          <circle cx="19" cy="17" r="1.5" fill="#FF4500" />
          <path d="M13 20.5c.8 1.2 5.2 1.2 6 0" stroke="#FF4500" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          {/* Ears */}
          <ellipse cx="9.5" cy="15" rx="2.5" ry="2" fill="white" />
          <ellipse cx="22.5" cy="15" rx="2.5" ry="2" fill="white" />
          <ellipse cx="9.5" cy="15" rx="1.3" ry="1" fill="#FF4500" />
          <ellipse cx="22.5" cy="15" rx="1.3" ry="1" fill="#FF4500" />
          {/* Antenna */}
          <line x1="16" y1="10" x2="20" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20.5" cy="6.5" r="1.5" fill="white" />
        </svg>
      );
    /* Google Search Console */
    case "google-search":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="white" stroke="#E5E7EB" />
          {/* Google G */}
          <path d="M23 16.2h-7v2.6h4.1c-.4 2-2.1 3.2-4.1 3.2a4.5 4.5 0 0 1 0-9c1.2 0 2.2.4 3 1.1l1.8-1.8A7 7 0 1 0 16 23a7 7 0 0 0 7-7c0-.3 0-.6-.1-.8z" fill="#4285F4" />
          <path d="M9.5 13.7l2.1 1.6a4.5 4.5 0 0 1 7.4-1l1.8-1.8A7 7 0 0 0 9.5 13.7z" fill="#EA4335" />
          <path d="M16 23a7 7 0 0 0 4.7-1.8l-2.2-1.7A4.5 4.5 0 0 1 11.6 17l-2.1 1.6A7 7 0 0 0 16 23z" fill="#34A853" />
          <path d="M9.5 18.3l2.1-1.6a4.5 4.5 0 0 1 0-3.4L9.5 11.7a7 7 0 0 0 0 6.6z" fill="#FBBC04" />
        </svg>
      );
    /* Google Ads */
    case "google-ads":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="white" stroke="#E5E7EB" />
          {/* Google Ads triangle bars */}
          <rect x="6" y="20" width="5" height="7" rx="2.5" fill="#FBBC04" />
          <rect x="13.5" y="14" width="5" height="13" rx="2.5" fill="#4285F4" />
          <rect x="21" y="8" width="5" height="19" rx="2.5" fill="#34A853" />
        </svg>
      );
    /* Email Sequencer */
    case "email-seq":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#6366F1" />
          <rect x="5" y="9" width="22" height="15" rx="3" stroke="white" strokeWidth="1.6" fill="none" />
          <path d="M5 12l11 7 11-7" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M5 20l6-4M27 20l-6-4" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" fill="none" />
        </svg>
      );
    /* Website Intelligence */
    case "website-intel":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#0EA5E9" />
          <circle cx="16" cy="16" r="8" stroke="white" strokeWidth="1.6" fill="none" />
          <path d="M16 8c-2 2-3.5 4.5-3.5 8s1.5 6 3.5 8" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M16 8c2 2 3.5 4.5 3.5 8s-1.5 6-3.5 8" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <line x1="8" y1="16" x2="24" y2="16" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="9" y1="12" x2="23" y2="12" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="9" y1="20" x2="23" y2="20" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    /* Google Analytics */
    case "analytics":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="white" stroke="#E5E7EB" />
          <rect x="7" y="18" width="5" height="9" rx="2.5" fill="#F9AB00" />
          <rect x="14" y="13" width="5" height="14" rx="2.5" fill="#E37400" />
          <circle cx="26" cy="8" r="4" fill="#E37400" />
          <path d="M21 12l-3 3" stroke="#E37400" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="var(--nos-bg-elevated)" />
          <circle cx="16" cy="16" r="5" stroke="var(--nos-text-muted)" strokeWidth="1.5" fill="none" />
        </svg>
      );
  }
}

/* ─── Connect dialog ─── */
interface ConnectDialogProps {
  integration: Integration | null;
  onClose: () => void;
}

function ConnectDialog({ integration, onClose }: ConnectDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!integration) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2200);
  }

  function handleClose() {
    setUsername("");
    setPassword("");
    setLoading(false);
    setSuccess(false);
    onClose();
  }

  return (
    <Dialog open={!!integration} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm" style={{ background: "var(--nos-bg-card)", border: "1px solid var(--border)" }}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              <BrandLogo id={integration.id} size={40} />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold text-[var(--nos-text-primary)]">
                Connect {integration.name}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[var(--nos-text-muted)] mt-0.5">
                Enter your credentials to link this account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-6"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(52,211,153,0.12)" }}>
                <CheckCircle2 size={28} className="text-[var(--nos-positive)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--nos-text-primary)]">Connected successfully!</p>
              <p className="text-xs text-[var(--nos-text-muted)] text-center">
                {integration.name} has been linked. Data will sync momentarily.
              </p>
              <Button
                className="mt-2 w-full bg-[var(--nos-positive)] text-white hover:opacity-90"
                onClick={handleClose}
              >
                Done
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--nos-text-secondary)]">
                  {integration.category === "crm" ? "API Key / Username" : "Username or Email"}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={integration.category === "crm" ? "your-api-key" : `your@email.com`}
                  required
                  disabled={loading}
                  className="w-full rounded-lg px-3 py-2 text-sm border outline-none transition-colors"
                  style={{
                    background: "var(--nos-bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--nos-text-primary)",
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--nos-text-secondary)]">
                  {integration.category === "crm" ? "API Secret" : "Password"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  disabled={loading}
                  className="w-full rounded-lg px-3 py-2 text-sm border outline-none transition-colors"
                  style={{
                    background: "var(--nos-bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--nos-text-primary)",
                  }}
                />
              </div>
              <p className="text-[10px] text-[var(--nos-text-muted)]">
                Your credentials are encrypted and never stored in plain text.
              </p>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={loading}
                  style={{ borderColor: "var(--border)", color: "var(--nos-text-secondary)" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1 gap-2"
                  disabled={loading || !username || !password}
                  style={{ background: "var(--nos-accent)", color: "white" }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Connecting…
                    </>
                  ) : (
                    <>
                      <Plug size={13} />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Integration card ─── */
function IntegrationCard({
  integration,
  onConnect,
}: {
  integration: Integration;
  onConnect: (i: Integration) => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="nos-card flex items-center gap-4"
    >
      {/* Logo */}
      <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
        <BrandLogo id={integration.id} size={36} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-[var(--nos-text-primary)] truncate">{integration.name}</p>
          {integration.connected ? (
            <Badge className="text-[9px] bg-[var(--nos-positive)] bg-opacity-15 text-[var(--nos-positive)] border-[var(--nos-positive)] border-opacity-30 shrink-0">
              Connected
            </Badge>
          ) : (
            <Badge className="text-[9px] bg-[var(--nos-bg-elevated)] text-[var(--nos-signal-cold)] border-[var(--border)] shrink-0">
              Disconnected
            </Badge>
          )}
        </div>
        {integration.connected && integration.lastSync ? (
          <div className="flex items-center gap-1 mt-0.5">
            <RefreshCw size={10} className="text-[var(--nos-text-muted)]" />
            <p className="text-[10px] text-[var(--nos-text-muted)]">Last sync: {integration.lastSync}</p>
          </div>
        ) : (
          <p className="text-[10px] text-[var(--nos-text-muted)] mt-0.5">Not connected</p>
        )}
      </div>

      {integration.connected ? (
        <CheckCircle2 size={16} className="text-[var(--nos-positive)] shrink-0" />
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5 text-xs border-[var(--nos-accent-border)] text-[var(--nos-accent)] hover:bg-[var(--nos-accent-muted)]"
          onClick={() => onConnect(integration)}
        >
          <Plug size={11} />
          Connect
        </Button>
      )}
    </motion.div>
  );
}

interface SectionProps {
  variant?: "a" | "b" | "c";
}

export function Integrations({ variant = "a" }: SectionProps) {
  const data = useClientData();
  const { integrations } = data;
  const [connectTarget, setConnectTarget] = useState<Integration | null>(null);

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: integrations.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0);

  const connectedCount = integrations.filter((i) => i.connected).length;
  const totalCount = integrations.length;

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Health summary */}
        <motion.div variants={itemVariants} className="nos-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--nos-text-primary)]">Integration Health</p>
              <p className="text-xs text-[var(--nos-text-muted)] mt-0.5">
                {connectedCount} of {totalCount} integrations active
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-1 max-w-32 justify-end">
                {integrations.map((integ) => (
                  <div
                    key={integ.id}
                    className="w-2 h-2 rounded-full"
                    style={{ background: integ.connected ? "var(--nos-positive)" : "var(--nos-bg-elevated)" }}
                    title={integ.name}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-[var(--nos-positive)]">
                {Math.round((connectedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-[var(--nos-bg-elevated)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(connectedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-[var(--nos-positive)]"
            />
          </div>
        </motion.div>

        {/* Category groups */}
        {byCategory.map((group) => (
          <motion.div key={group.category} variants={itemVariants}>
            <h3 className="text-xs text-label-caps mb-3">{group.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.items.map((integ) => (
                <IntegrationCard
                  key={integ.id}
                  integration={integ}
                  onConnect={setConnectTarget}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Connect dialog */}
      <ConnectDialog
        integration={connectTarget}
        onClose={() => setConnectTarget(null)}
      />
    </>
  );
}
