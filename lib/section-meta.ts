import {
  Brain,
  BarChart3,
  Target,
  Search,
  Globe,
  FileText,
  Mail,
  Puzzle,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

export interface SectionMeta {
  id: string;
  title: string;
  breadcrumb: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
  path: string;
}

export const SECTION_META: Record<string, SectionMeta> = {
  narrative: {
    id: "narrative",
    title: "Narrative Intelligence",
    breadcrumb: "Narrative Intel",
    description:
      "Your command view for how every marketing signal — content, search, outreach, and web intent — rolls up into pipeline outcomes.",
    highlights: [
      "Composite signal timeline across all channels",
      "Pipeline attribution, CAC, and deal velocity",
      "AI-generated narrative insights and recommended actions",
    ],
    icon: Brain,
    path: "/",
  },
  brand: {
    id: "brand",
    title: "Brand Intelligence",
    breadcrumb: "Brand Intel",
    description:
      "Real-time competitive brand scoreboard comparing your client against 7 competitors across Brand Score, Awareness, Impact, and Trust — plus audience growth signals from connected social channels.",
    highlights: [
      "Competitive scoreboard with directional movement per dimension",
      "Brand Score gauge with AI narrative explaining what drove change",
      "Audience & social metrics — total audience, net new, and channel breakdown",
    ],
    icon: BarChart3,
    path: "/brand",
  },
  positioning: {
    id: "positioning",
    title: "Positioning",
    breadcrumb: "Positioning",
    description:
      "Maps where you sit in the market on narrative strength vs. market presence — and how that position is shifting over time.",
    highlights: [
      "Competitive quadrant with your brand highlighted",
      "Position movement and keyword ownership trends",
      "Side-by-side competitor benchmarks",
    ],
    icon: Target,
    path: "/positioning",
  },
  search: {
    id: "search",
    title: "Search Intelligence",
    breadcrumb: "Search Intel",
    description:
      "Tracks organic visibility, GEO citations across AI engines, and which search themes are driving qualified intent.",
    highlights: [
      "Keyword rankings and visibility trends",
      "GEO citation velocity by AI engine",
      "Topic authority radar for narrative themes",
    ],
    icon: Search,
    path: "/search",
  },
  website: {
    id: "website",
    title: "Website Signals",
    breadcrumb: "Website Signals",
    description:
      "Surfaces high-intent accounts visiting your site, content engagement patterns, and conversion signals from web behavior.",
    highlights: [
      "Hot account identification and intent scoring",
      "Page-level engagement and heatmap patterns",
      "Visitor-to-pipeline conversion tracking",
    ],
    icon: Globe,
    path: "/website",
  },
  content: {
    id: "content",
    title: "Content Marketing",
    breadcrumb: "Content Marketing",
    description:
      "Connects content production and distribution performance to pipeline — across social, LinkedIn, newsletters, and calendars.",
    highlights: [
      "Channel performance and pipeline contribution",
      "Content calendar and publishing velocity",
      "Top-performing assets and engagement trends",
    ],
    icon: FileText,
    path: "/content",
  },
  outreach: {
    id: "outreach",
    title: "Cold Outreach",
    breadcrumb: "Cold Outreach",
    description:
      "Monitors email and LinkedIn outreach performance — reply rates, sequence effectiveness, and pipeline generated from outbound.",
    highlights: [
      "Reply rate waterfall and sequence analytics",
      "ICP score distribution and lead quality",
      "Pipeline attributed to outbound campaigns",
    ],
    icon: Mail,
    path: "/outreach",
  },
  "paid-media": {
    id: "paid-media",
    title: "Paid Media",
    breadcrumb: "Paid Media",
    description:
      "Cross-channel paid media intelligence — ad spend, ROAS, campaign performance, and creative analysis across Meta, Google, LinkedIn, TikTok, and more.",
    highlights: [
      "Blended ROAS and ad spend across all platforms",
      "Campaign-level performance with sortable table",
      "Best performing campaigns and creatives",
    ],
    icon: DollarSign,
    path: "/paid-media",
  },
  integrations: {
    id: "integrations",
    title: "Integrations",
    breadcrumb: "Integrations",
    description:
      "Shows the health of your connected data sources — CRM, analytics, social, and outreach tools that power NOS intelligence.",
    highlights: [
      "Connection status for all data sources",
      "Sync health and last-updated timestamps",
      "Coverage gaps and recommended connections",
    ],
    icon: Puzzle,
    path: "/integrations",
  },
};

export function getSectionMeta(slug?: string | string[]): SectionMeta {
  const s = Array.isArray(slug) ? slug[0] : slug;
  return SECTION_META[s ?? "narrative"] ?? SECTION_META.narrative;
}
