# Meta Lead Ads → Unified Google Sheet CRM — Setup Guide

This connects **two lead sources** into one Google Sheet so you always know
where every lead came from and what stage it's at:

1. **Meta (Facebook/Instagram) Instant Form** leads → `api/meta-leads-webhook.js`
2. **Website callback form** leads → `api/callback.js` (already emails you; now
   also writes to the same Sheet, tagged `Organic/Website`, `Meta Ads`, or
   `Google Ads` based on how the visitor arrived)

Both append rows to one **"Leads"** tab (+ a **"Notes"** tab for free-text
history) using a Google service account — no Zapier/Make, no manual copy-paste.

---

## Part 1 — Create the Google Sheet

1. Create a new Google Sheet (any name, e.g. "Slate Concepts — Leads CRM").
2. Copy the **Sheet ID** from its URL:
   `https://docs.google.com/spreadsheets/d/1NVn1XuX9XSMo6eZfQG65vqydt5wOrLBkkD1BZ4pfbJo/edit`
3. Leave the tabs empty — the code auto-creates `Leads` and `Notes` tabs with
   headers on first run.
4. The first lead or note write after deployment automatically applies a
  readable layout to `Leads` and `Notes`: frozen headers and Lead ID column,
  filters, alternating rows, wrapped text and wider columns. Lead Stage,
  Lead Score and Note Type have dropdowns. The layout is applied once, so
  subsequent writes do not reset your manual formatting.
5. Mobile numbers are stored as text, preserving `+` and leading zeros.
  Existing phone cells with formula errors are repaired only when their
  stored formula contains a recognizable phone number. Other formulas and
  existing text values are left untouched. Previously lost leading zeros
  cannot be reconstructed automatically.

## Part 2 — Google authentication (lets the server write to the Sheet)

You need **one** of these two modes. Try Mode A first; if your Google
Workspace org blocks service-account key creation (error mentioning
`iam.managed.disableServiceAccountKeyCreation`), use Mode B instead — no
admin permissions required.

### Mode A — Service Account (simplest, if your org allows it)

1. Go to https://console.cloud.google.com → create/select a project.
2. **APIs & Services → Library** → enable **"Google Sheets API"**.
3. **IAM & Admin → Service Accounts → Create Service Account**
   - Name: `slate-leads-writer` (anything works)
   - No roles needed at the project level — access is granted via sharing the Sheet.
4. Open the new service account → **Keys → Add Key → Create new key → JSON**.
   Download it.
   - ⚠️ If this fails with *"Service account key creation is disabled"*, your
     org enforces `iam.managed.disableServiceAccountKeyCreation` — skip to
     Mode B below instead of asking an admin to change org-wide policy.
5. From the JSON file, you need two values:
   - `client_email` → this is `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → this is `GOOGLE_SERVICE_ACCOUNT_KEY` (keep the `\n` escapes as-is)
6. Open your Google Sheet → **Share** → paste the `client_email` → give **Editor** access.

### Mode B — OAuth2 user credentials (use this if Mode A is blocked)

This authenticates as a real Google user (e.g. `danish@slateconcepts.com`)
instead of a service account, so it isn't subject to the SA-key-creation policy.

1. Go to https://console.cloud.google.com → create/select a project (can be
   the same one from Mode A, or create a fresh one under a **personal Gmail
   account** instead of the Workspace org if you'd rather avoid org policies
   entirely).
2. **APIs & Services → Library** → enable **"Google Sheets API"**.
3. **APIs & Services → OAuth consent screen**:
   - User Type: **External** (or Internal if available on a Workspace project)
   - App name: anything, e.g. "Slate Leads Writer"
   - Add your own email as a test user if prompted (External + Testing mode).
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Under **Authorized redirect URIs**, add: `http://localhost:8080`
   - Note the **Client ID** and **Client Secret** → these become
     `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET`.
5. Generate a **refresh token** for the account that will own the Sheet
   access (one-time, manual flow — Google's old "copy-paste code" `oob` flow
   is deprecated, so this uses a loopback redirect instead):
   - Open in a browser (replace `CLIENT_ID`):
     ```
     https://accounts.google.com/o/oauth2/v2/auth?client_id=CLIENT_ID&redirect_uri=http://localhost:8080&response_type=code&scope=https://www.googleapis.com/auth/spreadsheets&access_type=offline&prompt=consent
     ```
   - Sign in, approve. Your browser will redirect to
     `http://localhost:8080/?code=XXXXX...` (the page itself will fail to
     load — that's fine, just copy the `code` value out of the address bar).
   - Exchange it for a refresh token:
     ```bash
     curl -s https://oauth2.googleapis.com/token \
       -d client_id=CLIENT_ID \
       -d client_secret=CLIENT_SECRET \
       -d code=PASTE_CODE_HERE \
       -d grant_type=authorization_code \
       -d redirect_uri=http://localhost:8080
     ```
   - The JSON response's `refresh_token` → `GOOGLE_OAUTH_REFRESH_TOKEN`.
6. Make sure the Google account you authenticated as already has **Editor**
   access to the Sheet (if it's the Sheet's owner, this is automatic).

## Part 3 — Meta App + Webhook (for native Instant Form leads)

1. Go to https://developers.facebook.com → **My Apps → Create App** → type "Business".
2. In the app dashboard, **Add Product → Webhooks**.
3. **Webhooks → Page → Subscribe to this object**:
   - Callback URL: `https://slateconcepts.com/api/meta-leads-webhook`
   - Verify Token: make up any string, e.g. `slate-meta-verify-2026` →
     set this exact value as `META_WEBHOOK_VERIFY_TOKEN` in Vercel.
   - Subscribed field: `leadgen`
   - Click **Verify and Save** (Vercel must already have the env var deployed
     for the GET handshake in `meta-leads-webhook.js` to succeed).
4. **App Settings → Basic** → copy **App Secret** → `META_APP_SECRET`.
5. Generate a **Page Access Token** with `leads_retrieval` + `pages_show_list`
   permissions:
   - Easiest: **Graph API Explorer** (developers.facebook.com/tools/explorer)
     → select your app + Page → request those permissions → generate token.
   - For production, exchange it for a **long-lived token** (60 days) or set
     up a System User token (doesn't expire) via Business Settings — recommended
     once this is working, so you don't have to refresh it every 2 months.
   - Set as `META_PAGE_ACCESS_TOKEN`.
6. Make sure your Page's Instant Forms are linked to this same App (Meta does
   this automatically once the Page is connected to the App in Business Settings).

## Part 4 — Environment variables in Vercel

Add all of these in **Vercel Dashboard → Project → Settings → Environment Variables**
(apply to Production + Preview). Use **either** the Mode A or Mode B Google
auth rows, not both:

| Variable | Value |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` *(Mode A)* | from the service account JSON |
| `GOOGLE_SERVICE_ACCOUNT_KEY` *(Mode A)* | from the service account JSON (keep `\n`) |
| `GOOGLE_OAUTH_CLIENT_ID` *(Mode B)* | from the OAuth client |
| `GOOGLE_OAUTH_CLIENT_SECRET` *(Mode B)* | from the OAuth client |
| `GOOGLE_OAUTH_REFRESH_TOKEN` *(Mode B)* | from the token exchange step |
| `LEADS_SHEET_ID` | the Sheet ID from Part 1 |
| `META_WEBHOOK_VERIFY_TOKEN` | the string you chose in Part 3 |
| `META_APP_SECRET` | from Meta App → Basic Settings |
| `META_PAGE_ACCESS_TOKEN` | Page/System User access token |

Then **redeploy** so the functions pick up the new env vars, and re-run the
webhook **Verify and Save** step in Meta if it failed before the vars existed.

---

## How it works

- **Meta lead comes in** → Meta POSTs a `leadgen` event with just an ID →
  `meta-leads-webhook.js` verifies the signature, fetches the real answers
  from the Graph API, maps question text (e.g. "What are you looking for?")
  to schema fields (`Lead Type`), and appends a row + an auto-note with the
  raw Q&A (so nothing is lost even if a future form's wording doesn't match
  the keyword map in `QUESTION_MAP`).
- **Website form comes in** → `callback.js` sends the email like before, and
  now also appends a row tagged with `Lead Source` detected from the URL the
  visitor originally landed on (`fbclid`/`utm_source=facebook` → "Meta Ads",
  `gclid`/`utm_source=google` → "Google Ads", otherwise "Organic/Website").

## Adding new Meta question mappings

If you create a new Instant Form with differently-worded questions, add a
line to `QUESTION_MAP` in `api/meta-leads-webhook.js`:

```js
{ match: /your new question phrase/i, field: 'Budget Range' },
```

Unmapped answers are never dropped — they're still saved into the lead's
auto-note as raw text, just not placed into a dedicated column.

## Testing

- Run `node --test scripts/test-sheets.mjs` for mocked regression checks of
  phone handling, layout requests and safe repair of existing phone errors.
- To apply the layout without creating a test lead, run
  `node scripts/format-crm-sheet.mjs` with the Google auth variables and
  `LEADS_SHEET_ID` available in your environment or an untracked local
  `.env`. The script reports only tab names and the number of repaired phones.
  Never commit credentials. If the layout was already applied, it is a no-op.
- **Meta side:** Meta's webhook setup page has a "Test" button that sends a
  sample `leadgen` event — check Vercel function logs
  (`Deployments → Functions → /api/meta-leads-webhook → Logs`) and the Sheet.
- **Website side:** submit the callback form on a Preview deployment URL with
  `?utm_source=facebook&utm_campaign=test` appended, confirm the Sheet row
  shows `Lead Source: Meta Ads`, `Campaign Name: test`.

## Historical Meta leads

`node scripts/backfill-meta-leads.mjs --form=FORM_ID` fetches all available
pages from that form and previews changes without writing. Repeat `--form`
for other forms, including archived forms used in previous campaigns.
Add `--write` only after reviewing the preview counts. Google auth variables,
`LEADS_SHEET_ID` and `META_PAGE_ACCESS_TOKEN` must be available; an ignored
env file can be selected with `--env-file=PATH`. Never commit lead exports
or credentials. Use `--file=PATH` for a complete JSON lead array instead of
live Meta access; do not include pagination URLs or access tokens.

When Vercel does not provide secret values to a local environment pull, use
the deployed `/api/meta-leads-backfill` maintenance endpoint. It requires a
separate random `CRM_BACKFILL_TOKEN` in Production and an HTTPS POST with
`Authorization: Bearer TOKEN`. The JSON body is
`{"formIds":["FORM_ID"],"write":false}` for a preview; explicitly set
`write` to `true` for import. Remove the maintenance token and redeploy when
finished, so the endpoint rejects further requests. Never put tokens in URLs.

Imports preserve Meta's original creation timestamps, store Meta Lead ID
and Meta Form ID in appended CRM columns, and skip dummy test leads unless
`--include-tests` (or `includeTests: true`) is explicitly requested. Website
enquiries are never merged with Meta submissions merely because contact
details match. Existing Meta rows are matched by their Meta ID, or by an
exact form/raw-answer note match for legacy rows without IDs. Ambiguous
matches stop the import. Existing stages, owners and manual notes are
preserved; missing mapped fields are filled. Lead and auto-note writes use
one atomic Sheets batch. Repeat imports skip already imported leads.

Run one backfill at a time and do not sort or edit the CRM while it is
running. This is not a transactional database lock against simultaneous
webhook deliveries or other import processes. Meta typically retains
retrievable leads for 90 days; older history requires a saved export. API
permissions and untargeted-lead restrictions can also limit available results.

## Notes tab

Every automated capture also writes one row to the `Notes` tab with the raw
answers, so nothing is lost even for partially-mapped forms. The team can add
manual rows here too (`Lead ID | Timestamp | Author | Note Type=Manual | Note Text`)
to log calls, site visits, etc. — a simple `=FILTER(Notes!A:E, Notes!A:A="LD-2026-XXXX")`
formula on the Leads tab (or a small Apps Script sidebar) can show a lead's
full history in one place if you want that later.
