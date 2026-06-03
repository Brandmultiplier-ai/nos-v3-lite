# NOS — Narrative Operating System

**NOS v3** is a B2B narrative marketing intelligence dashboard built for BrandMultiplier. It translates content, search, outreach, web, and paid media signals into pipeline outcomes — with AI summaries, recommended actions, and a proprietary **Narrative Resonance Index (NRI)**.

This is a **demo/mock-data application** with three client workspaces (Nexus Labs, Meridian Brands, Apex Systems) and date-range filtering (7d / 30d / 90d).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Base UI |
| Charts | Recharts, Nivo (radar/heatmap), ECharts, react-calendar-heatmap |
| Motion | Framer Motion |
| State | Zustand (global UI state), React Context (client data) |
| Fonts | Geist Sans + Geist Mono |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # production server
npm run lint    # ESLint
```

---

## Project Structure

```
nos-v3/
├── app/
│   ├── layout.tsx                 # Root layout, ThemeProvider, fonts
│   ├── globals.css                # Design tokens, utilities, animations
│   └── (dashboard)/
│       ├── layout.tsx             # DashboardShell wrapper
│       └── [[...slug]]/page.tsx   # Dynamic section routing
├── components/
│   ├── layout/                    # DashboardShell
│   ├── nav/                       # ContextStrip, SectionList
│   ├── sections/                  # Top-level dashboard sections
│   ├── cards/                     # KPI, NRI, pipeline, phase metrics
│   ├── charts/                    # Recharts & custom visualizations
│   ├── shared/                    # Reusable UI primitives
│   └── ui/                        # shadcn/ui primitives
├── lib/
│   ├── data/                      # Mock data per client + range
│   ├── store.ts                   # Zustand global store
│   ├── section-meta.ts            # Section titles, paths, icons
│   └── utils.ts                   # cn() helper
└── middleware.ts                  # Default sub-tab redirects
```

---

## Architecture

### Routing

All dashboard pages live under the catch-all route `app/(dashboard)/[[...slug]]/page.tsx`.

| Path | Section |
|------|---------|
| `/` | Narrative Intelligence |
| `/brand` | Brand Intelligence |
| `/positioning` | Positioning |
| `/search/seo` · `/search/geo` | Search Intelligence |
| `/website` | Website Signals |
| `/content/social` · `/linkedin` · `/blog` · `/newsletter` | Content Marketing |
| `/outreach/email` · `/outreach/linkedin` | Cold Outreach |
| `/paid-media` | Paid Media (Enterprise only) |
| `/integrations` | Integrations |

`middleware.ts` redirects bare paths (`/content`, `/search`, `/outreach`) to their default sub-tabs.

### Global State (Zustand)

`lib/store.ts` holds:

- `activeClient` — `nexus` | `meridian` | `apex`
- `dateRange` — `7d` | `30d` | `90d`
- `commandOpen` — command palette visibility

### Data Layer

Mock data is generated per client and date range:

```
lib/data/
├── client-nexus.ts      # makeNexus(range)
├── client-meridian.ts   # makeMeridian(range)
├── client-apex.ts       # makeApex(range)
├── brand-builders.ts    # Shared brand scoreboard builders
├── sparkline.ts         # Deterministic sparkline + trend generators
├── types.ts             # All TypeScript interfaces
├── context.tsx          # ClientDataProvider
└── index.ts             # useClientData(), useDataKey()
```

Each client exports `{ "7d": ClientData, "30d": ClientData, "90d": ClientData }`.  
`ClientDataProvider` reads `activeClient` + `dateRange` from Zustand and supplies the matching snapshot via React Context.

**Range multiplier:** `mult = 0.23 (7d) | 1 (30d) | 3.1 (90d)` — applied to volume metrics, pipeline dollars, and trend series.

---

## Design System

All styling lives in `app/globals.css`. Components reference CSS custom properties — never hardcoded theme colors (except channel-specific brand hex where noted).

### Themes

| Mode | Class on `<html>` | Default |
|------|---------------------|---------|
| Dark | `.dark` | Yes |
| Light | `.light` | Toggle via header sun/moon button |

`ThemeProvider` (`components/shared/ThemeProvider.tsx`) persists preference in `localStorage`. A blocking inline script in `app/layout.tsx` prevents flash of wrong theme on load.

### Background Layers

| Token | Purpose |
|-------|---------|
| `--nos-bg-canvas` | App shell background |
| `--nos-bg-surface` | Card surface |
| `--nos-bg-elevated` | Inputs, pills, secondary surfaces |
| `--nos-bg-overlay` | Hover states, scrollbars |
| `--nos-bg-glass` | Header glass effect |

### Text Hierarchy

| Token | Use |
|-------|-----|
| `--nos-text-primary` | Headings, KPI values |
| `--nos-text-secondary` | Body copy, descriptions |
| `--nos-text-muted` | Labels, axis ticks, captions |

### Accent & Signal Colors

| Token | Meaning |
|-------|---------|
| `--nos-accent` | Brand purple — primary actions, highlights, NRI goal (level 6) |
| `--nos-accent-2` | Secondary violet — gradients |
| `--nos-positive` | Green — good trend, success, Leaders quadrant |
| `--nos-negative` | Red — bad trend, loss, decline |
| `--nos-signal-warm` | Yellow/amber — neutral/middle, NRI levels 2–3, running experiments |
| `--nos-signal-hot` | Red — high-priority badges, alerts |
| `--nos-signal-cold` | Grey — cold/inactive, NRI levels 0–1 |

**Universal stoplight model:** Green = positive · Red = negative · Yellow = neutral/middle. Applied consistently across KPI trends, funnels, and badges.

### Channel Colors

Each marketing channel has a dedicated token so the same color never means two things on one page:

| Token | Channel |
|-------|---------|
| `--nos-ch-linkedin` | LinkedIn |
| `--nos-ch-instagram` | Instagram |
| `--nos-ch-facebook` | Facebook |
| `--nos-ch-x` | X / Twitter |
| `--nos-ch-email` | Email outreach |
| `--nos-ch-newsletter` | Newsletter |
| `--nos-ch-website` | Website |
| `--nos-ch-search` | SEO / search |

Sales pipeline funnels and email engagement funnels use **separate, non-overlapping palettes** within their sections.

### Typography Utilities

| Class | Use |
|-------|-----|
| `.text-label-caps` | Section labels, category headers — uppercase, tracked, muted |
| `.font-mono-metric` | Large hero KPI numbers — Geist Mono, 2.25rem, bold |
| `.text-gradient` | Gradient text from primary → accent |

**Capitalization rule:** Section titles and card headings use Title Case. Priority badges use Title Case (`High`, `Medium`). Labels use `.text-label-caps` for consistent uppercase treatment.

### Card Utilities

| Class | Description |
|-------|-------------|
| `.nos-card` | Standard dashboard card — 14px radius, surface bg, subtle top gradient overlay, hover glow |
| `.nos-card-glass` | Frosted glass variant with backdrop blur |
| `.glow-accent` / `.glow-positive` / `.glow-negative` | Semantic glow shadows |
| `.scroll-fade-bottom` | Mask fade for scrollable tables |
| `.nos-ambient` | Radial accent orb background effect |
| `.skeleton-shimmer` | Loading skeleton animation |

### Animations

Defined in `globals.css`: `hotPulse`, `shimmer`, `gradientShift`, `scanLine`, `floatUp`, `pulseGlow`, `borderGlow`.

Framer Motion handles page transitions (`AnimatePresence`), staggered card reveals, and tab switches.

---

## Component Reference

### Layout

| Component | File | Role |
|-----------|------|------|
| `DashboardShell` | `components/layout/DashboardShell.tsx` | Full-screen shell: header + sidebar + scrollable main (max-width 1200px) |

### Navigation

| Component | File | Role |
|-----------|------|------|
| `ContextStrip` | `components/nav/ContextStrip.tsx` | Top bar: logo, client switcher, date picker, live indicator, theme toggle |
| `SectionList` | `components/nav/SectionList.tsx` | Left sidebar with section links; Paid Media locked for non-enterprise clients |

### Shared Primitives

| Component | File | Role |
|-----------|------|------|
| `DashboardCard` | `components/shared/DashboardCard.tsx` | Card wrapper with optional title, subtitle, and ⓘ info button |
| `CardInfoButton` | `components/shared/CardInfoButton.tsx` | Tooltip info icon — positioned top-right of cards |
| `SectionTLDR` | `components/shared/SectionTLDR.tsx` | AI Channel Summary + Recommended Actions grid (no CTAs) |
| `SectionSubTabs` | `components/shared/SectionSubTabs.tsx` | Centered pill tabs for sub-sections (SEO/GEO, email/LinkedIn, etc.) |
| `ClientSwitcher` | `components/shared/ClientSwitcher.tsx` | Nexus / Meridian / Apex workspace picker |
| `DateRangePicker` | `components/shared/DateRangePicker.tsx` | 7d / 30d / 90d dropdown |
| `ThemeProvider` | `components/shared/ThemeProvider.tsx` | Dark/light theme context |
| `ThemeToggle` | `components/shared/ThemeToggle.tsx` | Sun/moon toggle button |
| `CommandPalette` | `components/shared/CommandPalette.tsx` | ⌘K navigation palette |
| `MobileBanner` | `components/shared/MobileBanner.tsx` | Desktop-only notice on small screens |
| `EmptyState` | `components/shared/EmptyState.tsx` | Placeholder for empty data states |
| `ChartSkeleton` | `components/shared/ChartSkeleton.tsx` | Loading skeleton for charts |

### Cards

| Component | File | Role |
|-----------|------|------|
| `KPICard` | `components/cards/KPICard.tsx` | Standard metric card: label, value, change badge, sparkline, info tooltip |
| `HeroKPICard` | `components/sections/NarrativeIntel.tsx` | Large centered hero KPI (CAC, LTV, Revenue, etc.) |
| `NRIScoreCard` | `components/cards/NRIScoreCard.tsx` | Narrative Resonance Index — fractional step tracker (0–6) |
| `PhaseMetricCard` | `components/cards/PhaseMetricCard.tsx` | Growth metric + emotional indicator pair per narrative phase |
| `PhaseToMetricStrip` | `components/sections/PhaseToMetricStrip.tsx` | All five phase metric cards in a grid |
| `PhaseSecondaryKPI` | `components/cards/PhaseSecondaryKPI.tsx` | Compact phase metric for sub-sections |
| `PipelineBridge` | `components/cards/PipelineBridge.tsx` | Attributed pipeline strip (Narrative Intel only) |
| `InsightCard` | `components/cards/InsightCard.tsx` | AI narrative text block |

### Charts

| Component | File | Role |
|-----------|------|------|
| `MiniSparkline` | `components/charts/MiniSparkline.tsx` | 72×28 inline SVG sparkline on KPI cards |
| `TrendLine` | `components/charts/TrendLine.tsx` | Single-series line chart with axis labels |
| `SignalAreaChart` | `components/charts/SignalAreaChart.tsx` | Multi-channel stacked area chart (Narrative Intel) |
| `VelocityLine` | `components/charts/VelocityLine.tsx` | Deal velocity trend |
| `GartnerQuadrant` | `components/charts/GartnerQuadrant.tsx` | Horizontal ranked bar comparison (Narrative Strength vs Market Presence) |
| `PositioningQuadrantDots` | `components/charts/PositioningQuadrantDots.tsx` | Gartner-style 4-quadrant scatter plot |
| `NarrativeRadar` | `components/charts/NarrativeRadar.tsx` | Topic authority radar |
| `BrandHealthGauge` | `components/charts/BrandHealthGauge.tsx` | Semicircular brand health gauge |
| `DonutChart` | `components/charts/DonutChart.tsx` | Donut/pie breakdown |
| `PipelineFunnel` | `components/charts/PipelineFunnel.tsx` | Horizontal funnel bars |
| `HeatmapGrid` | `components/charts/HeatmapGrid.tsx` | Activity heatmap grid |
| `ContentCalendar` | `components/charts/ContentCalendar.tsx` | Publishing calendar heatmap |
| `SeoTrafficGlobe` | `components/charts/SeoTrafficGlobe.tsx` | Geographic traffic globe |
| `ChartAxisLabels` | `components/charts/ChartAxisLabels.tsx` | X/Y axis description row below every chart |
| `CustomTooltip` | `components/charts/CustomTooltip.tsx` | Shared Recharts tooltip styling |

**Chart conventions:**
- Every chart with axes includes `ChartAxisLabels` describing what X and Y represent.
- Color legends use `[colored dot] Label` pattern next to series names.
- `TrendLine` remounts via a data-derived `key` when workspace or date range changes.

### Dashboard Sections

| Section | File | Key Features |
|---------|------|--------------|
| Narrative Intel | `NarrativeIntel.tsx` | Hero KPIs, NRI tracker, phase metrics, signal timeline, AI narrative |
| Brand Intel | `BrandIntel.tsx` | Competitive scoreboard, brand gauge, audience growth |
| Positioning | `Positioning.tsx` | Bars/Dots quadrant toggle, movement trend, keyword ownership |
| Search Intel | `SearchIntel.tsx` | SEO tab (Ahrefs-style) + GEO tab (AI citations) |
| Website Signals | `WebsiteSignals.tsx` | Visitor trends, hot accounts, reading behavior |
| Content Marketing | `ContentMarketing.tsx` | Social, LinkedIn, Blog (Optimizely experiments), Newsletter (Beehiiv) |
| Cold Outreach | `ColdOutreach.tsx` | Email + LinkedIn tabs, funnel waterfalls, rep scorecards |
| Paid Media | `PaidMedia.tsx` | ROAS, platform breakdown, campaigns, creative leaderboard |
| Integrations | `Integrations.tsx` | Connect modal, brand logos, category groupings |

Each section (except Narrative Intel root) includes a `SectionTLDR` block whose copy changes per client and date range.

### UI Primitives (shadcn/ui)

Located in `components/ui/`: `button`, `badge`, `card`, `dialog`, `dropdown-menu`, `input`, `select`, `tabs`, `tooltip`, `command`, `table`, `progress`, `skeleton`, and others. Styled via shadcn tokens mapped to NOS CSS variables.

---

## Demo Workspaces

| Client | Type | Plan | NRI | Notes |
|--------|------|------|-----|-------|
| **Nexus Labs** | SaaS, Series B | DFY | 4.2 | LinkedIn + website-led pipeline |
| **Meridian Brands** | D2C-adjacent B2B | DWY | 3.4 | Instagram + newsletter-led |
| **Apex Systems** | Enterprise B2B | Enterprise | 2.7 | Paid Media enabled, executive LinkedIn + CISO outreach |

Switching workspace or date range regenerates all metrics, AI summaries, recommended actions, and chart series.

---

## Key Product Concepts

### Narrative Resonance Index (NRI)

Proprietary 0–6 scale measuring narrative penetration:

| Level | Name |
|-------|------|
| 0 | Invisible |
| 1 | Noticed |
| 2 | Consumed |
| 3 | Remembered |
| 4 | Shared |
| 5 | Referenced |
| 6 | Identified |

Supports fractional values (e.g. 2.7). Step tracker shows all integer dots, a smaller fractional dot, and a colored progress line from 0 to the current level.

### Phase Metrics

Five narrative phases, each with a **Growth Metric** and **Emotional Indicator** (e.g. Market perception + Sentiment score). Displayed on Narrative Intel and as secondary KPIs in Brand, Search, Content, and Outreach sections.

### Enterprise Gating

Paid Media nav item is disabled for Nexus and Meridian with a tooltip. Apex (Enterprise) has full access.

---

## Deployment

Deployed on Vercel from the `main` branch:

```
https://github.com/Brandmultiplier-ai/nos-v3-lite
```

---

## License

Private — BrandMultiplier.ai
