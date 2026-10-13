import assert from 'node:assert/strict';
import { test } from 'node:test';
import { OAuth2Client } from 'google-auth-library';

test('CRM layout, targeted phone repair, and raw intake', async () => {
    const previousEnv = { ...process.env };
    const previousFetch = globalThis.fetch;
    const previousGetAccessToken = OAuth2Client.prototype.getAccessToken;
    Object.assign(process.env, {
        GOOGLE_OAUTH_CLIENT_ID: 'test-client', GOOGLE_OAUTH_CLIENT_SECRET: 'test-secret',
        GOOGLE_OAUTH_REFRESH_TOKEN: 'test-refresh', LEADS_SHEET_ID: 'test-sheet',
    });
    const sheets = [
        { properties: { sheetId: 12, title: 'Leads' }, basicFilter: {}, bandedRanges: [{}] },
        { properties: { sheetId: 15, title: 'Notes' } },
    ];
    const requests = [];
    OAuth2Client.prototype.getAccessToken = async () => ({ token: 'fake-access' });
    globalThis.fetch = async (url, options) => {
        assert.equal(options.headers.Authorization, 'Bearer fake-access');
        const body = options.body ? JSON.parse(options.body) : undefined;
        requests.push({ url, body });
        let result = {};
        if (url.includes('includeGridData=true')) {
            const errorValue = { type: 'ERROR' };
            result = { sheets: [{ data: [{ startRow: 1, rowData: [
                { values: [{ userEnteredValue: { formulaValue: '=+91 076960 98468' }, effectiveValue: { errorValue } }] },
                { values: [{ userEnteredValue: { stringValue: '07696098468' } }] },
                { values: [{ userEnteredValue: { formulaValue: '=SUM(A1:A5)' }, effectiveValue: { errorValue } }] },
                { values: [{ userEnteredValue: { formulaValue: '=123456+987654' }, effectiveValue: { errorValue } }] },
            ] }] }] };
        } else if (options.method === 'GET') {
            result = { sheets };
        } else if (url.endsWith(':batchUpdate')) {
            for (const request of body.requests) {
                const metadata = request.createDeveloperMetadata?.developerMetadata;
                if (metadata) sheets.find(sheet => sheet.properties.sheetId === metadata.location.sheetId).developerMetadata = [metadata];
            }
        }
        return { ok: true, json: async () => result };
    };
    try {
        const { formatCrmSheet, appendLead, appendNote, LEADS_COLUMNS } = await import('../api/_lib/sheets.js');
        assert.deepEqual(await formatCrmSheet(), { formattedTabs: ['Leads', 'Notes'], repairedPhones: 1 });
        const updates = requests.at(-1).body.requests;
        const repairs = updates.filter(request => request.updateCells);
        assert.equal(repairs.length, 1);
        assert.deepEqual(repairs[0].updateCells.start, { sheetId: 12, rowIndex: 1, columnIndex: 4 });
        assert.equal(repairs[0].updateCells.rows[0].values[0].userEnteredValue.stringValue, '+91 076960 98468');
        assert.equal(updates.filter(request => request.setBasicFilter).length, 1);
        assert.equal(updates.filter(request => request.addBanding).length, 1);
        assert.equal(updates.filter(request => request.updateSheetProperties).length, 2);
        assert.ok(updates.some(request => request.repeatCell?.cell.userEnteredFormat?.numberFormat?.type === 'TEXT'));
        assert.ok(updates.some(request => request.updateDimensionProperties?.properties.pixelSize === 640));
        assert.ok(updates.some(request => request.setDataValidation?.range.startColumnIndex === LEADS_COLUMNS.indexOf('Lead Stage')));
        const before = requests.length;
        assert.deepEqual(await formatCrmSheet(), { formattedTabs: [], repairedPhones: 0 });
        assert.equal(requests.length, before + 1);
        for (const phone of ['+91 076960 98468', '07696098468']) {
            await appendLead({ 'Lead ID': 'TEST', 'Mobile Number': phone });
            const request = requests.at(-1);
            assert.equal(new URL(request.url).searchParams.get('valueInputOption'), 'RAW');
            assert.equal(request.body.values[0][LEADS_COLUMNS.indexOf('Mobile Number')], phone);
        }
        await appendNote('TEST', '=not a formula');
        assert.equal(new URL(requests.at(-1).url).searchParams.get('valueInputOption'), 'RAW');
        assert.equal(requests.at(-1).body.values[0][4], '=not a formula');
    } finally {
        process.env = previousEnv;
        globalThis.fetch = previousFetch;
        OAuth2Client.prototype.getAccessToken = previousGetAccessToken;
    }
});