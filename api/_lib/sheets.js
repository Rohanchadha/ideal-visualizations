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

import { randomUUID } from 'node:crypto';
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
    'Meta Lead ID',
    'Meta Form ID',
];

export const LEAD_STAGES = [
    'New', 'Attempted Contact', 'Contacted', 'Qualified', 'Not Qualified',
    'Meeting/Site Visit Scheduled', 'Quote Sent', 'Negotiation', 'Won', 'Lost',
];

export const PROPERTY_TYPES = [
    'Apartment / Flat', 'Independent House', 'Villa', 'Builder Floor',
    'Plot / Land', 'Commercial Space', 'Other',
];

export const PROJECT_STAGES = [
    'Just Exploring', 'Property Search / Purchase Pending', 'Plot Ready',
    'Design / Planning', 'Under Construction', 'Possession Awaited',
    'Possession Ready', 'Occupied / Renovation Needed', 'Work Already Started',
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
        body: { range: 'Notes!A1', majorDimension: 'ROWS', values: [['Lead ID', 'Timestamp', 'Author', 'Note Type', 'Note Text', 'Note ID', 'Edited On', 'Edited By']] },
    });
    try {
        await formatCrmSheet();
    } catch (error) {
        console.error('CRM layout update failed; lead capture will continue:', error.message);
    }
}

const LAYOUT_KEY = 'slate_crm_layout';
const LAYOUT_VERSION = '2';

function layoutRequests(sheet, widths) {
    const sheetId = sheet.properties.sheetId;
    const range = { sheetId, startColumnIndex: 0, endColumnIndex: widths.length };
    const header = { ...range, startRowIndex: 0, endRowIndex: 1 };
    const requests = [
        {
            updateSheetProperties: {
                properties: { sheetId, gridProperties: { frozenRowCount: 1, frozenColumnCount: 1 } },
                fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount',
            },
        },
        {
            repeatCell: {
                range,
                cell: { userEnteredFormat: {
                    textFormat: { fontSize: 11, foregroundColor: { red: 0.12, green: 0.16, blue: 0.18 } },
                    verticalAlignment: 'TOP', horizontalAlignment: 'LEFT', wrapStrategy: 'WRAP',
                } },
                fields: 'userEnteredFormat.textFormat,userEnteredFormat.verticalAlignment,userEnteredFormat.horizontalAlignment,userEnteredFormat.wrapStrategy',
            },
        },
        {
            repeatCell: {
                range: header,
                cell: { userEnteredFormat: {
                    backgroundColor: { red: 0.08, green: 0.25, blue: 0.24 },
                    textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } },
                    verticalAlignment: 'MIDDLE',
                } },
                fields: 'userEnteredFormat.backgroundColor,userEnteredFormat.textFormat,userEnteredFormat.verticalAlignment',
            },
        },
        {
            updateDimensionProperties: {
                range: { sheetId, dimension: 'ROWS', startIndex: 0, endIndex: 1 },
                properties: { pixelSize: 48 }, fields: 'pixelSize',
            },
        },
        ...widths.map((pixelSize, index) => ({
            updateDimensionProperties: {
                range: { sheetId, dimension: 'COLUMNS', startIndex: index, endIndex: index + 1 },
                properties: { pixelSize }, fields: 'pixelSize',
            },
        })),
    ];
    if (!sheet.basicFilter) requests.push({ setBasicFilter: { filter: { range } } });
    if (!sheet.bandedRanges?.length) {
        requests.push({ addBanding: { bandedRange: {
            range,
            rowProperties: {
                headerColor: { red: 0.08, green: 0.25, blue: 0.24 },
                firstBandColor: { red: 1, green: 1, blue: 1 },
                secondBandColor: { red: 0.94, green: 0.97, blue: 0.96 },
            },
        } } });
    }
    return requests;
}

function dropdownRequest(sheetId, column, values) {
    return { setDataValidation: {
        range: { sheetId, startRowIndex: 1, startColumnIndex: column, endColumnIndex: column + 1 },
        rule: {
            condition: { type: 'ONE_OF_LIST', values: values.map(userEnteredValue => ({ userEnteredValue })) },
            strict: false, showCustomUi: true,
        },
    } };
}

export function latestNoteFormula(row) {
    return `=IFERROR(LEFT(INDEX(SORT(FILTER({Notes!$B$2:$B,Notes!$E$2:$E,IF(Notes!$G$2:$G="",Notes!$B$2:$B,Notes!$G$2:$G),ROW(Notes!$A$2:$A)},Notes!$A$2:$A=$A${row}),3,FALSE,4,FALSE),1,2),180),"")`;
}

async function updateNotePreview(leadId) {
    const values = await sheetsRequest('/values/Leads!A2:A');
    const matches = (values.values || []).map((row, index) => ({ id: row[0], row: index + 2 }))
        .filter(item => item.id === leadId);
    if (matches.length !== 1) throw new Error('Cannot identify a unique lead for the notes preview');
    const range = `Leads!AA${matches[0].row}`;
    await sheetsRequest(`/values/${range}?valueInputOption=USER_ENTERED`, {
        method: 'PUT', body: { range, values: [[latestNoteFormula(matches[0].row)]] },
    });
}

async function refreshNotePreview(leadId) {
    try {
        await updateNotePreview(leadId);
    } catch {
        console.error('Note saved; Latest Note preview could not be refreshed');
    }
}

export async function verifyCrmLayout() {
    const query = new URLSearchParams({
        includeGridData: 'true',
        fields: 'sheets(properties(title),data(startColumn,columnMetadata(hiddenByUser),rowData(values(effectiveValue,dataValidation))))',
    });
    for (const range of ['Leads!H2', 'Leads!P2', 'Leads!J2', 'Leads!K2', 'Leads!U2', 'Leads!AA1:AA']) query.append('ranges', range);
    const metadata = await sheetsRequest(`?${query}`);
    const data = metadata.sheets?.find(sheet => sheet.properties.title === 'Leads')?.data || [];
    const grid = column => data.find(item => item.startColumn === column);
    const values = column => grid(column)?.rowData?.[0]?.values?.[0]?.dataValidation?.condition?.values?.map(value => value.userEnteredValue) || [];
    const hiddenColumns = [7, 15].filter(column => grid(column)?.columnMetadata?.[0]?.hiddenByUser === true).length;
    const dropdownColumns = [[9, PROPERTY_TYPES], [10, PROJECT_STAGES], [20, LEAD_STAGES]]
        .filter(([column, expected]) => JSON.stringify(values(column)) === JSON.stringify(expected)).length;
    const previews = grid(26)?.rowData || [];
    const latestNoteHeader = previews[0]?.values?.[0]?.effectiveValue?.stringValue === 'Latest Note';
    const notePreviewErrors = previews.slice(1).filter(row => row.values?.[0]?.effectiveValue?.errorValue).length;
    const notesWithPreview = previews.slice(1).filter(row => row.values?.[0]?.effectiveValue?.stringValue).length;
    return { layoutReady: hiddenColumns === 2 && dropdownColumns === 3 && latestNoteHeader && !notePreviewErrors,
        hiddenColumns, dropdownColumns, notesWithPreview, notePreviewErrors };
}

export async function formatCrmSheet() {
    const meta = await sheetsRequest('');
    const sheets = (meta.sheets || []).filter(sheet => ['Leads', 'Notes'].includes(sheet.properties.title));
    const pending = sheets.filter(sheet => !sheet.developerMetadata?.some(
        item => item.metadataKey === LAYOUT_KEY && item.metadataValue === LAYOUT_VERSION
    ));
    const requests = [];
    let repairedPhones = 0;
    for (const sheet of pending) {
        const sheetId = sheet.properties.sheetId;
        const hasPreviousLayout = sheet.developerMetadata?.some(item => item.metadataKey === LAYOUT_KEY);
        if (sheet.properties.title === 'Leads') {
            if (!hasPreviousLayout) requests.push(...layoutRequests(sheet, [
                170, 210, 210, 190, 180, 260, 160, 220, 210, 180, 210, 200,
                200, 220, 210, 190, 180, 180, 130, 160, 230, 220, 170, 130, 190, 190,
            ]));
            const phoneColumn = LEADS_COLUMNS.indexOf('Mobile Number');
            requests.push({ repeatCell: {
                range: { sheetId, startRowIndex: 1, startColumnIndex: phoneColumn, endColumnIndex: phoneColumn + 1 },
                cell: { userEnteredFormat: { numberFormat: { type: 'TEXT' } } },
                fields: 'userEnteredFormat.numberFormat',
            } });
            requests.push(dropdownRequest(sheetId, LEADS_COLUMNS.indexOf('Lead Stage'), LEAD_STAGES));
            requests.push(dropdownRequest(sheetId, LEADS_COLUMNS.indexOf('Lead Score'), ['Hot', 'Warm', 'Cold']));
            requests.push(dropdownRequest(sheetId, LEADS_COLUMNS.indexOf('Property Type'), PROPERTY_TYPES));
            requests.push(dropdownRequest(sheetId, LEADS_COLUMNS.indexOf('Project Stage'), PROJECT_STAGES));
            for (const field of ['Campaign Name', 'Preferred Contact Channel']) {
                const index = LEADS_COLUMNS.indexOf(field);
                requests.push({ updateDimensionProperties: {
                    range: { sheetId, dimension: 'COLUMNS', startIndex: index, endIndex: index + 1 },
                    properties: { hiddenByUser: true }, fields: 'hiddenByUser',
                } });
            }
            if ((sheet.properties.gridProperties?.columnCount ?? 26) < 27) requests.push({ updateSheetProperties: {
                properties: { sheetId, gridProperties: { columnCount: 27 } }, fields: 'gridProperties.columnCount',
            } });
            requests.push({ updateCells: {
                start: { sheetId, rowIndex: 0, columnIndex: 26 },
                rows: [{ values: [{ userEnteredValue: { stringValue: 'Latest Note' }, userEnteredFormat: {
                    backgroundColor: { red: 0.08, green: 0.25, blue: 0.24 },
                    textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } },
                    wrapStrategy: 'WRAP', verticalAlignment: 'MIDDLE',
                } }] }], fields: 'userEnteredValue,userEnteredFormat',
            } });
            requests.push({ updateDimensionProperties: {
                range: { sheetId, dimension: 'COLUMNS', startIndex: 26, endIndex: 27 },
                properties: { pixelSize: 420 }, fields: 'pixelSize',
            } });
            requests.push({ repeatCell: {
                range: { sheetId, startRowIndex: 1, startColumnIndex: 26, endColumnIndex: 27 },
                cell: { userEnteredFormat: { wrapStrategy: 'CLIP', verticalAlignment: 'TOP', textFormat: { fontSize: 11 } } },
                fields: 'userEnteredFormat.wrapStrategy,userEnteredFormat.verticalAlignment,userEnteredFormat.textFormat.fontSize',
            } });
            const leads = await sheetsRequest('/values/Leads!A2:A');
            for (const [index, row] of (leads.values || []).entries()) {
                if (row[0]) requests.push({ updateCells: {
                    start: { sheetId, rowIndex: index + 1, columnIndex: 26 },
                    rows: [{ values: [{ userEnteredValue: { formulaValue: latestNoteFormula(index + 2) } }] }],
                    fields: 'userEnteredValue',
                } });
            }
            const grid = await sheetsRequest('?includeGridData=true&ranges=Leads!E2:E&fields=sheets(data(startRow,rowData(values(userEnteredValue,effectiveValue))))');
            for (const gridSheet of grid.sheets || []) {
                for (const data of gridSheet.data || []) {
                    for (const [offset, row] of (data.rowData || []).entries()) {
                        const cell = row.values?.[0];
                        const formula = cell?.userEnteredValue?.formulaValue;
                        const phone = formula?.replace(/^=/, '').trim();
                        if (!cell?.effectiveValue?.errorValue || !phone || !/^\+?[\d\s()-]+$/.test(phone)) continue;
                        const digitCount = phone.replace(/\D/g, '').length;
                        if (digitCount < 6 || digitCount > 15) continue;
                        requests.push({ updateCells: {
                            start: { sheetId, rowIndex: (data.startRow ?? 1) + offset, columnIndex: phoneColumn },
                            rows: [{ values: [{ userEnteredValue: { stringValue: phone } }] }],
                            fields: 'userEnteredValue',
                        } });
                        repairedPhones += 1;
                    }
                }
            }
        } else {
            if (!hasPreviousLayout) requests.push(...layoutRequests(sheet, [170, 210, 180, 130, 640, 190, 210, 180]));
            requests.push(dropdownRequest(sheetId, 3, ['Auto', 'Manual']));
            requests.push({ updateCells: {
                start: { sheetId, rowIndex: 0, columnIndex: 5 },
                rows: [{ values: ['Note ID', 'Edited On', 'Edited By'].map(stringValue => ({ userEnteredValue: { stringValue } })) }],
                fields: 'userEnteredValue',
            } });
            requests.push({ updateDimensionProperties: {
                range: { sheetId, dimension: 'COLUMNS', startIndex: 5, endIndex: 6 },
                properties: { hiddenByUser: true }, fields: 'hiddenByUser',
            } });
        }
        requests.push({ createDeveloperMetadata: { developerMetadata: {
            metadataKey: LAYOUT_KEY, metadataValue: LAYOUT_VERSION,
            location: { sheetId }, visibility: 'DOCUMENT',
        } } });
    }
    if (requests.length) {
        await sheetsRequest(':batchUpdate', { method: 'POST', body: { requests } });
    }
    return { formattedTabs: pending.map(sheet => sheet.properties.title), repairedPhones };
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
    await sheetsRequest('/values/Leads!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS', {
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
    await sheetsRequest('/values/Notes!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS', {
        method: 'POST',
        body: { values: [[leadId, now, author, type, text, randomUUID(), '', '']] },
    });
    await refreshNotePreview(leadId);
}

export async function getMetaCrmState() {
    const meta = await sheetsRequest('?fields=sheets(properties(sheetId,title))');
    const sheetIds = Object.fromEntries((meta.sheets || []).map(sheet => [sheet.properties.title, sheet.properties.sheetId]));
    if (sheetIds.Leads === undefined || sheetIds.Notes === undefined) {
        throw new Error('The CRM must have Leads and Notes tabs before importing Meta history');
    }
    const data = await sheetsRequest('/values:batchGet?ranges=Leads!A1:Z&ranges=Notes!A1:E');
    const [leadValues, noteValues] = (data.valueRanges || []).map(range => range.values || []);
    const headers = leadValues?.[0] || [];
    for (const field of LEADS_COLUMNS.slice(0, 24)) {
        if (headers[LEADS_COLUMNS.indexOf(field)] !== field) throw new Error('Unexpected CRM column order; import stopped');
    }
    return {
        sheetIds,
        leads: (leadValues || []).slice(1).map((values, index) => ({
            rowIndex: index + 1,
            lead: Object.fromEntries(headers.map((header, column) => [header, values[column] ?? ''])),
        })),
        notes: (noteValues || []).slice(1),
    };
}

export async function upsertMetaLead(lead, rawAnswers, { state, dryRun = false, author = 'Meta Webhook' } = {}) {
    const metaId = lead['Meta Lead ID'];
    const formId = lead['Meta Form ID'];
    if (!/^\d+$/.test(metaId || '') || !/^\d+$/.test(formId || '')) throw new Error('Missing valid Meta lead/form ID');
    state ??= await getMetaCrmState();
    let matches = state.leads.filter(record => record.lead['Meta Lead ID'] === metaId);
    if (!matches.length) {
        const answerFingerprint = text => text.split(' | ').sort().join(' | ');
        const legacyIds = new Set(state.notes.filter(note => {
            const text = String(note[4] || '');
            const marker = 'Raw answers \u2014 ';
            const position = text.indexOf(marker);
            return text.startsWith(`Auto-captured from Meta Instant Form (${formId}).`) && position !== -1 &&
                answerFingerprint(text.slice(position + marker.length)) === answerFingerprint(rawAnswers);
        }).map(note => note[0]));
        matches = state.leads.filter(record => record.lead['Lead Source'] === 'Meta Ads' &&
            !record.lead['Meta Lead ID'] && legacyIds.has(record.lead['Lead ID']));
    }
    if (matches.length > 1) throw new Error(`Ambiguous existing rows for Meta lead ${metaId}; manual review required`);
    const existing = matches[0];
    const leadId = existing?.lead['Lead ID'] || `META-${metaId}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const notePrefix = `Meta lead ID: ${metaId}; Form ID: ${formId}.`;
    const note = [leadId, now, author, 'Auto', `${notePrefix} Raw answers: ${rawAnswers}`, randomUUID(), '', ''];
    const hasNote = state.notes.some(item => item[0] === leadId && String(item[4] || '').startsWith(notePrefix));
    const requests = [];
    const updated = existing ? { ...existing.lead } : { ...lead, 'Lead ID': leadId, 'Updated On': now };
    if (existing) {
        for (const [field, value] of Object.entries(lead)) {
            if (field === 'Lead ID' || field === 'Updated On' || !value) continue;
            if (['Meta Lead ID', 'Meta Form ID'].includes(field) || !existing.lead[field] ||
                (field === 'Created On' && !existing.lead['Meta Lead ID'])) {
                if (String(existing.lead[field] || '') === String(value)) continue;
                updated[field] = value;
                requests.push({ updateCells: {
                    start: { sheetId: state.sheetIds.Leads, rowIndex: existing.rowIndex, columnIndex: LEADS_COLUMNS.indexOf(field) },
                    rows: [{ values: [{ userEnteredValue: { stringValue: String(value) } }] }], fields: 'userEnteredValue',
                } });
            }
        }
        if (requests.length) {
            updated['Updated On'] = now;
            requests.push({ updateCells: {
                start: { sheetId: state.sheetIds.Leads, rowIndex: existing.rowIndex, columnIndex: LEADS_COLUMNS.indexOf('Updated On') },
                rows: [{ values: [{ userEnteredValue: { stringValue: now } }] }], fields: 'userEnteredValue',
            } });
        }
    } else {
        requests.push({ appendCells: {
            sheetId: state.sheetIds.Leads,
            rows: [{ values: LEADS_COLUMNS.map(field => ({ userEnteredValue: { stringValue: String(updated[field] ?? '') } })) }],
            fields: 'userEnteredValue',
        } });
    }
    if (!hasNote) requests.push({ appendCells: {
        sheetId: state.sheetIds.Notes,
        rows: [{ values: note.map(value => ({ userEnteredValue: { stringValue: value } })) }], fields: 'userEnteredValue',
    } });
    if (!dryRun && requests.length) {
        await ensureReady();
        await sheetsRequest(':batchUpdate', { method: 'POST', body: { requests } });
        await refreshNotePreview(leadId);
    }
    if (existing) existing.lead = updated;
    else state.leads.push({ rowIndex: state.leads.length + 1, lead: updated });
    if (!hasNote) state.notes.push(note);
    return { leadId, status: existing ? (requests.length ? 'updated' : 'skipped') : 'imported' };
}
