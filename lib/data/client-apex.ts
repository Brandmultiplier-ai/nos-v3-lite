import type { ClientDataByRange, ClientData } from "./types";

function makeApex(range: "7d" | "30d" | "90d"): ClientData {
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
  const spark = () => Array.from({ length: 7 }, (_, i) => Math.round(70 + Math.sin(i * 1.1) * 15 + Math.random() * 10));

  return {
    meta: {
      id: "apex",
      name: "Apex Systems",
      type: "Enterprise B2B",
      stage: "Enterprise",
      channels: ["linkedin", "email", "search"],
    },
    kpis: {
      cac: { value: 3100, change: -4, sparkline: spark(), prefix: "$" },
      pipeline: { value: Math.round(2100000 * mult), change: 9, sparkline: spark(), prefix: "$" },
      dealVelocity: { value: 58, change: -3, sparkline: spark(), suffix: "d" },
      dealsCreated: { value: Math.round(8 * mult), change: 14, sparkline: spark() },
      closedWon: { value: Math.round(1.5 * mult), change: 19, sparkline: spark() },
      attributedRevenue: { value: Math.round(540000 * mult), change: 22, sparkline: spark(), prefix: "$" },
    },
    signalTimeline: dates.map((date, i) => ({
      date,
      linkedin: Math.round(78 + Math.sin(i * 0.5) * 14 + i * 0.4),
      website: Math.round(68 + Math.cos(i * 0.4) * 10 + i * 0.5),
      email: Math.round(82 + Math.sin(i * 0.7) * 8 + i * 0.3),
      search: Math.round(62 + Math.cos(i * 0.6) * 12 + i * 0.4),
      content: Math.round(45 + Math.sin(i * 0.3) * 6 + i * 0.2),
    })),
    aiNarrative:
      "Apex's LinkedIn thought leadership is generating the highest account engagement scores in the enterprise IT infrastructure category, with 78% of deal-influencing interactions traced to executive posts. Email sequences targeting CISOs have a 34% reply rate — 2.2× above industry benchmark. SEO is the fastest-growing pipeline channel with $290k attributed in the last 90 days.",
    recommendedActions: [
      {
        priority: "high",
        icon: "Building2",
        title: "Executive narrative amplification",
        description: "CXO LinkedIn posts from Apex generate 4.2× more deal-stage engagement than company posts. A 12-week executive narrative program targeting 3 CXOs could add $480k in pipeline.",
        cta: "Build program",
      },
      {
        priority: "high",
        icon: "Mail",
        title: "CISO sequence — cybersecurity narrative angle",
        description: "CISO-targeted sequences with infrastructure security framing have 34% reply rates. Expanding this approach to a broader CISO list of 180 accounts has $1.2M pipeline potential.",
        cta: "Expand campaign",
      },
      {
        priority: "medium",
        icon: "Search",
        title: "Capture enterprise search intent surge",
        description: "Searches for 'enterprise IT infrastructure narrative' and 'CIO alignment strategy' are up 44% QoQ. A content cluster targeting these terms could capture 820 qualified monthly sessions.",
        cta: "View keyword map",
      },
    ],
    brand: {
      healthScore: 71,
      storyConsistency: [
        { channel: "LinkedIn", score: 88 },
        { channel: "Website", score: 74 },
        { channel: "Email", score: 92 },
        { channel: "Search", score: 68 },
      ],
      shareOfVoice: [
        { name: "Apex Systems", value: 22, isClient: true },
        { name: "EnterpriseLayer", value: 38, isClient: false },
        { name: "CoreTech Systems", value: 28, isClient: false },
        { name: "Others", value: 12, isClient: false },
      ],
      attributionFunnel: [
        { stage: "Impressions", value: 240000 },
        { stage: "Engaged", value: 18000 },
        { stage: "Converted", value: 820 },
        { stage: "Pipeline", value: 2100000 },
      ],
      aiInsight:
        "Apex's brand narrative is strongest in email (92/100) where CISO-specific messaging is highly consistent. The website lags at 74/100 — category-level messaging doesn't match the executive audience specificity in email. Aligning website copy to CISO personas could reduce CAC by an estimated 12% through improved intent signal quality.",
    },
    positioning: {
      quadrant: [
        { name: "Apex Systems", x: 62, y: 68, isClient: true },
        { name: "EnterpriseLayer", x: 82, y: 74, isClient: false },
        { name: "CoreTech Systems", x: 75, y: 52, isClient: false },
        { name: "InfraScale", x: 45, y: 80, isClient: false },
        { name: "SystemEdge", x: 38, y: 42, isClient: false },
      ],
      movementTimeline: [
        { date: "2025-09", x: 48, y: 52 },
        { date: "2025-10", x: 52, y: 56 },
        { date: "2025-11", x: 55, y: 60 },
        { date: "2025-12", x: 57, y: 63 },
        { date: "2026-01", x: 60, y: 66 },
        { date: "2026-02", x: 62, y: 68 },
      ],
      competitors: [
        { name: "EnterpriseLayer", narrativeScore: 74, marketPresence: 82, lastSeen: "1 day ago", trend: "up" },
        { name: "CoreTech Systems", narrativeScore: 52, marketPresence: 75, lastSeen: "3 days ago", trend: "flat" },
        { name: "InfraScale", narrativeScore: 80, marketPresence: 45, lastSeen: "1 week ago", trend: "up" },
        { name: "SystemEdge", narrativeScore: 42, marketPresence: 38, lastSeen: "2 weeks ago", trend: "down" },
      ],
      keywordOwnership: [
        { keyword: "enterprise IT narrative", score: 72 },
        { keyword: "CIO alignment strategy", score: 68 },
        { keyword: "infrastructure intelligence platform", score: 84 },
        { keyword: "enterprise pipeline velocity", score: 76 },
        { keyword: "CISO outreach strategy", score: 88 },
      ],
    },
    search: {
      organicSessions: dates.map((date, i) => ({
        date,
        value: Math.round(5400 + i * 62 + Math.sin(i * 0.6) * 280),
      })),
      keywords: [
        { keyword: "enterprise IT infrastructure strategy", ranking: 3, volume: 1800, change: 4, intent: "commercial" },
        { keyword: "CIO narrative alignment platform", ranking: 1, volume: 620, change: 8, intent: "commercial" },
        { keyword: "CISO marketing intelligence", ranking: 5, volume: 940, change: 2, intent: "commercial" },
        { keyword: "enterprise pipeline intelligence", ranking: 4, volume: 1100, change: 6, intent: "transactional" },
        { keyword: "B2B enterprise content attribution", ranking: 8, volume: 780, change: -2, intent: "commercial" },
        { keyword: "infrastructure thought leadership", ranking: 6, volume: 560, change: 3, intent: "informational" },
        { keyword: "CXO engagement strategy", ranking: 2, volume: 840, change: 5, intent: "informational" },
        { keyword: "enterprise account-based marketing", ranking: 11, volume: 2400, change: -1, intent: "commercial" },
        { keyword: "IT decision maker outreach", ranking: 7, volume: 620, change: 4, intent: "transactional" },
        { keyword: "enterprise SaaS narrative marketing", ranking: 9, volume: 480, change: 2, intent: "informational" },
      ],
      intentBreakdown: [
        { name: "Informational", value: 32 },
        { name: "Commercial", value: 52 },
        { name: "Transactional", value: 16 },
      ],
      pipelineFromOrganic: { value: 290000, change: 38, sparkline: spark(), prefix: "$" },
      geoEngines: [
        { engine: "ChatGPT", citations: 88, trend: [22, 36, 52, 62, 72, 80, 88] },
        { engine: "Perplexity", citations: 54, trend: [12, 22, 32, 40, 46, 50, 54] },
        { engine: "Gemini", citations: 38, trend: [8, 15, 22, 28, 32, 36, 38] },
        { engine: "Copilot", citations: 29, trend: [5, 10, 16, 20, 24, 27, 29] },
      ],
      topicAuthority: [
        { topic: "Product", score: 78 },
        { topic: "Brand", score: 72 },
        { topic: "Expertise", score: 88 },
        { topic: "Thought Leadership", score: 84 },
        { topic: "Market", score: 76 },
        { topic: "Social Proof", score: 68 },
      ],
      geoPipelineKPI: { value: 158000, change: 420, sparkline: spark(), prefix: "$" },
    },
    website: {
      visitors: { value: Math.round(12800 * mult), change: 16, sparkline: spark() },
      companiesIdentified: { value: Math.round(280 * mult), change: 28, sparkline: spark() },
      avgTimeOnSite: { value: 5.8, change: 12, sparkline: spark(), suffix: "m" },
      returning: { value: Math.round(4200 * mult), change: 22, sparkline: spark() },
      hotAccounts: { value: Math.round(22 * mult), change: 52, sparkline: spark() },
      visitorTrend: dates.map((date, i) => ({
        date,
        value: Math.round(400 + i * 7 + Math.sin(i * 0.5) * 50),
      })),
      trafficSources: [
        { name: "Organic", value: 44 },
        { name: "LinkedIn", value: 32 },
        { name: "Direct", value: 14 },
        { name: "Referral", value: 6 },
        { name: "Email", value: 4 },
      ],
      intentHeatmap: (() => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
        return days.flatMap((day) =>
          hours.map((hour) => ({
            day,
            hour,
            value: Math.round(
              25 +
                (["Tue", "Wed", "Thu", "Fri"].includes(day) ? 35 : 0) +
                (["10am", "11am", "2pm", "4pm"].includes(hour) ? 28 : 0) +
                Math.random() * 22
            ),
          }))
        );
      })(),
      signals: [
        { id: "1", company: "Titan Enterprises", industry: "Enterprise Tech", signalScore: 96, pagesVisited: 15, timeOnSite: "11m 08s", source: "LinkedIn", intent: "hot", pages: ["/enterprise", "/pricing", "/security", "/integrations", "/roi-calculator"], companySize: "500+", linkedinUrl: "#" },
        { id: "2", company: "Global Infrastructure Corp", industry: "IT Infrastructure", signalScore: 92, pagesVisited: 11, timeOnSite: "9m 22s", source: "Organic", intent: "hot", pages: ["/enterprise", "/security", "/pricing"], companySize: "500+", linkedinUrl: "#" },
        { id: "3", company: "Sentinel Systems", industry: "Cybersecurity", signalScore: 81, pagesVisited: 8, timeOnSite: "6m 44s", source: "Email", intent: "hot", pages: ["/security", "/case-studies", "/pricing"], companySize: "201-500", linkedinUrl: "#" },
        { id: "4", company: "Quantum Networks", industry: "Networking", signalScore: 74, pagesVisited: 6, timeOnSite: "4m 28s", source: "Direct", intent: "warm", pages: ["/enterprise", "/product"], companySize: "500+", linkedinUrl: "#" },
        { id: "5", company: "Nexgen Data", industry: "Data Centers", signalScore: 68, pagesVisited: 5, timeOnSite: "3m 12s", source: "Referral", intent: "warm", pages: ["/product", "/integrations"], companySize: "201-500", linkedinUrl: "#" },
        { id: "6", company: "CloudBridge Systems", industry: "Cloud Services", signalScore: 52, pagesVisited: 3, timeOnSite: "1m 34s", source: "Organic", intent: "cold", pages: ["/blog", "/home"], companySize: "51-200", linkedinUrl: "#" },
      ],
    },
    content: {
      socialOverview: [
        { channel: "LinkedIn", posts: Math.round(8 * mult), reach: Math.round(62000 * mult), engagementRate: 5.4, pipeline: Math.round(480000 * mult) },
        { channel: "Email", posts: Math.round(3 * mult), reach: Math.round(4800 * mult), engagementRate: 34, pipeline: Math.round(280000 * mult) },
      ],
      topPosts: [
        { date: "2026-02-18", channel: "linkedin", title: "Why enterprise CIOs are rewriting their vendor narrative", reach: 18400, engagementRate: 7.2, pipeline: 280000, content: "The CIOs buying in 2026 aren't looking for features. They're looking for alignment with their strategic narrative. Here's what that means for vendor GTM..." },
        { date: "2026-02-11", channel: "linkedin", title: "The CISO deal influencer pattern — data from 40 enterprise deals", reach: 14200, engagementRate: 6.8, pipeline: 210000, content: "We analyzed 40 enterprise deals. CISO involvement correlated with 68% higher deal values and 22% faster velocity. The narrative strategy behind this..." },
        { date: "2026-02-04", channel: "linkedin", title: "Enterprise narrative intelligence: the 2026 benchmark", reach: 11800, engagementRate: 5.9, pipeline: 180000, content: "Our Q1 2026 benchmark data on enterprise narrative strength across 200 companies in IT infrastructure. The gap between leaders and laggards is widening..." },
      ],
      linkedinFollowerGrowth: dates.map((date, i) => ({
        date,
        value: Math.round(8200 + i * 42 + Math.sin(i * 0.5) * 60),
      })),
      contentCalendar: (() => {
        const posts: import("./types").CalendarPost[] = [];
        for (let d = 1; d <= 28; d++) {
          if (d % 4 === 0) posts.push({ date: `2026-02-${String(d).padStart(2, "0")}`, channel: "linkedin", title: `Executive Insight Day ${d}`, reach: Math.round(8000 + Math.random() * 14000), engagementRate: 4 + Math.random() * 4, pipeline: Math.round(80000 + Math.random() * 200000), content: "Enterprise-grade thought leadership on CIO/CISO narrative alignment and vendor strategy..." });
          if (d % 10 === 0) posts.push({ date: `2026-02-${String(d).padStart(2, "0")}`, channel: "newsletter", title: `Enterprise Intelligence Brief #${Math.ceil(d / 10)}`, reach: Math.round(4600 + Math.random() * 400), engagementRate: 36 + Math.random() * 8, pipeline: Math.round(60000 + Math.random() * 100000), content: "This month: enterprise IT narrative trends and CIO decision-making patterns for 2026..." });
        }
        return posts;
      })(),
      newsletters: [
        { id: "n1", subject: "CIO Narrative Alignment Report: Q1 2026 Enterprise Benchmarks", sent: 4800, openRate: 38, clickRate: 10.4, unsubscribes: 8, pipeline: 320000, date: "2026-02-11" },
        { id: "n2", subject: "The CISO Influence Factor: How security narrative drives enterprise deals", sent: 4750, openRate: 42, clickRate: 8.8, unsubscribes: 6, pipeline: 248000, date: "2026-02-04" },
        { id: "n3", subject: "Enterprise GTM Intelligence: Signal patterns from 40 closed deals", sent: 4700, openRate: 46, clickRate: 13.2, unsubscribes: 4, pipeline: 420000, date: "2026-01-28" },
      ],
      subscriberGrowth: dates.map((date, i) => ({
        date,
        value: Math.round(4400 + i * 18 + Math.sin(i * 0.3) * 25),
      })),
      openRateTrend: dates.map((date, i) => ({
        date,
        value: Math.round(38 + Math.cos(i * 0.6) * 4 + i * 0.08),
      })),
    },
    outreach: {
      emailPipeline: { value: Math.round(840000 * mult), change: 34, sparkline: spark(), prefix: "$" },
      emailCampaigns: [
        { id: "e1", name: "CISO — Cybersecurity Narrative Sequence", status: "active", sequence: 5, sent: Math.round(180 * mult), opens: Math.round(82 * mult), replies: Math.round(38 * mult), meetings: Math.round(12 * mult), pipeline: Math.round(580000 * mult) },
        { id: "e2", name: "CIO — Infrastructure Intelligence", status: "active", sequence: 4, sent: Math.round(120 * mult), opens: Math.round(54 * mult), replies: Math.round(22 * mult), meetings: Math.round(7 * mult), pipeline: Math.round(380000 * mult) },
        { id: "e3", name: "VP IT — Vendor Alignment Story", status: "completed", sequence: 3, sent: Math.round(80 * mult), opens: Math.round(30 * mult), replies: Math.round(10 * mult), meetings: Math.round(3 * mult), pipeline: Math.round(180000 * mult) },
      ],
      replyWaterfall: [
        { step: "Step 1", value: 100 },
        { step: "Step 2", value: 74 },
        { step: "Step 3", value: 52 },
        { step: "Step 4", value: 38 },
        { step: "Step 5", value: 28 },
      ],
      topSubjectLines: [
        { subject: "CIO at {{Company}} — I found your vendor alignment gap", replyRate: 34.2 },
        { subject: "Your Q1 enterprise narrative vs EnterpriseLayer — interesting data", replyRate: 28.6 },
        { subject: "How [Similar Company] closed 3 enterprise deals with one narrative shift", replyRate: 21.4 },
        { subject: "CISO alignment strategy for {{Company}} — 12-minute call?", replyRate: 18.8 },
      ],
      linkedinFunnel: [
        { stage: "Connection Sent", value: 320 },
        { stage: "Accepted", value: 198 },
        { stage: "Replied", value: 92 },
        { stage: "Meeting Booked", value: 34 },
      ],
      linkedinCampaigns: [
        { id: "l1", name: "CXO Enterprise — Narrative Intelligence", status: "active", sent: Math.round(120 * mult), accepted: Math.round(78 * mult), replied: Math.round(38 * mult), meetings: Math.round(14 * mult), pipeline: Math.round(480000 * mult) },
        { id: "l2", name: "CISO Network — Security Narrative", status: "active", sent: Math.round(100 * mult), accepted: Math.round(62 * mult), replied: Math.round(28 * mult), meetings: Math.round(10 * mult), pipeline: Math.round(320000 * mult) },
      ],
      icpScoreDistribution: [
        { score: "90-100", count: 42 },
        { score: "80-89", count: 96 },
        { score: "70-79", count: 124 },
        { score: "60-69", count: 88 },
        { score: "50-59", count: 52 },
        { score: "<50", count: 28 },
      ],
    },
    integrations: [
      { id: "crm", name: "CRM", category: "crm", connected: true, lastSync: "1 min ago" },
      { id: "linkedin", name: "LinkedIn", category: "social", connected: true, lastSync: "4 min ago" },
      { id: "google-search", name: "Google Search Console", category: "seo", connected: true, lastSync: "2 hours ago" },
      { id: "email-seq", name: "Email Sequencer", category: "outreach", connected: true, lastSync: "8 min ago" },
      { id: "website-intel", name: "Website Intelligence", category: "website-intel", connected: true, lastSync: "Real-time" },
      { id: "analytics", name: "Web Analytics", category: "analytics", connected: true, lastSync: "Real-time" },
      { id: "instagram", name: "Instagram", category: "social", connected: false },
      { id: "facebook", name: "Facebook", category: "social", connected: false },
    ],
    pipelineBridge: {
      section: "Narrative Intel",
      attributed: Math.round(2100000 * mult),
      deals: Math.round(1.5 * mult),
      velocity: 58,
    },
  };
}

export const apexData: ClientDataByRange = {
  "7d": makeApex("7d"),
  "30d": makeApex("30d"),
  "90d": makeApex("90d"),
};
