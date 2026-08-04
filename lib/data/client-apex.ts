import type { ClientDataByRange, ClientData } from "./types";
import { makeApexBrand } from "./brand-builders";
import { createSparklineFactory, buildTrendSeries } from "./sparkline";

function makeApex(range: "7d" | "30d" | "90d"): ClientData {
  const mult = range === "7d" ? 0.23 : range === "30d" ? 1 : 3.1;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;

  const generateDates = (n: number) => {
    const end = new Date();
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(end);
      d.setDate(d.getDate() - (n - 1 - i) * (days / n));
      return d.toISOString().split("T")[0];
    });
  };

  const dates = generateDates(days > 30 ? 24 : days > 7 ? 12 : 7);
  const spark = createSparklineFactory(70, 15, 10);

  return {
    meta: {
      id: "apex",
      name: "Apex Systems",
      type: "Enterprise B2B",
      stage: "Enterprise",
      channels: ["linkedin", "email", "search"],
    },
    kpis: {
      cac: { value: 165000, change: range === "7d" ? -1 : range === "30d" ? -4 : -10, sparkline: spark(), prefix: "$" },
      pipeline: { value: Math.round(2100000 * mult), change: range === "7d" ? 4 : range === "30d" ? 9 : 17, sparkline: spark(), prefix: "$" },
      dealVelocity: { value: 52, change: range === "7d" ? -2 : range === "30d" ? -4 : -9, sparkline: spark(), suffix: "d" },
      dealsCreated: { value: Math.round(8 * mult), change: range === "7d" ? 5 : range === "30d" ? 14 : 26, sparkline: spark() },
      closedWon: { value: Math.round(7 * mult), change: range === "7d" ? 8 : range === "30d" ? 19 : 34, sparkline: spark() },
      attributedRevenue: { value: Math.round(540000 * mult), change: range === "7d" ? 8 : range === "30d" ? 22 : 38, sparkline: spark(), prefix: "$" },
      ltv: { value: 610000, change: range === "7d" ? 2 : range === "30d" ? 7 : 14, sparkline: spark(), prefix: "$" },
      avgDealSize: { value: 186000, change: range === "7d" ? 4 : range === "30d" ? 11 : 19, sparkline: spark(), prefix: "$" },
    },
    signalTimeline: dates.map((date, i) => ({
      date,
      linkedin: Math.round(78 + Math.sin(i * 0.5) * 14 + i * 0.4),
      website: Math.round(68 + Math.cos(i * 0.4) * 10 + i * 0.5),
      email: Math.round(82 + Math.sin(i * 0.7) * 8 + i * 0.3),
      search: Math.round(62 + Math.cos(i * 0.6) * 12 + i * 0.4),
      content: Math.round(45 + Math.sin(i * 0.3) * 6 + i * 0.2),
    })),
    aiNarrative: range === "7d"
      ? "This week, two executive LinkedIn posts from Apex reached above-benchmark enterprise engagement. A CISO sequence launched Monday has already generated 5 positive replies in 4 days — above the expected 7-day rate. Enterprise search volume for 'IT infrastructure narrative' is spiking. Act on the intent surge this week."
      : range === "30d"
      ? "Apex's LinkedIn thought leadership is generating the highest account engagement scores in the enterprise IT infrastructure category, with 78% of deal-influencing interactions traced to executive posts. Email sequences targeting CISOs have a 6.8% reply rate — 2.2× above industry benchmark. SEO is the fastest-growing pipeline channel with $96k attributed this month."
      : "Over the quarter, narrative-driven attributed revenue for Apex grew 22%, building on a ~$540k monthly baseline. LinkedIn executive posts have compounded into an authoritative brand signal in the CIO community. Email outreach is benefiting from this warm narrative foundation — CISO reply rates are consistently 2.2× benchmark. Search is emerging as a third significant pipeline source.",
    recommendedActions: range === "7d" ? [
      {
        priority: "high",
        icon: "Building2",
        title: "Capitalise on this week's exec LinkedIn momentum",
        description: "Two executive posts this week are outperforming — amplify via the company page and share into 3 enterprise LinkedIn groups where CIOs are active, while the posts are still gaining traction.",
        cta: "Amplify posts",
      },
      {
        priority: "high",
        icon: "Mail",
        title: "Fast-track the 5 early CISO sequence replies",
        description: "5 positive replies in 4 days is exceptional pacing. Get all 5 onto the calendar this week — enterprise reply windows close quickly when buying-committee attention shifts.",
        cta: "Book meetings",
      },
      {
        priority: "medium",
        icon: "Search",
        title: "Respond to this week's enterprise search spike",
        description: "Search volume for 'IT infrastructure narrative' is elevated this week. Publishing a short expert-angle post today would capture the intent surge before it passes.",
        cta: "Publish post",
      },
    ] : range === "30d" ? [
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
        description: "CISO-targeted sequences with infrastructure security framing have 6.8% reply rates. Expanding this approach to a broader CISO list of 180 accounts has significant pipeline potential.",
        cta: "Expand campaign",
      },
      {
        priority: "medium",
        icon: "Search",
        title: "Capture enterprise search intent surge",
        description: "Searches for 'enterprise IT infrastructure narrative' and 'CIO alignment strategy' are up 44% QoQ. A content cluster targeting these terms could capture 820 qualified monthly sessions.",
        cta: "View keyword map",
      },
    ] : [
      {
        priority: "high",
        icon: "Building2",
        title: "Scale the executive narrative program",
        description: "This quarter's data confirms: executive posts drive 78% of deal-influencing interactions. Formalising a 12-week rolling executive narrative program would systematise this into a reliable pipeline engine.",
        cta: "Design program",
      },
      {
        priority: "medium",
        icon: "Mail",
        title: "Expand CISO sequences to adjacent personas",
        description: "CISO outreach has proven its pipeline value. Apply the same infrastructure security narrative framework to CTO and VP Engineering personas — they share similar buying committee influence in enterprise IT deals.",
        cta: "Build personas",
      },
      {
        priority: "medium",
        icon: "Search",
        title: "Build a quarterly enterprise content strategy",
        description: "Search is emerging as a third major pipeline source. A quarterly enterprise content strategy anchored to this quarter's top-performing keywords would sustain the growth trajectory.",
        cta: "Plan strategy",
      },
    ],
    brand: makeApexBrand(mult),
    positioning: {
      tldr: {
        summary: range === "7d"
          ? "This week, EnterpriseLayer published a CIO-targeting LinkedIn series with strong early engagement. Monitor whether this shifts their narrative share-of-voice score before your executive posts go out Thursday — timing your response will maximise counter-narrative visibility."
          : range === "30d"
          ? "Apex Systems sits in a competitive Challenger position with strong enterprise credibility, but EnterpriseLayer holds the Leader slot with higher narrative scores. The gap is primarily in brand Impact — buyers recognise Apex but don't yet instinctively associate it as the definitive enterprise IT narrative platform. Closing this gap will directly improve win rates in competitive deals."
          : "Over the quarter, Apex's positioning score improved by 9 points while GovITConsult declined. Executive thought leadership is moving the needle — enterprise buyers increasingly cite Apex content during the buying process. The gap to EnterpriseLayer narrowed from 24 to 16 points, indicating the strategy is working.",
        actions: range === "7d" ? [
          { title: "Time your executive response to EnterpriseLayer", description: "EnterpriseLayer posted a CIO series this week. Scheduling your exec post for Thursday morning — peak CIO LinkedIn engagement window — will maximise counter-narrative visibility.", priority: "high", cta: "Schedule post" },
          { title: "Monitor share-of-voice daily this week", description: "Competitive content activity this week warrants daily monitoring of your top 5 brand keywords. Flag any position changes to adjust the following week's content plan.", priority: "high", cta: "Set up monitoring" },
          { title: "Refresh case study page with recent proof points", description: "Enterprise buyers evaluating this week are reading case studies. A quick update with recent customer outcomes strengthens your competitive positioning in active deals.", priority: "medium", cta: "Update page" },
        ] : range === "30d" ? [
          { title: "Close the gap on EnterpriseLayer", description: "EnterpriseLayer leads on narrative score but lags on Trust. Publish a thought leadership series on enterprise IT security narrative to erode their advantage.", priority: "high", cta: "Plan series" },
          { title: "Increase executive visibility", description: "Enterprise buyers want to buy from recognised experts. Increase exec LinkedIn presence to 4 posts per week.", priority: "high", cta: "Build exec calendar" },
          { title: "Obtain third-party validation", description: "Commission or solicit a Gartner Market Guide placement — your Trust scores justify the investment and it will accelerate competitive wins.", priority: "medium", cta: "Initiate outreach" },
        ] : [
          { title: "Accelerate the move toward Leader quadrant", description: "At current trajectory, Apex could enter the Leaders quadrant within two quarters. An increased executive content cadence and analyst engagement program would accelerate this timeline.", priority: "high", cta: "Build acceleration plan" },
          { title: "Commission a Gartner Market Guide placement", description: "Your narrative strength (68) and market presence (74) now justify a formal analyst engagement. A Gartner Market Guide inclusion would significantly close the gap to EnterpriseLayer.", priority: "medium", cta: "Initiate outreach" },
          { title: "Document positioning progress for exec team", description: "A 9-point positioning score improvement in one quarter is significant. Present this to the exec team as evidence of the narrative investment ROI to secure next quarter's budget.", priority: "medium", cta: "Prepare report" },
        ],
      },
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
      tldr: {
        summary: range === "7d"
          ? "This week, Apex was cited in 3 new AI engine responses for CIO-level infrastructure queries. GEO visibility is at 61.4% — monitor for any shifts following EnterpriseLayer's new content this week, which targets overlapping queries."
          : range === "30d"
          ? "Search intelligence is Apex's fastest-growing pipeline channel. GEO visibility at 61.4% means AI engines are increasingly citing Apex as the authoritative source for enterprise IT infrastructure and CIO-level queries. Organic search is attributing $96k in pipeline this month."
          : "Search has been the fastest-growing pipeline channel for Apex this quarter, growing from $180k to $290k in attributed pipeline. GEO visibility grew 5.2 points QoQ, and Apex now dominates AI engine citations for enterprise IT infrastructure queries. This channel is set to surpass email in pipeline contribution next quarter.",
        actions: range === "7d" ? [
          { title: "Protect GEO citation position this week", description: "EnterpriseLayer's new content targets overlapping AI engine queries. Submit updated Q&A responses to Perplexity and ChatGPT this week to protect your citation position.", priority: "high", cta: "Submit responses" },
          { title: "Optimise the top featured snippet opportunity", description: "Your highest-traffic page is position 4 for a featured snippet that sends 340 monthly visits to a competitor. A concise definition section addition could capture it this week.", priority: "high", cta: "Update page" },
          { title: "Check analyst citation backlinks this week", description: "Three Gartner and Forrester mentions from last month should have generated backlinks. Verify they are indexed and contributing to domain authority.", priority: "medium", cta: "Check backlinks" },
        ] : range === "30d" ? [
          { title: "Expand GEO content for CIO queries", description: "AI engines already cite Apex for infrastructure queries. Build structured Q&A content for the top 20 CIO buying-committee questions.", priority: "high", cta: "Develop content" },
          { title: "Target Gartner and Forrester citation keywords", description: "Analyst-cited content is your top citation multiplier. Create content that references and builds on recent analyst reports.", priority: "high", cta: "Plan content" },
          { title: "Optimise for featured snippets", description: "12 ranking pages are in position 4–7 with featured snippet opportunities. Add concise definition sections to capture them.", priority: "medium", cta: "Optimise pages" },
        ] : [
          { title: "Build a GEO dominance strategy", description: "At 61.4% GEO visibility, Apex is already the category leader in AI engine citations. A structured quarterly GEO content program would extend this lead and make it defensible.", priority: "high", cta: "Build strategy" },
          { title: "Commission analyst content to compound citations", description: "Analyst-cited content generates 3× the citation velocity of brand-authored content. Commission or co-author content with Gartner or Forrester for next quarter.", priority: "medium", cta: "Initiate discussions" },
          { title: "Prepare a search-to-pipeline attribution report", description: "Search is on track to surpass email as a pipeline channel. A detailed attribution report presented to the exec team would justify scaling the search investment next quarter.", priority: "medium", cta: "Build report" },
        ],
      },
      geo: {
        visibilityScore: 61.4,
        visibilityChange: 5.2,
        shareOfVoice: 44,
        shareOfVoiceChange: 6,
        aiInsight: "Apex dominates GEO for enterprise IT infrastructure and CIO-level queries. ChatGPT and Microsoft Copilot are your highest-performing platforms — align more content with enterprise buying committee questions to extend this lead. Analyst citations (Gartner, Forrester) are your top citation multipliers.",
        allBotVisits: { value: Math.round(58400 * mult), change: 72, sparkline: spark() },
        aiCitations: { value: Math.round(142000 * mult), change: 34, sparkline: spark() },
        aiTraining: { value: Math.round(28600 * mult), change: 4, sparkline: spark() },
        aiIndexing: { value: Math.round(36400 * mult), change: 3, sparkline: spark() },
        visibilityTrend: Array.from({ length: 14 }, (_, i) => ({
          date: new Date(2026, 3, 11 + i).toISOString().split("T")[0],
          client: Math.round(52 + Math.sin(i * 0.7) * 10 + i * 0.7),
          prev: Math.round(46 + Math.cos(i * 0.5) * 7 + i * 0.4),
        })),
        competitors: [
          { name: "Apex Systems",        isClient: true, visibilityScore: 61.4, change: 5.2, trend: [54, 56, 57, 58.5, 59.5, 60.5, 61.4] },
          { name: "EnterpriseNarrative", isClient: false, visibilityScore: 55.8, change: -1.2, trend: [58, 57.5, 57, 56.5, 56, 56, 55.8] },
          { name: "Pinnacle GTM",        isClient: false, visibilityScore: 48.2, change: 3.1, trend: [43, 44, 45, 46, 47, 47.8, 48.2] },
          { name: "CoreSignal",          isClient: false, visibilityScore: 31.6, change: -0.8, trend: [33, 32.5, 32, 31.8, 31.7, 31.6, 31.6] },
        ],
        platforms: [
          { platform: "ChatGPT",    visibilityPct: 68, change: 8,  color: "#34D399" },
          { platform: "Copilot",    visibilityPct: 62, change: 6,  color: "#A78BFA" },
          { platform: "Gemini",     visibilityPct: 54, change: 3,  color: "#FBBF24" },
          { platform: "Perplexity", visibilityPct: 48, change: 4,  color: "#0EA5E9" },
          { platform: "Anthropic",  visibilityPct: 41, change: 9,  color: "#FF6B4A" },
          { platform: "Grok",       visibilityPct: 28, change: 2,  color: "#F0F0FF" },
        ],
        citationDomains: [
          { domain: "apexsystems.com",  citations: 284, change: 38, category: "Own Site" },
          { domain: "gartner.com",       citations: 198, change: 24, category: "Analyst" },
          { domain: "forrester.com",     citations: 142, change: 18, category: "Analyst" },
          { domain: "linkedin.com",      citations: 116, change: 15, category: "Social" },
          { domain: "computerworld.com", citations: 84,  change: 9,  category: "Media" },
          { domain: "techrepublic.com",  citations: 62,  change: 6,  category: "Media" },
          { domain: "g2.com",            citations: 48,  change: 5,  category: "Review" },
          { domain: "reddit.com",        citations: 32,  change: -3, category: "Community" },
        ],
      },
      healthScore: 97,
      domainRating: 81,
      organicKeywordsTotal: { value: Math.round(48600 * mult), change: 9, sparkline: spark() },
      backlinks: { value: Math.round(4800 * mult), change: 35, sparkline: spark() },
      referringDomains: { value: Math.round(892 * mult), change: 128, sparkline: spark() },
      trafficValue: { value: Math.round(683000 * mult), change: 28, sparkline: spark(), prefix: "$" },
      organicSessions: buildTrendSeries(dates, 5400, 7, range),
      referringDomainsTrend: buildTrendSeries(dates, 680, 8, range),
      keywordBuckets: [
        { bucket: "1-3", label: "#1–3", count: Math.round(118 * mult), change: 10 },
        { bucket: "4-10", label: "#4–10", count: Math.round(205 * mult), change: -10 },
        { bucket: "11-50", label: "#11–50", count: Math.round(643 * mult), change: 112 },
        { bucket: "51-100", label: "#51–100", count: Math.round(174 * mult), change: 47 },
      ],
      countryBreakdown: [
        { code: "US", name: "United States", flag: "🇺🇸", traffic: Math.round(84100 * mult), trafficChange: -12200, lat: 38, lon: -97 },
        { code: "IN", name: "India",          flag: "🇮🇳", traffic: Math.round(25300 * mult), trafficChange: -3100,  lat: 20, lon: 77 },
        { code: "RU", name: "Russia",         flag: "🇷🇺", traffic: Math.round(17800 * mult), trafficChange: -1300,  lat: 60, lon: 90 },
        { code: "DE", name: "Germany",        flag: "🇩🇪", traffic: Math.round(17100 * mult), trafficChange: -1200,  lat: 51, lon: 10 },
        { code: "CA", name: "Canada",         flag: "🇨🇦", traffic: Math.round(11900 * mult), trafficChange: -1500,  lat: 56, lon: -106 },
        { code: "GB", name: "United Kingdom", flag: "🇬🇧", traffic: Math.round(9400 * mult),  trafficChange: 820,    lat: 51, lon: -1 },
        { code: "JP", name: "Japan",          flag: "🇯🇵", traffic: Math.round(6200 * mult),  trafficChange: 540,    lat: 36, lon: 138 },
      ],
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
      pipelineFromOrganic: { value: Math.round(290000 * mult), change: range === "7d" ? 14 : range === "30d" ? 38 : 62, sparkline: spark(), prefix: "$" },
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
      geoPipelineKPI: { value: Math.round(158000 * mult), change: range === "7d" ? 150 : range === "30d" ? 420 : 720, sparkline: spark(), prefix: "$" },
    },
    website: {
      tldr: {
        summary: range === "7d"
          ? "This week, 4 enterprise accounts with $500k+ deal potential visited pricing and case study pages. Three are repeat visitors. At $186k average deal size, each is a high-priority outreach target — route to AEs today before their buying-committee evaluation window closes."
          : range === "30d"
          ? "Website signals for Apex are extremely high-quality — visitors are primarily enterprise decision-makers (CIOs, CISOs, and VPs of IT) with long session times and deep page engagement. The 280 identified companies represents a rich outreach list: ABM on these visitors is one of the highest-ROI plays given Apex's $186k average deal size."
          : "Over the quarter, 868 unique enterprise companies visited intent-heavy pages — 28% more than Q3. The ABM workflow triggered by hot account signals generated 68 opportunities this quarter. Website intent data has proven to be Apex's most reliable account identification signal for enterprise sales.",
        actions: range === "7d" ? [
          { title: "Route this week's hot enterprise accounts to AEs now", description: "4 enterprise accounts visited pricing 2+ times this week. At Apex's $186k average deal size, each represents a major opportunity — assign to AEs with intent context within 24 hours.", priority: "high", cta: "Route accounts" },
          { title: "Review this week's session recordings for deal risks", description: "2 session recordings this week from active opportunities show friction at the technical specifications page. Watch and share insights with the AE handling each account.", priority: "high", cta: "Review recordings" },
          { title: "Check for JS errors in this week's sessions", description: "JS error rate in enterprise sessions is flagged this week. Identifying and fixing the specific error before more enterprise visitors arrive protects deal quality.", priority: "medium", cta: "Check errors" },
        ] : range === "30d" ? [
          { title: "Build ABM sequences for hot accounts", description: "38 enterprise accounts scored 'Hot' with no open opportunity. Assign them to AEs immediately for personalised ABM outreach.", priority: "high", cta: "Build ABM play" },
          { title: "Add enterprise-specific CTAs", description: "Current CTAs are generic. Add 'Book an Enterprise Assessment' CTA on pricing and case study pages — enterprise buyers respond better to consultative offers.", priority: "high", cta: "Update CTAs" },
          { title: "Reduce JS errors on product pages", description: "JS errors affect 8.4% of enterprise visits — for a buyer evaluating a technical platform, a broken experience can kill deals.", priority: "high", cta: "Fix errors" },
        ] : [
          { title: "Scale the hot-account ABM workflow", description: "68 opportunities this quarter came from the hot-account ABM workflow. Automating the AE assignment and first-touch sequence would scale this without adding SDR capacity.", priority: "high", cta: "Automate workflow" },
          { title: "Build an enterprise buyer journey map", description: "90 days of session data reveals the typical enterprise buying journey on the website. Map this journey and optimise each stage's content and CTA to reduce friction.", priority: "medium", cta: "Build journey map" },
          { title: "Invest in enterprise CRO testing", description: "With 280 monthly enterprise company identifications, even a 5% improvement in demo request rate would add 14 qualified opportunities per month at current visit volume.", priority: "medium", cta: "Plan CRO tests" },
        ],
      },
      visitors: { value: Math.round(12800 * mult), change: 16, sparkline: spark() },
      sessions: { value: Math.round(17200 * mult), change: 21, sparkline: spark() },
      companiesIdentified: { value: Math.round(280 * mult), change: 28, sparkline: spark() },
      avgTimeOnSite: { value: 5.8, change: 12, sparkline: spark(), suffix: "m" },
      returning: { value: Math.round(4200 * mult), change: 22, sparkline: spark() },
      hotAccounts: { value: Math.round(22 * mult), change: 52, sparkline: spark() },
      rageclickRate: { value: 9.4, change: -4, sparkline: spark() },
      deadclickRate: { value: 5.8, change: -6, sparkline: spark() },
      scrollDepth: { value: 71, change: 7, sparkline: spark() },
      jsErrors: { value: Math.round(88 * mult), change: -18, sparkline: spark() },
      quickBackRate: { value: 3.2, change: -2, sparkline: spark() },
      readingBehavior: [
        { label: "Casual", pct: 67.4, sessions: Math.round(858 * mult), color: "#7C7FFF" },
        { label: "Serious", pct: 22.8, sessions: Math.round(290 * mult), color: "#FBBF24" },
        { label: "Reader", pct: 9.8, sessions: Math.round(125 * mult), color: "#34D399" },
      ],
      visitorTrend: dates.map((date, i) => ({ date, value: Math.round(400 + i * 7 + Math.sin(i * 0.5) * 50) })),
      trafficSources: [
        { name: "Organic", value: 44 },
        { name: "LinkedIn", value: 32 },
        { name: "Direct", value: 14 },
        { name: "Referral", value: 6 },
        { name: "Email", value: 4 },
      ],
      visitorCountries: [
        { code: "US", name: "United States", flag: "🇺🇸", traffic: Math.round(6200 * mult), trafficChange: 18, lat: 37.09, lon: -95.71 },
        { code: "GB", name: "United Kingdom", flag: "🇬🇧", traffic: Math.round(2400 * mult), trafficChange: 12, lat: 55.38, lon: -3.44 },
        { code: "DE", name: "Germany", flag: "🇩🇪", traffic: Math.round(1600 * mult), trafficChange: 8, lat: 51.17, lon: 10.45 },
        { code: "FR", name: "France", flag: "🇫🇷", traffic: Math.round(980 * mult), trafficChange: 5, lat: 46.23, lon: 2.21 },
        { code: "SG", name: "Singapore", flag: "🇸🇬", traffic: Math.round(720 * mult), trafficChange: 34, lat: 1.35, lon: 103.82 },
        { code: "CA", name: "Canada", flag: "🇨🇦", traffic: Math.round(580 * mult), trafficChange: 4, lat: 56.13, lon: -106.35 },
        { code: "AU", name: "Australia", flag: "🇦🇺", traffic: Math.round(420 * mult), trafficChange: 11, lat: -25.27, lon: 133.78 },
      ],
      topPages: [
        { url: "/enterprise", sessions: Math.round(5200 * mult), scrollDepth: 78, exitRate: 22 },
        { url: "/security", sessions: Math.round(3800 * mult), scrollDepth: 82, exitRate: 18 },
        { url: "/pricing", sessions: Math.round(3200 * mult), scrollDepth: 89, exitRate: 26 },
        { url: "/roi-calculator", sessions: Math.round(2400 * mult), scrollDepth: 74, exitRate: 12 },
        { url: "/case-studies", sessions: Math.round(1900 * mult), scrollDepth: 94, exitRate: 8 },
        { url: "/integrations", sessions: Math.round(1400 * mult), scrollDepth: 61, exitRate: 34 },
      ],
      funnelSteps: [
        { label: "Homepage", sessions: Math.round(12800 * mult), dropoffPct: 0 },
        { label: "Enterprise / Product", sessions: Math.round(7400 * mult), dropoffPct: 42 },
        { label: "Pricing", sessions: Math.round(3200 * mult), dropoffPct: 57 },
        { label: "Demo Request", sessions: Math.round(1100 * mult), dropoffPct: 66 },
        { label: "Confirmed", sessions: Math.round(420 * mult), dropoffPct: 62 },
      ],
      sessionRecordings: [
        { id: "sr1", page: "/pricing", duration: "9m 42s", flags: [], country: "🇺🇸 US", device: "desktop" },
        { id: "sr2", page: "/security", duration: "7m 18s", flags: ["dead-click"], country: "🇬🇧 UK", device: "desktop" },
        { id: "sr3", page: "/enterprise", duration: "1m 12s", flags: ["quick-back"], country: "🇩🇪 DE", device: "mobile" },
        { id: "sr4", page: "/roi-calculator", duration: "11m 06s", flags: [], country: "🇸🇬 SG", device: "desktop" },
        { id: "sr5", page: "/case-studies", duration: "0m 48s", flags: ["rage-click", "js-error"], country: "🇫🇷 FR", device: "tablet" },
        { id: "sr6", page: "/integrations", duration: "4m 32s", flags: [], country: "🇦🇺 AU", device: "desktop" },
      ],
      intentHeatmap: (() => {
        const hDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
        return hDays.flatMap((day) =>
          hours.map((hour) => ({
            day,
            hour,
            value: Math.round(25 + (["Tue", "Wed", "Thu", "Fri"].includes(day) ? 35 : 0) + (["10am", "11am", "2pm", "4pm"].includes(hour) ? 28 : 0) + Math.random() * 22),
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
      tldr: {
        summary: range === "7d"
          ? "This week, two executive LinkedIn posts reached the highest engagement scores of the month. The Tuesday newsletter had a 38% open rate — above the monthly average. Maintain this week's executive content rhythm and ensure the newsletter goes out Thursday on schedule."
          : range === "30d"
          ? "Content marketing is Apex's strongest brand-building channel. LinkedIn thought leadership from executives generates the highest account engagement scores in the enterprise IT category, with 78% of deal-influencing interactions traced to executive posts. The enterprise intelligence newsletter has a 36% open rate from a high-value audience."
          : "Content has been Apex's highest-ROI channel this quarter, generating $480k in LinkedIn-attributed pipeline and $280k from the newsletter. Executive thought leadership has become a recognised signal in the enterprise IT community — buyer-side references to Apex content in deal conversations increased 34% this quarter.",
        actions: range === "7d" ? [
          { title: "Publish the planned CIO framework post this week", description: "This week's scheduled CIO-framework post is the highest-potential content on the calendar. Ensure it goes live Thursday at 8am EST for peak enterprise LinkedIn engagement.", priority: "high", cta: "Publish post" },
          { title: "Follow up with newsletter openers from Tuesday", description: "38% of Tuesday's newsletter readers opened — 12 are active opportunities. A personalised one-line follow-up from the AE today would be contextually relevant.", priority: "high", cta: "Send follow-ups" },
          { title: "Repurpose Tuesday's top post for the newsletter", description: "Tuesday's LinkedIn post reached above-benchmark engagement. Include the key insight in Thursday's newsletter to give subscribers the same signal as LinkedIn followers.", priority: "medium", cta: "Include in newsletter" },
        ] : range === "30d" ? [
          { title: "Increase executive post frequency", description: "Executive thought leadership posts outperform all other content 4:1 on pipeline influence. Go from 2 to 5 executive posts per week.", priority: "high", cta: "Update strategy" },
          { title: "Build content for buying committee", description: "Enterprise deals involve 6+ stakeholders. Create content specifically for CFO, CISO, and CTO personas in addition to the CIO.", priority: "high", cta: "Plan content" },
          { title: "Promote newsletter to enterprise prospects", description: "Add newsletter subscription CTA to all outreach sequences — subscribers have a 34% demo conversion rate.", priority: "medium", cta: "Update sequences" },
        ] : [
          { title: "Formalise the executive content program", description: "This quarter's data confirms executive posts are Apex's highest-ROI content investment. Formalise a 12-week rolling executive narrative program to sustain and scale the output.", priority: "high", cta: "Design program" },
          { title: "Develop a buying committee content library", description: "Build a content library with dedicated pieces for each enterprise buying-committee persona: CIO, CISO, CFO, and CTO. This would reduce sales cycle friction by providing AEs with persona-specific proof points.", priority: "medium", cta: "Plan library" },
          { title: "Launch a newsletter referral program", description: "With 36% open rates and 34% demo conversion from subscribers, growing the newsletter list is one of the highest-leverage actions for next quarter. A subscriber referral program could double list size in 60 days.", priority: "medium", cta: "Design program" },
        ],
      },
      socialOverview: [
        { channel: "LinkedIn", posts: Math.round(8 * mult), reach: Math.round(62000 * mult), engagementRate: 5.4, pipeline: Math.round(480000 * mult) },
        { channel: "Email", posts: Math.round(3 * mult), reach: Math.round(4800 * mult), engagementRate: 34, pipeline: Math.round(280000 * mult) },
      ],
      topPosts: [
        { date: "2026-02-18", channel: "linkedin", title: "Why enterprise CIOs are rewriting their vendor narrative", reach: 18400, engagementRate: 7.2, pipeline: 280000, content: "The CIOs buying in 2026 aren't looking for features. They're looking for alignment with their strategic narrative. Here's what that means for vendor GTM..." },
        { date: "2026-02-11", channel: "linkedin", title: "The CISO deal influencer pattern — data from 40 enterprise deals", reach: 14200, engagementRate: 6.8, pipeline: 210000, content: "We analyzed 40 enterprise deals. CISO involvement correlated with 68% higher deal values and 22% faster velocity. The narrative strategy behind this..." },
        { date: "2026-02-04", channel: "linkedin", title: "Enterprise narrative intelligence: the 2026 benchmark", reach: 11800, engagementRate: 5.9, pipeline: 180000, content: "Our Q1 2026 benchmark data on enterprise narrative strength across 200 companies in IT infrastructure. The gap between leaders and laggards is widening..." },
      ],
      platformStats: [
        { platform: "LinkedIn", color: "#0A66C2", followers: Math.round(22400 * mult), followersChange: 14, reach: Math.round(62000 * mult), engagementRate: 5.4, posts: Math.round(8 * mult) },
        { platform: "X / Twitter", color: "#FFFFFF", followers: Math.round(8400 * mult), followersChange: 8, reach: Math.round(24000 * mult), engagementRate: 2.8, posts: Math.round(18 * mult) },
        { platform: "YouTube", color: "#FF0000", followers: Math.round(4200 * mult), followersChange: 22, reach: Math.round(18000 * mult), engagementRate: 6.8, posts: Math.round(4 * mult), reelsWatchTime: 42 },
        { platform: "Newsletter", color: "#34D399", followers: Math.round(4800 * mult), followersChange: 11, reach: Math.round(4800 * mult), engagementRate: 42, posts: Math.round(3 * mult) },
      ],
      audienceGrowthStacked: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(2026, i - 10 + 2, 1).toISOString().split("T")[0].slice(0, 7),
        linkedin: Math.round(18200 + i * 350 + Math.sin(i * 0.4) * 120),
        instagram: Math.round(0),
        facebook: Math.round(2800 + i * 40),
        x: Math.round(7200 + i * 100 + Math.cos(i * 0.4) * 60),
      })),
      sentiment: {
        positive: 68, neutral: 22, negative: 10,
        volume: Math.round(3480 * mult), volumeChange: 12,
        themes: [
          { theme: "Enterprise security narrative", count: 820, sentiment: "positive" },
          { theme: "CIO/CISO alignment", count: 620, sentiment: "positive" },
          { theme: "Infrastructure thought leadership", count: 480, sentiment: "positive" },
          { theme: "Integration complexity", count: 124, sentiment: "negative" },
          { theme: "Implementation timeline", count: 96, sentiment: "neutral" },
        ],
      },
      linkedinKPIs: {
        followers:    { value: Math.round(22400 * mult), change: 14.2, sparkline: spark() },
        impressions:  { value: Math.round(6840000 * mult), change: 28.4, sparkline: spark() },
        engagements:  { value: Math.round(48200 * mult), change: 22.6, sparkline: spark() },
        posts:        { value: Math.round(8 * mult), change: 14.3, sparkline: spark() },
        comments:     { value: Math.round(4820 * mult), change: 18.4, sparkline: spark() },
        likes:        { value: Math.round(38400 * mult), change: 24.8, sparkline: spark() },
        shares:       { value: Math.round(580 * mult), change: 32.6, sparkline: spark() },
        profileViews: { value: Math.round(184000 * mult), change: 46.2, sparkline: spark() },
      },
      linkedinPosts: [
        { id: "lp1", date: "2026-02-18", content: "The CIOs buying in 2026 aren't looking for features. They're looking for alignment with their strategic narrative. Here's what that means for vendor GTM and why most IT vendors are losing deals they should be winning...", impressions: 18400, engagementRate: 7.2, likes: 824, comments: 128, pipeline: 280000, isViral: true },
        { id: "lp2", date: "2026-02-11", content: "We analyzed 40 enterprise deals. CISO involvement correlated with 68% higher deal values and 22% faster velocity. The narrative strategy behind why the CISOs champion some vendors and block others...", impressions: 14200, engagementRate: 6.8, likes: 642, comments: 96, pipeline: 210000, isViral: true },
        { id: "lp3", date: "2026-02-04", content: "Our Q1 2026 benchmark data on enterprise narrative strength across 200 companies in IT infrastructure. The gap between narrative leaders and laggards is widening. Thread on the full findings...", impressions: 11800, engagementRate: 5.9, likes: 488, comments: 72, pipeline: 180000, isViral: false },
        { id: "lp4", date: "2026-01-28", content: "Enterprise vendor selection isn't about features anymore. It's about story alignment. When the vendor's narrative matches the CIO's board presentation, deals close in half the time...", impressions: 8400, engagementRate: 5.2, likes: 348, comments: 52, pipeline: 140000, isViral: false },
      ],
      linkedinFollowerGrowth: dates.map((date, i) => ({ date, value: Math.round(8200 + i * 42 + Math.sin(i * 0.5) * 60) })),
      contentCalendar: (() => {
        const posts: import("./types").CalendarPost[] = [];
        for (let d = 1; d <= 28; d++) {
          if (d % 4 === 0) posts.push({ date: `2026-02-${String(d).padStart(2, "0")}`, channel: "linkedin", title: `Executive Insight Day ${d}`, reach: Math.round(8000 + Math.random() * 14000), engagementRate: 4 + Math.random() * 4, pipeline: Math.round(80000 + Math.random() * 200000), content: "Enterprise-grade thought leadership on CIO/CISO narrative alignment and vendor strategy..." });
          if (d % 10 === 0) posts.push({ date: `2026-02-${String(d).padStart(2, "0")}`, channel: "newsletter", title: `Enterprise Intelligence Brief #${Math.ceil(d / 10)}`, reach: Math.round(4600 + Math.random() * 400), engagementRate: 36 + Math.random() * 8, pipeline: Math.round(60000 + Math.random() * 100000), content: "This month: enterprise IT narrative trends and CIO decision-making patterns for 2026..." });
        }
        return posts;
      })(),
      blogPosts: [
        { title: "Why Enterprise IT Vendors Lose Deals They Should Win", url: "/blog/enterprise-vendor-narrative", pageviews: Math.round(12400 * mult), avgAttentionTime: "6m 48s", engagementRate: 88, pipeline: Math.round(480000 * mult), published: "2026-02-14" },
        { title: "CIO Decision Framework: Narrative Alignment Checklist for 2026", url: "/blog/cio-decision-framework", pageviews: Math.round(9800 * mult), avgAttentionTime: "7m 22s", engagementRate: 91, pipeline: Math.round(380000 * mult), published: "2026-02-07" },
        { title: "The CISO Influence Factor: 40-Deal Analysis", url: "/blog/ciso-influence-enterprise-deals", pageviews: Math.round(8200 * mult), avgAttentionTime: "8m 14s", engagementRate: 94, pipeline: Math.round(320000 * mult), published: "2026-01-31" },
        { title: "Enterprise IT Narrative Intelligence: Q1 2026 Benchmark", url: "/blog/enterprise-narrative-benchmark-q1", pageviews: Math.round(7400 * mult), avgAttentionTime: "5m 54s", engagementRate: 86, pipeline: Math.round(240000 * mult), published: "2026-01-24" },
        { title: "Security Narrative ROI: Quantifying the CISO Advantage", url: "/blog/security-narrative-roi", pageviews: Math.round(5800 * mult), avgAttentionTime: "4m 42s", engagementRate: 78, pipeline: Math.round(180000 * mult), published: "2026-01-17" },
      ],
      blogExperiments: [
        {
          id: "exp1", name: "Enterprise landing page: Feature-list vs. CIO narrative",
          status: "won", daysRunning: range === "7d" ? 14 : range === "30d" ? 68 : 192,
          visitors: Math.round(42800 * mult),
          baseline: { label: "Feature List", conversions: Math.round(482 * mult), visitors: Math.round(21200 * mult), conversionRate: 2.27 },
          variation: { label: "CIO Narrative", conversions: Math.round(728 * mult), visitors: Math.round(21600 * mult), conversionRate: 3.37, improvement: 48.4 },
          significance: range === "7d" ? 78 : range === "30d" ? 99 : 99,
          significanceCurve: [0,4,9,15,22,30,38,47,56,64,72,79,84,88,92,94,96,97,98,99,99,99,99,99,99].map((v, i) => ({ day: i * 3, value: v })),
        },
        {
          id: "exp2", name: "Whitepaper CTA: 'Download Report' vs. 'Get the Benchmark'",
          status: "running", daysRunning: range === "7d" ? 7 : range === "30d" ? 31 : 88,
          visitors: Math.round(14200 * mult),
          baseline: { label: "Download Report", conversions: Math.round(224 * mult), visitors: Math.round(7080 * mult), conversionRate: 3.16 },
          variation: { label: "Get the Benchmark", conversions: Math.round(256 * mult), visitors: Math.round(7120 * mult), conversionRate: 3.60, improvement: 13.8 },
          significance: range === "7d" ? 41 : range === "30d" ? 74 : 89,
          significanceCurve: [0,2,5,9,13,18,23,28,34,40,46,52,58,63,68,72,76,79,81,83,84,85,86].map((v, i) => ({ day: i * 1.5, value: v })),
        },
      ],
      blogPageviewsTrend: buildTrendSeries(dates, 5200, 9, range),
      activeSubscribers: { value: Math.round(4800 * mult), change: 14, sparkline: spark() },
      openRate: { value: 42, change: 2, sparkline: spark() },
      clickRate: { value: 10.4, change: 0.8, sparkline: spark() },
      newsletters: [
        { id: "n1", subject: "CIO Narrative Alignment Report: Q1 2026 Enterprise Benchmarks", sent: 4800, openRate: 38, clickRate: 10.4, unsubscribes: 8, pipeline: 320000, date: "2026-02-11" },
        { id: "n2", subject: "The CISO Influence Factor: How security narrative drives enterprise deals", sent: 4750, openRate: 42, clickRate: 8.8, unsubscribes: 6, pipeline: 248000, date: "2026-02-04" },
        { id: "n3", subject: "Enterprise GTM Intelligence: Signal patterns from 40 closed deals", sent: 4700, openRate: 46, clickRate: 13.2, unsubscribes: 4, pipeline: 420000, date: "2026-01-28" },
      ],
      subscriberGrowth: dates.map((date, i) => ({ date, value: Math.round(4400 + i * 18 + Math.sin(i * 0.3) * 25) })),
      openRateTrend: dates.map((date, i) => ({ date, value: Math.round(38 + Math.cos(i * 0.6) * 4 + i * 0.08) })),
      acquisitionSources: [
        { source: "LinkedIn organic", subscribers: Math.round(2240 * mult), pct: 47, openRate: 72, unsubscribeRate: 0.6 },
        { source: "website: direct / none", subscribers: Math.round(1104 * mult), pct: 23, openRate: 68, unsubscribeRate: 0.8 },
        { source: "website: google.com / organic", subscribers: Math.round(624 * mult), pct: 13, openRate: 74, unsubscribeRate: 0.7 },
        { source: "Event / Webinar", subscribers: Math.round(432 * mult), pct: 9, openRate: 84, unsubscribeRate: 0.3 },
        { source: "Partner referral", subscribers: Math.round(288 * mult), pct: 6, openRate: 78, unsubscribeRate: 0.5 },
        { source: "X / Twitter", subscribers: Math.round(112 * mult), pct: 2, openRate: 38, unsubscribeRate: 4.2 },
      ],
    },
    outreach: {
      tldr: {
        summary: range === "7d"
          ? "This week, the CISO sequence launched Monday already has 5 positive replies in 4 days — the fastest-pacing enterprise sequence this quarter. Three AEs have follow-ups pending. Get all 5 onto the calendar before end of week while the buying-committee attention window is open."
          : range === "30d"
          ? "Cold outreach for Apex is performing well above enterprise benchmark, with CISO-targeting sequences generating a 6.8% reply rate — 2.2× the 3.1% median for enterprise IT infrastructure. Prospects who arrive at email outreach after seeing LinkedIn posts reply at 2.1× the cold rate, validating the LinkedIn-first warm-up strategy."
          : "Over the quarter, outreach generated $840k in email-attributed pipeline across 68 opportunities. The LinkedIn-first strategy has been fully validated — reps using it consistently outperform those who don't by 2.1× on reply rates. CISO sequences are the top-performing segment by both reply rate and average deal size.",
        actions: range === "7d" ? [
          { title: "Book all 5 CISO sequence replies this week", description: "5 positive replies from the Monday CISO sequence need meeting links sent today. Enterprise reply windows close quickly — all 5 should be on the calendar before Thursday.", priority: "high", cta: "Book meetings" },
          { title: "Check LinkedIn-first pacing for this week's sequences", description: "Verify that all sequences that launched this week have LinkedIn view steps completed before the email day-1 sends. Reps who skip this step see 2.1× lower reply rates.", priority: "high", cta: "Audit sequences" },
          { title: "Review response handling for this week's pending replies", description: "3 replies from this week are awaiting a response. Use the enterprise-specific response script to maximise meeting booking rate from each.", priority: "medium", cta: "Send responses" },
        ] : range === "30d" ? [
          { title: "Scale CISO-targeting sequences", description: "CISO sequences are your highest-performing by reply rate and deal size. Build 3 new variations and increase volume by 50%.", priority: "high", cta: "Build sequences" },
          { title: "Standardise LinkedIn-first approach", description: "Reps who send a LinkedIn view before email day 1 see 2.1× reply rates. Make this standard practice across all AEs.", priority: "high", cta: "Update playbook" },
          { title: "Improve response-to-meeting conversion", description: "18% of replies don't convert to booked meetings — improve the response handling script and meeting CTA language.", priority: "medium", cta: "Update scripts" },
        ] : [
          { title: "Formalise the LinkedIn-first playbook", description: "The LinkedIn-first warm-up strategy is proven across a full quarter. Document it as a mandatory AE standard: LinkedIn view on day 0, email on day 1. Train all reps and measure compliance.", priority: "high", cta: "Formalise playbook" },
          { title: "Scale CISO sequence to CTO and CISO adjacent titles", description: "The CISO sequence framework works for security and infrastructure leaders. Apply the same narrative framework to VP Engineering and Chief Digital Officer personas — they share buying committee authority in enterprise IT.", priority: "medium", cta: "Build personas" },
          { title: "Plan next quarter outreach capacity expansion", description: "At current reply-to-opportunity rates, increasing contact volume by 30% would generate an estimated $252k in additional quarterly pipeline.", priority: "medium", cta: "Plan expansion" },
        ],
      },
      emailPipeline: { value: Math.round(840000 * mult), change: range === "7d" ? 12 : range === "30d" ? 34 : 58, sparkline: spark(), prefix: "$" },
      totalSent: { value: Math.round(18600 * mult), change: 28, sparkline: spark() },
      openRate: { value: 34.2, change: range === "7d" ? 2 : range === "30d" ? 6 : 11, sparkline: spark() },
      clickRate: { value: 4.1, change: 2, sparkline: spark() },
      replyRate: { value: 6.8, change: range === "7d" ? 0 : range === "30d" ? 2.2 : 4.8, sparkline: spark() },
      opportunitiesCount: { value: Math.round(68 * mult), change: 38, sparkline: spark() },
      masterTrend: Array.from({ length: 14 }, (_, i) => {
        const base = Math.round(1200 + Math.sin(i * 0.5) * 400 + i * 60);
        return { date: new Date(2026, 2, 1 + i * 6).toISOString().split("T")[0], sent: base, opens: Math.round(base * 0.63), uniqueOpens: Math.round(base * 0.56), replies: Math.round(base * 0.068) };
      }),
      emailCampaigns: [
        {
          id: "e1", name: "CISO — Cybersecurity Narrative Sequence", status: "active", sequence: 5,
          sent: Math.round(180 * mult), opens: Math.round(114 * mult), replies: Math.round(38 * mult), meetings: Math.round(12 * mult), pipeline: Math.round(580000 * mult),
          openRate: 63.4, replyRate: 21.1, positiveReplyRate: 14.8, bounceRate: 1.4,
          leads: Math.round(180 * mult), completed: Math.round(52 * mult), bounced: Math.round(8 * mult), unsubscribed: Math.round(4 * mult),
          sequenceSteps: [
            { step: "Step 1", sent: Math.round(180 * mult), opened: Math.round(114 * mult), replied: Math.round(22 * mult), openRate: 63.4, replyRate: 12.2 },
            { step: "Step 2", sent: Math.round(152 * mult), opened: Math.round(88 * mult), replied: Math.round(9 * mult), openRate: 57.9, replyRate: 5.9 },
            { step: "Step 3", sent: Math.round(128 * mult), opened: Math.round(68 * mult), replied: Math.round(5 * mult), openRate: 53.1, replyRate: 3.9 },
            { step: "Step 4", sent: Math.round(104 * mult), opened: Math.round(48 * mult), replied: Math.round(2 * mult), openRate: 46.2, replyRate: 1.9 },
            { step: "Step 5", sent: Math.round(82 * mult), opened: Math.round(32 * mult), replied: Math.round(0), openRate: 39.0, replyRate: 0.5 },
          ],
          trend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(2026, 3, 12 + i).toISOString().split("T")[0], sent: Math.round(110 + i * 14), opens: Math.round(70 + i * 9), replies: Math.round(7 + Math.sin(i) * 2) })),
        },
        {
          id: "e2", name: "CIO — Infrastructure Intelligence", status: "active", sequence: 4,
          sent: Math.round(120 * mult), opens: Math.round(72 * mult), replies: Math.round(22 * mult), meetings: Math.round(7 * mult), pipeline: Math.round(380000 * mult),
          openRate: 60.0, replyRate: 18.3, positiveReplyRate: 12.1, bounceRate: 1.6,
          leads: Math.round(120 * mult), completed: Math.round(38 * mult), bounced: Math.round(6 * mult), unsubscribed: Math.round(3 * mult),
          sequenceSteps: [
            { step: "Step 1", sent: Math.round(120 * mult), opened: Math.round(72 * mult), replied: Math.round(14 * mult), openRate: 60.0, replyRate: 11.7 },
            { step: "Step 2", sent: Math.round(98 * mult), opened: Math.round(54 * mult), replied: Math.round(6 * mult), openRate: 55.1, replyRate: 6.1 },
            { step: "Step 3", sent: Math.round(80 * mult), opened: Math.round(38 * mult), replied: Math.round(2 * mult), openRate: 47.5, replyRate: 2.5 },
            { step: "Step 4", sent: Math.round(64 * mult), opened: Math.round(24 * mult), replied: Math.round(0), openRate: 37.5, replyRate: 0.6 },
          ],
          trend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(2026, 3, 12 + i).toISOString().split("T")[0], sent: Math.round(72 + i * 9), opens: Math.round(44 + i * 5), replies: Math.round(5 + Math.cos(i)) })),
        },
        {
          id: "e3", name: "VP IT — Vendor Alignment Story", status: "completed", sequence: 3,
          sent: Math.round(80 * mult), opens: Math.round(40 * mult), replies: Math.round(10 * mult), meetings: Math.round(3 * mult), pipeline: Math.round(180000 * mult),
          openRate: 50.0, replyRate: 12.5, positiveReplyRate: 8.2, bounceRate: 2.0,
          leads: Math.round(80 * mult), completed: Math.round(68 * mult), bounced: Math.round(6 * mult), unsubscribed: Math.round(3 * mult),
          sequenceSteps: [
            { step: "Step 1", sent: Math.round(80 * mult), opened: Math.round(40 * mult), replied: Math.round(7 * mult), openRate: 50.0, replyRate: 8.8 },
            { step: "Step 2", sent: Math.round(62 * mult), opened: Math.round(28 * mult), replied: Math.round(2 * mult), openRate: 45.2, replyRate: 3.2 },
            { step: "Step 3", sent: Math.round(48 * mult), opened: Math.round(18 * mult), replied: Math.round(1 * mult), openRate: 37.5, replyRate: 2.1 },
          ],
          trend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(2026, 3, 12 + i).toISOString().split("T")[0], sent: Math.round(48 + i * 4), opens: Math.round(24 + i * 2), replies: Math.round(3) })),
        },
      ],
      inboxHealth: [
        { email: "intel@apexsystems.com",    warmupScore: 97, deliverabilityScore: 98, spamScore: 0.4, blacklisted: false, daysWarmedUp: 84, status: "healthy" },
        { email: "cxo@apexsystems.com",      warmupScore: 94, deliverabilityScore: 96, spamScore: 0.7, blacklisted: false, daysWarmedUp: 68, status: "healthy" },
        { email: "security@apexsystems.com", warmupScore: 88, deliverabilityScore: 91, spamScore: 1.2, blacklisted: false, daysWarmedUp: 52, status: "healthy" },
        { email: "gtm@apexsystems.com",      warmupScore: 71, deliverabilityScore: 74, spamScore: 2.8, blacklisted: false, daysWarmedUp: 18, status: "warming" },
      ],
      emailFunnel: [
        { stage: "Contacted", count: Math.round(18600 * mult), rate: 100,  color: "#0EA5E9" },
        { stage: "Opened",    count: Math.round(6361 * mult),  rate: 34.2, color: "#FBBF24" },
        { stage: "Clicked",   count: Math.round(763 * mult),   rate: 12.0, color: "#F97316" },
        { stage: "Replied",   count: Math.round(1265 * mult),  rate: 19.9, color: "#A78BFA" },
        { stage: "Meetings",  count: Math.round(278 * mult),   rate: 22.0, color: "#7C7FFF" },
        { stage: "Opps",      count: Math.round(181 * mult),   rate: 65.0, color: "#34D399" },
      ],
      crmPipelineFunnel: [
        { stage: "Request For Info", value: Math.round(2400000 * mult), deals: Math.round(42 * mult), pct: 100,  color: "#0EA5E9" },
        { stage: "Presentation",     value: Math.round(1820000 * mult), deals: Math.round(30 * mult), pct: 75.8, color: "#6366F1" },
        { stage: "Qualified",        value: Math.round(1380000 * mult), deals: Math.round(22 * mult), pct: 57.5, color: "#A78BFA" },
        { stage: "Negotiation",      value: Math.round(980000 * mult),  deals: Math.round(14 * mult), pct: 40.8, color: "#FBBF24" },
        { stage: "Won",              value: Math.round(1302000 * mult), deals: Math.round(7 * mult),  pct: 24.2, color: "#34D399" },
        { stage: "Lost",             value: Math.round(240000 * mult),  deals: Math.round(10 * mult), pct: 10.0, color: "#FF4455" },
      ],
      replyWaterfall: [
        { step: "Step 1", value: 100 }, { step: "Step 2", value: 74 }, { step: "Step 3", value: 52 },
        { step: "Step 4", value: 38 }, { step: "Step 5", value: 28 },
      ],
      topSubjectLines: [
        { subject: "CIO at {{Company}} — I found your vendor alignment gap", replyRate: 34.2 },
        { subject: "Your Q1 enterprise narrative vs EnterpriseLayer — interesting data", replyRate: 28.6 },
        { subject: "How [Similar Company] closed 3 enterprise deals with one narrative shift", replyRate: 21.4 },
        { subject: "CISO alignment strategy for {{Company}} — 12-minute call?", replyRate: 18.8 },
      ],
      linkedinFunnel: [
        { stage: "Connection Sent", value: 320 }, { stage: "Accepted", value: 198 },
        { stage: "Replied", value: 92 }, { stage: "Meeting Booked", value: 34 },
      ],
      linkedinCampaigns: [
        { id: "l1", name: "CXO Enterprise — Narrative Intelligence", status: "active", sent: Math.round(120 * mult), accepted: Math.round(78 * mult), replied: Math.round(38 * mult), meetings: Math.round(14 * mult), pipeline: Math.round(480000 * mult) },
        { id: "l2", name: "CISO Network — Security Narrative", status: "active", sent: Math.round(100 * mult), accepted: Math.round(62 * mult), replied: Math.round(28 * mult), meetings: Math.round(10 * mult), pipeline: Math.round(320000 * mult) },
      ],
      icpScoreDistribution: [
        { score: "90-100", count: 42 }, { score: "80-89", count: 96 }, { score: "70-79", count: 124 },
        { score: "60-69", count: 88 }, { score: "50-59", count: 52 }, { score: "<50", count: 28 },
      ],
      salesloft: {
        rhythm: {
          prioritizedActions: 58,
          completed: 36,
          allActivitiesMonth: Math.round(1020 * mult),
          activityTrend: dates.map((date, i) => ({ date, count: Math.round((24 + Math.sin(i * 0.6) * 8 + Math.random() * 10) * mult) })),
        },
        outcomes: [
          { label: "Opportunities Created", current: Math.round(84 * mult), projection: Math.round(118 * mult), goal: 160, unit: "count", color: "#6366F1", byRep: [{ name: "HP", value: 16 }, { name: "RW", value: 13 }, { name: "HG", value: 11 }, { name: "SH", value: 9 }, { name: "NL", value: 8 }, { name: "DM", value: 6 }] },
          { label: "Weighted Pipeline", current: Math.round(280000 * mult), projection: Math.round(390000 * mult), goal: 550000, unit: "money", color: "#8B5CF6", byRep: [{ name: "HP", value: 68000 }, { name: "RW", value: 52000 }, { name: "HG", value: 44000 }, { name: "SH", value: 38000 }, { name: "NL", value: 30000 }, { name: "DM", value: 24000 }] },
          { label: "Closed Won", current: Math.round(480000 * mult), projection: Math.round(660000 * mult), goal: 820000, unit: "money", color: "#34D399", byRep: [{ name: "HP", value: 118000 }, { name: "RW", value: 92000 }, { name: "HG", value: 80000 }, { name: "SH", value: 66000 }, { name: "NL", value: 56000 }, { name: "DM", value: 46000 }] },
        ],
        cadenceMetrics: {
          callsLogged: Math.round(7420 * mult), callsPerDay: Math.round(148 * mult), voicemails: Math.round(1020 * mult), conversations: Math.round(542 * mult), positiveConversations: Math.round(138 * mult), callTrend: Array.from({ length: 8 }, () => Math.round(100 + Math.random() * 55)), callChangePct: 11,
          emailsSent: Math.round(16480 * mult), pctPersonalized: 51.2, pctOpened: 44.8, pctClicked: 6.4, pctReplied: 14.8, emailTrend: Array.from({ length: 8 }, () => Math.round(400 + Math.random() * 160)), emailChangePct: 12,
          totalTouches: Math.round(19680 * mult), totalMeetings: Math.round(396 * mult), meetingChangePct: 10, effectivenessScore: 5.2, effectivenessChangePct: 9,
          linkedinSteps: Math.round(4488 * mult), linkedinResearch: Math.round(2220 * mult), linkedinIntroductions: Math.round(1160 * mult), linkedinConnections: Math.round(588 * mult), linkedinInMail: Math.round(520 * mult),
          otherStepsCompleted: Math.round(24480 * mult),
        },
        topCadences: [
          { name: "Enterprise CRO Playbook", opportunities: Math.round(428 * mult), meetings: Math.round(268 * mult), successes: Math.round(194 * mult), effectivenessScore: 9.1, oppChangePct: 18 },
          { name: "VP Sales — AI Narrative", opportunities: Math.round(338 * mult), meetings: Math.round(212 * mult), successes: Math.round(152 * mult), effectivenessScore: 7.8, oppChangePct: 12 },
          { name: "Series C Expansion", opportunities: Math.round(258 * mult), meetings: Math.round(162 * mult), successes: Math.round(116 * mult), effectivenessScore: 6.4, oppChangePct: -5 },
          { name: "EMEA Enterprise Push", opportunities: Math.round(194 * mult), meetings: Math.round(122 * mult), successes: Math.round(88 * mult), effectivenessScore: 5.8, oppChangePct: 8 },
          { name: "SMB Inbound Nurture", opportunities: Math.round(132 * mult), meetings: Math.round(84 * mult), successes: Math.round(60 * mult), effectivenessScore: 4.7, oppChangePct: -12 },
        ],
        topReps: [
          { name: "Marcus Rivera", successes: 194, meetings: 134, opportunities: 92, totalActivity: 3880, emailsSent: 1680, callsLogged: 1220, integrationSteps: 420 },
          { name: "Diana Foster", successes: 172, meetings: 118, opportunities: 80, totalActivity: 3440, emailsSent: 1480, callsLogged: 1080, integrationSteps: 380 },
          { name: "Alex Winters", successes: 152, meetings: 104, opportunities: 70, totalActivity: 3040, emailsSent: 1300, callsLogged: 960, integrationSteps: 340 },
          { name: "Priya Sharma", successes: 132, meetings: 90, opportunities: 60, totalActivity: 2640, emailsSent: 1120, callsLogged: 840, integrationSteps: 300 },
          { name: "Tom Callahan", successes: 114, meetings: 78, opportunities: 52, totalActivity: 2280, emailsSent: 960, callsLogged: 720, integrationSteps: 260 },
        ],
        dealFlow: {
          startPeriod: "Dec 1, 2025", endPeriod: "Dec 31, 2025",
          startTotal: Math.round(5680000 * mult), endTotal: Math.round(6520000 * mult), delta: Math.round(840000 * mult),
          sources: [
            { label: "Pipeline", value: Math.round(1020000 * mult), color: "#6366F1" },
            { label: "Best Case", value: Math.round(1500000 * mult), color: "#8B5CF6" },
            { label: "Commit", value: Math.round(3160000 * mult), color: "#A78BFA" },
            { label: "Pulled In", value: Math.round(1160000 * mult), color: "#F59E0B" },
            { label: "New", value: Math.round(1920000 * mult), color: "#34D399" },
          ],
          destinations: [
            { label: "Won", value: Math.round(4840000 * mult), color: "#34D399" },
            { label: "Idle", value: Math.round(1660000 * mult), color: "#64748B" },
            { label: "Pushed Out", value: Math.round(1140000 * mult), color: "#F59E0B" },
            { label: "Lost", value: Math.round(1080000 * mult), color: "#EF4444" },
          ],
          links: [
            { from: "Pipeline", to: "Won", value: Math.round(540000 * mult) },
            { from: "Pipeline", to: "Idle", value: Math.round(280000 * mult) },
            { from: "Pipeline", to: "Pushed Out", value: Math.round(200000 * mult) },
            { from: "Best Case", to: "Won", value: Math.round(1020000 * mult) },
            { from: "Best Case", to: "Idle", value: Math.round(280000 * mult) },
            { from: "Best Case", to: "Lost", value: Math.round(200000 * mult) },
            { from: "Commit", to: "Won", value: Math.round(2480000 * mult) },
            { from: "Commit", to: "Idle", value: Math.round(480000 * mult) },
            { from: "Commit", to: "Lost", value: Math.round(200000 * mult) },
            { from: "Pulled In", to: "Won", value: Math.round(680000 * mult) },
            { from: "Pulled In", to: "Pushed Out", value: Math.round(480000 * mult) },
            { from: "New", to: "Won", value: Math.round(120000 * mult) },
            { from: "New", to: "Idle", value: Math.round(600000 * mult) },
            { from: "New", to: "Pushed Out", value: Math.round(460000 * mult) },
            { from: "New", to: "Lost", value: Math.round(680000 * mult) },
          ],
        },
      },
    },
    integrations: [
      { id: "crm", name: "Salesforce CRM", category: "crm", connected: true, lastSync: "1 min ago" },
      { id: "linkedin", name: "LinkedIn", category: "social", connected: true, lastSync: "4 min ago" },
      { id: "instagram", name: "Instagram", category: "social", connected: false },
      { id: "facebook", name: "Facebook", category: "social", connected: false },
      { id: "tiktok", name: "TikTok", category: "social", connected: false },
      { id: "x-twitter", name: "X (Twitter)", category: "social", connected: false },
      { id: "reddit", name: "Reddit", category: "social", connected: false },
      { id: "google-search", name: "Google Search Console", category: "seo", connected: true, lastSync: "2 hours ago" },
      { id: "salesloft", name: "Salesloft", category: "outreach", connected: true, lastSync: "8 min ago" },
      { id: "vector", name: "Vector", category: "website-intel", connected: true, lastSync: "Real-time" },
      { id: "analytics", name: "Google Analytics", category: "analytics", connected: true, lastSync: "Real-time" },
      { id: "meta-ads", name: "Meta Ads", category: "paid-media", connected: true, lastSync: "15 min ago" },
      { id: "google-ads", name: "Google Ads", category: "paid-media", connected: true, lastSync: "22 min ago" },
      { id: "linkedin-ads", name: "LinkedIn Ads", category: "paid-media", connected: true, lastSync: "35 min ago" },
      { id: "tiktok-ads", name: "TikTok Ads", category: "paid-media", connected: true, lastSync: "40 min ago" },
      { id: "x-ads", name: "X Ads", category: "paid-media", connected: true, lastSync: "1 hour ago" },
      { id: "reddit-ads", name: "Reddit Ads", category: "paid-media", connected: false },
    ],
    paidMedia: {
      tldr: {
        summary: range === "7d"
          ? "Apex's paid media engine is running at enterprise scale across 5 connected platforms. LinkedIn Ads delivered 4.7× ROAS this week targeting VP Engineering buyers. Meta Ads retargeting is fueling 38% of all demo bookings from paid. Reddit Ads is the only disconnected channel — worth testing for developer-adjacent personas."
          : range === "30d"
          ? "Enterprise paid media delivered a 3.9× blended ROAS this month — above benchmark for enterprise B2B SaaS. LinkedIn continues to be the highest-quality channel for enterprise buyers, contributing 41% of enterprise pipeline from paid sources. TikTok Ads drove strong brand awareness metrics among the next-generation practitioner persona."
          : "Paid media delivered a 3.9× blended ROAS this quarter across 5 platforms. LinkedIn Ads is the top performer among all channels — directly attributable to precise Tier-1 enterprise account targeting. The quarter saw a significant improvement in creative quality as video ads across all platforms outperformed static by 2.4×. Recommend increasing LinkedIn budget by 35% in Q3.",
        actions: range === "7d" ? [
          { title: "Increase LinkedIn Ads budget by 20%", description: "LinkedIn is at 4.7× ROAS this week — the highest of any platform. The VP Engineering ICP segment is underserved. Increasing budget by 20% would capture an estimated 15 additional qualified leads this week.", priority: "high", cta: "Adjust budget" },
          { title: "Activate ABM-triggered Meta retargeting", description: "22 Tier-1 accounts showed website intent signals this week but have not been served Meta retargeting ads. Sync the ABM list to create a high-value retargeting audience.", priority: "high", cta: "Activate" },
          { title: "Connect Reddit Ads for developer audience", description: "Reddit's developer communities align with Apex's technical buyer persona. A $2k test this week would establish benchmarks before the quarterly budget planning cycle.", priority: "medium", cta: "Connect" },
        ] : range === "30d" ? [
          { title: "Expand LinkedIn Ads to CISO targeting", description: "LinkedIn Ads currently targets VP Engineering and VP Sales. Adding CISO as a segment would expand enterprise pipeline coverage. Estimated 2.8× ROAS based on similar B2B SaaS accounts in the segment.", priority: "high", cta: "Expand targeting" },
          { title: "Implement cross-platform attribution modelling", description: "With 5 platforms active, cross-channel attribution is increasingly important. A data-driven attribution model would improve budget allocation by up to 22% efficiency gain.", priority: "high", cta: "Build model" },
          { title: "Scale TikTok for practitioner brand awareness", description: "Increasing TikTok spend to $8k/month would double brand impression share among the practitioner persona that influences enterprise buying decisions.", priority: "medium", cta: "Scale budget" },
        ] : [
          { title: "Build an enterprise paid media playbook", description: "Apex's paid media performance this quarter establishes clear channel benchmarks. Documenting a replicable playbook — audience targeting, creative strategy, budget allocation — would systematise the approach for sustained performance.", priority: "high", cta: "Build playbook" },
          { title: "Invest in video creative production", description: "Video ads delivered 2.4× higher ROAS than static this quarter. Investing in a quarterly creative production cycle with 8-10 short-form video assets would maintain creative freshness and competitive advantage.", priority: "high", cta: "Plan production" },
          { title: "Evaluate X Ads for executive audience", description: "X Ads delivers executive audience targeting at scale. A $5k quarterly test targeting CTO and CEO audiences would establish whether X can complement LinkedIn for Apex's top-of-funnel coverage.", priority: "medium", cta: "Plan test" },
        ],
      },
      totalSpend: { value: Math.round(82200 * mult), change: 19, sparkline: spark(), prefix: "$" },
      totalRevenue: { value: Math.round(321300 * mult), change: 28, sparkline: spark(), prefix: "$" },
      roas: { value: 3.9, change: 12, sparkline: spark() },
      cac: { value: 41000, change: -18, sparkline: spark(), prefix: "$" },
      campaigns: [
        { id: "c1", name: "Tier-1 ABM — LinkedIn", platform: "LinkedIn Ads", status: "active", spend: Math.round(18000 * mult), revenue: Math.round(84000 * mult), roas: 4.7, impressions: Math.round(180000 * mult), clicks: Math.round(7200 * mult), conversions: Math.round(124 * mult), cpa: 145, cpc: 2.50 },
        { id: "c2", name: "Enterprise Pipeline — Google", platform: "Google Ads", status: "active", spend: Math.round(22000 * mult), revenue: Math.round(90900 * mult), roas: 4.1, impressions: Math.round(320000 * mult), clicks: Math.round(16000 * mult), conversions: Math.round(148 * mult), cpa: 149, cpc: 1.38 },
        { id: "c3", name: "Demo Retargeting — Meta", platform: "Meta Ads", status: "active", spend: Math.round(12000 * mult), revenue: Math.round(47700 * mult), roas: 4.0, impressions: Math.round(840000 * mult), clicks: Math.round(12600 * mult), conversions: Math.round(96 * mult), cpa: 125, cpc: 0.95 },
        { id: "c4", name: "VP Sales Sequence — LinkedIn", platform: "LinkedIn Ads", status: "active", spend: Math.round(8000 * mult), revenue: Math.round(33000 * mult), roas: 4.1, impressions: Math.round(92000 * mult), clicks: Math.round(3680 * mult), conversions: Math.round(58 * mult), cpa: 138, cpc: 2.17 },
        { id: "c5", name: "Brand Awareness — TikTok", platform: "TikTok Ads", status: "active", spend: Math.round(6000 * mult), revenue: Math.round(15600 * mult), roas: 2.6, impressions: Math.round(5800000 * mult), clicks: Math.round(46400 * mult), conversions: Math.round(48 * mult), cpa: 125, cpc: 0.13 },
        { id: "c6", name: "Competitor Keywords — Google", platform: "Google Ads", status: "active", spend: Math.round(9000 * mult), revenue: Math.round(33000 * mult), roas: 3.7, impressions: Math.round(128000 * mult), clicks: Math.round(9600 * mult), conversions: Math.round(72 * mult), cpa: 125, cpc: 0.94 },
        { id: "c7", name: "X Ads — Executive Reach", platform: "X Ads", status: "active", spend: Math.round(4000 * mult), revenue: Math.round(9800 * mult), roas: 2.5, impressions: Math.round(2200000 * mult), clicks: Math.round(22000 * mult), conversions: Math.round(24 * mult), cpa: 167, cpc: 0.18 },
        { id: "c8", name: "CXO Account Targeting", platform: "LinkedIn Ads", status: "paused", spend: Math.round(3200 * mult), revenue: Math.round(7300 * mult), roas: 2.3, impressions: Math.round(48000 * mult), clicks: Math.round(1920 * mult), conversions: Math.round(18 * mult), cpa: 178, cpc: 1.67 },
      ],
      platformBreakdown: [
        { platform: "LinkedIn Ads", spend: Math.round(29200 * mult), revenue: Math.round(124300 * mult), roas: 4.3, color: "#0A66C2" },
        { platform: "Google Ads", spend: Math.round(31000 * mult), revenue: Math.round(123900 * mult), roas: 4.0, color: "#4285F4" },
        { platform: "Meta Ads", spend: Math.round(12000 * mult), revenue: Math.round(47700 * mult), roas: 4.0, color: "#1877F2" },
        { platform: "TikTok Ads", spend: Math.round(6000 * mult), revenue: Math.round(15600 * mult), roas: 2.6, color: "#FF0050" },
        { platform: "X Ads", spend: Math.round(4000 * mult), revenue: Math.round(9800 * mult), roas: 2.5, color: "#1DA1F2" },
      ],
      spendTrend: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(2026, 1, 1 + i * 2).toISOString().split("T")[0],
        spend: Math.round((4342 + Math.sin(i * 0.5) * 1002 + i * 234) * mult),
        revenue: Math.round((17127 + Math.cos(i * 0.4) * 3071 + i * 945) * mult),
      })),
      bestCampaigns: [
        { name: "Tier-1 ABM — LinkedIn", platform: "LinkedIn Ads", revenue: Math.round(84000 * mult), conversions: Math.round(124 * mult), roas: 4.7 },
        { name: "Enterprise Pipeline — Google", platform: "Google Ads", revenue: Math.round(90900 * mult), conversions: Math.round(148 * mult), roas: 4.1 },
        { name: "Demo Retargeting — Meta", platform: "Meta Ads", revenue: Math.round(47700 * mult), conversions: Math.round(96 * mult), roas: 4.0 },
      ],
      bestAds: [
        { name: "Enterprise ROI Walkthrough — Video", platform: "LinkedIn Ads", revenue: Math.round(49100 * mult), conversions: Math.round(72 * mult), ctr: 5.8 },
        { name: "Pipeline Intelligence Demo — 60s", platform: "Google Ads", revenue: Math.round(39800 * mult), conversions: Math.round(68 * mult), ctr: 7.2 },
        { name: "CXO Social Proof — Carousel", platform: "Meta Ads", revenue: Math.round(29700 * mult), conversions: Math.round(52 * mult), ctr: 4.4 },
      ],
    },
    narrativeIntel: {
      nri: { current: 2.4, target: 2, tier: "DIY", trend: "up" },
      phaseMetrics: {
        phase1: {
          growthMetric: { name: "Market perception", value: "+6%", change: 6 },
          emotionalIndicator: { name: "Sentiment score", value: "48/100", change: 3 },
        },
        phase2: {
          growthMetric: { name: "Lead conversion", value: "+9%", change: 9 },
          emotionalIndicator: { name: "Engagement time", value: "2m 18s", change: 4 },
        },
        phase3: {
          growthMetric: { name: "Pipeline velocity", value: "52 days", change: range === "90d" ? -9 : -4 },
          emotionalIndicator: { name: "NPS", value: "+11", change: 2 },
        },
        phase4: {
          growthMetric: { name: "Deal size", value: "+7%", change: 7 },
          emotionalIndicator: { name: "Affinity index", value: "39/100", change: 2 },
        },
        phase5: {
          growthMetric: { name: "LTV:CAC", value: "3.7:1", change: 3 },
          emotionalIndicator: { name: "Advocacy rate", value: "12%", change: 1 },
        },
      },
    },
    pipelineBridge: {
      section: "Narrative Intel",
      attributed: Math.round(2100000 * mult),
      deals: Math.round(42 * mult),
      velocity: 52,
    },
  };
}

export const apexData: ClientDataByRange = {
  "7d": makeApex("7d"),
  "30d": makeApex("30d"),
  "90d": makeApex("90d"),
};
