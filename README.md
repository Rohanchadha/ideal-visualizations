# Slate Concepts — Marketing Site

A modern, animated marketing site for **Slate Concepts**, an architecture & 3D-visualization studio.
Built with React 19, Vite 7, Tailwind CSS v4, GSAP and React Router.

## Prerendering and Routing

`npm run build` now renders every published route into its own HTML file, plus `404.html`. The existing prebuild hook still refreshes gallery/sitemap source data. For a website-only build that preserves local generated data, use:

```bash
npm run build:site
node --test scripts/test-attribution.mjs scripts/test-prerender.mjs
npx vite preview --host 127.0.0.1 --port 4177
```

The render step reuses the React pages and SEO metadata, checks headings/canonicals/JSON-LD, excludes drafts, and generates the deployed sitemap from the same inventory. Unknown modification dates are omitted rather than set to the build date. React hydrates the initial content; development still uses the SPA server. Vercel uses clean HTML URLs and its native custom 404, not a catch-all homepage rewrite. Check redirects, 404 status codes and representative initial HTML on a preview deployment before publishing. Vite preview does not emulate Vercel redirects or serverless APIs.

## Search Measurement Handoff

Account baselines and production verification are pending owner access; build success does not establish indexing, rankings or delivered leads.

- Search Console: export recent 90-day and 28-day query/page data, inspect home, Amritsar, construction, portfolio and one article, and submit the deployed sitemap. Compare Amritsar construction queries separately from brand and international rendering queries before deciding whether home or the Amritsar hub owns each cluster.
- Google Business Profile: confirm owner access, business name, Taylor Road pin, daily 10:00-19:30 hours, service categories, phone and website. Danish's CoA registration is owner-confirmed; do not invent a registration number. No listing changes have been made.
- Use a tested GBP website URL such as `https://slateconcepts.com/?utm_source=google&utm_medium=organic&utm_campaign=amritsar-gbp`. Check persistence into the callback payload and CRM campaign; do not classify this as Google Ads.
- GA4 DebugView/Realtime: verify one page view per route and phone, directions, WhatsApp and callback intent events. `callback_submit_success` must fire only for successful delivery. Never send names, phone numbers or email addresses to analytics; any controlled lead test requires owner approval and cleanup.
- Existing CRM `Organic/Website` remains a combined website bucket: untagged/direct traffic is not proven organic search. Report it as unassigned website traffic until referrer/direct classification is explicitly implemented and verified. Calls and WhatsApp clicks are intent, not completed enquiries.
- Each week, record local nonbrand impressions/clicks, indexed priority pages, GBP interactions, verified enquiries, qualified Amritsar/Ludhiana construction leads and consultations. Set numerical goals from the baseline; do not promise rankings or invent traffic improvements.
- Project-detail pages remain deferred until actual scope, media permissions and project facts are provided. Do not label a visualization as a completed build.

---

## ✨ Features

- **Cinematic Hero** with GSAP entrance animations
- **Two-category Services** section (Architecture & Construction / 3D Visualization)
- **About — _Behind the Renders_**, **Why Choose Us**, **Portfolio**, **Cinema (videos)**, **Locations**
- **Dedicated Gallery page** (`/gallery`)
  - Tabs for Images / Videos
  - Click any tile to open in **full-screen lightbox** with **zoom in/out**, pan, double-tap & pinch-to-zoom on mobile, keyboard navigation (←/→, +/−, Esc, 0)
  - Mobile-responsive grid (2→3→4 columns)
- **Floating WhatsApp** button + global **"Talk on WhatsApp"** + **"Request a Callback"** primary CTAs
- **Callback request modal** with full validation:
  - Name, Country (dropdown), City (cascades from country), Service Required, Phone (with country code), Email (regex-validated), free-text message
  - Submits via **`/api/callback`** (nodemailer + SMTP) → branded notification email to `danish@slateconcepts.com` + auto-response to the lead
- **Auto-generated gallery manifest** from `public/gallery/` — drop in new media and it just appears
- **Image optimization pipeline** powered by `sharp`: every gallery image is converted to two `.webp` variants (full + thumb), shrinking ~176 MB of originals down to **~11 MB** of web-ready assets

---

## 🚀 Quick start

```bash
npm install
npm run dev          # → http://localhost:5173
```

The `predev` and `prebuild` hooks automatically:

1. Optimize any new images dropped into `public/gallery/images/`
2. Regenerate `src/config/galleryManifest.js`

So the gallery always reflects what's on disk — no manual lists to keep in sync.

---

## 📜 Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run gallery:optimize` | Re-encode any new originals to optimized `.webp` (full + thumb) |
| `npm run gallery:manifest` | Regenerate `src/config/galleryManifest.js` from disk |
| `npm run gallery:build` | Run optimize + manifest in sequence |

---

## 🗂 Project structure

```
ideal-visualizations/
├── public/
│   ├── gallery/
│   │   ├── images/        ← drop original images here (gitignored, can be huge)
│   │   ├── videos/        ← drop videos here (gitignored — see note below)
│   │   └── optimized/     ← auto-generated .webp variants (committed to git)
│   ├── 3D-Images/         ← assets used by the marketing sections (Hero, Portfolio…)
│   └── DanishProfilePicture.png
├── scripts/
│   ├── optimize-gallery.js        ← sharp-based image optimizer
│   └── build-gallery-manifest.js  ← generates galleryManifest.js
├── src/
│   ├── App.jsx                    ← routes + global providers
│   ├── main.jsx
│   ├── index.css                  ← Tailwind + custom utilities
│   ├── components/
│   │   ├── Navbar.jsx             ← responsive nav with mobile menu
│   │   ├── Hero.jsx
│   │   ├── About.jsx              ← "Behind the Renders"
│   │   ├── Services.jsx           ← Arch & Construction + 3D Viz categories
│   │   ├── WhyChooseUs.jsx
│   │   ├── Portfolio.jsx
│   │   ├── VideoShowcase.jsx
│   │   ├── Locations.jsx
│   │   ├── Footer.jsx             ← contact info, socials, CTA band
│   │   ├── FloatingWhatsApp.jsx
│   │   ├── CallbackForm.jsx       ← validated modal form
│   │   └── Lightbox.jsx           ← full-screen zoom/pan viewer
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   └── GalleryPage.jsx
│   ├── context/
│   │   └── UIContext.jsx          ← global modal state (openCallback)
│   └── config/
│       ├── site.js                ← contact info, services, countries
│       └── galleryManifest.js     ← AUTO-GENERATED — do not edit by hand
└── package.json
```

---

## 🖼 Adding new gallery media

### Images
1. Drop new files into `public/gallery/images/` (any of `.jpg`, `.jpeg`, `.png`, `.webp`).
2. Run `npm run dev` (auto-optimizes), or `npm run gallery:build` if the dev server is already running.
3. They appear in `/gallery` automatically.

### Videos
1. Drop `.mp4`, `.mov`, `.webm`, or `.m4v` files into `public/gallery/videos/`.
2. Run `npm run gallery:manifest`.

> ⚠️ **GitHub note:** GitHub blocks any single file over 100 MB. The folder `public/gallery/videos/` is therefore **gitignored**. For deployment, upload the videos directly to the host (Netlify/Vercel via CLI, or copy them into the deploy artefact). Alternatively, host them on a CDN / Cloudflare R2 / Bunny.net and replace the URLs in `galleryManifest.js`.

---

## 📞 Contact / form delivery

The Callback form posts to **`/api/callback`** — a Vercel Serverless Function (`api/callback.js`) using **nodemailer + SMTP**. Submissions trigger:

1. A branded **notification email** to the studio inbox (`LEADS_TO`)
2. A branded **auto-response email** to the lead

See [`CALLBACK-SETUP.md`](./CALLBACK-SETUP.md) for full setup (Resend / Zoho / Gmail / SendGrid all supported). Required env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `LEADS_TO`.

To change the destination, update `LEADS_TO` in Vercel → Settings → Environment Variables (no code change required).

---

## 🛠 Tech stack

- **React 19** + **React Router 7**
- **Vite 7** (dev server + bundler)
- **Tailwind CSS v4** (`@tailwindcss/vite` plugin)
- **GSAP + ScrollTrigger** for entrance / scroll animations
- **lucide-react** icons
- **sharp** for image optimization
- **nodemailer** + Vercel Serverless Functions for callback form → email delivery

---

## 📦 Deployment

```bash
npm run build       # outputs to dist/
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, S3 + CloudFront…).

Because the site uses client-side routing, configure your host to **fall back to `index.html`** for unknown paths (e.g. on Netlify add a `_redirects` file with `/* /index.html 200`).

---

© Slate Concepts — All rights reserved.

