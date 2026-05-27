export type DateRange = "7d" | "30d" | "90d";

/* ─────────────── KPI ─────────────── */
export interface KPIMetric {
  value: number;
  change: number; // percent, positive = up
  sparkline: number[];
  prefix?: string;
  suffix?: string;
}

export interface KPIs {
  cac: KPIMetric;
  pipeline: KPIMetric;
  dealVelocity: KPIMetric;
  dealsCreated: KPIMetric;
  closedWon: KPIMetric;
  attributedRevenue: KPIMetric;
}

/* ─────────────── Signal Timeline ─────────────── */
export interface SignalPoint {
  date: string;
  linkedin: number;
  website: number;
  email: number;
  search: number;
  content: number;
}

/* ─────────────── Brand ─────────────── */
export interface BrandData {
  healthScore: number;
  storyConsistency: { channel: string; score: number }[];
  shareOfVoice: { name: string; value: number; isClient: boolean }[];
  attributionFunnel: { stage: string; value: number }[];
  aiInsight: string;
}

/* ─────────────── Positioning ─────────────── */
export interface PositionPoint {
  name: string;
  x: number;
  y: number;
  isClient: boolean;
}

export interface PositioningData {
  quadrant: PositionPoint[];
  movementTimeline: { date: string; x: number; y: number }[];
  competitors: { name: string; narrativeScore: number; marketPresence: number; lastSeen: string; trend: "up" | "down" | "flat" }[];
  keywordOwnership: { keyword: string; score: number }[];
}

/* ─────────────── Search ─────────────── */
export interface KeywordRow {
  keyword: string;
  ranking: number;
  volume: number;
  change: number;
  intent: "informational" | "commercial" | "transactional";
}

export interface GEOEngine {
  engine: string;
  citations: number;
  trend: number[];
}

export interface SearchData {
  organicSessions: { date: string; value: number }[];
  keywords: KeywordRow[];
  intentBreakdown: { name: string; value: number }[];
  pipelineFromOrganic: KPIMetric;
  geoEngines: GEOEngine[];
  topicAuthority: { topic: string; score: number }[];
  geoPipelineKPI: KPIMetric;
}

/* ─────────────── Website Signals ─────────────── */
export interface CompanySignal {
  id: string;
  company: string;
  industry: string;
  signalScore: number;
  pagesVisited: number;
  timeOnSite: string;
  source: string;
  intent: "hot" | "warm" | "cold";
  pages: string[];
  companySize: string;
  linkedinUrl: string;
}

export interface WebsiteData {
  visitors: KPIMetric;
  companiesIdentified: KPIMetric;
  avgTimeOnSite: KPIMetric;
  returning: KPIMetric;
  hotAccounts: KPIMetric;
  visitorTrend: { date: string; value: number }[];
  trafficSources: { name: string; value: number }[];
  intentHeatmap: { day: string; hour: string; value: number }[];
  signals: CompanySignal[];
}

/* ─────────────── Content Marketing ─────────────── */
export interface CalendarPost {
  date: string;
  channel: "linkedin" | "instagram" | "facebook" | "x" | "newsletter";
  title: string;
  reach: number;
  engagementRate: number;
  pipeline: number;
  content: string;
}

export interface SocialChannelRow {
  channel: string;
  posts: number;
  reach: number;
  engagementRate: number;
  pipeline: number;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  sent: number;
  openRate: number;
  clickRate: number;
  unsubscribes: number;
  pipeline: number;
  date: string;
}

export interface ContentData {
  socialOverview: SocialChannelRow[];
  topPosts: CalendarPost[];
  linkedinFollowerGrowth: { date: string; value: number }[];
  contentCalendar: CalendarPost[];
  newsletters: NewsletterCampaign[];
  subscriberGrowth: { date: string; value: number }[];
  openRateTrend: { date: string; value: number }[];
}

/* ─────────────── Cold Outreach ─────────────── */
export interface EmailCampaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  sequence: number;
  sent: number;
  opens: number;
  replies: number;
  meetings: number;
  pipeline: number;
}

export interface LinkedInCampaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  sent: number;
  accepted: number;
  replied: number;
  meetings: number;
  pipeline: number;
}

export interface OutreachData {
  emailPipeline: KPIMetric;
  emailCampaigns: EmailCampaign[];
  replyWaterfall: { step: string; value: number }[];
  topSubjectLines: { subject: string; replyRate: number }[];
  linkedinFunnel: { stage: string; value: number }[];
  linkedinCampaigns: LinkedInCampaign[];
  icpScoreDistribution: { score: string; count: number }[];
}

/* ─────────────── Integration ─────────────── */
export interface Integration {
  id: string;
  name: string;
  category: "crm" | "social" | "seo" | "outreach" | "website-intel" | "analytics";
  connected: boolean;
  lastSync?: string;
}

/* ─────────────── Root Client Data ─────────────── */
export interface ClientData {
  meta: {
    id: string;
    name: string;
    type: string;
    stage: string;
    channels: string[];
  };
  kpis: KPIs;
  signalTimeline: SignalPoint[];
  aiNarrative: string;
  recommendedActions: { priority: "high" | "medium"; icon: string; title: string; description: string; cta: string }[];
  brand: BrandData;
  positioning: PositioningData;
  search: SearchData;
  website: WebsiteData;
  content: ContentData;
  outreach: OutreachData;
  integrations: Integration[];
  pipelineBridge: {
    section: string;
    attributed: number;
    deals: number;
    velocity: number;
  };
}

export type ClientDataByRange = Record<DateRange, ClientData>;
