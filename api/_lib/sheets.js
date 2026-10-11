// Shared Google Sheets writer used by both the Meta Lead Ads webhook
// (api/meta-leads-webhook.js) and the website callback form (api/callback.js).
//
// Writes into a single unified "Leads" sheet (+ a "Notes" sheet for the
// open-text note history) so every lead — regardless of channel — shows up
// in one place.
//
// Supports TWO authentication modes — use whichever works for your Google
// Cloud org:
//
//   MODE A — Service Account (simplest, but some Workspace orgs block
//            service-account key creation via the
//            `iam.managed.disableServiceAccountKeyCreation` policy):
//     GOOGLE_SERVICE_ACCOUNT_EMAIL   service account client_email
//     GOOGLE_SERVICE_ACCOUNT_KEY     service account private_key (escaped \n is fine)
//
//   MODE B — OAuth2 user credentials (works even when service-account key
//            creation is blocked, since these are personal user credentials,
//            not a service-account key):
//     GOOGLE_OAUTH_CLIENT_ID         OAuth 2.0 Client ID (Desktop app type)
//     GOOGLE_OAUTH_CLIENT_SECRET     OAuth 2.0 Client secret
//     GOOGLE_OAUTH_REFRESH_TOKEN     long-lived refresh token for the Google
//                                    account that owns/edits the Sheet
//
//   Always required:
//     LEADS_SHEET_ID                 the spreadsheet ID (from its URL)
//
// See META-LEADS-SETUP.md for step-by-step setup instructions for both modes.

import { JWT, OAuth2Client } from 'google-auth-library';

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

let cachedClient = null;

function getClient() {
    if (cachedClient) return cachedClient;

    const {
        GOOGLE_SERVICE_ACCOUNT_EMAIL,
        GOOGLE_SERVICE_ACCOUNT_KEY,
        GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET,
        GOOGLE_OAUTH_REFRESH_TOKEN,
    } = process.env;

    // Mode B — OAuth2 user credentials (preferred when SA key creation is blocked)
    if (GOOGLE_OAUTH_CLIENT_ID && GOOGLE_OAUTH_CLIENT_SECRET && GOOGLE_OAUTH_REFRESH_TOKEN) {
        const oauth2 = new OAuth2Client(GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET);
        oauth2.setCredentials({ refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN });
        cachedClient = oauth2;
        return cachedClient;
    }

    // Mode A — Service account
    if (GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_SERVICE_ACCOUNT_KEY) {
        const key = GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n');
        cachedClient = new JWT({ email: GOOGLE_SERVICE_ACCOUNT_EMAIL, key, scopes: SCOPES });
        return cachedClient;
    }

    throw new Error(
        'Missing Google auth env vars: set either GOOGLE_OAUTH_CLIENT_ID/SECRET/REFRESH_TOKEN ' +
        'or GOOGLE_SERVICE_ACCOUNT_EMAIL/KEY — see META-LEADS-SETUP.md'
    );
}

async function sheetsRequest(path, { method = 'GET', body } = {}) {
    const client = getClient();
    const { token } = await client.getAccessToken();
    const sheetId = process.env.LEADS_SHEET_ID;
    if (!sheetId) throw new Error('Missing LEADS_SHEET_ID');

    const res = await fetch(`${SHEETS_API}/${sheetId}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Sheets API ${method} ${path} failed: ${res.status} ${text}`);
    }
    return res.json();
}

// ---------- Unified Leads sheet schema ----------
// Keep this array as the single source of truth for column order.
export const LEADS_COLUMNS = [
    'Lead ID',
    'Created On',
    'Updated On',
    'Name',
    'Mobile Number',
    'Email',
    'Lead Source',       // Meta Ads / Google Ads / Organic / Referral / WhatsApp Inbound / Walk-in
    'Campaign Name',
    'Lead Type',          // Home Renovation / Interior Designing / Home Construction / ...
    'Property Type',      // Apartment / Independent House / Villa / Commercial
    'Project Stage',      // Just exploring / Plot ready / Possession in hand / Currently living in it
    'Budget Range',
    'Carpet / Built-up Area',
    'Location',
    'Planned Starting Date',
    'Preferred Contact Channel',
    'Follow Up Date',
    'Site Visit Date',
    'Quote Sent',         // Y/N
    'Deal Value',
    'Lead Stage',
    'Lost Reason',
    'Assigned To',
    'Lead Score',         // Hot / Warm / Cold
];

export const LEAD_STAGES = [
    'New', 'Attempted Contact', 'Contacted', 'Qualified',
    'Meeting/Site Visit Scheduled', 'Quote Sent', 'Negotiation', 'Won', 'Lost',
];

export const LEAD_SOURCES = [
    'Meta Ads', 'Google Ads', 'Organic/Website', 'Referral', 'WhatsApp Inbound', 'Walk-in',
];

export function newLeadId() {
    const d = new Date();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `LD-${d.getFullYear()}-${rand}`;
}

async function ensureSheetsExist() {
    const meta = await sheetsRequest('');
    const titles = (meta.sheets || []).map(s => s.properties.title);
    const requests = [];
    if (!titles.includes('Leads')) {
        requests.push({ addSheet: { properties: { title: 'Leads' } } });
    }
    if (!titles.includes('Notes')) {
        requests.push({ addSheet: { properties: { title: 'Notes' } } });
    }
    if (requests.length) {
        await sheetsRequest(':batchUpdate', { method: 'POST', body: { requests } });
    }
    // Header rows (idempotent — safe to re-write every cold start)
    await sheetsRequest('/values/Leads!A1?valueInputOption=RAW', {
        method: 'PUT',
        body: { range: 'Leads!A1', majorDimension: 'ROWS', values: [LEADS_COLUMNS] },
    });
    await sheetsRequest('/values/Notes!A1?valueInputOption=RAW', {
        method: 'PUT',
        body: { range: 'Notes!A1', majorDimension: 'ROWS', values: [['Lead ID', 'Timestamp', 'Author', 'Note Type', 'Note Text']] },
    });
}

let sheetsReady = false;
async function ensureReady() {
    if (sheetsReady) return;
    await ensureSheetsExist();
    sheetsReady = true;
}

/**
 * Appends a new lead row. `lead` keys should match LEADS_COLUMNS (missing
 * ones become blank cells). Returns the generated Lead ID.
 */
export async function appendLead(lead) {
    await ensureReady();
    const id = lead['Lead ID'] || newLeadId();
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const row = LEADS_COLUMNS.map((col) => {
        if (col === 'Lead ID') return id;
        if (col === 'Created On') return lead['Created On'] || now;
        if (col === 'Updated On') return now;
        if (col === 'Lead Stage') return lead['Lead Stage'] || 'New';
        return lead[col] ?? '';
    });
    await sheetsRequest('/values/Leads!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS', {
        method: 'POST',
        body: { values: [row] },
    });
    return id;
}

/**
 * Appends a note for a given Lead ID (auto or manual).
 */
export async function appendNote(leadId, text, { author = 'System', type = 'Auto' } = {}) {
    await ensureReady();
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    await sheetsRequest('/values/Notes!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS', {
        method: 'POST',
        body: { values: [[leadId, now, author, type, text]] },
    });
}
