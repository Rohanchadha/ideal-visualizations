# Action Plan — Ideal Visualizations

Prioritised by impact × effort. **Critical = ship this week. High = within 2 weeks. Medium = within 1 month. Low = backlog.**

---

## 🔴 CRITICAL (do first — blocks indexing & social)

### C1. Fix SPA routing so client-side routes don't return 404
**Problem:** `https://ideal-visualizations.vercel.app/gallery` returns Vercel's `NOT_FOUND` HTML 404. Any future route will too.
**Fix:** add a `vercel.json` at repo root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
**Effort:** 5 min. **Impact:** unlocks indexing of every future route.

### C2. Pre-render (or SSR) the homepage
**Problem:** the served HTML is `<body><div id="root"></div></body>`. Bing, DuckDuckGo, GPTBot, ClaudeBot, PerplexityBot, Slack, LinkedIn, X all see no content.
**Fix options (pick one):**
- Easiest: add `vite-plugin-prerender` or `vite-plugin-ssg` and pre-render `/`, `/gallery`, future routes at build time.
- Best long-term: migrate to **Next.js** (App Router) — keep React + Tailwind + GSAP, gain SSR/ISR, image optimisation, route-based code-splitting.
**Effort:** 1–2 days (prerender) / 3–5 days (Next.js port). **Impact:** unlocks ~70 % of off-Google organic and AI citations.

### C3. Add real `<head>` metadata
Edit `index.html` (or per-route `<Head>` if Next):
```html
<title>Ideal Visualizations | Architectural 3D Rendering, Walkthroughs & 360° — Amritsar, India</title>
<meta name="description" content="Photorealistic 3D architectural rendering, interior & exterior visualization, walkthroughs and 360° tours. Amritsar studio serving Delhi, Mumbai, Dubai and 16+ cities.">
<link rel="canonical" href="https://ideal-visualizations.vercel.app/">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:title" content="Ideal Visualizations — Architectural 3D Rendering Studio">
<meta property="og:description" content="Photorealistic 3D rendering, walkthroughs & 360° tours. 1500+ projects across 20+ cities.">
<meta property="og:image" content="https://ideal-visualizations.vercel.app/og-cover-1200x630.jpg">
<meta property="og:url" content="https://ideal-visualizations.vercel.app/">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```
Also generate and ship `/favicon.ico` (currently 404) and `/og-cover-1200x630.jpg`.
**Effort:** 30 min. **Impact:** SERP CTR + every social share.

### C4. Add `LocalBusiness` / `ProfessionalService` JSON-LD
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://ideal-visualizations.vercel.app/#org",
  "name": "Ideal Visualizations",
  "image": "https://ideal-visualizations.vercel.app/og-cover-1200x630.jpg",
  "url": "https://ideal-visualizations.vercel.app/",
  "telephone": "+91-XXXXXXXXXX",
  "email": "hello@idealvisualizations.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "<street>",
    "addressLocality": "Amritsar",
    "addressRegion": "Punjab",
    "postalCode": "<pin>",
    "addressCountry": "IN"
  },
  "areaServed": [
    "Amritsar","Chandigarh","Jalandhar","Ludhiana","Mohali","Bathinda","Manali","Shimla",
    "Delhi","Mumbai","Bangalore","Noida","Gurgaon","Hyderabad","Kolkata","Dubai"
  ],
  "founder": {
    "@type": "Person",
    "name": "Danish",
    "jobTitle": "Founder & Lead 3D Visualization Artist"
  },
  "sameAs": [
    "https://www.instagram.com/<handle>",
    "https://www.behance.net/<handle>",
    "https://www.youtube.com/<channel>"
  ]
}
```
**Effort:** 1 hour. **Impact:** Knowledge-Panel eligibility, local pack signal, AI entity resolution.

### C5. Publish `robots.txt`, `sitemap.xml`, `llms.txt`
Drop into `public/`:
```
# robots.txt
User-agent: *
Allow: /
Sitemap: https://ideal-visualizations.vercel.app/sitemap.xml
```
```xml
<!-- sitemap.xml -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://ideal-visualizations.vercel.app/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://ideal-visualizations.vercel.app/gallery</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
</urlset>
```
```
# llms.txt
# Ideal Visualizations — Architectural 3D Visualization Studio
- Home: https://ideal-visualizations.vercel.app/
- Gallery: https://ideal-visualizations.vercel.app/gallery
Contact: hello@idealvisualizations.com  |  WhatsApp: +91-…
```
**Effort:** 15 min. **Impact:** discovery + AI citation surface.

---

## 🟠 HIGH (within 2 weeks)

### H1. Move to a custom domain (`idealvisualizations.com` or `.in`)
`*.vercel.app` is treated as preview/staging by many link-graph tools and inherits zero topical authority. Buy domain → set in Vercel → add 301 from old → update GBP, social profiles, sitemap.
**Effort:** half-day. **Impact:** the single biggest off-page lever.

### H2. Verify Google Search Console + Bing Webmaster Tools + GA4
Submit sitemap, request indexing for `/`, monitor coverage. Run `python scripts/google_auth.py --check` once credentials are in place to enable richer audits.

### H3. Fix asset caching
Configure Vercel to send `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` (Vite's hashed bundles) and `/3D-Images/*`. Add to `vercel.json`:
```json
{
  "headers": [
    { "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/3D-Images/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=2592000" }] }
  ]
}
```

### H4. Optimise hero & portfolio images
- Convert all `/3D-Images/*` to AVIF + WebP at multiple widths (480/768/1280/1920).
- Use `<picture>` + `srcset` + `sizes`.
- Hero image: add `fetchpriority="high"`, `decoding="async"`, intrinsic `width`/`height`.
- Rename `2 (2).jpg` → `villa-mohali-twilight-exterior.avif` (no spaces, descriptive slug).
- Rewrite all `alt` text with project + city + style.
**Effort:** 1 day with a script (sharp / squoosh-cli). **Impact:** LCP from ~5 s → ~1.8 s; Google Images traffic.

### H5. Add real internal pages (architecture)
Build out the route tree in §9 of the audit (Services × 6, Locations × 5, Portfolio index + project pages, About, Contact). Even MVP versions with 300–600 words each will multiply indexed surface area 20×.

### H6. Add Google Business Profile + on-site link/embed
Claim/verify GBP for the Amritsar HQ. Embed Google Map in footer. Link to GBP from footer.

### H7. Fix the "30+ Years vs decade" trust contradiction
Choose the truthful number and align the hero stats with the founder bio. Add the founding year on the About section.

---

## 🟡 MEDIUM (within 1 month)

### M1. Per-city landing pages (top 5 cities only — quality gate)
Delhi, Mumbai, Dubai, Chandigarh, Amritsar. Each ≥ 600 unique words, ≥ 3 unique projects, city-specific testimonials, embedded map, `LocalBusiness` schema with city `areaServed`. **Hard cap: stay under 30 city pages and keep ≥ 60 % unique content per page** (per `references/quality-gates.md`).

### M2. Case-study pages for top 10 projects
Each = client brief, location, software stack (V-Ray / Corona / Lumion / Unreal), turnaround time, 6–12 final renders + 1 CAD/sketch reference. Add `CreativeWork` + `ImageObject` schema.

### M3. Add `VideoObject` schema for the 4 YouTube embeds
Pulls them into Google Video results and improves AI engine extraction.

### M4. Content marketing: 6 cornerstone blog posts
Suggested cluster around "architectural 3D rendering":
1. "How much does architectural 3D rendering cost in India? (2026)"
2. "Exterior vs interior rendering: a buyer's guide"
3. "How long does a 3D walkthrough take?"
4. "V-Ray vs Corona vs Lumion vs Unreal: studio benchmark"
5. "What to send your 3D rendering studio: a CAD prep checklist"
6. "360° tours for real-estate marketing: a step-by-step playbook"

### M5. Capture drift baseline
Once Critical + High items ship: `python scripts/drift_history.py https://idealvisualizations.com/ --baseline`. Re-run monthly.

### M6. Self-host Poppins font
Replace render-blocking Google Fonts with `@fontsource/poppins` to remove the cross-origin handshake (~150–300 ms LCP saving on cold visits).

### M7. Replace YouTube iframes with a facade
Use `lite-youtube-embed`. Saves ~1 MB and ~12 requests on initial load.

---

## 🟢 LOW (backlog)

- `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` headers.
- Code-split the React Router tree so `/gallery` doesn't ship hero/services JS.
- Add Reviews/Testimonials section + `Review` schema (after collecting ≥ 5 GBP reviews).
- Add a press/awards strip for trust signals.
- Multi-language (English + Hindi + Punjabi + Arabic for Dubai market) — defer until traffic warrants and use proper `hreflang` (run `/seo hreflang` later).
- Add a `Pricing` or "Starts from" anchor for B2B procurement clarity.

---

## Suggested 4-week sprint

| Week | Tasks |
|------|-------|
| 1 | C1 → C5, H3 (caching), buy domain (start of H1) |
| 2 | H1 (domain go-live + 301), H2 (GSC/Bing), H4 (image pipeline), H6 (GBP), H7 (copy fix) |
| 3 | H5 (route tree MVP) + M3 (VideoObject) + M5 (drift baseline) |
| 4 | M1 (top 5 city pages) + M2 (first 3 case studies) + M4 (first 2 cornerstone posts) + M6/M7 (perf polish) |

After week 4, expected SEO Health Score: **~75–82 / 100**.

---

## Re-audit checklist

After Week 1: re-run `/seo audit https://ideal-visualizations.vercel.app/` (or new domain). Confirm:
- [ ] `curl -sI https://<domain>/gallery` returns **200**, not 404
- [ ] `curl -s https://<domain>/ | grep -c "<h1"` returns **≥ 1** (SSR working)
- [ ] `curl -sI https://<domain>/robots.txt` returns **200**
- [ ] `curl -sI https://<domain>/sitemap.xml` returns **200**
- [ ] Rich Results Test passes for `ProfessionalService` schema
- [ ] LCP image < 300 KB after AVIF conversion
- [ ] Open Graph debugger (Facebook / LinkedIn / X) shows preview card

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built by agricidaniel — Join the AI Marketing Hub community
🆓 Free  → https://www.skool.com/ai-marketing-hub
⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
