import type { ClientDataByRange, ClientData } from "./types";

function makeMeridian(range: "7d" | "30d" | "90d"): ClientData {
  const mult = range === "7d" ? 0.23 : range === "30d" ? 1 : 3.1;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;

  const generateDates = (n: number) => {
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(2026, 1, 1);
      d.setDate(d.getDate() + i * (90 / n));
      return d.toISOString().split("T")[0];
    });
  };

  const dates = generateDates(days > 30 ? 24 : days > 7 ? 12 : 7);
  const spark = () => Array.from({ length: 7 }, (_, i) => Math.round(60 + Math.cos(i * 0.8) * 20 + Math.random() * 12));

  return {
    meta: {
      id: "meridian",
      name: "Meridian Brands",
      type: "D2C-adjacent B2B",
      stage: "Growth",
      channels: ["linkedin", "instagram", "facebook", "newsletter", "email"],
    },
    kpis: {
      cac: { value: 680, change: -6, sparkline: spark(), prefix: "$" },
      pipeline: { value: Math.round(310000 * mult), change: 12, sparkline: spark(), prefix: "$" },
      dealVelocity: { value: 21, change: -14, sparkline: spark(), suffix: "d" },
      dealsCreated: { value: Math.round(22 * mult), change: 18, sparkline: spark() },
      closedWon: { value: Math.round(7 * mult), change: 34, sparkline: spark() },
      attributedRevenue: { value: Math.round(78000 * mult), change: 28, sparkline: spark(), prefix: "$" },
    },
    signalTimeline: dates.map((date, i) => ({
      date,
      linkedin: Math.round(55 + Math.sin(i * 0.6) * 15 + i * 0.5),
      website: Math.round(62 + Math.cos(i * 0.4) * 12 + i * 0.4),
      email: Math.round(72 + Math.sin(i * 0.8) * 10 + i * 0.3),
      search: Math.round(38 + Math.cos(i * 0.5) * 8 + i * 0.2),
      content: Math.round(68 + Math.sin(i * 0.3) * 14 + i * 0.6),
    })),
    aiNarrative:
      "Instagram engagement is driving 2.1× more top-of-funnel leads than LinkedIn for Meridian's audience segment. Your newsletter has the highest content-to-pipeline conversion rate at 38%, suggesting your owned audience is your biggest untapped pipeline lever. Recommend a newsletter-first content strategy with social amplification on Instagram and Facebook.",
    recommendedActions: [
      {
        priority: "high",
        icon: "Mail",
        title: "Scale newsletter to pipeline engine",
        description: "Your newsletter open rate (41%) is 62% above industry median. A dedicated pipeline nurture sequence for engaged subscribers could add $45k in monthly pipeline.",
        cta: "Build sequence",
      },
      {
        priority: "high",
        icon: "Instagram",
        title: "Instagram-to-email funnel optimization",
        description: "Instagram posts mentioning customer outcomes convert 3.8× better to email subscribers than product posts. A simple link-in-bio redirect could capture 180+ qualified leads/month.",
        cta: "Set up funnel",
      },
      {
        priority: "medium",
        icon: "BarChart",
        title: "Facebook retargeting for mid-funnel",
        description: "Website visitors from Instagram who don't convert are showing strong intent signals. A Facebook retargeting campaign targeting these visitors has estimated $28 CPL in your category.",
        cta: "Create audience",
      },
    ],
    brand: {
      healthScore: 78,
      storyConsistency: [
        { channel: "LinkedIn", score: 82 },
        { channel: "Instagram", score: 88 },
        { channel: "Facebook", score: 74 },
        { channel: "Email", score: 91 },
        { channel: "Newsletter", score: 94 },
      ],
      shareOfVoice: [
        { name: "Meridian Brands", value: 28, isClient: true },
        { name: "BrandFlow Co", value: 32, isClient: false },
        { name: "ContentPulse", value: 24, isClient: false },
        { name: "Others", value: 16, isClient: false },
      ],
      attributionFunnel: [
        { stage: "Impressions", value: 820000 },
        { stage: "Engaged", value: 62000 },
        { stage: "Converted", value: 3400 },
        { stage: "Pipeline", value: 310000 },
      ],
      aiInsight:
        "Brand story consistency peaks in newsletter (94/100) and drops on Facebook (74/100). Facebook posts are using promotional language that conflicts with the thought leadership narrative dominant in your email and newsletter channels. Aligning Facebook content to your editorial voice could lift engagement rate by 28%.",
    },
    positioning: {
      quadrant: [
        { name: "Meridian Brands", x: 58, y: 72, isClient: true },
        { name: "BrandFlow Co", x: 72, y: 58, isClient: false },
        { name: "ContentPulse", x: 45, y: 65, isClient: false },
        { name: "SocialROI Pro", x: 38, y: 48, isClient: false },
        { name: "NarrativeLab", x: 62, y: 81, isClient: false },
      ],
      movementTimeline: [
        { date: "2025-09", x: 44, y: 58 },
        { date: "2025-10", x: 47, y: 62 },
        { date: "2025-11", x: 50, y: 65 },
        { date: "2025-12", x: 53, y: 68 },
        { date: "2026-01", x: 56, y: 70 },
        { date: "2026-02", x: 58, y: 72 },
      ],
      competitors: [
        { name: "BrandFlow Co", narrativeScore: 58, marketPresence: 72, lastSeen: "1 day ago", trend: "up" },
        { name: "ContentPulse", narrativeScore: 65, marketPresence: 45, lastSeen: "3 days ago", trend: "flat" },
        { name: "SocialROI Pro", narrativeScore: 48, marketPresence: 38, lastSeen: "1 week ago", trend: "down" },
        { name: "NarrativeLab", narrativeScore: 81, marketPresence: 62, lastSeen: "4 days ago", trend: "up" },
      ],
      keywordOwnership: [
        { keyword: "multi-channel brand narrative", score: 76 },
        { keyword: "D2C brand intelligence", score: 82 },
        { keyword: "content-led pipeline", score: 68 },
        { keyword: "brand story consistency", score: 88 },
        { keyword: "social to pipeline tracking", score: 71 },
      ],
    },
    search: {
      organicSessions: dates.map((date, i) => ({
        date,
        value: Math.round(1800 + i * 22 + Math.sin(i * 0.7) * 120),
      })),
      keywords: [
        { keyword: "multi-channel content attribution", ranking: 4, volume: 880, change: 2, intent: "commercial" },
        { keyword: "D2C brand marketing platform", ranking: 6, volume: 1100, change: -1, intent: "commercial" },
        { keyword: "social media pipeline tracking", ranking: 3, volume: 640, change: 4, intent: "transactional" },
        { keyword: "newsletter attribution software", ranking: 2, volume: 420, change: 7, intent: "commercial" },
        { keyword: "Instagram to pipeline funnel", ranking: 8, volume: 380, change: 3, intent: "informational" },
        { keyword: "brand consistency checker", ranking: 5, volume: 720, change: 2, intent: "informational" },
        { keyword: "content ROI calculator B2B", ranking: 11, volume: 940, change: -3, intent: "transactional" },
        { keyword: "Facebook ads attribution model", ranking: 9, volume: 1200, change: 1, intent: "commercial" },
        { keyword: "LinkedIn organic vs paid ROI", ranking: 7, volume: 560, change: 5, intent: "informational" },
        { keyword: "newsletter monetization strategy", ranking: 4, volume: 310, change: 9, intent: "informational" },
      ],
      intentBreakdown: [
        { name: "Informational", value: 42 },
        { name: "Commercial", value: 38 },
        { name: "Transactional", value: 20 },
      ],
      pipelineFromOrganic: { value: 48000, change: 16, sparkline: spark(), prefix: "$" },
      geoEngines: [
        { engine: "ChatGPT", citations: 68, trend: [18, 28, 38, 48, 56, 62, 68] },
        { engine: "Perplexity", citations: 42, trend: [10, 18, 24, 30, 36, 39, 42] },
        { engine: "Gemini", citations: 31, trend: [8, 12, 18, 22, 26, 29, 31] },
        { engine: "Copilot", citations: 18, trend: [4, 7, 10, 13, 15, 17, 18] },
      ],
      topicAuthority: [
        { topic: "Product", score: 64 },
        { topic: "Brand", score: 88 },
        { topic: "Expertise", score: 72 },
        { topic: "Thought Leadership", score: 78 },
        { topic: "Market", score: 58 },
        { topic: "Social Proof", score: 82 },
      ],
      geoPipelineKPI: { value: 38000, change: 220, sparkline: spark(), prefix: "$" },
    },
    website: {
      visitors: { value: Math.round(9200 * mult), change: 11, sparkline: spark() },
      companiesIdentified: { value: Math.round(180 * mult), change: 14, sparkline: spark() },
      avgTimeOnSite: { value: 3.6, change: 5, sparkline: spark(), suffix: "m" },
      returning: { value: Math.round(2800 * mult), change: 24, sparkline: spark() },
      hotAccounts: { value: Math.round(14 * mult), change: 38, sparkline: spark() },
      visitorTrend: dates.map((date, i) => ({
        date,
        value: Math.round(280 + i * 5 + Math.cos(i * 0.6) * 40),
      })),
      trafficSources: [
        { name: "Organic", value: 28 },
        { name: "Instagram", value: 22 },
        { name: "Facebook", value: 18 },
        { name: "LinkedIn", value: 14 },
        { name: "Email", value: 18 },
      ],
      intentHeatmap: (() => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
        return days.flatMap((day) =>
          hours.map((hour) => ({
            day,
            hour,
            value: Math.round(
              15 +
                (["Mon", "Tue", "Thu"].includes(day) ? 25 : 0) +
                (["10am", "2pm", "3pm"].includes(hour) ? 20 : 0) +
                Math.random() * 18
            ),
          }))
        );
      })(),
      signals: [
        { id: "1", company: "Bloom Commerce", industry: "E-commerce", signalScore: 91, pagesVisited: 10, timeOnSite: "7m 12s", source: "Instagram", intent: "hot", pages: ["/pricing", "/case-studies", "/product"], companySize: "51-200", linkedinUrl: "#" },
        { id: "2", company: "Vantage Retail Group", industry: "Retail", signalScore: 84, pagesVisited: 7, timeOnSite: "4m 48s", source: "Organic", intent: "hot", pages: ["/product", "/pricing"], companySize: "201-500", linkedinUrl: "#" },
        { id: "3", company: "Prism Agency", industry: "Marketing Agency", signalScore: 74, pagesVisited: 5, timeOnSite: "3m 22s", source: "Facebook", intent: "warm", pages: ["/blog", "/product"], companySize: "11-50", linkedinUrl: "#" },
        { id: "4", company: "Luxe Direct", industry: "DTC", signalScore: 68, pagesVisited: 4, timeOnSite: "2m 34s", source: "LinkedIn", intent: "warm", pages: ["/product", "/about"], companySize: "11-50", linkedinUrl: "#" },
        { id: "5", company: "Mosaic Brands", industry: "CPG", signalScore: 42, pagesVisited: 2, timeOnSite: "0m 58s", source: "Email", intent: "cold", pages: ["/home"], companySize: "51-200", linkedinUrl: "#" },
      ],
    },
    content: {
      socialOverview: [
        { channel: "LinkedIn", posts: Math.round(10 * mult), reach: Math.round(28000 * mult), engagementRate: 4.1, pipeline: Math.round(85000 * mult) },
        { channel: "Instagram", posts: Math.round(18 * mult), reach: Math.round(94000 * mult), engagementRate: 6.8, pipeline: Math.round(62000 * mult) },
        { channel: "Facebook", posts: Math.round(14 * mult), reach: Math.round(42000 * mult), engagementRate: 2.9, pipeline: Math.round(38000 * mult) },
        { channel: "Newsletter", posts: Math.round(4 * mult), reach: Math.round(6800 * mult), engagementRate: 41, pipeline: Math.round(124000 * mult) },
      ],
      topPosts: [
        { date: "2026-02-12", channel: "instagram", title: "Behind the brand: how we track social to pipeline", reach: 28400, engagementRate: 8.4, pipeline: 42000, content: "Every social post is a pipeline event. Here's our attribution stack — swipe to see the full breakdown..." },
        { date: "2026-02-09", channel: "newsletter", title: "The Multi-Channel Attribution Playbook", reach: 6800, engagementRate: 44, pipeline: 58000, content: "Most brands track social. We track what social does to pipeline. Here's the playbook..." },
        { date: "2026-02-05", channel: "linkedin", title: "Why Meridian dropped vanity metrics", reach: 11200, engagementRate: 5.6, pipeline: 28000, content: "We stopped tracking follower count 6 months ago. Pipeline from content is up 34% since then..." },
      ],
      linkedinFollowerGrowth: dates.map((date, i) => ({
        date,
        value: Math.round(2800 + i * 22 + Math.sin(i * 0.4) * 35),
      })),
      contentCalendar: (() => {
        const posts: import("./types").CalendarPost[] = [];
        for (let d = 1; d <= 28; d++) {
          if (d % 2 === 0) posts.push({ date: `2026-02-${String(d).padStart(2, "0")}`, channel: "instagram", title: `Instagram Post Day ${d}`, reach: Math.round(4000 + Math.random() * 20000), engagementRate: 4 + Math.random() * 6, pipeline: Math.round(3000 + Math.random() * 25000), content: "Brand narrative post for D2C-adjacent audience..." });
          if (d % 3 === 0) posts.push({ date: `2026-02-${String(d).padStart(2, "0")}`, channel: "facebook", title: `Facebook Post Day ${d}`, reach: Math.round(2000 + Math.random() * 10000), engagementRate: 2 + Math.random() * 3, pipeline: Math.round(2000 + Math.random() * 15000), content: "Facebook engagement post targeting mid-funnel brand consideration..." });
          if (d % 5 === 0) posts.push({ date: `2026-02-${String(d).padStart(2, "0")}`, channel: "linkedin", title: `LinkedIn Article Day ${d}`, reach: Math.round(5000 + Math.random() * 15000), engagementRate: 3 + Math.random() * 4, pipeline: Math.round(8000 + Math.random() * 35000), content: "Thought leadership on multi-channel attribution and content ROI..." });
          if (d % 7 === 0) posts.push({ date: `2026-02-${String(d).padStart(2, "0")}`, channel: "newsletter", title: `Brand Intelligence Weekly #${Math.ceil(d / 7)}`, reach: Math.round(6500 + Math.random() * 800), engagementRate: 38 + Math.random() * 10, pipeline: Math.round(20000 + Math.random() * 30000), content: "This week: multi-channel attribution wins and the future of owned media pipeline..." });
        }
        return posts;
      })(),
      newsletters: [
        { id: "n1", subject: "The multi-channel attribution playbook for DTC brands", sent: 6800, openRate: 44, clickRate: 9.8, unsubscribes: 18, pipeline: 58000, date: "2026-02-09" },
        { id: "n2", subject: "Why we stopped tracking followers (and what we track instead)", sent: 6750, openRate: 41, clickRate: 7.4, unsubscribes: 12, pipeline: 42000, date: "2026-02-02" },
        { id: "n3", subject: "Meridian Q1 Brand Intelligence Report", sent: 6700, openRate: 48, clickRate: 12.1, unsubscribes: 9, pipeline: 72000, date: "2026-01-26" },
      ],
      subscriberGrowth: dates.map((date, i) => ({
        date,
        value: Math.round(6400 + i * 24 + Math.sin(i * 0.4) * 40),
      })),
      openRateTrend: dates.map((date, i) => ({
        date,
        value: Math.round(38 + Math.sin(i * 0.5) * 4 + i * 0.12),
      })),
    },
    outreach: {
      emailPipeline: { value: Math.round(95000 * mult), change: 18, sparkline: spark(), prefix: "$" },
      emailCampaigns: [
        { id: "e1", name: "Brand Director — Multi-Channel ROI", status: "active", sequence: 3, sent: Math.round(160 * mult), opens: Math.round(72 * mult), replies: Math.round(24 * mult), meetings: Math.round(7 * mult), pipeline: Math.round(68000 * mult) },
        { id: "e2", name: "CMO Persona — Attribution Story", status: "active", sequence: 3, sent: Math.round(120 * mult), opens: Math.round(50 * mult), replies: Math.round(14 * mult), meetings: Math.round(4 * mult), pipeline: Math.round(42000 * mult) },
        { id: "e3", name: "Newsletter Co-Promo Outreach", status: "completed", sequence: 2, sent: Math.round(80 * mult), opens: Math.round(38 * mult), replies: Math.round(11 * mult), meetings: Math.round(3 * mult), pipeline: Math.round(28000 * mult) },
      ],
      replyWaterfall: [
        { step: "Step 1", value: 100 },
        { step: "Step 2", value: 72 },
        { step: "Step 3", value: 44 },
      ],
      topSubjectLines: [
        { subject: "How {{Company}} can track Instagram → pipeline in 2 weeks", replyRate: 22.1 },
        { subject: "Your brand story vs competitors — I found something interesting", replyRate: 16.8 },
        { subject: "Multi-channel attribution for D2C brands (quick question)", replyRate: 13.4 },
      ],
      linkedinFunnel: [
        { stage: "Connection Sent", value: 280 },
        { stage: "Accepted", value: 162 },
        { stage: "Replied", value: 72 },
        { stage: "Meeting Booked", value: 24 },
      ],
      linkedinCampaigns: [
        { id: "l1", name: "Brand Leads — D2C Category", status: "active", sent: Math.round(110 * mult), accepted: Math.round(68 * mult), replied: Math.round(28 * mult), meetings: Math.round(9 * mult), pipeline: Math.round(58000 * mult) },
        { id: "l2", name: "Agency Partners — Referral Pipeline", status: "paused", sent: Math.round(80 * mult), accepted: Math.round(44 * mult), replied: Math.round(14 * mult), meetings: Math.round(4 * mult), pipeline: Math.round(32000 * mult) },
      ],
      icpScoreDistribution: [
        { score: "90-100", count: 18 },
        { score: "80-89", count: 52 },
        { score: "70-79", count: 88 },
        { score: "60-69", count: 64 },
        { score: "50-59", count: 38 },
        { score: "<50", count: 22 },
      ],
    },
    integrations: [
      { id: "crm", name: "CRM", category: "crm", connected: true, lastSync: "4 min ago" },
      { id: "linkedin", name: "LinkedIn", category: "social", connected: true, lastSync: "8 min ago" },
      { id: "instagram", name: "Instagram", category: "social", connected: true, lastSync: "3 min ago" },
      { id: "facebook", name: "Facebook", category: "social", connected: true, lastSync: "6 min ago" },
      { id: "email-seq", name: "Email Sequencer", category: "outreach", connected: true, lastSync: "15 min ago" },
      { id: "analytics", name: "Web Analytics", category: "analytics", connected: true, lastSync: "Real-time" },
      { id: "google-search", name: "Google Search Console", category: "seo", connected: false },
      { id: "website-intel", name: "Website Intelligence", category: "website-intel", connected: false },
    ],
    pipelineBridge: {
      section: "Narrative Intel",
      attributed: Math.round(310000 * mult),
      deals: Math.round(7 * mult),
      velocity: 21,
    },
  };
}

export const meridianData: ClientDataByRange = {
  "7d": makeMeridian("7d"),
  "30d": makeMeridian("30d"),
  "90d": makeMeridian("90d"),
};
