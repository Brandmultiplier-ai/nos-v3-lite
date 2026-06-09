import type { ClientDataByRange, ClientData } from "./types";
import { createSparklineFactory, buildTrendSeries } from "./sparkline";
import { makeMeridianBrand } from "./brand-builders";

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
  const spark = createSparklineFactory(60, 20, 12);

  return {
    meta: {
      id: "meridian",
      name: "Meridian Brands",
      type: "D2C-adjacent B2B",
      stage: "Growth",
      channels: ["linkedin", "instagram", "facebook", "newsletter", "email"],
    },
    kpis: {
      cac: { value: 10350, change: range === "7d" ? -2 : range === "30d" ? -6 : -14, sparkline: spark(), prefix: "$" },
      pipeline: { value: Math.round(310000 * mult), change: range === "7d" ? 5 : range === "30d" ? 12 : 22, sparkline: spark(), prefix: "$" },
      dealVelocity: { value: 21, change: range === "7d" ? -5 : range === "30d" ? -14 : -24, sparkline: spark(), suffix: "d" },
      dealsCreated: { value: Math.round(22 * mult), change: range === "7d" ? 6 : range === "30d" ? 18 : 34, sparkline: spark() },
      closedWon: { value: Math.round(3 * mult), change: range === "7d" ? 12 : range === "30d" ? 34 : 52, sparkline: spark() },
      attributedRevenue: { value: Math.round(78000 * mult), change: range === "7d" ? 10 : range === "30d" ? 28 : 44, sparkline: spark(), prefix: "$" },
      ltv: { value: 35200, change: range === "7d" ? 5 : range === "30d" ? 14 : 23, sparkline: spark(), prefix: "$" },
      avgDealSize: { value: 11000, change: range === "7d" ? 3 : range === "30d" ? 8 : 16, sparkline: spark(), prefix: "$" },
    },
    signalTimeline: dates.map((date, i) => ({
      date,
      linkedin: Math.round(55 + Math.sin(i * 0.6) * 15 + i * 0.5),
      website: Math.round(62 + Math.cos(i * 0.4) * 12 + i * 0.4),
      email: Math.round(72 + Math.sin(i * 0.8) * 10 + i * 0.3),
      search: Math.round(38 + Math.cos(i * 0.5) * 8 + i * 0.2),
      content: Math.round(68 + Math.sin(i * 0.3) * 14 + i * 0.6),
    })),
    aiNarrative: range === "7d"
      ? "This week, Instagram engagement is 34% above last week's average with 4 posts reaching above-benchmark impressions. Newsletter open rate is 42% — above the monthly average. One Facebook post unexpectedly drove 12 qualified email sign-ups. Act on the newsletter momentum while engagement is high."
      : range === "30d"
      ? "Instagram engagement is driving 2.1× more top-of-funnel leads than LinkedIn for Meridian's audience. Your newsletter has the highest content-to-pipeline conversion rate at 38% — your owned audience is your biggest untapped pipeline lever. Recommend a newsletter-first content strategy with social amplification on Instagram and Facebook."
      : "Over the quarter, the newsletter-first strategy has proven its value, with owned channels now driving the majority of attributed pipeline. Instagram follower quality has improved — engagement-to-visit conversion is 12% above Q2. The multi-channel brand consistency improvements are showing in lower CAC and higher deal velocity.",
    recommendedActions: range === "7d" ? [
      {
        priority: "high",
        icon: "Mail",
        title: "Send a follow-up to this week's newsletter opens",
        description: "41% of this week's newsletter openers have not yet visited a product page. A short follow-up email with a specific case study link could move them down funnel this week.",
        cta: "Draft follow-up",
      },
      {
        priority: "high",
        icon: "Instagram",
        title: "Boost the top Instagram post from today",
        description: "Today's Instagram outcome post has 3.8× above-average early engagement. A $200 boost targeting lookalike audiences from your subscriber list will extend its reach window.",
        cta: "Boost post",
      },
      {
        priority: "medium",
        icon: "BarChart",
        title: "Update this week's content calendar",
        description: "Based on this week's early engagement signals, shifting Thursday's post to a customer outcome format will likely outperform the planned product post.",
        cta: "Update calendar",
      },
    ] : range === "30d" ? [
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
        title: "Instagram-to-email funnel optimisation",
        description: "Instagram posts mentioning customer outcomes convert 3.8× better to email subscribers than product posts. A simple link-in-bio redirect could capture 180+ qualified leads per month.",
        cta: "Set up funnel",
      },
      {
        priority: "medium",
        icon: "BarChart",
        title: "Facebook retargeting for mid-funnel",
        description: "Website visitors from Instagram who don't convert are showing strong intent signals. A Facebook retargeting campaign has estimated $28 CPL in your category.",
        cta: "Create audience",
      },
    ] : [
      {
        priority: "high",
        icon: "Mail",
        title: "Invest in newsletter subscriber acquisition",
        description: "Newsletter subscribers have a 38% pipeline conversion rate — the highest of any channel. Allocating $2k/month to subscriber acquisition would generate an estimated $76k in incremental quarterly pipeline.",
        cta: "Plan investment",
      },
      {
        priority: "medium",
        icon: "Instagram",
        title: "Develop a quarterly social content strategy",
        description: "This quarter's top-performing content themes are now clear. Document them as a repeatable content strategy to guide the next quarter and reduce content planning time.",
        cta: "Build strategy",
      },
      {
        priority: "medium",
        icon: "BarChart",
        title: "Measure brand consistency across channels",
        description: "90 days of multi-channel data allows for a brand consistency audit — measuring whether messaging, tone, and visual identity are aligned across Instagram, LinkedIn, and email.",
        cta: "Run audit",
      },
    ],
    brand: makeMeridianBrand(mult),
    positioning: {
      tldr: {
        summary: range === "7d"
          ? "This week, BrandFlow Co published two articles targeting D2C attribution keywords where Meridian currently ranks. Monitor share-of-voice impact over the next 7 days and prepare a counter-narrative content brief if rankings shift."
          : range === "30d"
          ? "Meridian Brands holds a solid Challenger position with strong narrative differentiation in the D2C-adjacent space. With BrandFlow Co closing the gap, maintaining narrative clarity and speed of content is critical to protecting your market position and pipeline contribution."
          : "Over the quarter, Meridian's positioning score improved by 14 points while SocialROI Pro declined. The narrative differentiation strategy is working — buyers in your segment are increasingly citing Meridian's content when explaining why they shortlisted you. Maintain the investment to sustain momentum.",
        actions: range === "7d" ? [
          { title: "Respond to BrandFlow Co's new content", description: "BrandFlow published two articles targeting your top keywords this week. A quick expert-angle counter-piece would protect your authority on these topics.", priority: "high", cta: "Draft content" },
          { title: "Check ranking changes this week", description: "Monitor your top 10 keyword rankings daily this week following competitor content activity. Prepare to update existing pages if positions drop.", priority: "high", cta: "Check rankings" },
          { title: "Update positioning page copy", description: "Your positioning/about page was last updated 60 days ago. Freshen it with this week's product updates to maintain search relevance.", priority: "medium", cta: "Update page" },
        ] : range === "30d" ? [
          { title: "Sharpen differentiation narrative", description: "BrandFlow Co is gaining ground on narrative presence. Publish a direct comparison guide to pre-empt buyer consideration of their offering.", priority: "high", cta: "Write guide" },
          { title: "Own emerging keywords", description: "Two D2C attribution keywords are trending with low competition — publish content targeting them before larger players enter.", priority: "high", cta: "Target keywords" },
          { title: "Promote analyst validation", description: "Buyer research shows third-party validation accelerates decisions in your segment. Surface any analyst or press mentions more prominently.", priority: "medium", cta: "Update sales enablement" },
        ] : [
          { title: "Formalise competitive differentiation strategy", description: "90 days of positioning data shows which messaging themes are winning against each competitor. Codify these into a positioning playbook for sales and marketing alignment.", priority: "high", cta: "Create playbook" },
          { title: "Publish a category definition piece", description: "Meridian's narrative strength score (72) gives authority to publish a category-defining piece that establishes your framework as the industry standard.", priority: "medium", cta: "Commission piece" },
          { title: "Monitor NarrativeLab's trajectory", description: "NarrativeLab has improved its narrative score by 8 points this quarter. Track their content output and SEO strategy to anticipate where they'll compete with you next.", priority: "medium", cta: "Set up monitoring" },
        ],
      },
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
      tldr: {
        summary: range === "7d"
          ? "This week, a D2C attribution article published by ContentPulse is gaining early traction on keywords you currently own. Submit an updated FAQ response to Perplexity this week to protect your AI citation share before the new content indexes."
          : range === "30d"
          ? "Search is a developing channel for Meridian — organic traffic is growing steadily but hasn't yet reached the efficiency of your social and email channels. The GEO opportunity is significant: AI engines are beginning to surface D2C brand attribution queries where Meridian has no established presence. Building topical authority now will compound into organic pipeline over the next 2–3 quarters."
          : "Organic search grew 22% this quarter from a low base. Three content pieces now rank on page 1 for D2C attribution queries. The search channel is transitioning from experimental to contributing — continued investment over the next two quarters will make it a primary top-of-funnel source.",
        actions: range === "7d" ? [
          { title: "Protect AI citation position this week", description: "ContentPulse published new D2C attribution content. Submit an updated Perplexity FAQ response this week to maintain your AI engine visibility.", priority: "high", cta: "Submit response" },
          { title: "Optimise the top CTR opportunity", description: "Your highest-impression keyword has a 2.1% CTR — below the page-1 benchmark of 3.8%. A title tag update this week could unlock significant additional organic traffic.", priority: "high", cta: "Update title tag" },
          { title: "Publish this week's blog post on schedule", description: "Maintaining content cadence is critical for Google's freshness signals. Ensure this week's scheduled post goes live as planned.", priority: "medium", cta: "Publish post" },
        ] : range === "30d" ? [
          { title: "Build D2C attribution content hub", description: "Create a cluster of 6–8 articles on D2C brand attribution — this is the highest-traffic topic in your category with low competition.", priority: "high", cta: "Plan content hub" },
          { title: "Optimise top 5 ranking pages", description: "Your current top-ranking pages have sub-optimal CTR. Improve title tags and meta descriptions to capture more of your existing rankings.", priority: "high", cta: "Optimise pages" },
          { title: "Submit brand Q&A to AI engines", description: "Submit structured Q&A content to improve GEO visibility on Perplexity and ChatGPT for D2C brand questions.", priority: "medium", cta: "Create GEO content" },
        ] : [
          { title: "Invest in a dedicated SEO roadmap", description: "With 3 page-1 rankings established, search is ready for a structured investment. A 90-day SEO roadmap targeting the top 20 category keywords would accelerate the channel's pipeline contribution.", priority: "high", cta: "Build roadmap" },
          { title: "Expand into commercial-intent keywords", description: "Current rankings are informational. Moving into commercial-intent keywords like 'D2C attribution software' would increase demo-qualified organic traffic.", priority: "medium", cta: "Research keywords" },
          { title: "Build a GEO content calendar", description: "AI engine citations are growing. A dedicated monthly output of structured GEO content (FAQ, definitions, comparisons) would compound visibility quarter over quarter.", priority: "medium", cta: "Plan calendar" },
        ],
      },
      geo: {
        visibilityScore: 34.1,
        visibilityChange: 1.8,
        shareOfVoice: 22,
        shareOfVoiceChange: 2,
        aiInsight: "Meridian's GEO presence is strongest on Perplexity and ChatGPT for D2C brand marketing queries. Instagram-to-pipeline and newsletter attribution topics are emerging citation clusters — publish dedicated guide content to accelerate indexing.",
        allBotVisits: { value: Math.round(14200 * mult), change: 28, sparkline: spark() },
        aiCitations: { value: Math.round(38400 * mult), change: 15, sparkline: spark() },
        aiTraining: { value: Math.round(7800 * mult), change: 1, sparkline: spark() },
        aiIndexing: { value: Math.round(9600 * mult), change: 1, sparkline: spark() },
        visibilityTrend: Array.from({ length: 14 }, (_, i) => ({
          date: new Date(2026, 3, 11 + i).toISOString().split("T")[0],
          client: Math.round(28 + Math.sin(i * 0.5) * 8 + i * 0.5),
          prev: Math.round(26 + Math.cos(i * 0.6) * 5 + i * 0.2),
        })),
        competitors: [
          { name: "Meridian Brands", isClient: true, visibilityScore: 34.1, change: 1.8, trend: [30, 31, 31.5, 32, 33, 33.8, 34.1] },
          { name: "Cascade Commerce", isClient: false, visibilityScore: 38.4, change: -0.8, trend: [40, 39.5, 39, 38.8, 38.5, 38.5, 38.4] },
          { name: "BrandMatrix",    isClient: false, visibilityScore: 29.2, change: 2.1, trend: [25, 26, 27, 28, 28.5, 29, 29.2] },
          { name: "VentureMark",   isClient: false, visibilityScore: 18.6, change: -1.2, trend: [21, 20.5, 20, 19.5, 19, 18.8, 18.6] },
        ],
        platforms: [
          { platform: "ChatGPT",    visibilityPct: 38, change: 3,  color: "#34D399" },
          { platform: "Perplexity", visibilityPct: 44, change: 5,  color: "#0EA5E9" },
          { platform: "Gemini",     visibilityPct: 28, change: -1, color: "#FBBF24" },
          { platform: "Anthropic",  visibilityPct: 18, change: 4,  color: "#FF6B4A" },
          { platform: "Copilot",    visibilityPct: 12, change: 1,  color: "#A78BFA" },
        ],
        citationDomains: [
          { domain: "meridianbrands.com",  citations: 68, change: 10, category: "Own Site" },
          { domain: "instagram.com",        citations: 54, change: 8,  category: "Social" },
          { domain: "hubspot.com",          citations: 42, change: 6,  category: "Media" },
          { domain: "g2.com",               citations: 31, change: 4,  category: "Review" },
          { domain: "contentmarketinginst.com", citations: 24, change: 3, category: "Media" },
          { domain: "linkedin.com",         citations: 21, change: 5,  category: "Social" },
        ],
      },
      healthScore: 84,
      domainRating: 52,
      organicKeywordsTotal: { value: Math.round(14200 * mult), change: 6, sparkline: spark() },
      backlinks: { value: Math.round(620 * mult), change: 14, sparkline: spark() },
      referringDomains: { value: Math.round(188 * mult), change: 42, sparkline: spark() },
      trafficValue: { value: Math.round(94000 * mult), change: 12, sparkline: spark(), prefix: "$" },
      organicSessions: buildTrendSeries(dates, 1800, 4, range),
      referringDomainsTrend: buildTrendSeries(dates, 140, 5, range),
      keywordBuckets: [
        { bucket: "1-3", label: "#1–3", count: Math.round(8 * mult), change: 3 },
        { bucket: "4-10", label: "#4–10", count: Math.round(14 * mult), change: 2 },
        { bucket: "11-50", label: "#11–50", count: Math.round(92 * mult), change: 8 },
        { bucket: "51-100", label: "#51–100", count: Math.round(48 * mult), change: -5 },
      ],
      countryBreakdown: [
        { code: "US", name: "United States", flag: "🇺🇸", traffic: Math.round(8200 * mult), trafficChange: 420, lat: 38, lon: -97 },
        { code: "GB", name: "United Kingdom", flag: "🇬🇧", traffic: Math.round(2100 * mult), trafficChange: 188, lat: 51, lon: -1 },
        { code: "AU", name: "Australia",      flag: "🇦🇺", traffic: Math.round(1400 * mult), trafficChange: 220, lat: -25, lon: 133 },
        { code: "CA", name: "Canada",         flag: "🇨🇦", traffic: Math.round(1200 * mult), trafficChange: -80, lat: 56, lon: -106 },
        { code: "DE", name: "Germany",        flag: "🇩🇪", traffic: Math.round(820 * mult),  trafficChange: 95,  lat: 51, lon: 10 },
        { code: "FR", name: "France",         flag: "🇫🇷", traffic: Math.round(640 * mult),  trafficChange: 70,  lat: 46, lon: 2 },
      ],
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
      pipelineFromOrganic: { value: Math.round(48000 * mult), change: range === "7d" ? 7 : range === "30d" ? 16 : 30, sparkline: spark(), prefix: "$" },
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
      geoPipelineKPI: { value: Math.round(38000 * mult), change: range === "7d" ? 80 : range === "30d" ? 220 : 420, sparkline: spark(), prefix: "$" },
    },
    website: {
      tldr: {
        summary: range === "7d"
          ? "This week, Instagram drove 34% of website traffic — above the monthly average. 4 new companies were identified as hot-intent accounts from social referral traffic. Track these through the week and trigger outreach before the intent window closes."
          : range === "30d"
          ? "Website signals for Meridian show solid audience quality with meaningful return visitor rates. Instagram is driving 2.1× more top-of-funnel website traffic than LinkedIn, confirming social-to-web as a key pipeline path. Expanding intent tracking on product pages will unlock better outreach targeting."
          : "Over the quarter, 560 unique companies visited intent-heavy pages — a 24% increase from Q3. The Instagram-to-website-to-outreach pipeline is proving itself with 14 attributable opportunities this quarter. Return visitor rates continue to improve, indicating growing brand consideration.",
        actions: range === "7d" ? [
          { title: "Act on this week's social-referred hot accounts", description: "4 companies identified from Instagram traffic this week have no open opportunity. Route them to SDRs with the social context for personalised first outreach.", priority: "high", cta: "Route accounts" },
          { title: "Check UTM tracking for this week's posts", description: "UTM data from 2 Instagram posts this week is not resolving correctly. Fix before posting tomorrow to ensure accurate attribution data.", priority: "high", cta: "Fix UTMs" },
          { title: "Review this week's session recordings", description: "3 sessions this week show high engagement then drop-off at the demo CTA. Review these recordings to identify the friction point.", priority: "medium", cta: "View recordings" },
        ] : range === "30d" ? [
          { title: "Add intent tracking to product pages", description: "Only homepage and blog are currently instrumented. Add company-level identification to /pricing and /demo pages immediately.", priority: "high", cta: "Implement tracking" },
          { title: "Create Instagram-to-website funnel tracking", description: "Set up UTM tracking on all Instagram link-in-bio posts to measure the social-to-pipeline path more precisely.", priority: "high", cta: "Set up UTMs" },
          { title: "Retarget return visitors", description: "2,800 return visitors haven't requested a demo — set up a retargeting ad sequence triggered by their second visit.", priority: "medium", cta: "Build retargeting" },
        ] : [
          { title: "Build a social-to-pipeline attribution report", description: "90 days of UTM and intent data can now show the full social-to-website-to-pipeline path. Present this attribution report to justify next quarter's social content investment.", priority: "high", cta: "Build report" },
          { title: "Scale the intent-to-outreach workflow", description: "The manual hot-account routing process handled 14 opportunities this quarter. Automating the routing via CRM workflows would scale this without adding headcount.", priority: "medium", cta: "Automate workflow" },
          { title: "Plan Q3 website conversion improvements", description: "With clearer intent data, identify the top 3 conversion friction points on product pages and prioritise CRO fixes for next quarter.", priority: "medium", cta: "Plan improvements" },
        ],
      },
      visitors: { value: Math.round(9200 * mult), change: 11, sparkline: spark() },
      sessions: { value: Math.round(12400 * mult), change: 14, sparkline: spark() },
      companiesIdentified: { value: Math.round(180 * mult), change: 14, sparkline: spark() },
      avgTimeOnSite: { value: 3.6, change: 5, sparkline: spark(), suffix: "m" },
      returning: { value: Math.round(2800 * mult), change: 24, sparkline: spark() },
      hotAccounts: { value: Math.round(14 * mult), change: 38, sparkline: spark() },
      rageclickRate: { value: 10.8, change: -3, sparkline: spark() },
      deadclickRate: { value: 6.4, change: -4, sparkline: spark() },
      scrollDepth: { value: 58, change: 2, sparkline: spark() },
      jsErrors: { value: Math.round(110 * mult), change: -8, sparkline: spark() },
      quickBackRate: { value: 5.2, change: -1, sparkline: spark() },
      readingBehavior: [
        { label: "Casual", pct: 74.3, sessions: Math.round(920 * mult), color: "#7C7FFF" },
        { label: "Serious", pct: 16.8, sessions: Math.round(208 * mult), color: "#FBBF24" },
        { label: "Reader", pct: 8.9, sessions: Math.round(110 * mult), color: "#34D399" },
      ],
      visitorTrend: dates.map((date, i) => ({ date, value: Math.round(280 + i * 5 + Math.cos(i * 0.6) * 40) })),
      trafficSources: [
        { name: "Organic", value: 28 },
        { name: "Instagram", value: 22 },
        { name: "Facebook", value: 18 },
        { name: "LinkedIn", value: 14 },
        { name: "Email", value: 18 },
      ],
      visitorCountries: [
        { code: "US", name: "United States", flag: "🇺🇸", traffic: Math.round(3800 * mult), trafficChange: 8, lat: 37.09, lon: -95.71 },
        { code: "GB", name: "United Kingdom", flag: "🇬🇧", traffic: Math.round(1600 * mult), trafficChange: 14, lat: 55.38, lon: -3.44 },
        { code: "AU", name: "Australia", flag: "🇦🇺", traffic: Math.round(1100 * mult), trafficChange: 22, lat: -25.27, lon: 133.78 },
        { code: "CA", name: "Canada", flag: "🇨🇦", traffic: Math.round(820 * mult), trafficChange: 6, lat: 56.13, lon: -106.35 },
        { code: "IN", name: "India", flag: "🇮🇳", traffic: Math.round(640 * mult), trafficChange: 31, lat: 20.59, lon: 78.96 },
        { code: "NZ", name: "New Zealand", flag: "🇳🇿", traffic: Math.round(340 * mult), trafficChange: 5, lat: -40.9, lon: 174.89 },
      ],
      topPages: [
        { url: "/shop", sessions: Math.round(3200 * mult), scrollDepth: 72, exitRate: 32 },
        { url: "/pricing", sessions: Math.round(2100 * mult), scrollDepth: 68, exitRate: 24 },
        { url: "/about", sessions: Math.round(1800 * mult), scrollDepth: 85, exitRate: 48 },
        { url: "/blog/d2c-playbook", sessions: Math.round(1200 * mult), scrollDepth: 91, exitRate: 38 },
        { url: "/contact", sessions: Math.round(840 * mult), scrollDepth: 44, exitRate: 22 },
      ],
      funnelSteps: [
        { label: "Homepage", sessions: Math.round(9200 * mult), dropoffPct: 0 },
        { label: "Shop / Product", sessions: Math.round(4800 * mult), dropoffPct: 48 },
        { label: "Pricing", sessions: Math.round(2100 * mult), dropoffPct: 56 },
        { label: "Contact / Demo", sessions: Math.round(580 * mult), dropoffPct: 72 },
        { label: "Confirmed", sessions: Math.round(180 * mult), dropoffPct: 69 },
      ],
      sessionRecordings: [
        { id: "sr1", page: "/shop", duration: "5m 08s", flags: ["rage-click"], country: "🇬🇧 UK", device: "mobile" },
        { id: "sr2", page: "/pricing", duration: "3m 42s", flags: [], country: "🇺🇸 US", device: "desktop" },
        { id: "sr3", page: "/about", duration: "1m 22s", flags: ["quick-back"], country: "🇦🇺 AU", device: "mobile" },
        { id: "sr4", page: "/contact", duration: "6m 58s", flags: ["dead-click"], country: "🇨🇦 CA", device: "desktop" },
        { id: "sr5", page: "/blog/d2c-playbook", duration: "8m 14s", flags: [], country: "🇺🇸 US", device: "tablet" },
      ],
      intentHeatmap: (() => {
        const hDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
        return hDays.flatMap((day) =>
          hours.map((hour) => ({
            day,
            hour,
            value: Math.round(15 + (["Mon", "Tue", "Thu"].includes(day) ? 25 : 0) + (["10am", "2pm", "3pm"].includes(hour) ? 20 : 0) + Math.random() * 18),
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
      tldr: {
        summary: range === "7d"
          ? "This week, the Monday newsletter drove the highest single-send open rate this month at 44%. One Instagram Reel outperformed all static posts. Maintain this week's content rhythm — consistency is the key driver of the audience growth trend."
          : range === "30d"
          ? "Content marketing is Meridian's most efficient pipeline channel per dollar spent. Instagram engagement is driving the most top-of-funnel leads, while the newsletter is your highest-converting owned channel at 38% content-to-pipeline rate. Distribution scale is the primary lever — message quality is already strong."
          : "Content has compounded this quarter into Meridian's leading pipeline channel. Instagram and the newsletter together generated $124k in influenced pipeline. Brand voice consistency across channels improved, contributing to a 14% reduction in CAC over the quarter.",
        actions: range === "7d" ? [
          { title: "Repurpose this week's top newsletter content", description: "The Monday send had 44% open rate. Extract the key insight and post it as an Instagram carousel today while the topic is relevant.", priority: "high", cta: "Repurpose content" },
          { title: "Add a newsletter CTA to today's Instagram post", description: "Only 12% of posts include a newsletter CTA. Adding one today to the high-performing Reel format could capture 40+ new subscribers.", priority: "high", cta: "Update post" },
          { title: "Review this week's Facebook reach", description: "Facebook reach dropped 18% vs. last week. Check whether this is an algorithm or schedule issue before next week's posts.", priority: "medium", cta: "Review analytics" },
        ] : range === "30d" ? [
          { title: "Increase Instagram post frequency", description: "Instagram posts mentioning customer outcomes convert 3.8× better to subscribers. Post 5 days per week instead of 3.", priority: "high", cta: "Build calendar" },
          { title: "Add newsletter CTA to every post", description: "Only 12% of Instagram posts include a newsletter CTA. Adding it consistently could add 180+ subscribers per month.", priority: "high", cta: "Update posts" },
          { title: "Repurpose newsletter issues to blog", description: "Newsletter open rate of 38% signals great content quality. Publish full issues as blog posts to capture organic search traffic.", priority: "medium", cta: "Plan repurposing" },
        ] : [
          { title: "Invest in a formal newsletter growth strategy", description: "Newsletter delivers the highest pipeline ROI of any content channel. A structured list growth program investing $1.5k/month could add $45k in quarterly pipeline.", priority: "high", cta: "Plan strategy" },
          { title: "Build a quarterly content calendar framework", description: "This quarter's top-performing formats and topics are now clear. Build a repeatable quarterly calendar template to reduce planning time and maintain output quality.", priority: "medium", cta: "Build template" },
          { title: "Develop a content repurposing system", description: "Creating content once and distributing across Instagram, blog, and newsletter reduces cost per content piece by an estimated 60%. Formalise the repurposing workflow.", priority: "medium", cta: "Build system" },
        ],
      },
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
      platformStats: [
        { platform: "Instagram", color: "#E1306C", followers: Math.round(28400 * mult), followersChange: 12, reach: Math.round(94000 * mult), engagementRate: 6.8, posts: Math.round(18 * mult), reelsWatchTime: 38, hookRate: 64 },
        { platform: "Facebook", color: "#1877F2", followers: Math.round(14200 * mult), followersChange: 3, reach: Math.round(42000 * mult), engagementRate: 2.9, posts: Math.round(14 * mult) },
        { platform: "LinkedIn", color: "#0A66C2", followers: Math.round(6800 * mult), followersChange: 9, reach: Math.round(28000 * mult), engagementRate: 4.1, posts: Math.round(10 * mult) },
        { platform: "Newsletter", color: "#34D399", followers: Math.round(6800 * mult), followersChange: 18, reach: Math.round(6800 * mult), engagementRate: 44, posts: Math.round(4 * mult) },
      ],
      audienceGrowthStacked: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(2026, i - 10 + 2, 1).toISOString().split("T")[0].slice(0, 7),
        linkedin: Math.round(5800 + i * 90 + Math.sin(i * 0.4) * 40),
        instagram: Math.round(24200 + i * 340 + Math.cos(i * 0.5) * 140),
        facebook: Math.round(13600 + i * 50 + Math.sin(i * 0.3) * 30),
        x: Math.round(1200 + i * 10),
      })),
      sentiment: {
        positive: 81, neutral: 14, negative: 5,
        volume: Math.round(4120 * mult), volumeChange: 28,
        themes: [
          { theme: "Brand storytelling", count: 720, sentiment: "positive" },
          { theme: "Product quality", count: 540, sentiment: "positive" },
          { theme: "Customer success", count: 380, sentiment: "positive" },
          { theme: "Pricing", count: 64, sentiment: "negative" },
          { theme: "Delivery/timing", count: 48, sentiment: "neutral" },
        ],
      },
      linkedinKPIs: {
        followers:    { value: Math.round(6800 * mult), change: 22.1, sparkline: spark() },
        impressions:  { value: Math.round(1240000 * mult), change: 14.2, sparkline: spark() },
        engagements:  { value: Math.round(8200 * mult), change: 8.4, sparkline: spark() },
        posts:        { value: Math.round(10 * mult), change: 11.1, sparkline: spark() },
        comments:     { value: Math.round(820 * mult), change: -12.3, sparkline: spark() },
        likes:        { value: Math.round(6400 * mult), change: 9.6, sparkline: spark() },
        shares:       { value: Math.round(48 * mult), change: -18.4, sparkline: spark() },
        profileViews: { value: Math.round(28000 * mult), change: 31.2, sparkline: spark() },
      },
      linkedinPosts: [
        { id: "lp1", date: "2026-02-12", content: "We stopped tracking follower count 6 months ago. Pipeline from content is up 34% since then. Here's what we track instead and how the shift changed our entire content strategy...", impressions: 11200, engagementRate: 5.6, likes: 328, comments: 48, pipeline: 28000, isViral: true },
        { id: "lp2", date: "2026-02-05", content: "Behind the brand: every social post is a pipeline event. We built an attribution stack that traces a LinkedIn comment to a closed deal. Full breakdown of our model...", impressions: 7800, engagementRate: 4.8, likes: 242, comments: 36, pipeline: 22000, isViral: false },
        { id: "lp3", date: "2026-01-29", content: "Meridian dropped vanity metrics and our board meetings are completely different now. Instead of 'we got 50k impressions' we say 'content drove $124k pipeline this month'...", impressions: 6400, engagementRate: 4.2, likes: 196, comments: 28, pipeline: 18000, isViral: false },
      ],
      linkedinFollowerGrowth: dates.map((date, i) => ({ date, value: Math.round(2800 + i * 22 + Math.sin(i * 0.4) * 35) })),
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
      blogPosts: [
        { title: "Multi-Channel Attribution for D2C Brands: The Definitive Guide", url: "/blog/d2c-attribution-guide", pageviews: Math.round(6800 * mult), avgAttentionTime: "5m 14s", engagementRate: 82, pipeline: Math.round(48000 * mult), published: "2026-02-08" },
        { title: "Instagram Reels to Pipeline: Our 3-Month Experiment", url: "/blog/instagram-reels-pipeline", pageviews: Math.round(5200 * mult), avgAttentionTime: "4m 48s", engagementRate: 78, pipeline: Math.round(38000 * mult), published: "2026-01-31" },
        { title: "Why Newsletter Subscribers Convert 3× Better than Social Followers", url: "/blog/newsletter-vs-social-conversion", pageviews: Math.round(4400 * mult), avgAttentionTime: "4m 02s", engagementRate: 86, pipeline: Math.round(32000 * mult), published: "2026-01-24" },
        { title: "The Brand Storytelling Framework That Drives DTC Revenue", url: "/blog/brand-storytelling-dtc", pageviews: Math.round(3800 * mult), avgAttentionTime: "3m 36s", engagementRate: 74, pipeline: Math.round(24000 * mult), published: "2026-01-17" },
      ],
      blogExperiments: [
        {
          id: "exp1", name: "Instagram link-in-bio: Blog post vs. Email capture",
          status: "won", daysRunning: range === "7d" ? 10 : range === "30d" ? 42 : 118,
          visitors: Math.round(18400 * mult),
          baseline: { label: "Blog Post Link", conversions: Math.round(264 * mult), visitors: Math.round(9180 * mult), conversionRate: 2.88 },
          variation: { label: "Email Capture Page", conversions: Math.round(388 * mult), visitors: Math.round(9220 * mult), conversionRate: 4.21, improvement: 46.2 },
          significance: range === "7d" ? 68 : range === "30d" ? 99 : 99,
          significanceCurve: [0,3,7,12,18,25,33,41,50,58,66,73,79,84,88,91,94,96,97,98,99,99,99].map((v, i) => ({ day: i * 2, value: v })),
        },
        {
          id: "exp2", name: "Facebook ad copy: Emotional vs. Stats-led",
          status: "running", daysRunning: range === "7d" ? 6 : range === "30d" ? 18 : 52,
          visitors: Math.round(6200 * mult),
          baseline: { label: "Stats-Led", conversions: Math.round(96 * mult), visitors: Math.round(3100 * mult), conversionRate: 3.1 },
          variation: { label: "Emotional Story", conversions: Math.round(106 * mult), visitors: Math.round(3100 * mult), conversionRate: 3.42, improvement: 10.3 },
          significance: range === "7d" ? 34 : range === "30d" ? 58 : 76,
          significanceCurve: [0,2,4,8,12,16,21,26,31,37,43,48,53,58,60,62,64,66,68].map((v, i) => ({ day: i, value: v })),
        },
      ],
      blogPageviewsTrend: buildTrendSeries(dates, 2400, 6, range),
      activeSubscribers: { value: Math.round(6800 * mult), change: 24, sparkline: spark() },
      openRate: { value: 44, change: 4, sparkline: spark() },
      clickRate: { value: 9.8, change: 1.2, sparkline: spark() },
      newsletters: [
        { id: "n1", subject: "The multi-channel attribution playbook for DTC brands", sent: 6800, openRate: 44, clickRate: 9.8, unsubscribes: 18, pipeline: 58000, date: "2026-02-09" },
        { id: "n2", subject: "Why we stopped tracking followers (and what we track instead)", sent: 6750, openRate: 41, clickRate: 7.4, unsubscribes: 12, pipeline: 42000, date: "2026-02-02" },
        { id: "n3", subject: "Meridian Q1 Brand Intelligence Report", sent: 6700, openRate: 48, clickRate: 12.1, unsubscribes: 9, pipeline: 72000, date: "2026-01-26" },
      ],
      subscriberGrowth: dates.map((date, i) => ({ date, value: Math.round(6400 + i * 24 + Math.sin(i * 0.4) * 40) })),
      openRateTrend: dates.map((date, i) => ({ date, value: Math.round(38 + Math.sin(i * 0.5) * 4 + i * 0.12) })),
      acquisitionSources: [
        { source: "Instagram: link in bio", subscribers: Math.round(2480 * mult), pct: 36, openRate: 62, unsubscribeRate: 2.4 },
        { source: "website: direct / none", subscribers: Math.round(1820 * mult), pct: 27, openRate: 74, unsubscribeRate: 0.9 },
        { source: "website: google.com / organic", subscribers: Math.round(1020 * mult), pct: 15, openRate: 68, unsubscribeRate: 1.1 },
        { source: "Facebook referral", subscribers: Math.round(680 * mult), pct: 10, openRate: 48, unsubscribeRate: 3.8 },
        { source: "Referral program", subscribers: Math.round(480 * mult), pct: 7, openRate: 81, unsubscribeRate: 0.4 },
        { source: "Other", subscribers: Math.round(320 * mult), pct: 5, openRate: 44, unsubscribeRate: 4.2 },
      ],
    },
    outreach: {
      tldr: {
        summary: range === "7d"
          ? "This week's outreach open rate is tracking at 54% — 2 points above the monthly average. 6 positive replies came in, with 2 booked meetings. Extend the highest-performing sequence from this week before end of day Friday to capture the mid-week engagement window."
          : range === "30d"
          ? "Cold outreach for Meridian is performing well given the shorter average deal size and faster sales cycle. Email personalisation is driving above-average open rates, and LinkedIn cadences are warming buyers who've engaged with brand content. The primary opportunity is improving follow-up consistency — reply rates spike on days 3 and 7, but many sequences end before reaching those intervals."
          : "Over the quarter, outreach generated $95k in email pipeline across 28 opportunities. Reply rates improved each month as personalisation quality increased. The LinkedIn content warm-up strategy is validated — buyers who engage with content before receiving outreach reply at 2.1× the cold rate.",
        actions: range === "7d" ? [
          { title: "Extend this week's best-performing sequence", description: "The Tuesday persona sequence had a 62% open rate this week. Extend it with 2 additional follow-up steps before the engagement window closes on Friday.", priority: "high", cta: "Extend sequence" },
          { title: "Follow up on this week's 6 positive replies", description: "6 positive replies are awaiting follow-up booking links. Respond before end of day today to maintain meeting conversion momentum.", priority: "high", cta: "Send follow-ups" },
          { title: "Pause low-performing Friday sends", description: "Friday sends have 28% lower open rates than Tuesday or Wednesday. Reschedule any Friday sends to mid-week for better engagement.", priority: "medium", cta: "Reschedule sends" },
        ] : range === "30d" ? [
          { title: "Extend sequence length", description: "40% of sequences end before day 7 — the highest reply-rate day. Add 2 additional follow-up steps to all active sequences.", priority: "high", cta: "Update sequences" },
          { title: "Personalise opening lines", description: "Sequences with brand-specific opening lines have 2.4× higher reply rate. Train SDRs to use Instagram or newsletter references in first lines.", priority: "high", cta: "Update playbook" },
          { title: "Launch LinkedIn and email combined plays", description: "Coordinate LinkedIn views with email sends on day 1 of each sequence for a 2.1× uplift in reply rate.", priority: "medium", cta: "Set up plays" },
        ] : [
          { title: "Build a formal personalisation playbook", description: "90 days of data confirms personalised opening lines drive 2.4× higher reply rates. Document the best-performing openers by industry and persona as a repeatable SDR resource.", priority: "high", cta: "Build playbook" },
          { title: "Scale the LinkedIn warm-up strategy", description: "Content-warmed sequences have proven their lift. Formalising the LinkedIn engagement → outreach trigger as a standard workflow would make the strategy scalable.", priority: "medium", cta: "Formalise workflow" },
          { title: "Plan next quarter's outreach capacity", description: "At current conversion rates, a 25% increase in contact volume would generate an estimated $24k in additional quarterly pipeline.", priority: "medium", cta: "Plan capacity" },
        ],
      },
      emailPipeline: { value: Math.round(95000 * mult), change: range === "7d" ? 7 : range === "30d" ? 18 : 34, sparkline: spark(), prefix: "$" },
      totalSent: { value: Math.round(28400 * mult), change: 12, sparkline: spark() },
      openRate: { value: range === "7d" ? 50.2 : range === "30d" ? 52.8 : 55.4, change: range === "7d" ? 1 : range === "30d" ? 3 : 6, sparkline: spark() },
      clickRate: { value: 7.8, change: 2, sparkline: spark() },
      replyRate: { value: 3.0, change: range === "7d" ? 0 : range === "30d" ? 1.4 : 3.2, sparkline: spark() },
      opportunitiesCount: { value: Math.round(28 * mult), change: 16, sparkline: spark() },
      masterTrend: Array.from({ length: 14 }, (_, i) => {
        const base = Math.round(500 + Math.sin(i * 0.5) * 180 + i * 25);
        return { date: new Date(2026, 2, 1 + i * 6).toISOString().split("T")[0], sent: base, opens: Math.round(base * 0.53), uniqueOpens: Math.round(base * 0.47), replies: Math.round(base * 0.052) };
      }),
      emailCampaigns: [
        {
          id: "e1", name: "Brand Director — Multi-Channel ROI", status: "active", sequence: 3,
          sent: Math.round(160 * mult), opens: Math.round(85 * mult), replies: Math.round(24 * mult), meetings: Math.round(7 * mult), pipeline: Math.round(68000 * mult),
          openRate: 52.8, replyRate: 15.0, positiveReplyRate: 9.2, bounceRate: 2.4,
          leads: Math.round(160 * mult), completed: Math.round(48 * mult), bounced: Math.round(10 * mult), unsubscribed: Math.round(6 * mult),
          sequenceSteps: [
            { step: "Step 1", sent: Math.round(160 * mult), opened: Math.round(85 * mult), replied: Math.round(15 * mult), openRate: 52.8, replyRate: 9.4 },
            { step: "Step 2", sent: Math.round(130 * mult), opened: Math.round(62 * mult), replied: Math.round(7 * mult), openRate: 47.7, replyRate: 5.4 },
            { step: "Step 3", sent: Math.round(100 * mult), opened: Math.round(38 * mult), replied: Math.round(2 * mult), openRate: 38.0, replyRate: 2.0 },
          ],
          trend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(2026, 3, 12 + i).toISOString().split("T")[0], sent: Math.round(50 + i * 8), opens: Math.round(26 + i * 4), replies: Math.round(3 + Math.sin(i)) })),
        },
        {
          id: "e2", name: "CMO Persona — Attribution Story", status: "active", sequence: 3,
          sent: Math.round(120 * mult), opens: Math.round(58 * mult), replies: Math.round(14 * mult), meetings: Math.round(4 * mult), pipeline: Math.round(42000 * mult),
          openRate: 48.3, replyRate: 11.7, positiveReplyRate: 6.8, bounceRate: 1.9,
          leads: Math.round(120 * mult), completed: Math.round(32 * mult), bounced: Math.round(7 * mult), unsubscribed: Math.round(4 * mult),
          sequenceSteps: [
            { step: "Step 1", sent: Math.round(120 * mult), opened: Math.round(58 * mult), replied: Math.round(9 * mult), openRate: 48.3, replyRate: 7.5 },
            { step: "Step 2", sent: Math.round(98 * mult), opened: Math.round(42 * mult), replied: Math.round(4 * mult), openRate: 42.9, replyRate: 4.1 },
            { step: "Step 3", sent: Math.round(78 * mult), opened: Math.round(28 * mult), replied: Math.round(1 * mult), openRate: 35.9, replyRate: 1.3 },
          ],
          trend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(2026, 3, 12 + i).toISOString().split("T")[0], sent: Math.round(38 + i * 5), opens: Math.round(18 + i * 3), replies: Math.round(2 + Math.cos(i)) })),
        },
        {
          id: "e3", name: "Newsletter Co-Promo Outreach", status: "completed", sequence: 2,
          sent: Math.round(80 * mult), opens: Math.round(38 * mult), replies: Math.round(11 * mult), meetings: Math.round(3 * mult), pipeline: Math.round(28000 * mult),
          openRate: 47.5, replyRate: 13.8, positiveReplyRate: 7.5, bounceRate: 2.8,
          leads: Math.round(80 * mult), completed: Math.round(70 * mult), bounced: Math.round(8 * mult), unsubscribed: Math.round(4 * mult),
          sequenceSteps: [
            { step: "Step 1", sent: Math.round(80 * mult), opened: Math.round(38 * mult), replied: Math.round(8 * mult), openRate: 47.5, replyRate: 10.0 },
            { step: "Step 2", sent: Math.round(62 * mult), opened: Math.round(22 * mult), replied: Math.round(3 * mult), openRate: 35.5, replyRate: 4.8 },
          ],
          trend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(2026, 3, 12 + i).toISOString().split("T")[0], sent: Math.round(24 + i * 2), opens: Math.round(11 + i), replies: Math.round(2) })),
        },
      ],
      inboxHealth: [
        { email: "hello@meridianbrands.com", warmupScore: 91, deliverabilityScore: 93, spamScore: 1.0, blacklisted: false, daysWarmedUp: 36, status: "healthy" },
        { email: "grow@meridianbrands.com",  warmupScore: 82, deliverabilityScore: 86, spamScore: 1.6, blacklisted: false, daysWarmedUp: 28, status: "healthy" },
        { email: "reach@meridianbrands.com", warmupScore: 61, deliverabilityScore: 65, spamScore: 3.1, blacklisted: false, daysWarmedUp: 14, status: "warming" },
      ],
      emailFunnel: [
        { stage: "Contacted", count: Math.round(28400 * mult), rate: 100, color: "#0EA5E9" },
        { stage: "Opened",    count: Math.round(15904 * mult), rate: 56,  color: "#FBBF24" },
        { stage: "Clicked",   count: Math.round(2227 * mult),  rate: 14,  color: "#F97316" },
        { stage: "Replied",   count: Math.round(846 * mult),   rate: 38,  color: "#A78BFA" },
        { stage: "Meetings",  count: Math.round(186 * mult),   rate: 22,  color: "#7C7FFF" },
        { stage: "Opps",      count: Math.round(121 * mult),   rate: 65,  color: "#34D399" },
      ],
      crmPipelineFunnel: [
        { stage: "Request For Info", value: Math.round(380000 * mult), deals: Math.round(18 * mult), pct: 100,  color: "#0EA5E9" },
        { stage: "Presentation",     value: Math.round(268000 * mult), deals: Math.round(12 * mult), pct: 70.5, color: "#6366F1" },
        { stage: "Qualified",        value: Math.round(182000 * mult), deals: Math.round(8 * mult),  pct: 47.9, color: "#A78BFA" },
        { stage: "Negotiation",      value: Math.round(118000 * mult), deals: Math.round(5 * mult),  pct: 31.1, color: "#FBBF24" },
        { stage: "Won",              value: Math.round(33000 * mult),  deals: Math.round(3 * mult),  pct: 17.9, color: "#34D399" },
        { stage: "Lost",             value: Math.round(42000 * mult),  deals: Math.round(4 * mult),  pct: 11.1, color: "#FF4455" },
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
        { score: "90-100", count: 18 }, { score: "80-89", count: 52 }, { score: "70-79", count: 88 },
        { score: "60-69", count: 64 }, { score: "50-59", count: 38 }, { score: "<50", count: 22 },
      ],
      salesloft: {
        rhythm: {
          prioritizedActions: 33,
          completed: 18,
          allActivitiesMonth: Math.round(580 * mult),
          activityTrend: dates.map((date, i) => ({ date, count: Math.round((14 + Math.sin(i * 0.7) * 4 + Math.random() * 6) * mult) })),
        },
        outcomes: [
          { label: "Opportunities Created", current: Math.round(44 * mult), projection: Math.round(68 * mult), goal: 100, unit: "count", color: "#6366F1", byRep: [{ name: "HP", value: 9 }, { name: "RW", value: 7 }, { name: "HG", value: 6 }, { name: "SH", value: 5 }, { name: "NL", value: 4 }, { name: "DM", value: 3 }] },
          { label: "Weighted Pipeline", current: Math.round(155000 * mult), projection: Math.round(220000 * mult), goal: 320000, unit: "money", color: "#8B5CF6", byRep: [{ name: "HP", value: 38000 }, { name: "RW", value: 28000 }, { name: "HG", value: 24000 }, { name: "SH", value: 20000 }, { name: "NL", value: 16000 }, { name: "DM", value: 12000 }] },
          { label: "Closed Won", current: Math.round(260000 * mult), projection: Math.round(360000 * mult), goal: 480000, unit: "money", color: "#34D399", byRep: [{ name: "HP", value: 62000 }, { name: "RW", value: 48000 }, { name: "HG", value: 44000 }, { name: "SH", value: 36000 }, { name: "NL", value: 32000 }, { name: "DM", value: 26000 }] },
        ],
        cadenceMetrics: {
          callsLogged: Math.round(4210 * mult), callsPerDay: Math.round(84 * mult), voicemails: Math.round(592 * mult), conversations: Math.round(308 * mult), positiveConversations: Math.round(78 * mult), callTrend: Array.from({ length: 8 }, () => Math.round(60 + Math.random() * 35)), callChangePct: 5,
          emailsSent: Math.round(9640 * mult), pctPersonalized: 42.1, pctOpened: 38.4, pctClicked: 4.8, pctReplied: 11.2, emailTrend: Array.from({ length: 8 }, () => Math.round(240 + Math.random() * 100)), emailChangePct: 6,
          totalTouches: Math.round(11280 * mult), totalMeetings: Math.round(228 * mult), meetingChangePct: 5, effectivenessScore: 4.1, effectivenessChangePct: 5,
          linkedinSteps: Math.round(2580 * mult), linkedinResearch: Math.round(1280 * mult), linkedinIntroductions: Math.round(668 * mult), linkedinConnections: Math.round(342 * mult), linkedinInMail: Math.round(290 * mult),
          otherStepsCompleted: Math.round(14200 * mult),
        },
        topCadences: [
          { name: "Enterprise B2B Outbound", opportunities: Math.round(244 * mult), meetings: Math.round(154 * mult), successes: Math.round(110 * mult), effectivenessScore: 7.6, oppChangePct: -14 },
          { name: "Mid-Market Expansion", opportunities: Math.round(192 * mult), meetings: Math.round(120 * mult), successes: Math.round(84 * mult), effectivenessScore: 6.2, oppChangePct: 4 },
          { name: "APAC Series A Push", opportunities: Math.round(148 * mult), meetings: Math.round(90 * mult), successes: Math.round(62 * mult), effectivenessScore: 5.1, oppChangePct: 10 },
          { name: "SMB Fast Close", opportunities: Math.round(108 * mult), meetings: Math.round(68 * mult), successes: Math.round(48 * mult), effectivenessScore: 4.5, oppChangePct: -8 },
          { name: "Dormant Win-Back", opportunities: Math.round(72 * mult), meetings: Math.round(46 * mult), successes: Math.round(32 * mult), effectivenessScore: 3.8, oppChangePct: 15 },
        ],
        topReps: [
          { name: "Sarah Mitchell", successes: 118, meetings: 82, opportunities: 56, totalActivity: 2460, emailsSent: 1060, callsLogged: 740, integrationSteps: 260 },
          { name: "James Park", successes: 104, meetings: 72, opportunities: 48, totalActivity: 2210, emailsSent: 940, callsLogged: 680, integrationSteps: 230 },
          { name: "Lisa Torres", successes: 92, meetings: 64, opportunities: 42, totalActivity: 1980, emailsSent: 820, callsLogged: 620, integrationSteps: 200 },
          { name: "Ryan Chen", successes: 80, meetings: 56, opportunities: 36, totalActivity: 1740, emailsSent: 700, callsLogged: 540, integrationSteps: 170 },
          { name: "Emma Walsh", successes: 68, meetings: 48, opportunities: 30, totalActivity: 1520, emailsSent: 600, callsLogged: 460, integrationSteps: 150 },
        ],
        dealFlow: {
          startPeriod: "Dec 1, 2025", endPeriod: "Dec 31, 2025",
          startTotal: Math.round(3200000 * mult), endTotal: Math.round(3680000 * mult), delta: Math.round(480000 * mult),
          sources: [
            { label: "Pipeline", value: Math.round(580000 * mult), color: "#6366F1" },
            { label: "Best Case", value: Math.round(860000 * mult), color: "#8B5CF6" },
            { label: "Commit", value: Math.round(1760000 * mult), color: "#A78BFA" },
            { label: "Pulled In", value: Math.round(660000 * mult), color: "#F59E0B" },
            { label: "New", value: Math.round(1080000 * mult), color: "#34D399" },
          ],
          destinations: [
            { label: "Won", value: Math.round(2760000 * mult), color: "#34D399" },
            { label: "Idle", value: Math.round(940000 * mult), color: "#64748B" },
            { label: "Pushed Out", value: Math.round(640000 * mult), color: "#F59E0B" },
            { label: "Lost", value: Math.round(600000 * mult), color: "#EF4444" },
          ],
          links: [
            { from: "Pipeline", to: "Won", value: Math.round(300000 * mult) },
            { from: "Pipeline", to: "Idle", value: Math.round(160000 * mult) },
            { from: "Pipeline", to: "Pushed Out", value: Math.round(120000 * mult) },
            { from: "Best Case", to: "Won", value: Math.round(580000 * mult) },
            { from: "Best Case", to: "Idle", value: Math.round(160000 * mult) },
            { from: "Best Case", to: "Lost", value: Math.round(120000 * mult) },
            { from: "Commit", to: "Won", value: Math.round(1380000 * mult) },
            { from: "Commit", to: "Idle", value: Math.round(280000 * mult) },
            { from: "Commit", to: "Lost", value: Math.round(100000 * mult) },
            { from: "Pulled In", to: "Won", value: Math.round(380000 * mult) },
            { from: "Pulled In", to: "Pushed Out", value: Math.round(280000 * mult) },
            { from: "New", to: "Won", value: Math.round(100000 * mult) },
            { from: "New", to: "Idle", value: Math.round(340000 * mult) },
            { from: "New", to: "Pushed Out", value: Math.round(240000 * mult) },
            { from: "New", to: "Lost", value: Math.round(380000 * mult) },
          ],
        },
      },
    },
    integrations: [
      { id: "crm", name: "Salesforce CRM", category: "crm", connected: true, lastSync: "4 min ago" },
      { id: "linkedin", name: "LinkedIn", category: "social", connected: true, lastSync: "8 min ago" },
      { id: "instagram", name: "Instagram", category: "social", connected: true, lastSync: "3 min ago" },
      { id: "facebook", name: "Facebook", category: "social", connected: true, lastSync: "6 min ago" },
      { id: "tiktok", name: "TikTok", category: "social", connected: true, lastSync: "10 min ago" },
      { id: "x-twitter", name: "X (Twitter)", category: "social", connected: false },
      { id: "reddit", name: "Reddit", category: "social", connected: false },
      { id: "google-search", name: "Google Search Console", category: "seo", connected: false },
      { id: "email-seq", name: "Email Sequencer", category: "outreach", connected: true, lastSync: "15 min ago" },
      { id: "website-intel", name: "Website Intelligence", category: "website-intel", connected: false },
      { id: "analytics", name: "Google Analytics", category: "analytics", connected: true, lastSync: "Real-time" },
      { id: "meta-ads", name: "Meta Ads", category: "paid-media", connected: true, lastSync: "20 min ago" },
      { id: "tiktok-ads", name: "TikTok Ads", category: "paid-media", connected: true, lastSync: "25 min ago" },
      { id: "google-ads", name: "Google Ads", category: "paid-media", connected: true, lastSync: "1 hour ago" },
      { id: "linkedin-ads", name: "LinkedIn Ads", category: "paid-media", connected: false },
      { id: "x-ads", name: "X Ads", category: "paid-media", connected: false },
      { id: "reddit-ads", name: "Reddit Ads", category: "paid-media", connected: false },
    ],
    paidMedia: {
      tldr: {
        summary: range === "7d"
          ? "Meta Ads and TikTok Ads drove strong top-of-funnel engagement this week, with Meta at 2.8× ROAS and TikTok at 2.1×. Google Ads is connected but underperforming at 1.1× ROAS — the search keyword strategy needs updating for the D2C audience."
          : range === "30d"
          ? "Paid media is performing well across Meta and TikTok, which are the best-fit channels for Meridian's D2C-adjacent audience. Combined ROAS this month is 2.3×. Google Ads is underdelivering relative to spend — consider reallocating to Meta where CPAs are 28% lower."
          : "Paid media delivered a 2.3× blended ROAS this quarter. Meta Ads consistently outperformed Google Ads for D2C brand acquisition. TikTok Ads drove 34% of total impression volume at a competitive CPA — a strong signal to increase budget in Q3.",
        actions: range === "7d" ? [
          { title: "Scale the top TikTok creative", description: "Your TikTok customer outcome video is at 2.2× ROAS this week — the platform's best performer. Boost budget by 25% to capture the momentum window.", priority: "high", cta: "Scale budget" },
          { title: "Review Google Ads keyword targeting", description: "Google Ads CPA is 2.1× higher than Meta this week. Your current keyword strategy targets generic D2C terms — switching to brand and competitor terms would improve efficiency.", priority: "high", cta: "Review keywords" },
          { title: "Connect X Ads for brand awareness testing", description: "X Ads offers low CPMs for D2C brand awareness. A small $500 test budget this week would establish a baseline for the channel.", priority: "medium", cta: "Connect" },
        ] : range === "30d" ? [
          { title: "Shift 20% of Google Ads budget to Meta", description: "Meta Ads CPA is 28% lower than Google this month. Reallocating budget would reduce blended CPA and increase total conversion volume without increasing spend.", priority: "high", cta: "Adjust budget" },
          { title: "Build a TikTok creative testing framework", description: "TikTok is performing well but using only 2 creative formats. A structured A/B test across 4 formats — outcomes, UGC, product demo, founder story — would identify the top performer.", priority: "medium", cta: "Plan tests" },
          { title: "Connect LinkedIn Ads for B2B side", description: "Meridian's B2B adjacent buyers are active on LinkedIn. Adding LinkedIn Ads with a $2k/month budget would test whether B2B targeting complements the D2C funnel.", priority: "medium", cta: "Connect" },
        ] : [
          { title: "Build a channel attribution model", description: "With 3 paid channels active for a full quarter, the data is sufficient for a multi-touch attribution model. Understanding which channel assists vs. converts would optimise next quarter's budget allocation.", priority: "high", cta: "Build model" },
          { title: "Develop a D2C creative library", description: "This quarter identified the top-performing creative formats: outcome stories on TikTok and social proof on Meta. Build a reusable creative library to reduce production cost per winning format.", priority: "medium", cta: "Build library" },
          { title: "Test Reddit Ads for community-led acquisition", description: "Reddit communities in your product category have high buyer intent. A $1k/quarter test on Reddit Ads would establish whether community-based paid acquisition is viable.", priority: "medium", cta: "Plan test" },
        ],
      },
      totalSpend: { value: Math.round(17200 * mult), change: 11, sparkline: spark(), prefix: "$" },
      totalRevenue: { value: Math.round(38722 * mult), change: 18, sparkline: spark(), prefix: "$" },
      roas: { value: 2.3, change: 6, sparkline: spark() },
      cac: { value: 680, change: -8, sparkline: spark(), prefix: "$" },
      campaigns: [
        { id: "c1", name: "D2C Brand — Meta Reels", platform: "Meta Ads", status: "active", spend: Math.round(5400 * mult), revenue: Math.round(15882 * mult), roas: 2.9, impressions: Math.round(380000 * mult), clicks: Math.round(7600 * mult), conversions: Math.round(92 * mult), cpa: 59, cpc: 0.71 },
        { id: "c2", name: "Outcome Stories — TikTok", platform: "TikTok Ads", status: "active", spend: Math.round(3800 * mult), revenue: Math.round(8529 * mult), roas: 2.2, impressions: Math.round(820000 * mult), clicks: Math.round(14760 * mult), conversions: Math.round(68 * mult), cpa: 56, cpc: 0.26 },
        { id: "c3", name: "Brand Keywords — Google", platform: "Google Ads", status: "active", spend: Math.round(2600 * mult), revenue: Math.round(2817 * mult), roas: 1.1, impressions: Math.round(62000 * mult), clicks: Math.round(3720 * mult), conversions: Math.round(28 * mult), cpa: 93, cpc: 0.70 },
        { id: "c4", name: "Lookalike — High LTV", platform: "Meta Ads", status: "active", spend: Math.round(3100 * mult), revenue: Math.round(7918 * mult), roas: 2.6, impressions: Math.round(210000 * mult), clicks: Math.round(4200 * mult), conversions: Math.round(48 * mult), cpa: 65, cpc: 0.74 },
        { id: "c5", name: "TikTok Product Demo", platform: "TikTok Ads", status: "paused", spend: Math.round(1400 * mult), revenue: Math.round(2601 * mult), roas: 1.9, impressions: Math.round(340000 * mult), clicks: Math.round(5100 * mult), conversions: Math.round(22 * mult), cpa: 64, cpc: 0.27 },
        { id: "c6", name: "Google Display — Retargeting", platform: "Google Ads", status: "active", spend: Math.round(900 * mult), revenue: Math.round(975 * mult), roas: 1.1, impressions: Math.round(480000 * mult), clicks: Math.round(1920 * mult), conversions: Math.round(12 * mult), cpa: 75, cpc: 0.47 },
      ],
      platformBreakdown: [
        { platform: "Meta Ads", spend: Math.round(8500 * mult), revenue: Math.round(23800 * mult), roas: 2.8, color: "#1877F2" },
        { platform: "TikTok Ads", spend: Math.round(5200 * mult), revenue: Math.round(11130 * mult), roas: 2.1, color: "#FF0050" },
        { platform: "Google Ads", spend: Math.round(3500 * mult), revenue: Math.round(3792 * mult), roas: 1.1, color: "#4285F4" },
        { platform: "LinkedIn Ads", spend: 0, revenue: 0, roas: 0, color: "#0A66C2" },
      ],
      spendTrend: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(2026, 1, 1 + i * 2).toISOString().split("T")[0],
        spend: Math.round((1200 + Math.sin(i * 0.5) * 280 + i * 50) * 0.7588 * mult),
        revenue: Math.round((4100 + Math.cos(i * 0.4) * 900 + i * 220) * 0.5002 * mult),
      })),
      bestCampaigns: [
        { name: "D2C Brand — Meta Reels", platform: "Meta Ads", revenue: Math.round(15882 * mult), conversions: Math.round(92 * mult), roas: 2.9 },
        { name: "Lookalike — High LTV", platform: "Meta Ads", revenue: Math.round(7918 * mult), conversions: Math.round(48 * mult), roas: 2.6 },
        { name: "Outcome Stories — TikTok", platform: "TikTok Ads", revenue: Math.round(8529 * mult), conversions: Math.round(68 * mult), roas: 2.2 },
      ],
      bestAds: [
        { name: "Customer Outcome — Reel 15s", platform: "Meta Ads", revenue: Math.round(12400 * mult), conversions: Math.round(56 * mult), ctr: 3.6 },
        { name: "Founder Story — TikTok UGC", platform: "TikTok Ads", revenue: Math.round(7800 * mult), conversions: Math.round(38 * mult), ctr: 2.9 },
        { name: "Social Proof Carousel", platform: "Meta Ads", revenue: Math.round(8100 * mult), conversions: Math.round(36 * mult), ctr: 3.1 },
      ],
    },
    narrativeIntel: {
      nri: { current: 3.4, target: 3, tier: "DWY", trend: "stable" },
      phaseMetrics: {
        phase1: {
          growthMetric: { name: "Market perception", value: "+12%", change: 12 },
          emotionalIndicator: { name: "Sentiment score", value: "61/100", change: 5 },
        },
        phase2: {
          growthMetric: { name: "Lead conversion", value: "+19%", change: 19 },
          emotionalIndicator: { name: "Engagement time", value: "3m 04s", change: 9 },
        },
        phase3: {
          growthMetric: { name: "Pipeline velocity", value: "21 days", change: -8 },
          emotionalIndicator: { name: "NPS", value: "+28", change: 7 },
        },
        phase4: {
          growthMetric: { name: "Deal size", value: "+14%", change: 14 },
          emotionalIndicator: { name: "Affinity index", value: "52/100", change: 4 },
        },
        phase5: {
          growthMetric: { name: "LTV:CAC", value: "3.4:1", change: 6 },
          emotionalIndicator: { name: "Advocacy rate", value: "21%", change: 3 },
        },
      },
    },
    pipelineBridge: {
      section: "Narrative Intel",
      attributed: Math.round(310000 * mult),
      deals: Math.round(18 * mult),
      velocity: 21,
    },
  };
}

export const meridianData: ClientDataByRange = {
  "7d": makeMeridian("7d"),
  "30d": makeMeridian("30d"),
  "90d": makeMeridian("90d"),
};
