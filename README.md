# Ideal Visualizations — Marketing Site

A modern, animated marketing site for **Ideal Visualizations**, an architecture & 3D-visualization studio.
Built with React 19, Vite 7, Tailwind CSS v4, GSAP and React Router.

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
  - Submits via [FormSubmit.co](https://formsubmit.co) → emails arrive at `danish@slateconcepts.com`
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

The Callback form posts to **[FormSubmit.co](https://formsubmit.co)** which emails the submission to `danish@slateconcepts.com`.

> The **first** submission triggers a confirmation email from FormSubmit — click the activation link inside it once. Every future submission then arrives directly in the inbox.

To change the destination, update `CONTACT.email` in `src/config/site.js`.

---

## 🛠 Tech stack

- **React 19** + **React Router 7**
- **Vite 7** (dev server + bundler)
- **Tailwind CSS v4** (`@tailwindcss/vite` plugin)
- **GSAP + ScrollTrigger** for entrance / scroll animations
- **lucide-react** icons
- **sharp** for image optimization
- **FormSubmit.co** for serverless form → email delivery

---

## 📦 Deployment

```bash
npm run build       # outputs to dist/
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, S3 + CloudFront…).

Because the site uses client-side routing, configure your host to **fall back to `index.html`** for unknown paths (e.g. on Netlify add a `_redirects` file with `/* /index.html 200`).

---

© Ideal Visualizations — All rights reserved.

