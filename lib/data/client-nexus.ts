import type { ClientDataByRange, ClientData } from "./types";
import { makeNexusBrand } from "./brand-builders";
import { createSparklineFactory, buildTrendSeries } from "./sparkline";

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
  const spark = createSparklineFactory(80, 20);

  return {
    meta: {
      id: "nexus",
      name: "Nexus Labs",
      type: "SaaS",
      stage: "Series B",
      channels: ["linkedin", "website", "email", "search"],
    },
    kpis: {
      cac: { value: 34500, change: range === "7d" ? -4 : range === "30d" ? -12 : -19, sparkline: spark(), prefix: "$" },
      pipeline: { value: Math.round(840000 * mult), change: range === "7d" ? 9 : range === "30d" ? 18 : 31, sparkline: spark(), prefix: "$" },
      dealVelocity: { value: 34, change: range === "7d" ? -2 : range === "30d" ? -8 : -16, sparkline: spark(), suffix: "d" },
      dealsCreated: { value: Math.round(14 * mult), change: range === "7d" ? 8 : range === "30d" ? 22 : 38, sparkline: spark() },
      closedWon: { value: Math.round(5 * mult), change: range === "7d" ? 4 : range === "30d" ? 15 : 28, sparkline: spark() },
      attributedRevenue: { value: Math.round(210000 * mult), change: range === "7d" ? 12 : range === "30d" ? 31 : 48, sparkline: spark(), prefix: "$" },
      ltv: { value: 145000, change: range === "7d" ? 3 : range === "30d" ? 9 : 17, sparkline: spark(), prefix: "$" },
      avgDealSize: { value: 52000, change: range === "7d" ? 2 : range === "30d" ? 6 : 13, sparkline: spark(), prefix: "$" },
    },
    signalTimeline: dates.map((date, i) => ({
      date,
      linkedin: Math.round(65 + Math.sin(i * 0.7) * 18 + i * 0.8),
      website: Math.round(72 + Math.cos(i * 0.5) * 14 + i * 0.6),
      email: Math.round(48 + Math.sin(i * 0.9) * 12 + i * 0.4),
      search: Math.round(55 + Math.cos(i * 0.6) * 10 + i * 0.5),
      content: Math.round(40 + Math.sin(i * 0.4) * 8 + i * 0.3),
    })),
    aiNarrative: range === "7d"
      ? "Over the last 7 days, LinkedIn engagement spiked 48% above weekly average — three posts reached above-benchmark impressions. Website intent from Series B accounts is elevated with 6 accounts visiting pricing 2+ times. Act now before this short window of intent cools."
      : range === "30d"
      ? "Your LinkedIn signal velocity is 2.3× higher than your Q1 baseline, correlating with a 40% increase in inbound pipeline this month. Website intent signals from Series B SaaS companies are clustering around your pricing and ROI pages, suggesting high commercial intent. Recommend accelerating cadence on email sequences targeting CFO personas — open rates are 34% above benchmark."
      : "Over the past quarter, narrative-driven pipeline has grown 31% and deal velocity improved by 8 days. LinkedIn and website signals show a compounding flywheel — brands that sustain signal output for 90+ days see 2.1× lower CAC. Your current trajectory supports hitting annual revenue targets.",
    recommendedActions: range === "7d" ? [
      {
        priority: "high",
        icon: "TrendingUp",
        title: "Follow up on this week's intent signals",
        description: "6 high-intent accounts spiked on pricing pages in the last 48 hours. Reach them while context is fresh — reply rate drops 60% after 72 hours of no contact.",
        cta: "View accounts",
      },
      {
        priority: "high",
        icon: "Target",
        title: "Boost the top LinkedIn post from this week",
        description: "Your Wednesday post is 2.8× above average engagement. Amplify it with a paid boost to capture the momentum window before reach decays.",
        cta: "Boost post",
      },
      {
        priority: "medium",
        icon: "Search",
        title: "Send a same-day follow-up to hot accounts",
        description: "Accounts that receive outreach within 24 hours of a site visit convert at 3.4× the baseline rate. 6 accounts qualify today.",
        cta: "Start sequence",
      },
    ] : range === "30d" ? [
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
    ] : [
      {
        priority: "high",
        icon: "TrendingUp",
        title: "Scale the LinkedIn-to-email channel sequence",
        description: "Accounts touched via LinkedIn then email over 90 days convert at 2.8× the single-channel rate. Formalise this as a standard multi-touch cadence.",
        cta: "Build playbook",
      },
      {
        priority: "medium",
        icon: "Target",
        title: "Invest in SEO for long-cycle terms",
        description: "Three 90-day keyword clusters now show consistent ranking signals. Expanding long-form content on these terms compounds organic pipeline over the next quarter.",
        cta: "Review clusters",
      },
      {
        priority: "medium",
        icon: "Search",
        title: "Build a quarterly brand signal report",
        description: "Quarter-over-quarter brand signal data shows a 28% improvement in narrative share-of-voice. Package this as an internal exec report to align GTM investment.",
        cta: "Create report",
      },
    ],
    brand: makeNexusBrand(mult),
    positioning: {
      tldr: {
        summary: range === "7d"
          ? "This week's positioning signals are stable. NarrateIQ posted two comparison articles targeting your top keyword — monitor share-of-voice closely. No immediate quadrant movement, but early competitive activity warrants attention."
          : range === "30d"
          ? "Nexus Labs is positioned firmly in the Leaders quadrant with narrative strength above 74/100. A strong market position reduces CAC across every channel — buyers arrive with positive pre-existing associations, meaning shorter sales cycles and higher win rates against weaker-positioned competitors."
          : "Over the quarter, your positioning score has improved by 12 points while NarrateIQ lost ground. The compounding effect of consistent narrative investment is showing — sustained Leaders quadrant presence correlates with a 28% improvement in brand-influenced pipeline this quarter.",
        actions: range === "7d" ? [
          { title: "Monitor NarrateIQ content", description: "Two comparison articles published this week target your 'narrative intelligence' keyword. Review and prepare a counter-narrative response before they gain traction.", priority: "high", cta: "Review content" },
          { title: "Refresh homepage messaging", description: "A quick copy refresh on the homepage hero aligns with this week's trending pain points from intent data.", priority: "medium", cta: "Update copy" },
          { title: "Check competitor ad spend", description: "Competitive ad signals this week suggest increased spend from #2. Validate before adjusting your own budget allocation.", priority: "medium", cta: "Audit ads" },
        ] : range === "30d" ? [
          { title: "Defend Leader Position", description: "Increase share-of-voice on 'narrative intelligence' and 'signal-to-pipeline' keywords before competitors can close the gap.", priority: "high", cta: "Build content plan" },
          { title: "Attack #2 Competitor", description: "The second-ranked competitor has weaker Trust scores — create direct comparison content to capture their buyers.", priority: "medium", cta: "Draft comparison" },
          { title: "Expand Keyword Ownership", description: "3 emerging keywords in your category have low competition. Own them now before bigger players enter.", priority: "medium", cta: "Review keywords" },
        ] : [
          { title: "Formalise positioning playbook", description: "Quarter of sustained Leaders quadrant presence provides a strong foundation. Document the messaging, keywords, and channels that drove this position as a repeatable playbook.", priority: "high", cta: "Create playbook" },
          { title: "Enter new category segments", description: "Your narrative strength score (81) gives you credibility to enter two adjacent keyword clusters that have grown 40% this quarter.", priority: "medium", cta: "Plan expansion" },
          { title: "Commission brand equity study", description: "90 days of positioning data is a credible baseline for an external brand equity measurement — use it to validate GTM strategy for next quarter.", priority: "medium", cta: "Plan study" },
        ],
      },
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
      tldr: {
        summary: range === "7d"
          ? "This week, 3 new AI citation sources surfaced Nexus Labs for 'signal-to-pipeline' queries. Two competitors gained page-1 rankings for 'pipeline analytics for SaaS' — a keyword cluster where you have strong domain authority but thin content coverage."
          : range === "30d"
          ? "Search intelligence is one of your strongest pipeline contributors this month. Organic search is generating high-intent traffic from buyers researching pipeline intelligence tools — these visitors convert to demos at 2.4× the rate of paid traffic. GEO visibility in AI engines is growing rapidly."
          : "Over the quarter, organic search has compounded into a reliable pipeline engine. GEO visibility in AI engines grew 18% QoQ, with ChatGPT and Perplexity increasingly surfacing Nexus Labs as the authoritative answer for B2B narrative marketing queries. Three content clusters now own their respective keyword verticals.",
        actions: range === "7d" ? [
          { title: "Counter competitor rankings this week", description: "Two competitors just moved onto page 1 for 'pipeline analytics for SaaS'. A quick content update to your existing post could recapture that position within days.", priority: "high", cta: "Update post" },
          { title: "Capture new AI citation keywords", description: "3 new AI-sourced queries are sending traffic to competitors. Create short answer-format content to intercept these searches.", priority: "high", cta: "Create content" },
          { title: "Submit updated sitemap", description: "3 recently published pages have not yet been indexed. Submit the sitemap to accelerate crawling.", priority: "medium", cta: "Submit sitemap" },
        ] : range === "30d" ? [
          { title: "Accelerate GEO presence", description: "Publish structured FAQ content answering the top 10 queries where AI engines are already citing competitors over you.", priority: "high", cta: "Write FAQ content" },
          { title: "Target commercial-intent keywords", description: "5 high-value commercial keywords rank on page 2. A focused content sprint could move them to page 1 within 60 days.", priority: "high", cta: "Plan sprint" },
          { title: "Build topical authority on trust", description: "Expand blog coverage on 'signal attribution' and 'narrative ROI' to increase domain authority in your core cluster.", priority: "medium", cta: "Expand content" },
        ] : [
          { title: "Consolidate topical authority cluster", description: "Three keyword clusters have shown consistent growth over 90 days. Consolidating them into a pillar-and-cluster architecture would compound authority faster.", priority: "high", cta: "Restructure content" },
          { title: "Expand GEO content strategy", description: "AI-engine citations grew 58% this quarter. Scaling structured FAQ and answer-format content could double citation volume next quarter.", priority: "medium", cta: "Build GEO plan" },
          { title: "Review backlink velocity", description: "Organic backlinks have slowed over the last 30 days of the quarter. A targeted digital PR push would sustain domain authority gains.", priority: "medium", cta: "Plan outreach" },
        ],
      },
      geo: {
        visibilityScore: 48.3,
        visibilityChange: 3.5,
        shareOfVoice: 31,
        shareOfVoiceChange: 4,
        aiInsight: "Your visibility score surged this week, driven by ChatGPT and Perplexity citations around 'signal-to-pipeline' and 'narrative marketing platform' queries. Anthropic is a new source — your thought leadership content is getting indexed. Focus on publishing structured FAQs to capture more AI Overview slots.",
        allBotVisits: { value: Math.round(32600 * mult), change: 58, sparkline: spark() },
        aiCitations: { value: Math.round(24800 * mult), change: 20, sparkline: spark() },
        aiTraining: { value: Math.round(13200 * mult), change: 2, sparkline: spark() },
        aiIndexing: { value: Math.round(18200 * mult), change: 1, sparkline: spark() },
        visibilityTrend: Array.from({ length: 14 }, (_, i) => ({
          date: new Date(2026, 3, 11 + i).toISOString().split("T")[0],
          client: Math.round(38 + Math.sin(i * 0.6) * 12 + i * 0.8),
          prev: Math.round(34 + Math.cos(i * 0.5) * 8 + i * 0.4),
        })),
        competitors: [
          { name: "Nexus Labs", isClient: true, visibilityScore: 41.8, change: 2.4, trend: [36, 38, 37, 39, 40, 41, 41.8] },
          { name: "NarrateIQ",  isClient: false, visibilityScore: 41.5, change: -1.29, trend: [44, 43, 43, 42, 42, 41.8, 41.5] },
          { name: "PipelineOS", isClient: false, visibilityScore: 28.2, change: -0.37, trend: [29, 28.5, 28, 28.3, 28.1, 28.3, 28.2] },
          { name: "StoryScale", isClient: false, visibilityScore: 24.6, change: 1.14, trend: [22, 22.5, 23, 23.5, 24, 24.3, 24.6] },
          { name: "Contentful MktOS", isClient: false, visibilityScore: 24.2, change: -3.44, trend: [28, 27, 26.5, 26, 25.5, 24.8, 24.2] },
        ],
        platforms: [
          { platform: "ChatGPT",   visibilityPct: 48, change: 5,  color: "#34D399" },
          { platform: "Perplexity",visibilityPct: 41, change: 3,  color: "#0EA5E9" },
          { platform: "Gemini",    visibilityPct: 36, change: -2, color: "#FBBF24" },
          { platform: "Anthropic", visibilityPct: 29, change: 8,  color: "#FF6B4A" },
          { platform: "Copilot",   visibilityPct: 22, change: 1,  color: "#A78BFA" },
          { platform: "Grok",      visibilityPct: 18, change: 4,  color: "#F0F0FF" },
        ],
        citationDomains: [
          { domain: "nexuslabs.com",      citations: 124, change: 18, category: "Own Site" },
          { domain: "g2.com",             citations: 89,  change: 12, category: "Review" },
          { domain: "techcrunch.com",     citations: 62,  change: 5,  category: "Media" },
          { domain: "linkedin.com",       citations: 58,  change: 9,  category: "Social" },
          { domain: "gartner.com",        citations: 41,  change: 3,  category: "Analyst" },
          { domain: "capterra.com",       citations: 34,  change: 7,  category: "Review" },
          { domain: "reddit.com",         citations: 28,  change: -2, category: "Community" },
          { domain: "producthunt.com",    citations: 21,  change: 4,  category: "Community" },
        ],
      },
      healthScore: 92,
      domainRating: 68,
      organicKeywordsTotal: { value: Math.round(29300 * mult), change: -4, sparkline: spark() },
      backlinks: { value: Math.round(1340 * mult), change: 21, sparkline: spark() },
      referringDomains: { value: Math.round(317 * mult), change: 99, sparkline: spark() },
      trafficValue: { value: Math.round(218000 * mult), change: 18, sparkline: spark(), prefix: "$" },
      organicSessions: buildTrendSeries(dates, 3200, 1, range),
      referringDomainsTrend: buildTrendSeries(dates, 220, 2, range),
      keywordBuckets: [
        { bucket: "1-3", label: "#1–3", count: Math.round(17 * mult), change: 8 },
        { bucket: "4-10", label: "#4–10", count: Math.round(27 * mult), change: 5 },
        { bucket: "11-50", label: "#11–50", count: Math.round(174 * mult), change: 16 },
        { bucket: "51-100", label: "#51–100", count: Math.round(83 * mult), change: -10 },
      ],
      countryBreakdown: [
        { code: "US", name: "United States", flag: "🇺🇸", traffic: Math.round(17700 * mult), trafficChange: -1700, lat: 38, lon: -97 },
        { code: "IN", name: "India",          flag: "🇮🇳", traffic: Math.round(4100 * mult), trafficChange: -1900, lat: 20, lon: 77 },
        { code: "CA", name: "Canada",         flag: "🇨🇦", traffic: Math.round(4400 * mult), trafficChange: -438,  lat: 56, lon: -106 },
        { code: "GB", name: "United Kingdom", flag: "🇬🇧", traffic: Math.round(3600 * mult), trafficChange: -194,  lat: 51, lon: -1 },
        { code: "AU", name: "Australia",      flag: "🇦🇺", traffic: Math.round(2100 * mult), trafficChange: 312,   lat: -25, lon: 133 },
        { code: "DE", name: "Germany",        flag: "🇩🇪", traffic: Math.round(1800 * mult), trafficChange: 220,   lat: 51, lon: 10 },
        { code: "SG", name: "Singapore",      flag: "🇸🇬", traffic: Math.round(980 * mult),  trafficChange: 145,   lat: 1, lon: 104 },
      ],
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
      pipelineFromOrganic: { value: Math.round(128000 * mult), change: range === "7d" ? 10 : range === "30d" ? 24 : 41, sparkline: spark(), prefix: "$" },
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
      geoPipelineKPI: { value: Math.round(94000 * mult), change: range === "7d" ? 120 : range === "30d" ? 340 : 580, sparkline: spark(), prefix: "$" },
    },
    website: {
      tldr: {
        summary: range === "7d"
          ? "This week's website activity is above the weekly average with 6 high-intent accounts visiting pricing and ROI calculator pages. Three accounts are repeat visitors with no open opportunity — the optimal outreach window is within 24 hours of each visit."
          : range === "30d"
          ? "Website signals show strong intent from identified accounts in your ICP. This month, 340 companies visited your pricing and ROI pages — a leading indicator of late-stage interest. High scroll depth and return visitor rates suggest your content is building genuine brand consideration before conversion."
          : "Over the quarter, 1,100 unique companies visited intent-heavy pages. Website intent data has proven its value as an outreach trigger — accounts contacted within 24 hours of a hot-signal visit convert at 3.4× baseline. Scroll depth improvements indicate better content-market fit than the prior quarter.",
        actions: range === "7d" ? [
          { title: "Contact this week's hot accounts today", description: "6 accounts visited pricing 2+ times this week with no open opportunity. Same-day outreach on hot intent visits converts at 3.4× the standard rate.", priority: "high", cta: "Start outreach" },
          { title: "Review this week's rage-click sessions", description: "3 session recordings this week flagged rage-clicks on the pricing page CTA. Watch and fix the UX issue before more leads are lost.", priority: "high", cta: "View recordings" },
          { title: "Add intent data to CRM", description: "Sync this week's high-intent company identifications to your CRM to keep AEs informed before their next prospect call.", priority: "medium", cta: "Sync to CRM" },
        ] : range === "30d" ? [
          { title: "Trigger outreach on hot accounts", description: "22 companies scored 'Hot' this month with no open opportunity. Route them to SDRs immediately for personalised outreach.", priority: "high", cta: "Create workflow" },
          { title: "Reduce quick-back rate", description: "9.4% of visitors leave within 8 seconds — review landing page clarity and headline alignment with ad messaging.", priority: "high", cta: "Review pages" },
          { title: "Retarget warm accounts", description: "Build a retargeting audience from companies that visited pricing or case study pages but haven't requested a demo.", priority: "medium", cta: "Build audience" },
        ] : [
          { title: "Build an intent-to-pipeline workflow", description: "90 days of data validates the website intent signal. Build a formal workflow: hot score → SDR alert → 24h outreach sequence, to capture every future hot account.", priority: "high", cta: "Build workflow" },
          { title: "Improve the pricing page conversion rate", description: "The pricing page has the highest intent traffic but a 28% exit rate. A CRO test on the page layout could meaningfully increase demo requests.", priority: "medium", cta: "Plan CRO test" },
          { title: "Expand ICP identification coverage", description: "Currently identifying 340 companies per month from 18,400 visitors — a 1.8% identification rate. Improving this with better de-anonymisation tools could reveal more opportunities.", priority: "medium", cta: "Review tools" },
        ],
      },
      visitors: { value: Math.round(18400 * mult), change: 14, sparkline: spark() },
      sessions: { value: Math.round(24600 * mult), change: 18, sparkline: spark() },
      companiesIdentified: { value: Math.round(340 * mult), change: 22, sparkline: spark() },
      avgTimeOnSite: { value: 4.2, change: 8, sparkline: spark(), suffix: "m" },
      returning: { value: Math.round(5200 * mult), change: 31, sparkline: spark() },
      hotAccounts: { value: Math.round(28 * mult), change: 45, sparkline: spark() },
      rageclickRate: { value: 14.02, change: -2, sparkline: spark() },
      deadclickRate: { value: 8.7, change: -5, sparkline: spark() },
      scrollDepth: { value: 63, change: 4, sparkline: spark() },
      jsErrors: { value: Math.round(199 * mult), change: -12, sparkline: spark() },
      quickBackRate: { value: 4.16, change: -1, sparkline: spark() },
      readingBehavior: [
        { label: "Casual", pct: 71.77, sessions: Math.round(1027 * mult), color: "#7C7FFF" },
        { label: "Serious", pct: 18.43, sessions: Math.round(264 * mult), color: "#FBBF24" },
        { label: "Reader", pct: 9.8, sessions: Math.round(140 * mult), color: "#34D399" },
      ],
      visitorTrend: dates.map((date, i) => ({ date, value: Math.round(580 + i * 8 + Math.sin(i * 0.7) * 60) })),
      trafficSources: [
        { name: "Organic", value: 38 },
        { name: "LinkedIn", value: 24 },
        { name: "Direct", value: 18 },
        { name: "Referral", value: 12 },
        { name: "Email", value: 8 },
      ],
      visitorCountries: [
        { code: "US", name: "United States", flag: "🇺🇸", traffic: Math.round(8200 * mult), trafficChange: 12, lat: 37.09, lon: -95.71 },
        { code: "IN", name: "India", flag: "🇮🇳", traffic: Math.round(3400 * mult), trafficChange: 34, lat: 20.59, lon: 78.96 },
        { code: "GB", name: "United Kingdom", flag: "🇬🇧", traffic: Math.round(2100 * mult), trafficChange: 8, lat: 55.38, lon: -3.44 },
        { code: "CA", name: "Canada", flag: "🇨🇦", traffic: Math.round(1400 * mult), trafficChange: 5, lat: 56.13, lon: -106.35 },
        { code: "DE", name: "Germany", flag: "🇩🇪", traffic: Math.round(980 * mult), trafficChange: -3, lat: 51.17, lon: 10.45 },
        { code: "AU", name: "Australia", flag: "🇦🇺", traffic: Math.round(760 * mult), trafficChange: 18, lat: -25.27, lon: 133.78 },
        { code: "SG", name: "Singapore", flag: "🇸🇬", traffic: Math.round(540 * mult), trafficChange: 22, lat: 1.35, lon: 103.82 },
      ],
      topPages: [
        { url: "/pricing", sessions: Math.round(4200 * mult), scrollDepth: 84, exitRate: 28 },
        { url: "/roi-calculator", sessions: Math.round(3100 * mult), scrollDepth: 72, exitRate: 14 },
        { url: "/case-studies", sessions: Math.round(2800 * mult), scrollDepth: 91, exitRate: 12 },
        { url: "/product", sessions: Math.round(2400 * mult), scrollDepth: 61, exitRate: 36 },
        { url: "/blog/pipeline-intelligence", sessions: Math.round(1900 * mult), scrollDepth: 88, exitRate: 42 },
        { url: "/integrations", sessions: Math.round(1400 * mult), scrollDepth: 54, exitRate: 31 },
      ],
      funnelSteps: [
        { label: "Homepage", sessions: Math.round(18400 * mult), dropoffPct: 0 },
        { label: "Product Page", sessions: Math.round(9800 * mult), dropoffPct: 47 },
        { label: "Pricing", sessions: Math.round(4200 * mult), dropoffPct: 57 },
        { label: "Demo Request", sessions: Math.round(1100 * mult), dropoffPct: 74 },
        { label: "Confirmed", sessions: Math.round(340 * mult), dropoffPct: 69 },
      ],
      sessionRecordings: [
        { id: "sr1", page: "/pricing", duration: "6m 12s", flags: ["rage-click", "dead-click"], country: "🇺🇸 US", device: "desktop" },
        { id: "sr2", page: "/roi-calculator", duration: "4m 38s", flags: [], country: "🇬🇧 UK", device: "desktop" },
        { id: "sr3", page: "/product", duration: "1m 44s", flags: ["quick-back"], country: "🇮🇳 IN", device: "mobile" },
        { id: "sr4", page: "/integrations", duration: "8m 02s", flags: ["js-error"], country: "🇩🇪 DE", device: "desktop" },
        { id: "sr5", page: "/blog/pipeline-intelligence", duration: "9m 51s", flags: [], country: "🇦🇺 AU", device: "tablet" },
        { id: "sr6", page: "/case-studies", duration: "0m 52s", flags: ["quick-back", "rage-click"], country: "🇨🇦 CA", device: "mobile" },
      ],
      intentHeatmap: (() => {
        const hDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
        return hDays.flatMap((day) =>
          hours.map((hour) => ({
            day,
            hour,
            value: Math.round(20 + (["Tue", "Wed", "Thu"].includes(day) ? 30 : 0) + (["10am", "11am", "2pm", "3pm"].includes(hour) ? 25 : 0) + Math.random() * 20),
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
      tldr: {
        summary: range === "7d"
          ? "This week, two LinkedIn posts significantly outperformed average reach — both contained proprietary data points. Newsletter open rate is tracking above the monthly benchmark. One blog post is showing strong early organic signals from a newly indexed keyword."
          : range === "30d"
          ? "Content marketing is generating consistent brand signals across LinkedIn and email. LinkedIn thought leadership is driving the highest-quality inbound — posts with specific data or frameworks outperform generic content by 3.1× in pipeline influence. The newsletter is the most efficient content-to-pipeline channel per dollar spent."
          : "Over the quarter, content has compounded into a reliable pipeline engine. LinkedIn and newsletter together attributed $280k in influenced pipeline. Blog organic traffic grew 34% QoQ, and content-sourced leads now have a 22% lower CAC than paid channels.",
        actions: range === "7d" ? [
          { title: "Publish a data-led post today", description: "This week's top post pattern: proprietary data + a specific insight. You have unpublished benchmark data from last week that would perform well — draft and post today.", priority: "high", cta: "Draft post" },
          { title: "Respond to newsletter replies", description: "18 subscribers replied to this week's newsletter. Personalised replies from the founder convert to demo calls at a high rate — action within 24 hours.", priority: "high", cta: "Review replies" },
          { title: "Update the top-ranking blog post", description: "Your highest-traffic post was last updated 4 months ago. A freshness update keeps it ranking and improves on-page engagement.", priority: "medium", cta: "Update post" },
        ] : range === "30d" ? [
          { title: "Double down on data-led LinkedIn posts", description: "Your top 3 posts all featured proprietary data. Schedule 2 data-driven posts per week to replicate this pattern.", priority: "high", cta: "Plan posts" },
          { title: "Grow newsletter list", description: "Newsletter subscribers convert to pipeline at 38% — every 100 new subscribers adds ~$8k in expected pipeline over 90 days.", priority: "high", cta: "Build growth plan" },
          { title: "Launch blog content sprint", description: "Blog traffic from organic is growing but content cadence is low. Increase to 3 posts per week targeting commercial keywords.", priority: "medium", cta: "Plan sprint" },
        ] : [
          { title: "Build a content attribution model", description: "This quarter's data is sufficient to build a first-party attribution model showing content-to-pipeline contribution per channel. This will justify next quarter's content budget.", priority: "high", cta: "Build model" },
          { title: "Plan Q3 editorial calendar", description: "The top 5 performing content themes from this quarter should anchor next quarter's editorial strategy. Define these themes now before budget planning.", priority: "medium", cta: "Plan calendar" },
          { title: "Expand to a second newsletter segment", description: "Newsletter data shows two distinct audience personas with different content preferences. A segmented newsletter would increase relevant engagement by an estimated 24%.", priority: "medium", cta: "Plan segment" },
        ],
      },
      // ── Social / Meta (Sprout) ──
      socialOverview: [
        { channel: "LinkedIn", posts: Math.round(12 * mult), reach: Math.round(48000 * mult), engagementRate: 4.8, pipeline: Math.round(180000 * mult) },
        { channel: "Email", posts: Math.round(4 * mult), reach: Math.round(8200 * mult), engagementRate: 32, pipeline: Math.round(95000 * mult) },
      ],
      topPosts: [
        { date: "2026-02-14", channel: "linkedin", title: "Why your narrative IS your pipeline", reach: 12400, engagementRate: 6.2, pipeline: 48000, content: "Stop measuring content by likes. Every post is a pipeline event. Here's how we track it..." },
        { date: "2026-02-08", channel: "linkedin", title: "The B2B signal stack in 2026", reach: 8900, engagementRate: 5.1, pipeline: 32000, content: "Intent data is table stakes. Signal intelligence is what separates 28% win rates from 48%..." },
        { date: "2026-02-01", channel: "newsletter", title: "Narrative Operating System: Feb Edition", reach: 4200, engagementRate: 38, pipeline: 28000, content: "This month: How 3 Series B SaaS companies tripled pipeline velocity by fixing one thing..." },
      ],
      platformStats: [
        { platform: "LinkedIn", color: "#0A66C2", followers: Math.round(14800 * mult), followersChange: 8, reach: Math.round(48000 * mult), engagementRate: 4.8, posts: Math.round(12 * mult) },
        { platform: "Instagram", color: "#E1306C", followers: Math.round(8200 * mult), followersChange: 14, reach: Math.round(28000 * mult), engagementRate: 6.4, posts: Math.round(18 * mult), reelsWatchTime: 24, hookRate: 58 },
        { platform: "Facebook", color: "#1877F2", followers: Math.round(5400 * mult), followersChange: 3, reach: Math.round(18000 * mult), engagementRate: 2.1, posts: Math.round(14 * mult) },
        { platform: "X / Twitter", color: "#FFFFFF", followers: Math.round(3100 * mult), followersChange: -2, reach: Math.round(12000 * mult), engagementRate: 1.8, posts: Math.round(24 * mult) },
      ],
      audienceGrowthStacked: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(2026, i - 10 + 2, 1).toISOString().split("T")[0].slice(0, 7),
        linkedin: Math.round(12400 + i * 200 + Math.sin(i * 0.4) * 80),
        instagram: Math.round(6800 + i * 130 + Math.cos(i * 0.5) * 60),
        facebook: Math.round(5200 + i * 30 + Math.sin(i * 0.3) * 40),
        x: Math.round(3200 + i * 18 + Math.cos(i * 0.4) * 30),
      })),
      sentiment: {
        positive: 72, neutral: 18, negative: 10,
        volume: Math.round(2840 * mult), volumeChange: 18,
        themes: [
          { theme: "Pipeline intelligence", count: 480, sentiment: "positive" },
          { theme: "Signal-to-pipeline", count: 342, sentiment: "positive" },
          { theme: "Narrative strategy", count: 218, sentiment: "positive" },
          { theme: "Pricing concerns", count: 84, sentiment: "negative" },
          { theme: "Onboarding", count: 66, sentiment: "neutral" },
        ],
      },
      // ── LinkedIn (Taplio) ──
      linkedinKPIs: {
        followers:    { value: Math.round(14800 * mult), change: 30.04, sparkline: spark() },
        impressions:  { value: Math.round(3779000 * mult), change: -26.88, sparkline: spark() },
        engagements:  { value: Math.round(17978 * mult), change: -19.54, sparkline: spark() },
        posts:        { value: Math.round(58 * mult), change: 23.4, sparkline: spark() },
        comments:     { value: Math.round(2555 * mult), change: -47.72, sparkline: spark() },
        likes:        { value: Math.round(15313 * mult), change: -10.36, sparkline: spark() },
        shares:       { value: Math.round(110 * mult), change: -70.59, sparkline: spark() },
        profileViews: { value: Math.round(83134 * mult), change: 41.06, sparkline: spark() },
      },
      linkedinPosts: [
        { id: "lp1", date: "2026-02-14", content: "Stop measuring content by likes. Every post is a pipeline event. Here's how we track narrative ROI for B2B SaaS without guessing...", impressions: 12400, engagementRate: 6.2, likes: 384, comments: 62, pipeline: 48000, isViral: true },
        { id: "lp2", date: "2026-02-08", content: "Intent data is table stakes. Signal intelligence is what separates 28% win rates from 48%. Here's the stack we built in 6 months...", impressions: 8900, engagementRate: 5.1, likes: 298, comments: 44, pipeline: 32000, isViral: true },
        { id: "lp3", date: "2026-02-05", content: "The 3 signals that predict enterprise deals 90 days before close. Thread on how we built our signal model from scratch...", impressions: 6200, engagementRate: 4.4, likes: 201, comments: 31, pipeline: 24000, isViral: false },
        { id: "lp4", date: "2026-01-28", content: "We just published our Q1 2026 Pipeline Velocity Index. Here's what we found about narrative-led GTM teams vs. product-led...", impressions: 5100, engagementRate: 3.8, likes: 168, comments: 22, pipeline: 18000, isViral: false },
        { id: "lp5", date: "2026-01-22", content: "Your ICP isn't who you think it is. We scored 2,400 accounts against 12 signal dimensions and found something unexpected...", impressions: 4800, engagementRate: 4.0, likes: 152, comments: 19, pipeline: 16000, isViral: false },
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
      // ── Blog / SEO (Optimizely) ──
      blogPosts: [
        { title: "Why Narrative Intelligence beats keyword stuffing in 2026", url: "/blog/narrative-intelligence-seo", pageviews: Math.round(8400 * mult), avgAttentionTime: "4m 12s", engagementRate: 78, pipeline: Math.round(62000 * mult), published: "2026-02-10" },
        { title: "The Signal Stack: How to predict deals 90 days out", url: "/blog/signal-stack-guide", pageviews: Math.round(6200 * mult), avgAttentionTime: "5m 48s", engagementRate: 84, pipeline: Math.round(48000 * mult), published: "2026-02-03" },
        { title: "Pipeline Velocity Index: Q1 2026 Benchmark Report", url: "/blog/pipeline-velocity-q1-2026", pageviews: Math.round(5100 * mult), avgAttentionTime: "6m 22s", engagementRate: 91, pipeline: Math.round(38000 * mult), published: "2026-01-28" },
        { title: "B2B Content Attribution: Beyond Last-Click", url: "/blog/content-attribution-b2b", pageviews: Math.round(4800 * mult), avgAttentionTime: "3m 54s", engagementRate: 72, pipeline: Math.round(32000 * mult), published: "2026-01-21" },
        { title: "GTM Narrative Framework: 6 Core Components", url: "/blog/gtm-narrative-framework", pageviews: Math.round(4200 * mult), avgAttentionTime: "4m 38s", engagementRate: 81, pipeline: Math.round(28000 * mult), published: "2026-01-14" },
      ],
      blogExperiments: [
        {
          id: "exp1",
          name: "CTA copy: 'Get Started' vs 'See Your Pipeline'",
          status: "won",
          daysRunning: range === "7d" ? 12 : range === "30d" ? 54 : 148,
          visitors: Math.round(25308 * mult),
          baseline: { label: "Original", conversions: Math.round(397 * mult), visitors: Math.round(12586 * mult), conversionRate: 3.15 },
          variation: { label: "Variation #1", conversions: Math.round(525 * mult), visitors: Math.round(12722 * mult), conversionRate: 4.13, improvement: 30.83 },
          significance: range === "7d" ? 72 : range === "30d" ? 97 : 99,
          significanceCurve: [0,2,4,7,11,16,22,28,34,40,46,52,58,64,70,74,78,82,86,89,92,94,95,96,97].map((v, i) => ({ day: i * 2, value: v })),
        },
        {
          id: "exp2",
          name: "Hero headline: Product-led vs Narrative-led",
          status: "running",
          daysRunning: range === "7d" ? 8 : range === "30d" ? 22 : 68,
          visitors: Math.round(8412 * mult),
          baseline: { label: "Original", conversions: Math.round(134 * mult), visitors: Math.round(4188 * mult), conversionRate: 3.2 },
          variation: { label: "Narrative headline", conversions: Math.round(148 * mult), visitors: Math.round(4224 * mult), conversionRate: 3.5, improvement: 9.4 },
          significance: range === "7d" ? 38 : range === "30d" ? 62 : 81,
          significanceCurve: [0,1,3,6,9,12,16,20,24,28,34,40,48,54,60,66,70,73,74,75,76,77,78].map((v, i) => ({ day: i, value: v })),
        },
      ],
      blogPageviewsTrend: buildTrendSeries(dates, 3200, 3, range),
      // ── Newsletter (Beehiiv) ──
      activeSubscribers: { value: Math.round(4200 * mult), change: 18, sparkline: spark() },
      openRate: { value: 41, change: 3, sparkline: spark() },
      clickRate: { value: 8.2, change: 1, sparkline: spark() },
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
      acquisitionSources: [
        { source: "website: direct / none", subscribers: Math.round(1820 * mult), pct: 43, openRate: 71, unsubscribeRate: 1.2 },
        { source: "website: google.com / organic", subscribers: Math.round(980 * mult), pct: 23, openRate: 68, unsubscribeRate: 0.8 },
        { source: "LinkedIn referral", subscribers: Math.round(620 * mult), pct: 15, openRate: 62, unsubscribeRate: 1.8 },
        { source: "website: t.co / referral", subscribers: Math.round(380 * mult), pct: 9, openRate: 44, unsubscribeRate: 3.2 },
        { source: "Email referral", subscribers: Math.round(240 * mult), pct: 6, openRate: 58, unsubscribeRate: 1.4 },
        { source: "Product / In-app", subscribers: Math.round(160 * mult), pct: 4, openRate: 81, unsubscribeRate: 0.4 },
      ],
    },
    outreach: {
      tldr: {
        summary: range === "7d"
          ? "This week's outreach metrics are on track with above-average open rates. Two sequences sent on Tuesday saw a 62% open rate — the highest this month. 8 new positive replies came in, with 3 converting to booked meetings. Follow up on all pending replies before the week ends."
          : range === "30d"
          ? "Cold outreach is performing above benchmark across both email and LinkedIn. Email sequences to CFO and VP Sales personas are generating 34% above-average reply rates, indicating strong message-market fit. LinkedIn cadences are amplifying brand recognition — prospects who've seen LinkedIn posts before receiving outreach respond at 2.1× the rate of cold contacts."
          : "Over the quarter, outreach has generated $280k in attributed email pipeline across 43 opportunities. Reply rate improved steadily each month, validating the message-market fit refinements. The LinkedIn + Email multi-touch pattern has proven to be the highest-converting sequence structure with consistent 2.1× lift.",
        actions: range === "7d" ? [
          { title: "Follow up on this week's positive replies", description: "8 positive replies came in this week — 5 are still awaiting a follow-up booking link. Respond within 24 hours to maintain momentum.", priority: "high", cta: "Review replies" },
          { title: "Pause the underperforming Tuesday sequence", description: "The Tuesday 9am sequence has a 14% open rate vs. the 59% account average. Pause and review subject line and send time before continuing.", priority: "high", cta: "Review sequence" },
          { title: "Review inbox health for at-risk accounts", description: "One sending account dropped below the healthy threshold this week. A brief pause and warmup review will protect deliverability for next week.", priority: "medium", cta: "Check inbox health" },
        ] : range === "30d" ? [
          { title: "Scale CFO-persona sequences", description: "The CFO sequence is your highest-converting — build 2 new variations and increase contact volume by 40%.", priority: "high", cta: "Build sequences" },
          { title: "Improve follow-up timing", description: "Days 3 and 7 follow-ups have the highest reply rates. Restructure all sequences to prioritise these intervals.", priority: "high", cta: "Restructure cadences" },
          { title: "Combine LinkedIn and email", description: "Accounts touched via both LinkedIn and email convert at 2.1× rate. Sync LinkedIn view events into email trigger logic.", priority: "medium", cta: "Set up integration" },
        ] : [
          { title: "Build a formal multi-touch playbook", description: "90 days of data confirms the LinkedIn + Email sequence generates 2.1× the reply rate of single-channel outreach. Formalise this as the standard sequence structure for all reps.", priority: "high", cta: "Build playbook" },
          { title: "Expand to VP Marketing persona sequences", description: "CFO sequences have proven their ROI. The VP Marketing persona shares similar pain points and has shown strong intent signals from website data this quarter.", priority: "medium", cta: "Build sequence" },
          { title: "Plan Q3 outreach capacity", description: "At current reply-to-opportunity conversion rates, adding 20% more contact volume would generate an estimated $56k additional pipeline next quarter.", priority: "medium", cta: "Plan capacity" },
        ],
      },
      emailPipeline: { value: Math.round(280000 * mult), change: range === "7d" ? 10 : range === "30d" ? 26 : 44, sparkline: spark(), prefix: "$" },
      totalSent: { value: Math.round(46200 * mult), change: range === "7d" ? 7 : range === "30d" ? 18 : 32, sparkline: spark() },
      openRate: { value: range === "7d" ? 56.8 : range === "30d" ? 59.2 : 62.1, change: range === "7d" ? 1 : range === "30d" ? 4 : 8, sparkline: spark() },
      clickRate: { value: 7.8, change: 2, sparkline: spark() },
      replyRate: { value: 3.0, change: range === "7d" ? 0 : range === "30d" ? 1 : 3, sparkline: spark() },
      opportunitiesCount: { value: Math.round(43 * mult), change: range === "7d" ? 9 : range === "30d" ? 22 : 38, sparkline: spark() },
      masterTrend: Array.from({ length: 14 }, (_, i) => {
        const base = Math.round(800 + Math.sin(i * 0.5) * 300 + i * 40);
        return {
          date: new Date(2026, 2, 1 + i * 6).toISOString().split("T")[0],
          sent: base,
          opens: Math.round(base * 0.59),
          uniqueOpens: Math.round(base * 0.52),
          replies: Math.round(base * 0.041),
        };
      }),
      emailCampaigns: [
        {
          id: "e1", name: "CFO Persona — Pipeline Narrative", status: "active", sequence: 4,
          sent: Math.round(280 * mult), opens: Math.round(166 * mult), replies: Math.round(34 * mult), meetings: Math.round(9 * mult), pipeline: Math.round(180000 * mult),
          openRate: 59.2, replyRate: 12.1, positiveReplyRate: 7.4, bounceRate: 2.1,
          leads: Math.round(280 * mult), completed: Math.round(67 * mult), bounced: Math.round(14 * mult), unsubscribed: Math.round(8 * mult),
          sequenceSteps: [
            { step: "Step 1", sent: Math.round(280 * mult), opened: Math.round(166 * mult), replied: Math.round(21 * mult), openRate: 59.2, replyRate: 7.5 },
            { step: "Step 2", sent: Math.round(210 * mult), opened: Math.round(112 * mult), replied: Math.round(8 * mult), openRate: 53.4, replyRate: 3.8 },
            { step: "Step 3", sent: Math.round(170 * mult), opened: Math.round(78 * mult), replied: Math.round(4 * mult), openRate: 45.9, replyRate: 2.4 },
            { step: "Step 4", sent: Math.round(130 * mult), opened: Math.round(52 * mult), replied: Math.round(1 * mult), openRate: 40.0, replyRate: 0.8 },
          ],
          trend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(2026, 3, 12 + i).toISOString().split("T")[0], sent: Math.round(80 + i * 12), opens: Math.round(48 + i * 7), replies: Math.round(4 + Math.sin(i) * 2) })),
        },
        {
          id: "e2", name: "VP Marketing — Signal Stack", status: "active", sequence: 3,
          sent: Math.round(180 * mult), opens: Math.round(98 * mult), replies: Math.round(18 * mult), meetings: Math.round(5 * mult), pipeline: Math.round(95000 * mult),
          openRate: 54.4, replyRate: 10.0, positiveReplyRate: 6.1, bounceRate: 1.8,
          leads: Math.round(180 * mult), completed: Math.round(42 * mult), bounced: Math.round(8 * mult), unsubscribed: Math.round(5 * mult),
          sequenceSteps: [
            { step: "Step 1", sent: Math.round(180 * mult), opened: Math.round(98 * mult), replied: Math.round(12 * mult), openRate: 54.4, replyRate: 6.7 },
            { step: "Step 2", sent: Math.round(148 * mult), opened: Math.round(72 * mult), replied: Math.round(5 * mult), openRate: 48.6, replyRate: 3.4 },
            { step: "Step 3", sent: Math.round(118 * mult), opened: Math.round(48 * mult), replied: Math.round(1 * mult), openRate: 40.7, replyRate: 0.8 },
          ],
          trend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(2026, 3, 12 + i).toISOString().split("T")[0], sent: Math.round(55 + i * 8), opens: Math.round(30 + i * 4), replies: Math.round(3 + Math.cos(i)) })),
        },
        {
          id: "e3", name: "Re-engagement — Q4 2025 Prospects", status: "completed", sequence: 2,
          sent: Math.round(95 * mult), opens: Math.round(32 * mult), replies: Math.round(7 * mult), meetings: Math.round(2 * mult), pipeline: Math.round(40000 * mult),
          openRate: 33.7, replyRate: 7.4, positiveReplyRate: 3.2, bounceRate: 4.1,
          leads: Math.round(95 * mult), completed: Math.round(82 * mult), bounced: Math.round(12 * mult), unsubscribed: Math.round(6 * mult),
          sequenceSteps: [
            { step: "Step 1", sent: Math.round(95 * mult), opened: Math.round(32 * mult), replied: Math.round(5 * mult), openRate: 33.7, replyRate: 5.3 },
            { step: "Step 2", sent: Math.round(72 * mult), opened: Math.round(20 * mult), replied: Math.round(2 * mult), openRate: 27.8, replyRate: 2.8 },
          ],
          trend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(2026, 3, 12 + i).toISOString().split("T")[0], sent: Math.round(28 + i * 3), opens: Math.round(9 + i * 1), replies: Math.round(1) })),
        },
      ],
      inboxHealth: [
        { email: "alex@nexuslabs.com",   warmupScore: 94, deliverabilityScore: 96, spamScore: 0.8, blacklisted: false, daysWarmedUp: 42, status: "healthy" },
        { email: "sarah@nexuslabs.com",  warmupScore: 88, deliverabilityScore: 91, spamScore: 1.2, blacklisted: false, daysWarmedUp: 38, status: "healthy" },
        { email: "growth@nexuslabs.com", warmupScore: 74, deliverabilityScore: 78, spamScore: 2.4, blacklisted: false, daysWarmedUp: 21, status: "warming" },
        { email: "outreach@nexuslabs.com", warmupScore: 48, deliverabilityScore: 52, spamScore: 4.8, blacklisted: false, daysWarmedUp: 9, status: "at-risk" },
      ],
      emailFunnel: [
        { stage: "Contacted", count: Math.round(46200 * mult), rate: 100, color: "#0EA5E9" },
        { stage: "Opened",    count: Math.round(25872 * mult), rate: 56,  color: "#FBBF24" },
        { stage: "Clicked",   count: Math.round(3622 * mult),  rate: 14,  color: "#F97316" },
        { stage: "Replied",   count: Math.round(1376 * mult),  rate: 38,  color: "#A78BFA" },
        { stage: "Meetings",  count: Math.round(303 * mult),   rate: 22,  color: "#7C7FFF" },
        { stage: "Opps",      count: Math.round(197 * mult),   rate: 65,  color: "#34D399" },
      ],
      crmPipelineFunnel: [
        { stage: "Request For Info", value: Math.round(840000 * mult), deals: Math.round(28 * mult), pct: 100,  color: "#0EA5E9" },
        { stage: "Presentation",     value: Math.round(620000 * mult), deals: Math.round(20 * mult), pct: 73.8, color: "#6366F1" },
        { stage: "Qualified",        value: Math.round(460000 * mult), deals: Math.round(14 * mult), pct: 54.8, color: "#A78BFA" },
        { stage: "Negotiation",      value: Math.round(310000 * mult), deals: Math.round(9 * mult),  pct: 36.9, color: "#FBBF24" },
        { stage: "Won",              value: Math.round(260000 * mult), deals: Math.round(5 * mult),  pct: 17.9, color: "#34D399" },
        { stage: "Lost",             value: Math.round(92000 * mult),  deals: Math.round(6 * mult),  pct: 11.0, color: "#FF4455" },
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
      salesloft: {
        rhythm: {
          prioritizedActions: 41,
          completed: 24,
          allActivitiesMonth: Math.round(741 * mult),
          activityTrend: dates.map((date, i) => ({ date, count: Math.round((18 + Math.sin(i * 0.7) * 6 + Math.random() * 8) * mult) })),
        },
        outcomes: [
          { label: "Opportunities Created", current: Math.round(60 * mult), projection: Math.round(90 * mult), goal: 120, unit: "count", color: "#6366F1", byRep: [{ name: "HP", value: 12 }, { name: "RW", value: 9 }, { name: "HG", value: 8 }, { name: "SH", value: 7 }, { name: "NL", value: 6 }, { name: "DM", value: 5 }] },
          { label: "Weighted Pipeline", current: Math.round(200000 * mult), projection: Math.round(280000 * mult), goal: 400000, unit: "money", color: "#8B5CF6", byRep: [{ name: "HP", value: 48000 }, { name: "RW", value: 36000 }, { name: "HG", value: 32000 }, { name: "SH", value: 28000 }, { name: "NL", value: 22000 }, { name: "DM", value: 18000 }] },
          { label: "Closed Won", current: Math.round(340000 * mult), projection: Math.round(480000 * mult), goal: 600000, unit: "money", color: "#34D399", byRep: [{ name: "HP", value: 82000 }, { name: "RW", value: 64000 }, { name: "HG", value: 58000 }, { name: "SH", value: 48000 }, { name: "NL", value: 42000 }, { name: "DM", value: 36000 }] },
        ],
        cadenceMetrics: {
          callsLogged: Math.round(5489 * mult), callsPerDay: Math.round(109 * mult), voicemails: Math.round(758 * mult), conversations: Math.round(399 * mult), positiveConversations: Math.round(101 * mult), callTrend: Array.from({ length: 8 }, () => Math.round(80 + Math.random() * 40)), callChangePct: 7,
          emailsSent: Math.round(12182 * mult), pctPersonalized: 46.5, pctOpened: 41.2, pctClicked: 5.2, pctReplied: 13.0, emailTrend: Array.from({ length: 8 }, () => Math.round(300 + Math.random() * 120)), emailChangePct: 9,
          totalTouches: Math.round(14445 * mult), totalMeetings: Math.round(292 * mult), meetingChangePct: 7, effectivenessScore: 4.6, effectivenessChangePct: 7,
          linkedinSteps: Math.round(3316 * mult), linkedinResearch: Math.round(1644 * mult), linkedinIntroductions: Math.round(858 * mult), linkedinConnections: Math.round(435 * mult), linkedinInMail: Math.round(379 * mult),
          otherStepsCompleted: Math.round(18078 * mult),
        },
        topCadences: [
          { name: "Inbound Hot Leads", opportunities: Math.round(312 * mult), meetings: Math.round(198 * mult), successes: Math.round(142 * mult), effectivenessScore: 8.2, oppChangePct: -21 },
          { name: "TMENT Main Pipeline", opportunities: Math.round(248 * mult), meetings: Math.round(156 * mult), successes: Math.round(108 * mult), effectivenessScore: 6.7, oppChangePct: -15 },
          { name: "Q1 – EMEA SMB", opportunities: Math.round(184 * mult), meetings: Math.round(112 * mult), successes: Math.round(78 * mult), effectivenessScore: 5.4, oppChangePct: 8 },
          { name: "Q2 – 2021 S...", opportunities: Math.round(140 * mult), meetings: Math.round(88 * mult), successes: Math.round(62 * mult), effectivenessScore: 4.9, oppChangePct: 12 },
          { name: "Sales Leader C...", opportunities: Math.round(98 * mult), meetings: Math.round(64 * mult), successes: Math.round(44 * mult), effectivenessScore: 4.1, oppChangePct: -5 },
        ],
        topReps: [
          { name: "Carly Anders", successes: 142, meetings: 98, opportunities: 68, totalActivity: 2840, emailsSent: 1240, callsLogged: 890, integrationSteps: 310 },
          { name: "Kyle Childree", successes: 128, meetings: 86, opportunities: 58, totalActivity: 2620, emailsSent: 1120, callsLogged: 820, integrationSteps: 280 },
          { name: "Paige Montecalvo", successes: 114, meetings: 76, opportunities: 52, totalActivity: 2480, emailsSent: 980, callsLogged: 760, integrationSteps: 260 },
          { name: "Zane Coburn", successes: 98, meetings: 68, opportunities: 44, totalActivity: 2210, emailsSent: 860, callsLogged: 680, integrationSteps: 220 },
          { name: "Tilton Taylor", successes: 86, meetings: 58, opportunities: 38, totalActivity: 1980, emailsSent: 740, callsLogged: 600, integrationSteps: 190 },
        ],
        dealFlow: {
          startPeriod: "Dec 1, 2025", endPeriod: "Dec 31, 2025",
          startTotal: Math.round(4150000 * mult), endTotal: Math.round(4760000 * mult), delta: Math.round(600000 * mult),
          sources: [
            { label: "Pipeline", value: Math.round(750000 * mult), color: "#6366F1" },
            { label: "Best Case", value: Math.round(1100000 * mult), color: "#8B5CF6" },
            { label: "Commit", value: Math.round(2300000 * mult), color: "#A78BFA" },
            { label: "Pulled In", value: Math.round(850000 * mult), color: "#F59E0B" },
            { label: "New", value: Math.round(1400000 * mult), color: "#34D399" },
          ],
          destinations: [
            { label: "Won", value: Math.round(3550000 * mult), color: "#34D399" },
            { label: "Idle", value: Math.round(1210000 * mult), color: "#64748B" },
            { label: "Pushed Out", value: Math.round(835000 * mult), color: "#F59E0B" },
            { label: "Lost", value: Math.round(800000 * mult), color: "#EF4444" },
          ],
          links: [
            { from: "Pipeline", to: "Won", value: Math.round(400000 * mult) },
            { from: "Pipeline", to: "Idle", value: Math.round(200000 * mult) },
            { from: "Pipeline", to: "Pushed Out", value: Math.round(150000 * mult) },
            { from: "Best Case", to: "Won", value: Math.round(750000 * mult) },
            { from: "Best Case", to: "Idle", value: Math.round(200000 * mult) },
            { from: "Best Case", to: "Lost", value: Math.round(150000 * mult) },
            { from: "Commit", to: "Won", value: Math.round(1800000 * mult) },
            { from: "Commit", to: "Idle", value: Math.round(350000 * mult) },
            { from: "Commit", to: "Lost", value: Math.round(150000 * mult) },
            { from: "Pulled In", to: "Won", value: Math.round(500000 * mult) },
            { from: "Pulled In", to: "Pushed Out", value: Math.round(350000 * mult) },
            { from: "New", to: "Won", value: Math.round(100000 * mult) },
            { from: "New", to: "Idle", value: Math.round(460000 * mult) },
            { from: "New", to: "Pushed Out", value: Math.round(335000 * mult) },
            { from: "New", to: "Lost", value: Math.round(500000 * mult) },
          ],
        },
      },
    },
    integrations: [
      { id: "crm", name: "HubSpot CRM", category: "crm", connected: true, lastSync: "2 min ago" },
      { id: "linkedin", name: "LinkedIn", category: "social", connected: true, lastSync: "5 min ago" },
      { id: "instagram", name: "Instagram", category: "social", connected: true, lastSync: "8 min ago" },
      { id: "facebook", name: "Facebook", category: "social", connected: false },
      { id: "tiktok", name: "TikTok", category: "social", connected: false },
      { id: "x-twitter", name: "X (Twitter)", category: "social", connected: false },
      { id: "reddit", name: "Reddit", category: "social", connected: false },
      { id: "google-search", name: "Google Search Console", category: "seo", connected: true, lastSync: "1 hour ago" },
      { id: "email-seq", name: "Email Sequencer", category: "outreach", connected: true, lastSync: "12 min ago" },
      { id: "website-intel", name: "Website Intelligence", category: "website-intel", connected: true, lastSync: "Real-time" },
      { id: "analytics", name: "Google Analytics", category: "analytics", connected: true, lastSync: "Real-time" },
      { id: "meta-ads", name: "Meta Ads", category: "paid-media", connected: true, lastSync: "30 min ago" },
      { id: "google-ads", name: "Google Ads", category: "paid-media", connected: true, lastSync: "45 min ago" },
      { id: "linkedin-ads", name: "LinkedIn Ads", category: "paid-media", connected: false },
      { id: "tiktok-ads", name: "TikTok Ads", category: "paid-media", connected: false },
      { id: "x-ads", name: "X Ads", category: "paid-media", connected: false },
      { id: "reddit-ads", name: "Reddit Ads", category: "paid-media", connected: false },
    ],
    paidMedia: {
      tldr: {
        summary: range === "7d"
          ? "This week, Meta Ads and Google Ads are running above ROAS benchmarks. Your top-performing campaign delivered 3.9× ROAS in the last 7 days. LinkedIn Ads are not yet connected — adding them could provide visibility into $48k estimated pipeline from paid social."
          : range === "30d"
          ? "Paid media is contributing roughly 42% of total attributed revenue this month. Meta Ads leads on conversion volume, while Google Ads delivers the highest ROAS at 3.4×. LinkedIn Ads is disconnected — this is a high-opportunity channel for your ICP given the B2B SaaS profile."
          : "Paid media generated a meaningful share of attributed revenue this quarter across Meta and Google. ROAS improved month-over-month as creative optimisation took effect. Expanding to LinkedIn Ads and TikTok Ads could add incremental pipeline next quarter based on industry benchmarks for your category.",
        actions: range === "7d" ? [
          { title: "Scale the top Meta campaign", description: "Your CFO-targeting campaign delivered 3.6× ROAS this week. Increase daily budget by 30% to capture the full audience window before week ends.", priority: "high", cta: "Scale budget" },
          { title: "Connect LinkedIn Ads", description: "LinkedIn Ads is disconnected. Your ICP is CISOs and VP Sales — LinkedIn is the highest-ROI paid channel for B2B SaaS in your category.", priority: "high", cta: "Connect" },
          { title: "Pause underperforming Google Display", description: "Display network campaigns are at 0.6× ROAS this week — below breakeven. Pause and reallocate budget to Search which is at 3.9×.", priority: "medium", cta: "Pause campaign" },
        ] : range === "30d" ? [
          { title: "Allocate more budget to Google Search", description: "Google Search campaigns are delivering 3.9× ROAS — the highest of any paid channel. Shifting 20% of Meta display budget to Search would improve overall blended ROAS.", priority: "high", cta: "Adjust budget" },
          { title: "Connect LinkedIn Ads for ICP targeting", description: "LinkedIn Ads provides the most precise B2B targeting for your ICP. Estimated 2.4× ROAS based on industry benchmarks for Series B SaaS companies targeting VP-level buyers.", priority: "high", cta: "Connect" },
          { title: "Set up conversion tracking for all campaigns", description: "3 active campaigns are not tracking post-click conversions. Adding proper UTM tracking and goal completion events would improve attribution accuracy by an estimated 34%.", priority: "medium", cta: "Set up tracking" },
        ] : [
          { title: "Build a paid media attribution model", description: "This quarter's paid data is sufficient for a multi-touch attribution model. Combining Meta, Google, and website intent data would reveal the true channel contribution to pipeline.", priority: "high", cta: "Build model" },
          { title: "Plan Q3 paid media expansion", description: "Based on this quarter's ROAS data, LinkedIn Ads and TikTok Ads are the highest-ROI expansion opportunities. Budget recommendations: LinkedIn $8k/month, TikTok $3k/month.", priority: "medium", cta: "Plan expansion" },
          { title: "Audit creative performance", description: "Video ads delivered 1.8× higher click-through rate than static images this quarter. A creative refresh strategy for Q3 should prioritise short-form video across Meta and TikTok.", priority: "medium", cta: "Audit creatives" },
        ],
      },
      totalSpend: { value: Math.round(20300 * mult), change: 14, sparkline: spark(), prefix: "$" },
      totalRevenue: { value: Math.round(66660 * mult), change: 22, sparkline: spark(), prefix: "$" },
      roas: { value: 3.3, change: 8, sparkline: spark() },
      cac: { value: 1240, change: -12, sparkline: spark(), prefix: "$" },
      campaigns: [
        { id: "c1", name: "CFO Pipeline — Retargeting", platform: "Meta Ads", status: "active", spend: Math.round(4800 * mult), revenue: Math.round(17280 * mult), roas: 3.6, impressions: Math.round(142000 * mult), clicks: Math.round(3840 * mult), conversions: Math.round(58 * mult), cpa: 82, cpc: 1.25 },
        { id: "c2", name: "B2B SaaS Search — Brand", platform: "Google Ads", status: "active", spend: Math.round(6200 * mult), revenue: Math.round(24180 * mult), roas: 3.9, impressions: Math.round(88000 * mult), clicks: Math.round(5280 * mult), conversions: Math.round(72 * mult), cpa: 86, cpc: 1.17 },
        { id: "c3", name: "Pipeline Intelligence Keywords", platform: "Google Ads", status: "active", spend: Math.round(3400 * mult), revenue: Math.round(11730 * mult), roas: 3.5, impressions: Math.round(52000 * mult), clicks: Math.round(2860 * mult), conversions: Math.round(38 * mult), cpa: 89, cpc: 1.19 },
        { id: "c4", name: "VP Sales — Lookalike", platform: "Meta Ads", status: "active", spend: Math.round(2900 * mult), revenue: Math.round(8700 * mult), roas: 3.0, impressions: Math.round(96000 * mult), clicks: Math.round(2400 * mult), conversions: Math.round(32 * mult), cpa: 91, cpc: 1.21 },
        { id: "c5", name: "Narrative ROI — Awareness", platform: "Meta Ads", status: "paused", spend: Math.round(1800 * mult), revenue: Math.round(4050 * mult), roas: 2.3, impressions: Math.round(210000 * mult), clicks: Math.round(1680 * mult), conversions: Math.round(18 * mult), cpa: 100, cpc: 1.07 },
        { id: "c6", name: "Google Display — Retargeting", platform: "Google Ads", status: "active", spend: Math.round(1200 * mult), revenue: Math.round(720 * mult), roas: 0.6, impressions: Math.round(380000 * mult), clicks: Math.round(760 * mult), conversions: Math.round(8 * mult), cpa: 150, cpc: 1.58 },
      ],
      platformBreakdown: [
        { platform: "Meta Ads", spend: Math.round(9500 * mult), revenue: Math.round(30030 * mult), roas: 3.2, color: "#1877F2" },
        { platform: "Google Ads", spend: Math.round(10800 * mult), revenue: Math.round(36630 * mult), roas: 3.4, color: "#4285F4" },
        { platform: "LinkedIn Ads", spend: 0, revenue: 0, roas: 0, color: "#0A66C2" },
        { platform: "TikTok Ads", spend: 0, revenue: 0, roas: 0, color: "#FF0050" },
      ],
      spendTrend: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(2026, 1, 1 + i * 2).toISOString().split("T")[0],
        spend: Math.round((1098 + Math.sin(i * 0.6) * 244 + i * 49) * mult),
        revenue: Math.round((3622.5 + Math.sin(i * 0.4) * 795 + i * 168) * mult),
      })),
      bestCampaigns: [
        { name: "B2B SaaS Search — Brand", platform: "Google Ads", revenue: Math.round(24180 * mult), conversions: Math.round(72 * mult), roas: 3.9 },
        { name: "CFO Pipeline — Retargeting", platform: "Meta Ads", revenue: Math.round(17280 * mult), conversions: Math.round(58 * mult), roas: 3.6 },
        { name: "Pipeline Intelligence Keywords", platform: "Google Ads", revenue: Math.round(11730 * mult), conversions: Math.round(38 * mult), roas: 3.5 },
      ],
      bestAds: [
        { name: "CEO Walkthrough Video — 30s", platform: "Meta Ads", revenue: Math.round(10650 * mult), conversions: Math.round(36 * mult), ctr: 4.2 },
        { name: "Pipeline ROI Static — Dark BG", platform: "Meta Ads", revenue: Math.round(6600 * mult), conversions: Math.round(22 * mult), ctr: 3.8 },
        { name: "B2B SaaS Search — Exact Match", platform: "Google Ads", revenue: Math.round(13800 * mult), conversions: Math.round(42 * mult), ctr: 6.1 },
      ],
    },
    narrativeIntel: {
      nri: { current: 4.2, target: 4, tier: "DFY", trend: "up" },
      phaseMetrics: {
        phase1: {
          growthMetric: { name: "Market perception", value: "+18%", change: 18 },
          emotionalIndicator: { name: "Sentiment score", value: "74/100", change: 8 },
        },
        phase2: {
          growthMetric: { name: "Lead conversion", value: "+31%", change: 31 },
          emotionalIndicator: { name: "Engagement time", value: "4m 12s", change: 14 },
        },
        phase3: {
          growthMetric: { name: "Pipeline velocity", value: "28 days", change: -18 },
          emotionalIndicator: { name: "NPS", value: "+42", change: 12 },
        },
        phase4: {
          growthMetric: { name: "Deal size", value: "+22%", change: 22 },
          emotionalIndicator: { name: "Affinity index", value: "68/100", change: 9 },
        },
        phase5: {
          growthMetric: { name: "LTV:CAC", value: "4.2:1", change: 11 },
          emotionalIndicator: { name: "Advocacy rate", value: "34%", change: 6 },
        },
      },
    },
    pipelineBridge: {
      section: "Narrative Intel",
      attributed: Math.round(840000 * mult),
      deals: Math.round(28 * mult),
      velocity: 34,
    },
  };
}

export const nexusData: ClientDataByRange = {
  "7d": makeNexus("7d"),
  "30d": makeNexus("30d"),
  "90d": makeNexus("90d"),
};
