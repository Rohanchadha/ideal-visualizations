// Vercel Serverless Function — Meta (Facebook/Instagram) Lead Ads webhook.
//
// Flow:
//  1. Meta calls GET once to verify the webhook (hub.challenge handshake).
//  2. On every new Instant Form submission, Meta POSTs a `leadgen` event
//     containing only a `leadgen_id` (no field data).
//  3. We fetch the actual field answers from the Graph API using a Page
//     Access Token, map them onto our unified Leads schema, and append a
//     row (+ an automated Note) to the Google Sheet via api/_lib/sheets.js.
//
// One-time setup in Meta:
//   1. developers.facebook.com → create an App → add "Webhooks" product.
//   2. Subscribe to the Page object, field `leadgen`.
//   3. Callback URL:  https://slateconcepts.com/api/meta-leads-webhook
//      Verify Token:   any string you choose — put the same value in
//                      META_WEBHOOK_VERIFY_TOKEN below.
//   4. Generate a Page Access Token (Graph API Explorer or System User with
//      `leads_retrieval` + `pages_show_list` permissions) → put it in
//      META_PAGE_ACCESS_TOKEN.
//   5. App → Settings → Basic → App Secret → META_APP_SECRET (used to verify
//      the X-Hub-Signature-256 header so random POSTs can't forge leads).
//
// Required environment variables:
//   META_WEBHOOK_VERIFY_TOKEN   chosen by you, matched in Meta's webhook setup
//   META_APP_SECRET             from the Meta App's Basic Settings
//   META_PAGE_ACCESS_TOKEN      long-lived Page access token
//   (plus GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_KEY / LEADS_SHEET_ID
//    from api/_lib/sheets.js)

import crypto from 'node:crypto';
import { appendLead, appendNote, newLeadId } from './_lib/sheets.js';

const GRAPH_API = 'https://graph.facebook.com/v19.0';

// ---------- Map Meta's exact question wording (from your sample) to our schema ----------
// Add more aliases here as you create new/different Instant Forms — matching
// is case-insensitive and tolerant of minor wording changes via includes().
const QUESTION_MAP = [
    { match: /full name|your name/i, field: 'Name' },
    { match: /email/i, field: 'Email' },
    { match: /phone/i, field: 'Mobile Number' },
    { match: /what are you looking for/i, field: 'Lead Type' },
    { match: /budget/i, field: 'Budget Range' },
    { match: /where is your home located|location|city/i, field: 'Location' },
    { match: /when are you planning to start|starting date|timeline/i, field: 'Planned Starting Date' },
    { match: /property type/i, field: 'Property Type' },
    { match: /stage|possession|plot ready/i, field: 'Project Stage' },
    { match: /area|sq ?ft|built.?up|carpet/i, field: 'Carpet / Built-up Area' },
];

function mapFieldName(question) {
    const hit = QUESTION_MAP.find((q) => q.match.test(question));
    return hit ? hit.field : null;
}

function verifySignature(rawBody, signatureHeader) {
    const secret = process.env.META_APP_SECRET;
    if (!secret || !signatureHeader) return false;
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    try {
        return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
    } catch {
        return false;
    }
}

async function fetchLeadFields(leadgenId) {
    const token = process.env.META_PAGE_ACCESS_TOKEN;
    const res = await fetch(`${GRAPH_API}/${leadgenId}?access_token=${encodeURIComponent(token)}`);
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Graph API lead fetch failed: ${res.status} ${text}`);
    }
    return res.json();
}

async function fetchAdCampaignName(adId) {
    if (!adId) return '';
    const token = process.env.META_PAGE_ACCESS_TOKEN;
    try {
        const res = await fetch(`${GRAPH_API}/${adId}?fields=campaign{name}&access_token=${encodeURIComponent(token)}`);
        if (!res.ok) return '';
        const data = await res.json();
        return data?.campaign?.name || '';
    } catch {
        return '';
    }
}

// Vercel needs the raw body to verify the HMAC signature, so disable the
// default body parser and read/parse it ourselves.
export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
    // ---- Step 1: Meta's one-time webhook verification handshake ----
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
            return res.status(200).send(challenge);
        }
        return res.status(403).send('Verification failed');
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    // ---- Step 2: validate signature using the raw body ----
    const rawBody = await readRawBody(req);
    const signature = req.headers['x-hub-signature-256'];
    if (!verifySignature(rawBody, signature)) {
        console.error('Meta webhook: invalid signature');
        return res.status(401).json({ ok: false, error: 'Invalid signature' });
    }

    let payload;
    try {
        payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
        return res.status(400).json({ ok: false, error: 'Invalid JSON' });
    }

    // Acknowledge immediately-ish; Meta expects a fast 200. We process leads
    // sequentially below, which is fine at this volume (a handful/day).
    try {
        const entries = payload.entry || [];
        for (const entry of entries) {
            const changes = entry.changes || [];
            for (const change of changes) {
                if (change.field !== 'leadgen') continue;
                const { leadgen_id: leadgenId, form_id: formId, ad_id: adId } = change.value || {};
                if (!leadgenId) continue;

                let fieldData;
                try {
                    fieldData = await fetchLeadFields(leadgenId);
                } catch (err) {
                    console.error('Failed to fetch lead fields:', err.message);
                    continue; // don't fail the whole batch for one bad lead
                }

                const answers = {};
                for (const f of fieldData.field_data || []) {
                    const mapped = mapFieldName(f.name);
                    const value = (f.values || [])[0] || '';
                    if (mapped) answers[mapped] = value;
                    else answers[f.name] = value; // keep unmapped answers too
                }

                const campaignName = await fetchAdCampaignName(adId);
                const leadId = newLeadId();

                await appendLead({
                    'Lead ID': leadId,
                    Name: answers['Name'] || '',
                    'Mobile Number': answers['Mobile Number'] || '',
                    Email: answers['Email'] || '',
                    'Lead Source': 'Meta Ads',
                    'Campaign Name': campaignName,
                    'Lead Type': answers['Lead Type'] || '',
                    'Property Type': answers['Property Type'] || '',
                    'Project Stage': answers['Project Stage'] || '',
                    'Budget Range': answers['Budget Range'] || '',
                    'Carpet / Built-up Area': answers['Carpet / Built-up Area'] || '',
                    Location: answers['Location'] || '',
                    'Planned Starting Date': answers['Planned Starting Date'] || '',
                    'Lead Stage': 'New',
                    'Lead Score': 'Warm',
                });

                const rawAnswers = (fieldData.field_data || [])
                    .map((f) => `${f.name}: ${(f.values || [])[0] || ''}`)
                    .join(' | ');
                await appendNote(leadId, `Auto-captured from Meta Instant Form (${formId}). Raw answers — ${rawAnswers}`, {
                    author: 'Meta Webhook',
                    type: 'Auto',
                });
            }
        }
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Meta webhook processing failed:', err);
        // Still return 200 so Meta doesn't retry-storm us; errors are logged
        // for manual follow-up via Vercel function logs.
        return res.status(200).json({ ok: false, error: 'Processed with errors, see logs' });
    }
}
