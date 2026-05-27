import type { ClientDataByRange, ClientData } from "./types";

function makeNexus(range: "7d" | "30d" | "90d"): ClientData {
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
  const spark = () => Array.from({ length: 7 }, (_, i) => Math.round(80 + Math.sin(i * 0.9) * 20 + Math.random() * 15));

  return {
    meta: {
      id: "nexus",
      name: "Nexus Labs",
      type: "SaaS",
      stage: "Series B",
      channels: ["linkedin", "website", "email", "search"],
    },
    kpis: {
      cac: { value: 1240, change: -12, sparkline: spark(), prefix: "$" },
      pipeline: { value: Math.round(840000 * mult), change: 18, sparkline: spark(), prefix: "$" },
      dealVelocity: { value: 34, change: -8, sparkline: spark(), suffix: "d" },
      dealsCreated: { value: Math.round(14 * mult), change: 22, sparkline: spark() },
      closedWon: { value: Math.round(4 * mult), change: 15, sparkline: spark() },
      attributedRevenue: { value: Math.round(210000 * mult), change: 31, sparkline: spark(), prefix: "$" },
    },
    signalTimeline: dates.map((date, i) => ({
      date,
      linkedin: Math.round(65 + Math.sin(i * 0.7) * 18 + i * 0.8),
      website: Math.round(72 + Math.cos(i * 0.5) * 14 + i * 0.6),
      email: Math.round(48 + Math.sin(i * 0.9) * 12 + i * 0.4),
      search: Math.round(55 + Math.cos(i * 0.6) * 10 + i * 0.5),
      content: Math.round(40 + Math.sin(i * 0.4) * 8 + i * 0.3),
    })),
    aiNarrative:
      "Your LinkedIn signal velocity is 2.3× higher than your Q1 baseline, correlating with a 40% increase in inbound pipeline this month. Website intent signals from Series B SaaS companies are clustering around your pricing and ROI pages, suggesting high commercial intent. Recommend accelerating cadence on email sequences targeting CFO personas — open rates are 34% above benchmark.",
    recommendedActions: [
      {
        priority: "high",
        icon: "TrendingUp",
        title: "Amplify LinkedIn thought leadership",
        description: "Your CEO posts generate 3.1× more pipeline-attributable engagement than product posts. Publishing 2× per week on narrative-led content could add $120k to pipeline.",
        cta: "Create content brief",
      },
      {
        priority: "high",
        icon: "Target",
        title: "Launch intent-triggered email sequence",
        description: "14 accounts have visited pricing 3+ times in the last 7 days. A targeted 3-step sequence to these accounts has estimated 22% reply rate based on segment benchmarks.",
        cta: "View accounts",
      },
      {
        priority: "medium",
        icon: "Search",
        title: "Capture 'pipeline analytics' keyword cluster",
        description: "You rank #7 for 'pipeline analytics for SaaS'. A content refresh targeting this cluster could move you to top 3, adding ~340 monthly qualified sessions.",
        cta: "View keyword brief",
      },
    ],
    brand: {
      healthScore: 84,
      storyConsistency: [
        { channel: "LinkedIn", score: 91 },
        { channel: "Website", score: 88 },
        { channel: "Email", score: 76 },
        { channel: "Search", score: 82 },
      ],
      shareOfVoice: [
        { name: "Nexus Labs", value: 34, isClient: true },
        { name: "NarrateIQ", value: 28, isClient: false },
        { name: "PipelineOS", value: 22, isClient: false },
        { name: "Others", value: 16, isClient: false },
      ],
      attributionFunnel: [
        { stage: "Impressions", value: 420000 },
        { stage: "Engaged", value: 38000 },
        { stage: "Converted", value: 2800 },
        { stage: "Pipeline", value: 840000 },
      ],
      aiInsight:
        "Brand story consistency is strongest on LinkedIn (91/100) and dips in email sequences (76/100). Tightening the value proposition language in your drip campaigns to match LinkedIn messaging could improve email-attributed pipeline by an estimated 18%.",
    },
    positioning: {
      quadrant: [
        { name: "Nexus Labs", x: 74, y: 81, isClient: true },
        { name: "NarrateIQ", x: 68, y: 62, isClient: false },
        { name: "PipelineOS", x: 55, y: 70, isClient: false },
        { name: "StoryScale", x: 42, y: 78, isClient: false },
        { name: "Contentful MktOS", x: 30, y: 45, isClient: false },
      ],
      movementTimeline: [
        { date: "2025-09", x: 58, y: 62 },
        { date: "2025-10", x: 62, y: 67 },
        { date: "2025-11", x: 65, y: 72 },
        { date: "2025-12", x: 68, y: 75 },
        { date: "2026-01", x: 71, y: 78 },
        { date: "2026-02", x: 74, y: 81 },
      ],
      competitors: [
        { name: "NarrateIQ", narrativeScore: 62, marketPresence: 68, lastSeen: "2 days ago", trend: "flat" },
        { name: "PipelineOS", narrativeScore: 70, marketPresence: 55, lastSeen: "1 day ago", trend: "up" },
        { name: "StoryScale", narrativeScore: 78, marketPresence: 42, lastSeen: "5 days ago", trend: "down" },
        { name: "Contentful MktOS", narrativeScore: 45, marketPresence: 30, lastSeen: "2 weeks ago", trend: "flat" },
      ],
      keywordOwnership: [
        { keyword: "narrative marketing", score: 88 },
        { keyword: "pipeline intelligence", score: 82 },
        { keyword: "B2B content ROI", score: 74 },
        { keyword: "signal-to-pipeline", score: 91 },
        { keyword: "GTM narrative", score: 67 },
      ],
    },
    search: {
      organicSessions: dates.map((date, i) => ({
        date,
        value: Math.round(3200 + i * 45 + Math.sin(i * 0.8) * 200),
      })),
      keywords: [
        { keyword: "signal-to-pipeline SaaS", ranking: 2, volume: 1200, change: 3, intent: "commercial" },
        { keyword: "narrative marketing platform", ranking: 1, volume: 890, change: 1, intent: "commercial" },
        { keyword: "pipeline analytics B2B", ranking: 7, volume: 2100, change: -2, intent: "commercial" },
        { keyword: "content attribution software", ranking: 4, volume: 760, change: 2, intent: "transactional" },
        { keyword: "B2B content ROI tracking", ranking: 3, volume: 540, change: 5, intent: "commercial" },
        { keyword: "marketing intelligence platform", ranking: 12, volume: 3200, change: -4, intent: "informational" },
        { keyword: "outreach signal tracking", ranking: 5, volume: 430, change: 8, intent: "commercial" },
        { keyword: "GTM narrative strategy", ranking: 9, volume: 670, change: 1, intent: "informational" },
        { keyword: "how to attribute pipeline", ranking: 3, volume: 890, change: 6, intent: "informational" },
        { keyword: "sales pipeline from content", ranking: 6, volume: 520, change: 2, intent: "transactional" },
      ],
      intentBreakdown: [
        { name: "Informational", value: 38 },
        { name: "Commercial", value: 44 },
        { name: "Transactional", value: 18 },
      ],
      pipelineFromOrganic: { value: 128000, change: 24, sparkline: spark(), prefix: "$" },
      geoEngines: [
        { engine: "ChatGPT", citations: 124, trend: [40, 55, 68, 82, 98, 110, 124] },
        { engine: "Perplexity", citations: 87, trend: [20, 32, 45, 58, 68, 78, 87] },
        { engine: "Gemini", citations: 63, trend: [15, 22, 34, 44, 52, 58, 63] },
        { engine: "Copilot", citations: 41, trend: [8, 14, 20, 28, 34, 38, 41] },
      ],
      topicAuthority: [
        { topic: "Product", score: 82 },
        { topic: "Brand", score: 91 },
        { topic: "Expertise", score: 76 },
        { topic: "Thought Leadership", score: 88 },
        { topic: "Market", score: 69 },
        { topic: "Social Proof", score: 74 },
      ],
      geoPipelineKPI: { value: 94000, change: 340, sparkline: spark(), prefix: "$" },
    },
    website: {
      visitors: { value: Math.round(18400 * mult), change: 14, sparkline: spark() },
      companiesIdentified: { value: Math.round(340 * mult), change: 22, sparkline: spark() },
      avgTimeOnSite: { value: 4.2, change: 8, sparkline: spark(), suffix: "m" },
      returning: { value: Math.round(5200 * mult), change: 31, sparkline: spark() },
      hotAccounts: { value: Math.round(28 * mult), change: 45, sparkline: spark() },
      visitorTrend: dates.map((date, i) => ({
        date,
        value: Math.round(580 + i * 8 + Math.sin(i * 0.7) * 60),
      })),
      trafficSources: [
        { name: "Organic", value: 38 },
        { name: "LinkedIn", value: 24 },
        { name: "Direct", value: 18 },
        { name: "Referral", value: 12 },
        { name: "Email", value: 8 },
      ],
      intentHeatmap: (() => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
        return days.flatMap((day) =>
          hours.map((hour) => ({
            day,
            hour,
            value: Math.round(
              20 +
                (["Tue", "Wed", "Thu"].includes(day) ? 30 : 0) +
                (["10am", "11am", "2pm", "3pm"].includes(hour) ? 25 : 0) +
                Math.random() * 20
            ),
          }))
        );
      })(),
      signals: [
        { id: "1", company: "Axiom Revenue", industry: "SaaS", signalScore: 94, pagesVisited: 12, timeOnSite: "8m 24s", source: "LinkedIn", intent: "hot", pages: ["/pricing", "/roi-calculator", "/case-studies"], companySize: "201-500", linkedinUrl: "#" },
        { id: "2", company: "Meridian Partners", industry: "Professional Services", signalScore: 87, pagesVisited: 8, timeOnSite: "5m 12s", source: "Organic", intent: "hot", pages: ["/product", "/pricing", "/integrations"], companySize: "51-200", linkedinUrl: "#" },
        { id: "3", company: "Cascade Growth", industry: "FinTech", signalScore: 76, pagesVisited: 6, timeOnSite: "4m 01s", source: "Direct", intent: "warm", pages: ["/product", "/about"], companySize: "11-50", linkedinUrl: "#" },
        { id: "4", company: "Orbit Technologies", industry: "DevTools", signalScore: 71, pagesVisited: 5, timeOnSite: "3m 44s", source: "Referral", intent: "warm", pages: ["/blog", "/product"], companySize: "11-50", linkedinUrl: "#" },
        { id: "5", company: "Summit Analytics", industry: "Analytics", signalScore: 68, pagesVisited: 4, timeOnSite: "2m 55s", source: "LinkedIn", intent: "warm", pages: ["/home", "/product"], companySize: "51-200", linkedinUrl: "#" },
        { id: "6", company: "Pinnacle Media", industry: "Media", signalScore: 45, pagesVisited: 2, timeOnSite: "1m 02s", source: "Email", intent: "cold", pages: ["/blog"], companySize: "201-500", linkedinUrl: "#" },
        { id: "7", company: "Vector Systems", industry: "Enterprise Tech", signalScore: 38, pagesVisited: 2, timeOnSite: "0m 54s", source: "Organic", intent: "cold", pages: ["/home"], companySize: "500+", linkedinUrl: "#" },
      ],
    },
    content: {
      socialOverview: [
        { channel: "LinkedIn", posts: Math.round(12 * mult), reach: Math.round(48000 * mult), engagementRate: 4.8, pipeline: Math.round(180000 * mult) },
        { channel: "Email", posts: Math.round(4 * mult), reach: Math.round(8200 * mult), engagementRate: 32, pipeline: Math.round(95000 * mult) },
      ],
      topPosts: [
        { date: "2026-02-14", channel: "linkedin", title: "Why your narrative IS your pipeline", reach: 12400, engagementRate: 6.2, pipeline: 48000, content: "Stop measuring content by likes. Every post is a pipeline event. Here's how we track it..." },
        { date: "2026-02-08", channel: "linkedin", title: "The B2B signal stack in 2026", reach: 8900, engagementRate: 5.1, pipeline: 32000, content: "Intent data is table stakes. Signal intelligence is what separates 28% win rates from 48%..." },
        { date: "2026-02-01", channel: "newsletter", title: "Narrative Operating System: Feb Edition", reach: 4200, engagementRate: 38, pipeline: 28000, content: "This month: How 3 Series B SaaS companies tripled pipeline velocity by fixing one thing..." },
      ],
      linkedinFollowerGrowth: dates.map((date, i) => ({
        date,
        value: Math.round(4200 + i * 38 + Math.sin(i * 0.5) * 50),
      })),
      contentCalendar: (() => {
        const posts: import("./types").CalendarPost[] = [];
        for (let d = 1; d <= 28; d++) {
          if (d % 3 === 0) posts.push({ date: `2026-02-${String(d).padStart(2, "0")}`, channel: "linkedin", title: `LinkedIn Post Day ${d}`, reach: Math.round(3000 + Math.random() * 8000), engagementRate: 3 + Math.random() * 4, pipeline: Math.round(5000 + Math.random() * 40000), content: "Narrative-driven post about pipeline intelligence and signal tracking for B2B SaaS..." });
          if (d % 7 === 0) posts.push({ date: `2026-02-${String(d).padStart(2, "0")}`, channel: "newsletter", title: `NOS Weekly #${Math.ceil(d / 7)}`, reach: Math.round(3800 + Math.random() * 1000), engagementRate: 30 + Math.random() * 12, pipeline: Math.round(15000 + Math.random() * 20000), content: "This week in narrative marketing: signal-to-pipeline ratios for high-growth SaaS..." });
        }
        return posts;
      })(),
      newsletters: [
        { id: "n1", subject: "How Nexus increased pipeline 40% by changing one word in their narrative", sent: 4200, openRate: 41, clickRate: 8.2, unsubscribes: 12, pipeline: 48000, date: "2026-02-14" },
        { id: "n2", subject: "The 3 signals that predict enterprise deals before they happen", sent: 4150, openRate: 38, clickRate: 6.8, unsubscribes: 8, pipeline: 32000, date: "2026-02-07" },
        { id: "n3", subject: "NOS Benchmark Report: Q1 2026 Pipeline Velocity Index", sent: 4100, openRate: 44, clickRate: 11.2, unsubscribes: 5, pipeline: 62000, date: "2026-01-31" },
      ],
      subscriberGrowth: dates.map((date, i) => ({
        date,
        value: Math.round(3800 + i * 15 + Math.sin(i * 0.3) * 30),
      })),
      openRateTrend: dates.map((date, i) => ({
        date,
        value: Math.round(34 + Math.sin(i * 0.6) * 5 + i * 0.1),
      })),
    },
    outreach: {
      emailPipeline: { value: Math.round(280000 * mult), change: 26, sparkline: spark(), prefix: "$" },
      emailCampaigns: [
        { id: "e1", name: "CFO Persona — Pipeline Narrative", status: "active", sequence: 4, sent: Math.round(280 * mult), opens: Math.round(112 * mult), replies: Math.round(34 * mult), meetings: Math.round(9 * mult), pipeline: Math.round(180000 * mult) },
        { id: "e2", name: "VP Marketing — Signal Stack", status: "active", sequence: 3, sent: Math.round(180 * mult), opens: Math.round(68 * mult), replies: Math.round(18 * mult), meetings: Math.round(5 * mult), pipeline: Math.round(95000 * mult) },
        { id: "e3", name: "Re-engagement — Q4 2025 Prospects", status: "completed", sequence: 2, sent: Math.round(95 * mult), opens: Math.round(32 * mult), replies: Math.round(7 * mult), meetings: Math.round(2 * mult), pipeline: Math.round(40000 * mult) },
      ],
      replyWaterfall: [
        { step: "Step 1", value: 100 },
        { step: "Step 2", value: 68 },
        { step: "Step 3", value: 42 },
        { step: "Step 4", value: 28 },
      ],
      topSubjectLines: [
        { subject: "How [Company] can 3× pipeline velocity in Q2", replyRate: 18.4 },
        { subject: "Your Q1 signal data — want me to share what I found?", replyRate: 14.2 },
        { subject: "Quick question about {{Company}}'s content attribution", replyRate: 11.8 },
        { subject: "CFO at [Company] — this might be worth 15 minutes", replyRate: 9.6 },
      ],
      linkedinFunnel: [
        { stage: "Connection Sent", value: 420 },
        { stage: "Accepted", value: 218 },
        { stage: "Replied", value: 84 },
        { stage: "Meeting Booked", value: 28 },
      ],
      linkedinCampaigns: [
        { id: "l1", name: "Series B CROs — Narrative Angle", status: "active", sent: Math.round(140 * mult), accepted: Math.round(72 * mult), replied: Math.round(28 * mult), meetings: Math.round(8 * mult), pipeline: Math.round(120000 * mult) },
        { id: "l2", name: "VP Sales — Pipeline Intelligence", status: "active", sent: Math.round(110 * mult), accepted: Math.round(52 * mult), replied: Math.round(18 * mult), meetings: Math.round(5 * mult), pipeline: Math.round(75000 * mult) },
      ],
      icpScoreDistribution: [
        { score: "90-100", count: 24 },
        { score: "80-89", count: 68 },
        { score: "70-79", count: 112 },
        { score: "60-69", count: 84 },
        { score: "50-59", count: 45 },
        { score: "<50", count: 18 },
      ],
    },
    integrations: [
      { id: "crm", name: "CRM", category: "crm", connected: true, lastSync: "2 min ago" },
      { id: "linkedin", name: "LinkedIn", category: "social", connected: true, lastSync: "5 min ago" },
      { id: "google-search", name: "Google Search Console", category: "seo", connected: true, lastSync: "1 hour ago" },
      { id: "email-seq", name: "Email Sequencer", category: "outreach", connected: true, lastSync: "12 min ago" },
      { id: "website-intel", name: "Website Intelligence", category: "website-intel", connected: true, lastSync: "Real-time" },
      { id: "analytics", name: "Web Analytics", category: "analytics", connected: true, lastSync: "Real-time" },
      { id: "instagram", name: "Instagram", category: "social", connected: false },
      { id: "facebook", name: "Facebook", category: "social", connected: false },
    ],
    pipelineBridge: {
      section: "Narrative Intel",
      attributed: Math.round(840000 * mult),
      deals: Math.round(4 * mult),
      velocity: 34,
    },
  };
}

export const nexusData: ClientDataByRange = {
  "7d": makeNexus("7d"),
  "30d": makeNexus("30d"),
  "90d": makeNexus("90d"),
};
