import type { BrandData } from "./types";
import { createSparklineFactory } from "./sparkline";

const spark = createSparklineFactory(70, (i) => Math.sin(i * 0.8) * 20);

// ─── Nexus Labs ───────────────────────────────────────────────────
export function makeNexusBrand(mult: number): BrandData {
  return {
    tldr: {
      summary: "Brand intelligence is trending strongly positive for Nexus Labs. Awareness and Trust scores are up 9 and 6 points respectively, expanding your share of voice in the Series B SaaS category. A stronger brand narrative means buyers arrive warmer — reducing sales cycle friction and improving conversion rates at the bottom of the funnel.",
      actions: [
        { title: "Amplify Trust Content", description: "Repurpose positive customer outcomes and analyst mentions into evergreen social assets to compound trust gains.", priority: "high", cta: "Create assets" },
        { title: "Align Messaging Across Channels", description: "Audit LinkedIn, blog, and email for consistent positioning language — inconsistency is diluting Awareness lift.", priority: "high", cta: "Run audit" },
        { title: "Schedule Peak-Hour Posts", description: "Improve cross-platform timing to maximize reach when your target audience is most active (Tue–Thu, 10am–2pm).", priority: "medium", cta: "Review schedule" },
      ],
    },
    brandScore: 81,
    brandScoreChange: 7,
    aiInsight:
      "Brand Score surges as Awareness and Trust drive momentum. Strong lifts in Awareness (+9) and Trust (+6) push your Brand Score to 81, signaling broad market traction. Growing Impact (+5) suggests campaigns are resonating, with an opportunity to lock in gains through sharper messaging alignment and coordinated timing across channels.",
    aiActions: [
      {
        title: "Messaging Alignment",
        description: "Audit digital content for consistency across campaigns and regions to maximize Awareness gains.",
      },
      {
        title: "Channel Timing",
        description: "Improve cross-platform scheduling to amplify reach when target audiences are most active.",
      },
      {
        title: "Trust Amplification",
        description: "Repurpose positive reviews and analyst coverage into campaigns to extend credibility.",
      },
      {
        title: "Impact Expansion",
        description: "Scale high-performing content formats into video and short-form to broaden reach.",
      },
    ],
    scoreboard: [
      {
        name: "Nexus Labs",
        isClient: true,
        brandScore: { score: 81, change: 7 },
        awareness: { score: 76, change: 9 },
        impact: { score: 68, change: 5 },
        trust: { score: 75, change: 6 },
      },
      {
        name: "NarrateIQ",
        isClient: false,
        brandScore: { score: 86, change: 2 },
        awareness: { score: 77, change: -3 },
        impact: { score: 61, change: 1 },
        trust: { score: 69, change: -2 },
      },
      {
        name: "PipelineOS",
        isClient: false,
        brandScore: { score: 71, change: -4 },
        awareness: { score: 58, change: 2 },
        impact: { score: 43, change: -8 },
        trust: { score: 73, change: 5 },
      },
      {
        name: "StoryScale",
        isClient: false,
        brandScore: { score: 62, change: 3 },
        awareness: { score: 58, change: 1 },
        impact: { score: 89, change: 12 },
        trust: { score: 49, change: -4 },
      },
      {
        name: "Contentful MktOS",
        isClient: false,
        brandScore: { score: 56, change: -2 },
        awareness: { score: 66, change: -5 },
        impact: { score: 33, change: 1 },
        trust: { score: 57, change: 4 },
      },
    ],
    audience: {
      total: {
        value: Math.round(56440 * mult),
        change: 49,
        sparkline: spark(),
      },
      netNew: {
        value: Math.round(4070 * mult),
        change: 5,
        sparkline: spark(),
      },
      development: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(2025, 6 + i, 1).toISOString().split("T")[0],
        increase: Math.round(18 + Math.sin(i * 0.6) * 8 + i * 0.5),
        decrease: Math.round(8 + Math.cos(i * 0.5) * 4),
        paid: Math.round(12 + Math.sin(i * 0.8) * 5 + i * 0.3),
        organic: Math.round(10 + Math.cos(i * 0.7) * 3 + i * 0.2),
      })),
      byChannel: [
        {
          network: "linkedin",
          channelName: "Nexus Labs",
          fans: Math.round(34700 * mult),
          fansChange: 48,
          netNew: -16,
          increase: 65,
          decrease: 78,
        },
        {
          network: "email",
          channelName: "NOS Newsletter",
          fans: Math.round(18700 * mult),
          fansChange: 52,
          netNew: 172,
          increase: 85,
          decrease: 32,
        },
        {
          network: "website",
          channelName: "Nexus Labs Blog",
          fans: Math.round(3100 * mult),
          fansChange: 34,
          netNew: 92,
          increase: 43,
          decrease: 21,
        },
      ],
      platformMix: [
        { platform: "LinkedIn", share: 61, color: "#0A66C2" },
        { platform: "Newsletter", share: 33, color: "#34D399" },
        { platform: "Website", share: 6, color: "#7C7FFF" },
      ],
    },
  };
}

// ─── Meridian Brands ─────────────────────────────────────────────
export function makeMeridianBrand(mult: number): BrandData {
  return {
    tldr: {
      summary: "Meridian Brands is building steady brand equity across Instagram and Facebook, with Awareness momentum growing among D2C-adjacent buyers. Brand strength compounds into pipeline indirectly — buyers who recognize and trust the brand convert at higher rates, respond faster to email sequences, and require fewer touchpoints to close.",
      actions: [
        { title: "Strengthen Campaign Narrative", description: "Align Instagram, Facebook, and email around a single brand story this quarter to close the Trust-to-Impact gap.", priority: "high", cta: "Plan campaign" },
        { title: "Activate Newsletter Audience", description: "Your newsletter has the highest content-to-pipeline conversion — use it to nurture brand-aware leads into demos.", priority: "high", cta: "Build sequence" },
        { title: "Repurpose Top Social Posts", description: "Turn your top-performing Instagram posts into email and LinkedIn content to extend reach at zero additional cost.", priority: "medium", cta: "Repurpose content" },
      ],
    },
    brandScore: 74,
    brandScoreChange: 4,
    aiInsight:
      "Meridian's brand is building Awareness momentum across Instagram and Facebook, with Trust scores climbing steadily. Impact lags slightly — content is being seen but not converting to strong brand association. Focus on campaign narrative consistency to close the gap.",
    aiActions: [
      {
        title: "Narrative Consistency",
        description: "Align messaging across Instagram, Facebook, and newsletter to reinforce a single brand story.",
      },
      {
        title: "Impact Content Push",
        description: "Invest in long-form content that drives association, not just reach — whitepapers, case studies, webinars.",
      },
      {
        title: "Social Proof Layer",
        description: "Feature customer outcomes prominently across all channels to build Trust scores faster.",
      },
    ],
    scoreboard: [
      {
        name: "Meridian Brands",
        isClient: true,
        brandScore: { score: 74, change: 4 },
        awareness: { score: 82, change: 7 },
        impact: { score: 61, change: 2 },
        trust: { score: 68, change: 5 },
      },
      {
        name: "Cascade Commerce",
        isClient: false,
        brandScore: { score: 79, change: -1 },
        awareness: { score: 78, change: 3 },
        impact: { score: 74, change: -2 },
        trust: { score: 72, change: 1 },
      },
      {
        name: "BrandMatrix",
        isClient: false,
        brandScore: { score: 68, change: 6 },
        awareness: { score: 65, change: 8 },
        impact: { score: 55, change: 4 },
        trust: { score: 60, change: -3 },
      },
      {
        name: "VentureMark",
        isClient: false,
        brandScore: { score: 58, change: -3 },
        awareness: { score: 54, change: -5 },
        impact: { score: 62, change: 1 },
        trust: { score: 52, change: -2 },
      },
    ],
    audience: {
      total: {
        value: Math.round(128000 * mult),
        change: 22,
        sparkline: spark(),
      },
      netNew: {
        value: Math.round(6800 * mult),
        change: 12,
        sparkline: spark(),
      },
      development: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(2025, 6 + i, 1).toISOString().split("T")[0],
        increase: Math.round(25 + Math.sin(i * 0.5) * 10 + i * 0.4),
        decrease: Math.round(10 + Math.cos(i * 0.6) * 5),
        paid: Math.round(18 + Math.sin(i * 0.7) * 7 + i * 0.2),
        organic: Math.round(14 + Math.cos(i * 0.8) * 4 + i * 0.3),
      })),
      byChannel: [
        {
          network: "instagram",
          channelName: "Meridian Brands",
          fans: Math.round(68000 * mult),
          fansChange: 31,
          netNew: 312,
          increase: 180,
          decrease: 45,
        },
        {
          network: "facebook",
          channelName: "Meridian Official",
          fans: Math.round(42000 * mult),
          fansChange: 18,
          netNew: 148,
          increase: 95,
          decrease: 38,
        },
        {
          network: "linkedin",
          channelName: "Meridian Brands",
          fans: Math.round(18000 * mult),
          fansChange: 44,
          netNew: 92,
          increase: 64,
          decrease: 18,
        },
      ],
      platformMix: [
        { platform: "Instagram", share: 53, color: "#E1306C" },
        { platform: "Facebook", share: 33, color: "#1877F2" },
        { platform: "LinkedIn", share: 14, color: "#0A66C2" },
      ],
    },
  };
}

// ─── Apex Systems ─────────────────────────────────────────────────
export function makeApexBrand(mult: number): BrandData {
  return {
    tldr: {
      summary: "Apex Systems has established strong brand Trust within enterprise IT, with Awareness scoring high among CIOs and CISOs. The brand narrative is contributing to pipeline by shortening objection cycles — buyers already recognize Apex's authority before the first sales touch, which is driving the above-benchmark reply rates on email sequences.",
      actions: [
        { title: "Scale Executive Thought Leadership", description: "Increase LinkedIn post frequency for senior leadership — executive content is generating 78% of deal-influencing brand touches.", priority: "high", cta: "Build calendar" },
        { title: "Leverage Analyst Citations", description: "Gartner and Forrester mentions are your top trust multipliers. Promote these citations in every outreach sequence.", priority: "high", cta: "Create assets" },
        { title: "Improve Impact Score", description: "Brand recognition isn't translating to pipeline association fast enough. Add explicit ROI case studies to content mix.", priority: "medium", cta: "Commission studies" },
      ],
    },
    brandScore: 68,
    brandScoreChange: 3,
    aiInsight:
      "Apex's brand is strong in Trust and Awareness within the enterprise segment, but Impact scores reflect a need for more content that converts brand recognition into pipeline association. Executive thought leadership is the highest-leverage play right now.",
    aiActions: [
      {
        title: "Executive Visibility",
        description: "Launch a quarterly executive content program targeting CXO-level conversations in your key verticals.",
      },
      {
        title: "Analyst Relations Boost",
        description: "Increase analyst briefings and contributed articles to lift Impact scores in enterprise media.",
      },
      {
        title: "Content Depth",
        description: "Invest in technical whitepapers and ROI frameworks that enterprise buyers share internally.",
      },
    ],
    scoreboard: [
      {
        name: "Apex Systems",
        isClient: true,
        brandScore: { score: 68, change: 3 },
        awareness: { score: 72, change: 4 },
        impact: { score: 58, change: 1 },
        trust: { score: 79, change: 5 },
      },
      {
        name: "EnterpriseNarrative",
        isClient: false,
        brandScore: { score: 75, change: -2 },
        awareness: { score: 80, change: -3 },
        impact: { score: 65, change: 2 },
        trust: { score: 74, change: 1 },
      },
      {
        name: "Pinnacle GTM",
        isClient: false,
        brandScore: { score: 71, change: 5 },
        awareness: { score: 68, change: 6 },
        impact: { score: 70, change: 4 },
        trust: { score: 66, change: -1 },
      },
      {
        name: "CoreSignal",
        isClient: false,
        brandScore: { score: 55, change: -1 },
        awareness: { score: 58, change: 2 },
        impact: { score: 49, change: -3 },
        trust: { score: 61, change: 3 },
      },
    ],
    audience: {
      total: {
        value: Math.round(24000 * mult),
        change: 9,
        sparkline: spark(),
      },
      netNew: {
        value: Math.round(820 * mult),
        change: 6,
        sparkline: spark(),
      },
      development: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(2025, 6 + i, 1).toISOString().split("T")[0],
        increase: Math.round(12 + Math.sin(i * 0.7) * 5 + i * 0.3),
        decrease: Math.round(5 + Math.cos(i * 0.4) * 3),
        paid: Math.round(8 + Math.sin(i * 0.6) * 4 + i * 0.1),
        organic: Math.round(6 + Math.cos(i * 0.5) * 2 + i * 0.15),
      })),
      byChannel: [
        {
          network: "linkedin",
          channelName: "Apex Systems",
          fans: Math.round(18000 * mult),
          fansChange: 14,
          netNew: 48,
          increase: 38,
          decrease: 12,
        },
        {
          network: "email",
          channelName: "Apex Intelligence",
          fans: Math.round(6000 * mult),
          fansChange: 8,
          netNew: 22,
          increase: 18,
          decrease: 5,
        },
      ],
      platformMix: [
        { platform: "LinkedIn", share: 75, color: "#0A66C2" },
        { platform: "Newsletter", share: 25, color: "#34D399" },
      ],
    },
  };
}
