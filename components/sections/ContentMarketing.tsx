"use client";

import { motion } from "framer-motion";
import { useClientData } from "@/lib/data";
import { PipelineBridge } from "@/components/cards/PipelineBridge";
import { ContentCalendar } from "@/components/charts/ContentCalendar";
import { TrendLine } from "@/components/charts/TrendLine";
import { EmptyState } from "@/components/shared/EmptyState";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { SectionSubTabs } from "@/components/shared/SectionSubTabs";
import { Badge } from "@/components/ui/badge";

const CONTENT_TABS = [
  { id: "social", label: "Social Channels", path: "/content/social" },
  { id: "linkedin", label: "LinkedIn Content", path: "/content/linkedin" },
  { id: "newsletter", label: "Newsletter", path: "/content/newsletter" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const CHANNEL_COLORS: Record<string, string> = {
  LinkedIn: "#0A66C2",
  Instagram: "#E1306C",
  Facebook: "#1877F2",
  Email: "#F59E0B",
  Newsletter: "#22C55E",
  X: "#FFFFFF",
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

type ContentTab = "social" | "linkedin" | "newsletter";

interface ContentMarketingProps {
  tab?: ContentTab;
}

export function ContentMarketing({ tab = "social" }: ContentMarketingProps) {
  const data = useClientData();
  const { content, pipelineBridge, meta } = data;
  const hasInstagram = meta.channels.includes("instagram");

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <PipelineBridge
        attributed={pipelineBridge.attributed}
        deals={pipelineBridge.deals}
        velocity={pipelineBridge.velocity}
        section="Content Marketing"
        info="Pipeline attributed to content marketing activities across social, LinkedIn, and newsletter channels in the selected period."
      />

      <SectionSubTabs tabs={CONTENT_TABS} />

      {tab === "social" && (
        <>
          <motion.div variants={itemVariants}>
            <DashboardCard
              title="Cross-Channel Performance"
              subtitle="Posts · Reach · Engagement · Pipeline this period"
              info="Compares performance across every connected social channel — volume, reach, engagement rate, and pipeline generated."
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {["Channel", "Posts", "Reach", "Engagement Rate", "Pipeline"].map((h) => (
                        <th key={h} className="text-left pb-2 text-[10px] text-label-caps text-[var(--nos-text-muted)] pr-6">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {content.socialOverview.map((row) => (
                      <tr key={row.channel} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--nos-bg-elevated)] transition-colors">
                        <td className="py-2.5 pr-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: CHANNEL_COLORS[row.channel] ?? "#6366F1" }} />
                            <span className="font-medium text-[var(--nos-text-primary)]">{row.channel}</span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-6 text-[var(--nos-text-secondary)]">{Math.round(row.posts)}</td>
                        <td className="py-2.5 pr-6 text-[var(--nos-text-secondary)]">{fmtNum(Math.round(row.reach))}</td>
                        <td className="py-2.5 pr-6">
                          <span className="text-[var(--nos-positive)] font-medium">{row.engagementRate.toFixed(1)}%</span>
                        </td>
                        <td className="py-2.5 font-semibold text-[var(--nos-positive)]">{fmt(Math.round(row.pipeline))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-xs text-label-caps mb-3">Best Performing Posts</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {content.topPosts.map((post, i) => (
                <DashboardCard
                  key={i}
                  info="Top-performing post by reach, engagement, and pipeline contribution for this channel."
                >
                  <div className="flex items-center justify-between mb-2 pr-6">
                    <Badge
                      className="text-[9px] capitalize"
                      style={{
                        background: `${CHANNEL_COLORS[post.channel.charAt(0).toUpperCase() + post.channel.slice(1)] ?? "#6366F1"}20`,
                        color: CHANNEL_COLORS[post.channel.charAt(0).toUpperCase() + post.channel.slice(1)] ?? "#6366F1",
                        border: `1px solid ${CHANNEL_COLORS[post.channel.charAt(0).toUpperCase() + post.channel.slice(1)] ?? "#6366F1"}40`,
                      }}
                    >
                      {post.channel}
                    </Badge>
                    <span className="text-xs text-[var(--nos-text-muted)]">{post.date}</span>
                  </div>
                  <p className="text-sm font-medium text-[var(--nos-text-primary)] mb-2 leading-snug">{post.title}</p>
                  <p className="text-xs text-[var(--nos-text-muted)] mb-3 leading-relaxed line-clamp-2">{post.content}</p>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <p className="text-[var(--nos-text-muted)]">Reach</p>
                      <p className="font-semibold text-[var(--nos-text-primary)]">{fmtNum(post.reach)}</p>
                    </div>
                    <div>
                      <p className="text-[var(--nos-text-muted)]">Engagement</p>
                      <p className="font-semibold text-[var(--nos-positive)]">{post.engagementRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-[var(--nos-text-muted)]">Pipeline</p>
                      <p className="font-semibold text-[var(--nos-positive)]">{fmt(post.pipeline)}</p>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          </motion.div>

          {!hasInstagram && (
            <motion.div variants={itemVariants}>
              <EmptyState
                title="Instagram not connected"
                description="Connect Instagram to track post performance, engagement rates, and pipeline attribution from Instagram content."
                tool="Instagram"
              />
            </motion.div>
          )}
        </>
      )}

      {tab === "linkedin" && (
        <>
          <motion.div variants={itemVariants}>
            <DashboardCard
              info="Tracks organic LinkedIn audience growth over time — a leading indicator of narrative reach and top-of-funnel pipeline potential."
            >
              <TrendLine
                data={content.linkedinFollowerGrowth}
                title="LinkedIn Follower Growth"
                subtitle="Organic audience growth trend"
                color="#0A66C2"
                height={200}
              />
            </DashboardCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              info="Publishing schedule and content mix across the month — shows cadence, channel distribution, and planned vs. published posts."
            >
              <ContentCalendar posts={content.contentCalendar} />
            </DashboardCard>
          </motion.div>
        </>
      )}

      {tab === "newsletter" && (
        <motion.div variants={itemVariants}>
          <p className="text-xs text-label-caps mb-3">Newsletter Performance</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <DashboardCard
              className="lg:col-span-2"
              title="Campaign Results"
              subtitle="Open rate · Click rate · Pipeline per campaign"
              info="Email newsletter campaign performance — delivery, engagement, unsubscribes, and pipeline attributed to each send."
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {["Subject", "Sent", "Open Rate", "Click Rate", "Unsubs", "Pipeline"].map((h) => (
                        <th key={h} className="text-left pb-2 text-[10px] text-label-caps text-[var(--nos-text-muted)] pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {content.newsletters.map((nl) => (
                      <tr key={nl.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--nos-bg-elevated)] transition-colors">
                        <td className="py-2.5 pr-4 max-w-[200px] truncate text-[var(--nos-text-primary)] text-xs">{nl.subject}</td>
                        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">{fmtNum(nl.sent)}</td>
                        <td className="py-2.5 pr-4 text-xs font-medium text-[var(--nos-positive)]">{nl.openRate}%</td>
                        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-secondary)]">{nl.clickRate}%</td>
                        <td className="py-2.5 pr-4 text-xs text-[var(--nos-text-muted)]">{nl.unsubscribes}</td>
                        <td className="py-2.5 text-xs font-semibold text-[var(--nos-positive)]">{fmt(nl.pipeline)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
            <div className="flex flex-col gap-4">
              <DashboardCard info="Total email list size over time — measures list growth from content and lead capture.">
                <TrendLine data={content.subscriberGrowth} title="Subscriber Growth" subtitle="Cumulative email list size" color="#22C55E" height={130} />
              </DashboardCard>
              <DashboardCard info="Average open rate trend across newsletter sends — indicates subject line and content relevance.">
                <TrendLine data={content.openRateTrend} title="Open Rate Trend" subtitle="%" color="#F59E0B" height={130} />
              </DashboardCard>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
