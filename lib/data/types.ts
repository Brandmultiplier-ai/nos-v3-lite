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
  ltv: KPIMetric;
  avgDealSize: KPIMetric;
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
export interface BrandScoreCell {
  score: number;
  change: number;
}

export interface BrandScoreboardRow {
  name: string;
  isClient: boolean;
  brandScore: BrandScoreCell;
  awareness: BrandScoreCell;
  impact: BrandScoreCell;
  trust: BrandScoreCell;
}

export interface AudienceChannelRow {
  network: string;
  channelName: string;
  fans: number;
  fansChange: number;
  netNew: number;
  increase: number;
  decrease: number;
}

export interface AudienceDevelopmentPoint {
  date: string;
  increase: number;
  decrease: number;
  paid: number;
  organic: number;
}

export interface BrandData {
  tldr: SectionTldr;
  brandScore: number;
  brandScoreChange: number;
  scoreboard: BrandScoreboardRow[];
  aiInsight: string;
  aiActions: { title: string; description: string }[];
  audience: {
    total: KPIMetric;
    netNew: KPIMetric;
    development: AudienceDevelopmentPoint[];
    byChannel: AudienceChannelRow[];
    platformMix: { platform: string; share: number; color: string }[];
  };
}

/* ─────────────── Positioning ─────────────── */
export interface PositionPoint {
  name: string;
  x: number;
  y: number;
  isClient: boolean;
}

export interface PositioningData {
  tldr: SectionTldr;
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

export interface GEOCompetitor {
  name: string;
  isClient: boolean;
  visibilityScore: number;
  change: number;
  trend: number[];
}

export interface GEOCitationDomain {
  domain: string;
  citations: number;
  change: number;
  category: string;
}

export interface GEOPlatformRow {
  platform: string;
  visibilityPct: number;
  change: number;
  color: string;
}

export interface GEOData {
  visibilityScore: number;
  visibilityChange: number;
  aiCitations: KPIMetric;
  aiTraining: KPIMetric;
  aiIndexing: KPIMetric;
  allBotVisits: KPIMetric;
  visibilityTrend: { date: string; client: number; prev: number }[];
  competitors: GEOCompetitor[];
  platforms: GEOPlatformRow[];
  citationDomains: GEOCitationDomain[];
  shareOfVoice: number; // % of AI answers that mention the client
  shareOfVoiceChange: number;
  aiInsight: string;
}

export interface CountryRow {
  code: string;
  name: string;
  flag: string;
  traffic: number;
  trafficChange: number;
  lat: number;
  lon: number;
}

export interface KeywordBucket {
  bucket: string;
  label: string;
  count: number;
  change: number;
}

export interface SearchData {
  tldr: SectionTldr;
  geo: GEOData;
  healthScore: number;
  domainRating: number;
  organicKeywordsTotal: KPIMetric;
  backlinks: KPIMetric;
  referringDomains: KPIMetric;
  trafficValue: KPIMetric;
  organicTraffic?: KPIMetric;
  organicSessions: { date: string; value: number }[];
  referringDomainsTrend: { date: string; value: number }[];
  keywords: KeywordRow[];
  keywordBuckets: KeywordBucket[];
  intentBreakdown: { name: string; value: number }[];
  pipelineFromOrganic: KPIMetric;
  countryBreakdown: CountryRow[];
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

export interface FunnelStep {
  label: string;
  sessions: number;
  dropoffPct: number;
}

export interface TopPage {
  url: string;
  sessions: number;
  scrollDepth: number;
  exitRate: number;
}

export interface SessionRecording {
  id: string;
  page: string;
  duration: string;
  flags: ("rage-click" | "dead-click" | "quick-back" | "js-error")[];
  country: string;
  device: "desktop" | "mobile" | "tablet";
}

export interface WebsiteData {
  tldr: SectionTldr;
  // Core traffic KPIs
  visitors: KPIMetric;
  sessions: KPIMetric;
  companiesIdentified: KPIMetric;
  avgTimeOnSite: KPIMetric;
  returning: KPIMetric;
  hotAccounts: KPIMetric;
  // Clarity behavioral KPIs
  rageclickRate: KPIMetric;
  deadclickRate: KPIMetric;
  scrollDepth: KPIMetric;
  jsErrors: KPIMetric;
  quickBackRate: KPIMetric;
  // Reading behavior
  readingBehavior: { label: string; pct: number; sessions: number; color: string }[];
  // Trend & sources
  visitorTrend: { date: string; value: number }[];
  trafficSources: { name: string; value: number }[];
  // Visitor geo for globe
  visitorCountries: CountryRow[];
  // Top pages
  topPages: TopPage[];
  // Funnel
  funnelSteps: FunnelStep[];
  // Session recordings feed
  sessionRecordings: SessionRecording[];
  // Heatmap & signals (preserved)
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

/* ── LinkedIn (Taplio) ── */
export interface LinkedInKPIs {
  followers: KPIMetric;
  impressions: KPIMetric;
  engagements: KPIMetric;
  posts: KPIMetric;
  comments: KPIMetric;
  likes: KPIMetric;
  shares: KPIMetric;
  profileViews: KPIMetric;
}

export interface LinkedInPost {
  id: string;
  date: string;
  content: string;
  impressions: number;
  engagementRate: number;
  likes: number;
  comments: number;
  pipeline: number;
  isViral: boolean;
}

/* ── Social / Meta (Sprout Social) ── */
export interface AudienceGrowthPoint {
  date: string;
  linkedin: number;
  instagram?: number;
  facebook?: number;
  x?: number;
  youtube?: number;
  newsletter?: number;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  volume: number;
  volumeChange: number;
  themes: { theme: string; count: number; sentiment: "positive" | "neutral" | "negative" }[];
}

export interface SocialPlatformStats {
  platform: string;
  color: string;
  followers: number;
  followersChange: number;
  reach: number;
  engagementRate: number;
  posts: number;
  reelsWatchTime?: number;
  hookRate?: number;
}

/* ── Blog / SEO Content (Optimizely) ── */
export interface BlogPost {
  title: string;
  url: string;
  pageviews: number;
  avgAttentionTime: string;
  engagementRate: number;
  pipeline: number;
  published: string;
}

export interface ContentExperiment {
  id: string;
  name: string;
  status: "running" | "won" | "paused";
  daysRunning: number;
  visitors: number;
  baseline: { label: string; conversions: number; visitors: number; conversionRate: number };
  variation: { label: string; conversions: number; visitors: number; conversionRate: number; improvement: number };
  significance: number;
  significanceCurve: { day: number; value: number }[];
}

/* ── Newsletter (Beehiiv) ── */
export interface NewsletterAcquisitionSource {
  source: string;
  subscribers: number;
  pct: number;
  openRate: number;
  unsubscribeRate: number;
}

export interface ContentData {
  tldr: SectionTldr;
  // Social (Sprout style)
  socialOverview: SocialChannelRow[];
  topPosts: CalendarPost[];
  platformStats: SocialPlatformStats[];
  audienceGrowthStacked: AudienceGrowthPoint[];
  sentiment: SentimentData;
  // LinkedIn (Taplio style)
  linkedinKPIs: LinkedInKPIs;
  linkedinPosts: LinkedInPost[];
  linkedinFollowerGrowth: { date: string; value: number }[];
  contentCalendar: CalendarPost[];
  // Blog / SEO (Optimizely style)
  blogPosts: BlogPost[];
  blogExperiments: ContentExperiment[];
  blogPageviewsTrend: { date: string; value: number }[];
  // Newsletter (Beehiiv style)
  newsletters: NewsletterCampaign[];
  subscriberGrowth: { date: string; value: number }[];
  openRateTrend: { date: string; value: number }[];
  activeSubscribers: KPIMetric;
  openRate: KPIMetric;
  clickRate: KPIMetric;
  acquisitionSources: NewsletterAcquisitionSource[];
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
  // Instantly.ai-style extras
  openRate: number;
  replyRate: number;
  positiveReplyRate: number;
  bounceRate: number;
  leads: number;
  completed: number;
  bounced: number;
  unsubscribed: number;
  sequenceSteps: { step: string; sent: number; opened: number; replied: number; openRate: number; replyRate: number }[];
  trend: { date: string; sent: number; opens: number; replies: number }[];
}

export interface InboxHealth {
  email: string;
  warmupScore: number;
  deliverabilityScore: number;
  spamScore: number;
  blacklisted: boolean;
  daysWarmedUp: number;
  status: "healthy" | "warming" | "at-risk";
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

export interface EmailFunnelStep {
  stage: string;
  count: number;
  rate: number; // % of previous step
  color: string;
}

export interface CRMPipelineFunnel {
  stage: string;
  value: number; // $ pipeline value
  deals: number;
  pct: number;   // % of top stage
  color: string;
}

/* ─────────────── Salesloft LinkedIn types ─────────────── */
export interface DealFlowItem {
  label: string;
  value: number;
  color: string;
}
export interface DealFlowLink {
  from: string;
  to: string;
  value: number;
}
export interface SalesloftData {
  rhythm: {
    prioritizedActions: number;
    completed: number;
    allActivitiesMonth: number;
    activityTrend: { date: string; count: number }[];
  };
  outcomes: {
    label: string;
    current: number;
    projection: number;
    goal: number;
    unit: "count" | "money";
    color: string;
    byRep: { name: string; value: number }[];
  }[];
  cadenceMetrics: {
    callsLogged: number; callsPerDay: number; voicemails: number; conversations: number;
    positiveConversations: number; callTrend: number[]; callChangePct: number;
    emailsSent: number; pctPersonalized: number; pctOpened: number; pctClicked: number;
    pctReplied: number; emailTrend: number[]; emailChangePct: number;
    totalTouches: number; totalMeetings: number; meetingChangePct: number;
    effectivenessScore: number; effectivenessChangePct: number;
    linkedinSteps: number; linkedinResearch: number; linkedinIntroductions: number;
    linkedinConnections: number; linkedinInMail: number;
    otherStepsCompleted: number;
  };
  topCadences: {
    name: string; opportunities: number; meetings: number;
    successes: number; effectivenessScore: number; oppChangePct: number;
  }[];
  topReps: {
    name: string; successes: number; meetings: number; opportunities: number;
    totalActivity: number; emailsSent: number; callsLogged: number; integrationSteps: number;
  }[];
  dealFlow: {
    startPeriod: string; endPeriod: string;
    startTotal: number; endTotal: number; delta: number;
    sources: DealFlowItem[];
    destinations: DealFlowItem[];
    links: DealFlowLink[];
  };
}

export interface OutreachData {
  tldr: SectionTldr;
  emailPipeline: KPIMetric;
  // Instantly.ai master KPIs
  totalSent: KPIMetric;
  openRate: KPIMetric;
  clickRate: KPIMetric;
  replyRate: KPIMetric;
  opportunitiesCount: KPIMetric;
  // Trend (sent/opens/unique opens/replies over time)
  masterTrend: { date: string; sent: number; opens: number; uniqueOpens: number; replies: number }[];
  emailCampaigns: EmailCampaign[];
  inboxHealth: InboxHealth[];
  // Funnels
  emailFunnel: EmailFunnelStep[];
  crmPipelineFunnel: CRMPipelineFunnel[];
  replyWaterfall: { step: string; value: number }[];
  topSubjectLines: { subject: string; replyRate: number }[];
  linkedinFunnel: { stage: string; value: number }[];
  linkedinCampaigns: LinkedInCampaign[];
  icpScoreDistribution: { score: string; count: number }[];
  salesloft: SalesloftData;
}

/* ─────────────── Integration ─────────────── */
export interface Integration {
  id: string;
  name: string;
  category: "crm" | "social" | "seo" | "outreach" | "website-intel" | "analytics" | "paid-media";
  connected: boolean;
  lastSync?: string;
}

/* ─────────────── Paid Media ─────────────── */
export interface PaidMediaCampaign {
  id: string;
  name: string;
  platform: string;
  status: "active" | "paused" | "completed";
  spend: number;
  revenue: number;
  roas: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpa: number;
  cpc: number;
}

export interface PaidMediaData {
  tldr: SectionTldr;
  totalSpend: KPIMetric;
  totalRevenue: KPIMetric;
  roas: KPIMetric;
  cac: KPIMetric;
  campaigns: PaidMediaCampaign[];
  platformBreakdown: { platform: string; spend: number; revenue: number; roas: number; color: string }[];
  spendTrend: { date: string; spend: number; revenue: number }[];
  bestCampaigns: { name: string; platform: string; revenue: number; conversions: number; roas: number }[];
  bestAds: { name: string; platform: string; revenue: number; conversions: number; ctr: number }[];
}

/* ─────────────── Narrative Resonance Index + Phase Metrics ─────────────── */
export interface PhaseMetricPair {
  growthMetric: { name: string; value: string; change: number; suppressChange?: boolean };
  emotionalIndicator: { name: string; value: string; change: number };
}

export interface NarrativeIntelData {
  nri: {
    current: number;
    target: number;
    tier: "DIY" | "DWY" | "DFY";
    trend: "up" | "stable" | "down";
  };
  phaseMetrics: {
    phase1: PhaseMetricPair;
    phase2: PhaseMetricPair;
    phase3: PhaseMetricPair;
    phase4: PhaseMetricPair;
    phase5: PhaseMetricPair;
  };
}

/* ─────────────── Section TLDR ─────────────── */
export interface TldrAction {
  title: string;
  description: string;
  priority: "high" | "medium";
  cta: string;
}

export interface SectionTldr {
  summary: string;
  actions: TldrAction[];
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
  paidMedia: PaidMediaData;
  narrativeIntel: NarrativeIntelData;
  pipelineBridge: {
    section: string;
    attributed: number;
    deals: number;
    velocity: number;
  };
}

export type ClientDataByRange = Record<DateRange, ClientData>;
