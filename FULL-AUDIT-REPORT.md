# Full SEO Audit — Ideal Visualizations

- **URL audited:** https://ideal-visualizations.vercel.app/
- **Audit date:** 25 April 2026
- **Auditor:** `/seo audit` (claude-seo skill v1.9.0)
- **Business type detected:** Local Service / Creative Agency (Architectural 3D Visualization studio, HQ Amritsar, Punjab, India; service area: Chandigarh, Amritsar, Jalandhar, Ludhiana, Mohali, Bathinda, Manali, Shimla, Dubai, Delhi, Mumbai, Bangalore, Noida, Gurgaon, Hyderabad, Kolkata)
- **Tech stack:** React 18 + Vite SPA, GSAP, Tailwind, hosted on Vercel (single `index.html` shell, JS bundle `index-hsPKH4E8.js`)
- **Pages crawlable:** 1 (`/`). The `/gallery` route returns **HTTP 404** to crawlers — see Critical-1.

---

## Executive Summary

### SEO Health Score: **31 / 100  (Poor)**

| Category | Score | Weight | Weighted |
|----------|------:|------:|--------:|
| Technical SEO         | 25 | 22% | 5.5 |
| Content Quality       | 35 | 23% | 8.0 |
| On-Page SEO           | 20 | 20% | 4.0 |
| Schema / Structured Data | 0 | 10% | 0.0 |
| Performance (CWV, lab estimate) | 45 | 10% | 4.5 |
| AI Search Readiness   | 25 | 10% | 2.5 |
| Images                | 10 | 5%  | 0.5 |
| **Total**             |    |     | **~31** |

### Top 5 Critical Issues
1. **SPA renders empty `<body><div id="root"></div></body>`** — no server-rendered HTML. Googlebot can render JS, but most other crawlers (Bing, DuckDuckGo, Slack, LinkedIn, Twitter, ChatGPT, Perplexity, Claude, GPTBot) see **zero content**.
2. **`/gallery` and any other client-side route returns HTTP 404** from Vercel (no SPA rewrite to `index.html`) — Google sees the gallery page as a hard 404, will not index it.
3. **No `robots.txt`, no `sitemap.xml`, no `llms.txt`** (all return 404) — discovery and AI-citation surfaces are absent.
4. **No structured data** (no JSON-LD `LocalBusiness`, `Organization`, `ProfessionalService`, `ImageObject`, or `VideoObject`) on a portfolio-driven, multi-city local service site — major missed opportunity for rich results and Knowledge Panel.
5. **Title is generic ("Ideal Visualizations") and there is no meta description, no canonical, no Open Graph / Twitter Card tags, no `favicon.ico` (404)** — every social share will look broken; SERP CTR will suffer.

### Top 5 Quick Wins (≤ 1 day each)
1. Add a `vercel.json` rewrite so all routes serve `index.html` (fixes /gallery 404).
2. Add a real `<title>`, `<meta name="description">`, `<link rel="canonical">`, OG/Twitter tags, and a `favicon.ico` to `index.html`.
3. Drop a static `robots.txt` and `sitemap.xml` in `public/`.
4. Add a JSON-LD `ProfessionalService` block (with `areaServed`, `telephone`, `email`, `sameAs` Instagram/Behance, `address`) into `index.html`.
5. Pre-render the homepage (Vite SSG, `vite-plugin-prerender`, or move to Next.js) so non-Google crawlers and LLMs see the H1, services, locations, and stats.

---

## 1. Technical SEO   —   Score 25 / 100

| Check | Result | Severity |
|---|---|---|
| HTTPS + HSTS | ✅ HSTS `max-age=63072000; includeSubDomains; preload` | OK |
| HTTP/2 | ✅ | OK |
| `robots.txt` | ❌ 404 | **High** |
| `sitemap.xml` | ❌ 404 | **High** |
| `llms.txt` | ❌ 404 | Medium |
| `favicon.ico` | ❌ 404 (only `/vite.svg` referenced) | Medium |
| `<link rel="canonical">` | ❌ Missing | **High** |
| `<meta name="robots">` | ❌ Missing (defaults to index/follow — OK but no control) | Low |
| Client-side routing fallback | ❌ `/gallery` → 404 NOT_FOUND from Vercel | **Critical** |
| Server-rendered HTML | ❌ Empty `<div id="root">` shell | **Critical** |
| `cache-control` on static assets | ⚠️ `max-age=0, must-revalidate` even on hashed JS/CSS/images — no browser caching | **High** |
| `Content-Security-Policy` | ❌ Not set | Medium |
| `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` | ❌ Not set | Low/Medium |
| `lang="en"` on `<html>` | ✅ | OK |
| Mobile viewport meta | ✅ | OK |
| Redirects | N/A — single page | OK |

**Notes**
- Vercel default cache headers are `max-age=0, must-revalidate` even for hashed assets like `index-hsPKH4E8.js`. With Vite's content hashes you should serve `cache-control: public, max-age=31536000, immutable`. Today every visit re-validates ~3 MB of assets.
- The empty body and the `/gallery` 404 together mean only `/` is indexable, and even `/` will only be indexed by Google (which renders JS) — not by Bing, social previewers, or AI engines.

---

## 2. Content Quality (E-E-A-T)   —   Score 35 / 100

Signals reconstructed from the JS bundle (Googlebot will see these post-render):

- **Hero:** "Bringing architecture to life."
- **Services:** Architecture Planning, Elevation Designing, Exterior Renders, Interior Renders, Walkthroughs, 360° Views, plus turnkey construction.
- **Stats claimed:** 30+ Years Experience, 1500+ Completed Projects, 20+ Cities Worldwide, 500+ Happy Clients.
- **About / Founder:** "Hi, I'm Danish. With over a decade of experience in architectural visualization …" — note the contradiction: founder claims "over a decade" while stats claim "30+ Years Experience". Pick one; mismatched numbers hurt trust and E-E-A-T.
- **No blog, case studies, project pages, or service pages** — entire site is a single scroll. Nothing for topical-authority, no internal linking, no per-project deep-dives.
- **No author bio page, no credentials, no awards/clients listed** beyond a profile picture and quote.
- **Contact info:** phone, email, "Amritsar Headquarters, Punjab, India" present in footer (good NAP signal — but only after JS render).

**Recommendations**
- Reconcile the 30+ vs "decade" claim. Add the founding year on the About section.
- Build per-project case-study pages: brief, client (anonymised if needed), location, square footage, software, render time, before/after (CAD → render), final images. 1500+ projects is a massive content moat being wasted.
- Add a "Cities served" landing page per Tier-1 city (Chandigarh, Amritsar, Mohali, Dubai, Delhi, Mumbai, Gurgaon) with city-specific projects, NAP, and unique copy. Quality gate: stay below 30 location pages and ensure ≥ 60 % unique content per page (see `references/quality-gates.md`).
- Add a blog / insight section: "How long does a 3D walkthrough take?", "Exterior vs interior rendering checklist", "Choosing between V-Ray, Corona, Lumion", etc. — these target informational queries that feed into AI Overview citations.

---

## 3. On-Page SEO   —   Score 20 / 100

| Element | Current | Recommended |
|---|---|---|
| `<title>` | "Ideal Visualizations" (21 chars) | "Ideal Visualizations \| Architectural 3D Rendering & Walkthroughs — Amritsar, India" (≤ 60 chars) |
| `<meta name="description">` | **Missing** | "Photorealistic 3D architectural rendering, interior & exterior visualization, walkthroughs and 360° tours. Studio in Amritsar serving Delhi, Mumbai, Dubai & 16+ cities." (~155 chars) |
| Canonical | **Missing** | `<link rel="canonical" href="https://ideal-visualizations.vercel.app/">` |
| Open Graph (og:title, og:description, og:image, og:type, og:url) | **All missing** | Add full OG block + 1200×630 share image |
| Twitter Card | **Missing** | `summary_large_image` |
| H1 | "Bringing architecture to life." (only after JS render) | OK once SSR/prerender is added; consider adding "Architectural 3D Visualization Studio" as supporting text |
| H2/H3 hierarchy | Present in DOM after render (Why Choose Us, Spaces in Motion, What we deliver, Behind the Renders, Locations) | OK, but rename "Behind the Renders" to include the founder's name for entity SEO ("About Danish — Founder, Ideal Visualizations") |
| Internal links | Only anchor links + `/gallery` (which 404s) | Add real pages and link to them |
| Outbound links | Instagram, Behance, WhatsApp, YouTube embeds | Add `rel="noopener"` (already present) ✅ |

---

## 4. Schema / Structured Data   —   Score 0 / 100

**No JSON-LD found.** Critical for a multi-city visual portfolio. Add at minimum:

- `ProfessionalService` (or `LocalBusiness` subtype) with `name`, `image`, `@id`, `url`, `telephone`, `email`, `address` (Amritsar, Punjab, IN), `geo`, `areaServed` (array of all 16 cities), `priceRange`, `sameAs` (Instagram, Behance, YouTube channel).
- `Organization` + `founder` (Person: Danish) with `jobTitle`, `image`, `description`.
- `ImageObject` for each portfolio piece — caption + `creator` + `contentUrl`.
- `VideoObject` for each YouTube embed (`name`, `thumbnailUrl`, `uploadDate`, `embedUrl`, `duration`).
- `BreadcrumbList` once you add real routes.

> **Do NOT add** `HowTo` (deprecated Sept 2023) or `FAQPage` (limited to gov/health since Aug 2023 for rich results — only add for AI/LLM citation benefit, flagged as Info, not Critical).

---

## 5. Performance (Core Web Vitals — lab estimate)   —   Score 45 / 100

Field data unavailable (no CrUX entry; Google API credentials not configured locally). Lab-grade estimates from response inspection:

| Metric | Estimate | Threshold | Status |
|---|---|---|---|
| LCP  | ~3.5–5.5 s on 4G mobile (LCP element = `/3D-Images/1.jpg`, **1.45 MB**, no `width/height`, no `srcset`, no `loading="eager"` priority hint, no `fetchpriority="high"`) | ≤ 2.5 s | ❌ Poor |
| INP  | Likely OK (GSAP animations only, no heavy handlers) | ≤ 200 ms | ⚠️ Unknown |
| CLS  | Likely small (images use Tailwind aspect classes) | ≤ 0.1 | ✅ Likely OK |
| Total transfer (initial) | ~7–9 MB just for hero + first-screen 3D images | — | ❌ |

**Issues**
- Hero JPG `1.jpg` is 1.45 MB at full size; should be `<picture>` with AVIF/WebP @ ~150–250 KB plus a low-res LQIP.
- Multiple PNGs (2.png 2.6 MB, 1.png 2.4 MB) used as decorative/portfolio images — convert to WebP/AVIF and serve responsive `srcset`.
- Bundle JS is 405 KB un-gzipped (likely ~130 KB gzipped) — acceptable, but React + GSAP + ScrollTrigger + Router could be code-split per route.
- `cache-control: max-age=0` on hashed assets defeats repeat-visit performance (see Technical).
- Google Fonts loaded as render-blocking stylesheet — add `&display=swap` (already present ✅) and consider self-hosting Poppins via `@fontsource/poppins` to remove the cross-origin handshake.
- YouTube embeds loaded as raw iframes — use `lite-youtube-embed` or `loading="lazy"` (already lazy ✅) plus a facade.

---

## 6. AI Search Readiness (GEO)   —   Score 25 / 100

- **GPTBot, ClaudeBot, PerplexityBot, Google-Extended:** all see an empty page (no SSR). Citability ≈ 0 right now.
- **No `llms.txt`** to declare canonical content surfaces.
- **No author entity / sameAs graph** — LLMs cannot disambiguate "Ideal Visualizations" from generic phrases.
- **No FAQ-style Q&A blocks** (good for AI extraction even when not eligible for Google's FAQ rich result).
- **No structured "About / Services / Locations / Pricing" headings in plain HTML.**

**Action plan**
1. Pre-render or SSR the homepage so AI crawlers see the H1, services list, stats, locations, NAP, and founder bio.
2. Add `llms.txt` at root pointing to `/`, future `/services`, `/gallery`, `/about`, `/contact`.
3. Add JSON-LD `Organization` + `Person` (Danish) + `sameAs` to Instagram, Behance, YouTube, LinkedIn so AI engines can resolve the brand entity.
4. Write at least 3 long-form, citation-friendly guides ("What is architectural 3D rendering?", "How much does a 3D walkthrough cost in India?", "Render turnaround time benchmarks") — these are the chunks LLMs grab.

---

## 7. Local SEO   —   Score 30 / 100

Strong local intent signals exist in the React tree but **none of it is in the rendered HTML** at request time, and there is **no Google Business Profile link** discoverable on-site.

| Signal | Status |
|---|---|
| NAP (Name, Address, Phone) | Partial — Amritsar HQ + phone + email shown after JS render. No street address, no postal code. **High** |
| Google Business Profile link / embed | ❌ None | **High** |
| `LocalBusiness` schema | ❌ None | **High** |
| Service-area markup (`areaServed`) | ❌ None | **High** |
| Per-city landing pages | ❌ None — 16 cities listed as pills only | **High** |
| Reviews / testimonials | ❌ None on-site | **High** |
| Citations (NAP consistency on 3rd-party directories) | Not auditable from site alone | Medium |
| Map embed | ❌ None | Medium |

**Recommendations**
1. Publish complete street address + Google Maps embed + GBP profile link in the footer.
2. Add `LocalBusiness` (or more specific `ProfessionalService`) JSON-LD with full NAP, opening hours, geo coordinates, `areaServed` (Country: IN + AE).
3. Create per-city pages for the top 5 revenue cities (Delhi, Mumbai, Dubai, Chandigarh, Amritsar), each with at least 3 unique projects from that city, unique copy, and city-specific schema.
4. Add a testimonials section with `Review` schema once you have collected ≥ 5 reviews on GBP.

---

## 8. Images   —   Score 10 / 100

| Issue | Details |
|---|---|
| Total weight | Six hero/portfolio images alone exceed **9 MB** uncompressed |
| Format | JPEG + PNG only — no WebP, no AVIF |
| `alt` text | Generic ("3D Architectural Rendering", "Portfolio piece 1", "3D rendering N") — no project, location, style, or material keywords |
| `srcset` / `sizes` | ❌ Not used — same full-resolution file served to mobile and desktop |
| Lazy loading | ✅ `loading="lazy"` on portfolio thumbs |
| `width`/`height` attrs | ❌ Missing — relies on Tailwind aspect classes (CLS-safe but no intrinsic size hint) |
| Image sitemap | ❌ Not present |
| Image filenames | Numeric (`1.jpg`, `2 (2).jpg`) and **contain a space** which is URL-unfriendly | 

**Actions**
- Convert all `/3D-Images/*` to AVIF (primary) + WebP (fallback), generate 480/768/1280/1920 widths, serve via `<picture>` + `srcset`.
- Rewrite `alt` text to project-descriptive: e.g. *"Twilight exterior render of a 4-bedroom modern villa, Mohali, Punjab — Ideal Visualizations"*.
- Rename files (no spaces, descriptive slug) — important for Google Images.
- Generate an image sitemap once project pages exist.

---

## 9. Sitemap & Crawl Architecture   —   Score 0 / 100

Site is effectively a **single-page** experience with one phantom route (`/gallery`) that 404s. A sitemap today would contain a single URL.

**Target architecture (post-fix)**
```
/                 (home)
/services/architecture-planning
/services/elevation-design
/services/exterior-rendering
/services/interior-rendering
/services/walkthroughs
/services/360-views
/locations/amritsar
/locations/chandigarh
/locations/delhi
/locations/mumbai
/locations/dubai
/portfolio                (gallery index)
/portfolio/<project-slug> (case study pages)
/about
/contact
/blog/<post>
```
Then publish a real `sitemap.xml` and image sitemap.

---

## 10. SXO (Search Experience)   —   Score 50 / 100

Visually polished, smooth GSAP animations, clear CTAs (WhatsApp + Callback), strong above-the-fold hierarchy — these are positives.

Friction:
- Two competing primary CTAs (WhatsApp green vs orange Callback) compete for attention. Pick a primary.
- No price/quote indication anywhere — users in B2B procurement bounce when no anchor exists. Even "Projects from ₹X / sq ft" or "Average turnaround: 5–10 days" reduces uncertainty.
- No trust badges (client logos, awards, press) despite "1500+ projects, 500+ clients".
- WhatsApp-first contact may not match enterprise-buyer expectations in Dubai/Mumbai — add an email lead form and a calendar link.

---

## 11. Backlinks   —   Not run

Backlink APIs not configured locally (`scripts/backlinks_auth.py --check` would need Moz / Bing / DataForSEO keys). Recommended next step: enable Common Crawl domain-level metrics or add Moz Free API key.

Likely current state: the project is on a `*.vercel.app` subdomain, which inherits no domain authority and is treated as a preview by most link-graph tools. **Move to a custom domain (e.g., idealvisualizations.com / .in) before any link-building campaign.** This is the single highest-leverage off-page action.

---

## 12. Drift, E-commerce, Cluster, Maps modules

- **seo-drift:** no baseline exists for this URL — recommend running `python scripts/drift_history.py https://ideal-visualizations.vercel.app/ --baseline` after fixes ship.
- **seo-ecommerce:** N/A (no products / cart).
- **seo-cluster:** deferred until at least 5 blog posts exist.
- **seo-maps:** DataForSEO MCP not detected; geo-grid analysis skipped.
- **seo-google (CrUX/GSC/GA4):** Google API credentials not detected (`scripts/google_auth.py --check`). Verify the property in Google Search Console after a custom domain is live.

---

## Methodology & Limitations

- Crawl scope: 1 page (`/`) + 1 attempted route (`/gallery`, 404) + key root files (`robots.txt`, `sitemap.xml`, `llms.txt`, `favicon.ico`).
- Content extracted from the React production bundle (`index-hsPKH4E8.js`); structural conclusions are based on the rendered DOM Googlebot would compose, **not** on what non-rendering crawlers see (which is empty).
- Lab-only performance estimates; field CWV requires CrUX/PSI.
- No live SERP, backlink, or GBP data (corresponding APIs not configured).
