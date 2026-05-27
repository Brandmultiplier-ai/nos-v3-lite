"use client";

import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import { PipelineBridge } from "@/components/cards/PipelineBridge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RefreshCw, Plug } from "lucide-react";
import type { Integration } from "@/lib/data/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const CATEGORY_ORDER = ["crm", "social", "seo", "outreach", "website-intel", "analytics"];
const CATEGORY_LABELS: Record<string, string> = {
  crm: "CRM",
  social: "Social Channels",
  seo: "SEO & Search",
  outreach: "Outreach Sequencer",
  "website-intel": "Website Intelligence",
  analytics: "Analytics",
};

function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <motion.div
      variants={itemVariants}
      className="nos-card flex items-center gap-4"
    >
      {/* Status indicator */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
        integration.connected ? "bg-[var(--nos-positive)] bg-opacity-10" : "bg-[var(--nos-bg-elevated)]"
      }`}>
        {integration.connected ? (
          <CheckCircle2 size={16} className="text-[var(--nos-positive)]" />
        ) : (
          <XCircle size={16} className="text-[var(--nos-signal-cold)]" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-[var(--nos-text-primary)]">{integration.name}</p>
          {integration.connected ? (
            <Badge className="text-[9px] bg-[var(--nos-positive)] bg-opacity-15 text-[var(--nos-positive)] border-[var(--nos-positive)] border-opacity-30">
              Connected
            </Badge>
          ) : (
            <Badge className="text-[9px] bg-[var(--nos-bg-elevated)] text-[var(--nos-signal-cold)] border-[var(--border)]">
              Disconnected
            </Badge>
          )}
        </div>
        {integration.connected && integration.lastSync && (
          <div className="flex items-center gap-1 mt-0.5">
            <RefreshCw size={10} className="text-[var(--nos-text-muted)]" />
            <p className="text-[10px] text-[var(--nos-text-muted)]">Last sync: {integration.lastSync}</p>
          </div>
        )}
      </div>

      {!integration.connected && (
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5 text-xs border-[var(--nos-accent-border)] text-[var(--nos-accent)] hover:bg-[var(--nos-accent-muted)]"
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
  const { integrations, pipelineBridge } = data;

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: integrations.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0);

  const connectedCount = integrations.filter((i) => i.connected).length;
  const totalCount = integrations.length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <PipelineBridge
        attributed={pipelineBridge.attributed}
        deals={pipelineBridge.deals}
        velocity={pipelineBridge.velocity}
        section="All Connected Channels"
      />

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
            <div className="flex gap-1">
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
              <IntegrationCard key={integ.id} integration={integ} />
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
