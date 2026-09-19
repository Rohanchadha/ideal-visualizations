# Slate Concepts — Social Media Command Center

A ready-to-use system for a **remote team of 3** to plan, produce, and publish content on
[@slate.concepts](https://www.instagram.com/slate.concepts/) with the goal of hitting
**20,000 followers in 6–12 months.**

---

## 📦 What's in this folder

Each `.csv` file becomes **one tab** in a single Google Sheet.

| # | File | Becomes Tab | Purpose |
|---|------|-------------|---------|
| 1 | `1-Dashboard.csv` | 🏠 Dashboard | Team rules, targets, at-a-glance status |
| 2 | `2-Content-Calendar.csv` | 📅 Calendar | The main planner — what to post, when, who owns it |
| 3 | `3-Content-Pillars-Ideas-Bank.csv` | 💡 Ideas Bank | Your 24 ideas turned into repeatable content pillars |
| 4 | `4-Raw-Assets-Library.csv` | 🎞️ Raw Assets | Every raw clip/photo logged so it can be reused later |
| 5 | `5-Festival-Calendar.csv` | 🪔 Festivals | North India holiday hooks (Diwali, Karva Chauth, etc.) |
| 6 | `6-Roles-Workflow.csv` | 👥 Roles & Workflow | Who does what, production stages, SLAs |
| 7 | `7-Metrics-Tracker.csv` | 📈 Metrics | Weekly follower + engagement tracking vs. the 20k goal |
| 8 | `8-Caption-Hashtag-Bank.csv` | #️⃣ Caption & Hashtag Bank | Reusable hooks, CTAs, hashtag sets |

---

## 🚀 Set it up — pick ONE option

### ✅ Option A (easiest): Upload the ready-made file — 30 seconds
The whole workbook is **already built and styled** for you:
`Slate-Concepts-Social-Command-Center.xlsx`

1. Go to [drive.google.com](https://drive.google.com) → **New → File upload** → pick `Slate-Concepts-Social-Command-Center.xlsx`.
2. Right-click the uploaded file → **Open with → Google Sheets**.
3. **File → Save as Google Sheets** (converts it to a native Sheet).
4. **Share** with your 2 teammates as **Editors** (top-right **Share** button).

All 8 tabs, headers, colors, frozen rows, and starter content are already there.

### ⚡ Option B (fully automated, no upload): Apps Script — 2 minutes
Use `BuildInGoogleSheets.gs.js` to build everything *inside* your account:

1. Go to [sheets.new](https://sheets.new) (blank sheet).
2. **Extensions → Apps Script**.
3. Delete the placeholder code, paste **all** of `BuildInGoogleSheets.gs.js`.
4. Click **▶ Run** (function `buildWorkbook`) and approve the permission prompt.
5. Switch back to the sheet — all 8 tabs are built & styled automatically.

### �️ Option C (manual): Import the CSVs yourself
1. Create a blank Google Sheet named **"Slate Concepts — Social Command Center"**.
2. For **each** CSV: **File → Import → Upload** → *"Insert new sheet(s)"*, then rename the tab.
3. Freeze header rows: **View → Freeze → 1 row**.

> 💡 After any option: **Tools → Notification settings → Email daily digest** so all 3 of you stay in the loop.

---

## 🎨 Recommended color coding (do this once)

On the **Calendar** tab, use conditional formatting on the `Status` column:

| Status | Color |
|--------|-------|
| Idea | Grey |
| Scripting | Yellow |
| Shooting | Orange |
| Editing | Blue |
| Ready | Green |
| Scheduled | Purple |
| Posted | Dark Green |
| Needs Rework | Red |

**Format → Conditional formatting → Text contains** → set each color.

---

## 📊 The strategy behind the sheet (why it's built this way)

**Cadence to hit 20k:** Aim for **1 post/day minimum**, front-loaded with Reels.
Instagram growth in 2026 = Reels-first. Target mix per week:
- **4–5 Reels** (reach engine — this is what grows followers)
- **1–2 Carousels** (saves + authority — great for "Top 5" and "What not to do")
- **3–5 Stories/day** (retention + warm audience)
- **1 collab/repost** (borrow other audiences)

**The 3 jobs on the team** (see Roles tab):
1. **Creative Lead / Strategist** — approves ideas, owns the calendar, writes hooks.
2. **Producer / Shooter** — captures raw footage on site, logs it in Raw Assets.
3. **Editor / Publisher** — edits Reels, writes captions, schedules & posts.

**The reuse engine:** Every raw clip goes into the **Raw Assets Library** with tags.
Six months from now, that ceiling clip you shot for a Reel becomes a carousel,
a "before/after," and a testimonial B-roll. Nothing gets shot twice.

---

## 🗓️ Suggested weekly rhythm

| Day | Ritual | Owner |
|-----|--------|-------|
| **Monday** | 30-min planning call — fill next 2 weeks of Calendar | All 3 |
| **Wed** | Shoot day — capture raw, log in Raw Assets | Producer |
| **Fri** | Edit + schedule the coming week | Editor |
| **Sun** | Review Metrics tab, note what worked | Creative Lead |

Batch-produce: shoot 1 day, edit for the week. Don't create daily — that burns out remote teams.

---

## ✅ First-week checklist

- [ ] Import all 8 tabs into one Google Sheet
- [ ] Share with both teammates as Editors
- [ ] Assign the 3 roles (Roles tab)
- [ ] Fill the first 2 weeks of the Calendar from the Ideas Bank
- [ ] Log your existing raw footage into Raw Assets
- [ ] Set your baseline follower count in the Metrics tab (Week 0)
- [ ] Book a recurring Monday 30-min planning call
