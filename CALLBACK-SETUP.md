# Callback Form — SMTP Setup Guide

The callback form is handled by `api/callback.js`, a Vercel Serverless Function that uses **nodemailer** + SMTP to:

1. Validate the submission server-side (with honeypot anti-spam + rate-limiting)
2. Email a branded notification to the studio inbox (`LEADS_TO`)
3. Email an auto-response to the lead so they know we received their request
4. Return JSON to the form — no page reload, no third-party redirect

---

## 1. Pick an SMTP provider

You have several free / low-cost options. Pick **one**:

### Option A — Resend (recommended for new domains)
- Sign up at https://resend.com (free 3,000 emails/month, 100/day)
- Add & verify your domain `slateconcepts.com` (DNS records)
- Create an API key
- SMTP credentials:
  ```
  SMTP_HOST=smtp.resend.com
  SMTP_PORT=465
  SMTP_SECURE=true
  SMTP_USER=resend
  SMTP_PASS=<your re_xxxxx api key>
  SMTP_FROM="Slate Concept Studios <noreply@slateconcepts.com>"
  ```

### Option B — Zoho Mail (if you already host email there)
- If `danish@slateconcepts.com` is hosted on Zoho:
  ```
  SMTP_HOST=smtp.zoho.in           # or smtp.zoho.com depending on data centre
  SMTP_PORT=465
  SMTP_SECURE=true
  SMTP_USER=danish@slateconcepts.com
  SMTP_PASS=<App Password from Zoho — not your real password>
  SMTP_FROM="Slate Concept Studios <danish@slateconcepts.com>"
  ```
- Generate App Password: Zoho Mail → My Account → Security → App Passwords

### Option C — Gmail / Google Workspace
- Best if `danish@slateconcepts.com` is on Google Workspace
- Enable 2FA on the account
- Generate App Password: https://myaccount.google.com/apppasswords
  ```
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=465
  SMTP_SECURE=true
  SMTP_USER=danish@slateconcepts.com
  SMTP_PASS=<16-character App Password>
  SMTP_FROM="Slate Concept Studios <danish@slateconcepts.com>"
  ```

### Option D — Brevo / SendGrid / Mailgun
- See `.env.example` for credential formats. All work the same way.

---

## 2. Configure environment variables in Vercel

1. Go to **Vercel Dashboard → ideal-visualizations project → Settings → Environment Variables**
2. Add each of these (apply to **Production**, **Preview**, **Development**):

| Variable | Example value |
|---|---|
| `SMTP_HOST` | `smtp.resend.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `resend` (Resend) or your email (Gmail/Zoho) |
| `SMTP_PASS` | API key or App Password — **never your real password** |
| `SMTP_FROM` | `Slate Concept Studios <noreply@slateconcepts.com>` |
| `LEADS_TO` | `danish@slateconcepts.com` |
| `LEADS_CC` | *(optional)* `sales@slateconcepts.com` |

3. Trigger a redeploy: **Deployments → ⋯ → Redeploy** (no code push needed)

---

## 3. Test it end-to-end

### On production:
1. Open the live site → click "Request a Callback"
2. Submit the form with your real email
3. You should:
   - See the green "Request received!" success state
   - Receive the **branded notification email** at `danish@slateconcepts.com`
   - Receive the **auto-response email** at the address you submitted

### Locally:
Plain `npm run dev` (Vite) does **NOT** serve `/api/*` routes. You have two options:

**Option 1 — `vercel dev` (recommended):**
```bash
npm install -g vercel        # one-time
vercel link                   # one-time, links the local repo to your Vercel project
vercel dev                    # runs Vite + serverless functions on http://localhost:3000
```

**Option 2 — Test only on Preview deployments:**
Push a branch and use the auto-generated `*-git-*.vercel.app` preview URL.

---

## 4. Monitoring & debugging

- **Function logs:** Vercel Dashboard → Deployments → your latest deployment → Functions → `/api/callback` → Logs
- **GA events:** GA4 → Reports → Engagement → Events. Look for:
  - `callback_submit_success` — successful submissions (mark as Conversion)
  - `callback_submit_error` — failures (investigate function logs)
- **Rate limit:** 5 submissions per IP per minute (in-memory, per warm instance). Adjust in `api/callback.js`.

---

## 5. Anti-spam protection in place

| Layer | How it works |
|---|---|
| Honeypot | Hidden `website` field. Bots fill it; real users don't. Submission silently dropped. |
| Server-side validation | Email format + phone format checked server-side, not just in the browser. |
| Rate limiting | 5 submissions per IP per minute per warm instance. |
| Method check | Only `POST` is accepted; `GET`/etc return 405. |
| Field length caps | All inputs trimmed and capped (name 120, message 2000, etc.) to prevent abuse. |

If spam still becomes an issue, add **hCaptcha** or **Cloudflare Turnstile** — both have free tiers and integrate cleanly.

---

## 6. Customizing the emails

Both email templates live in `api/callback.js`:
- `notificationHtml(lead)` — what the studio receives
- `autoResponseHtml(lead)` — what the lead receives

Plain inline HTML, fully self-contained. Change branding/copy/colours there.
