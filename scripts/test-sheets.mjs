import assert from 'node:assert/strict';
import { test } from 'node:test';
import { OAuth2Client } from 'google-auth-library';

test('Meta Graph field names map to CRM fields', async () => {
    const { mapFieldName } = await import('../api/meta-leads-webhook.js');
    for (const [question, expected] of [
        ['full_name', 'Name'], ['email', 'Email'], ['phone', 'Mobile Number'],
        ['what_are_you_looking_for?', 'Lead Type'],
        ["what's_your_estimated_construction_+_interior_budget?", 'Budget Range'],
        ['where_is_your_home_located?', 'Location'],
        ['when_are_you_planning_to_start?', 'Planned Starting Date'],
        ['inbox_url', null],
    ]) assert.equal(mapFieldName(question), expected);
});

test('Meta mapping preserves original dates and phones, and normalizes labels', async () => {
    const { mapMetaLead } = await import('../api/meta-leads-webhook.js');
    const data = {
        id: '100001', form_id: '200001', created_time: '2026-10-06T03:19:21+0000',
        field_data: [
            { name: 'full_name', values: ['Sample Person'] },
            { name: 'phone', values: ['+910001234567'] },
            { name: 'what_are_you_looking_for?', values: ['interior_design'] },
            { name: "what's_your_estimated_budget_for_interiors?", values: ['not_decided_yet'] },
            { name: 'where_is_your_home_located?', values: ['chandigarh'] },
            { name: 'when_are_you_planning_to_start?', values: ['1-3_months'] },
            { name: 'inbox_url' },
        ],
    };
    const mapped = mapMetaLead(data);
    assert.equal(mapped.lead.Name, 'Sample Person');
    assert.equal(mapped.lead['Mobile Number'], '+910001234567');
    assert.equal(mapped.lead['Created On'], '2026-10-06 03:19:21 UTC');
    assert.equal(mapped.lead['Lead Type'], 'Interior Designing');
    assert.equal(mapped.lead['Budget Range'], 'not decided yet');
    assert.equal(mapped.lead['Planned Starting Date'], '1-3 months');
    assert.equal(mapped.lead['Meta Lead ID'], data.id);
    assert.equal(mapped.isTest, false);
    assert.ok(mapped.rawAnswers.includes('what_are_you_looking_for?: interior_design'));
    assert.throws(() => mapMetaLead({ ...data, created_time: undefined }), /timestamp/);
});

test('historical fetch follows cursors without sending tokens in URLs', async () => {
    const { fetchFormLeads, importMetaHistory } = await import('./backfill-meta-leads.mjs');
    const paths = [];
    const leads = await fetchFormLeads('200001', {
        token: 'fake-token', fetchImpl: async (url, options) => {
            assert.equal(options.headers.Authorization, 'Bearer fake-token');
            assert.equal(url.searchParams.has('access_token'), false);
            paths.push(url.searchParams.get('after'));
            return { ok: true, json: async () => ({
                data: [{ id: paths.length === 1 ? '100001' : '100002', created_time: '2026-10-06T03:19:21+0000', field_data: [] }],
                ...(paths.length === 1 ? { paging: { next: 'private-url-not-followed', cursors: { after: 'next-page' } } } : {}),
            }) };
        },
    });
    assert.deepEqual(paths, [null, 'next-page']);
    assert.equal(leads.length, 2);
    let saves = 0;
    const summary = await importMetaHistory([...leads, leads[0], {
        id: '100003', form_id: '200001', created_time: '2026-10-06T03:19:21+0000',
        field_data: [{ name: 'phone', values: ['<test lead: dummy data for phone>'] }],
    }], { state: {}, save: async (lead, raw, options) => {
        assert.equal(options.dryRun, true);
        saves += 1;
        return { status: 'imported' };
    } });
    assert.equal(saves, 2);
    assert.equal(summary.imported, 2);
    assert.equal(summary.skipped, 1);
    assert.equal(summary.testLeadsSkipped, 1);
});

test('Meta upsert preserves manual fields, reconciles legacy notes, and is rerunnable', async () => {
    const { upsertMetaLead } = await import('../api/_lib/sheets.js');
    const lead = {
        'Meta Lead ID': '100001', 'Meta Form ID': '200001', Name: 'Sample Person',
        'Created On': '2026-10-06 03:19:21 UTC', 'Lead Source': 'Meta Ads', 'Lead Stage': 'New',
    };
    const raw = 'full_name: Sample Person | phone: +910001234567';
    const state = {
        sheetIds: { Leads: 12, Notes: 15 },
        leads: [{ rowIndex: 1, lead: {
            'Lead ID': 'LD-EXISTING', 'Lead Source': 'Meta Ads', 'Lead Stage': 'Qualified',
            'Assigned To': 'Team Member', 'Created On': '2026-10-13 00:00:00 UTC',
        } }],
        notes: [['LD-EXISTING', '', '', '', `Auto-captured from Meta Instant Form (200001). Raw answers \u2014 ${raw}`]],
    };
    assert.equal((await upsertMetaLead(lead, raw, { state, dryRun: true })).status, 'updated');
    assert.equal(state.leads.length, 1);
    assert.equal(state.leads[0].lead['Lead Stage'], 'Qualified');
    assert.equal(state.leads[0].lead['Assigned To'], 'Team Member');
    assert.equal(state.leads[0].lead['Created On'], lead['Created On']);
    assert.equal(state.leads[0].lead.Name, 'Sample Person');
    assert.equal((await upsertMetaLead(lead, raw, { state, dryRun: true })).status, 'skipped');
    assert.equal((await upsertMetaLead({ ...lead, 'Meta Lead ID': '100002' }, raw, { state, dryRun: true })).status, 'imported');
    assert.equal(state.leads.length, 2);
    const ambiguous = {
        sheetIds: state.sheetIds,
        leads: ['ONE', 'TWO'].map(id => ({ rowIndex: 1, lead: { 'Lead ID': id, 'Lead Source': 'Meta Ads' } })),
        notes: ['ONE', 'TWO'].map(id => [id, '', '', '', `Auto-captured from Meta Instant Form (200001). Raw answers \u2014 ${raw}`]),
    };
    await assert.rejects(upsertMetaLead(lead, raw, { state: ambiguous, dryRun: true }), /Ambiguous/);
});

test('backfill endpoint requires its own secret and rejects invalid input', async () => {
    const { default: handler } = await import('../api/meta-leads-backfill.js');
    const previous = process.env.CRM_BACKFILL_TOKEN;
    const response = {
        status(code) { this.code = code; return this; },
        json(body) { this.body = body; return this; },
    };
    try {
        delete process.env.CRM_BACKFILL_TOKEN;
        await handler({ method: 'POST', headers: {} }, response);
        assert.equal(response.code, 401);
        process.env.CRM_BACKFILL_TOKEN = 'fake-backfill-secret';
        await handler({ method: 'POST', headers: { authorization: 'Bearer wrong' } }, response);
        assert.equal(response.code, 401);
        await handler({ method: 'GET', headers: {} }, response);
        assert.equal(response.code, 405);
        await handler({ method: 'POST', headers: { authorization: 'Bearer fake-backfill-secret' }, body: { formIds: ['bad-id'] } }, response);
        assert.equal(response.code, 400);
        await handler({ method: 'POST', headers: { authorization: 'Bearer fake-backfill-secret' }, body: { formIds: ['123'], write: 'true' } }, response);
        assert.equal(response.code, 400);
    } finally {
        if (previous === undefined) delete process.env.CRM_BACKFILL_TOKEN;
        else process.env.CRM_BACKFILL_TOKEN = previous;
    }
});

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
        const { upsertMetaLead } = await import('../api/_lib/sheets.js');
        const state = { sheetIds: { Leads: 12, Notes: 15 }, leads: [], notes: [] };
        const metaLead = { 'Meta Lead ID': '100001', 'Meta Form ID': '200001', 'Mobile Number': '+910001234567' };
        assert.equal((await upsertMetaLead(metaLead, 'phone: +910001234567', { state })).status, 'imported');
        const batch = requests.at(-1).body.requests;
        assert.equal(batch.length, 2);
        assert.equal(batch[0].appendCells.sheetId, 12);
        assert.equal(batch[1].appendCells.sheetId, 15);
        assert.equal(batch[0].appendCells.rows[0].values[LEADS_COLUMNS.indexOf('Mobile Number')].userEnteredValue.stringValue, '+910001234567');
        const total = requests.length;
        assert.equal((await upsertMetaLead(metaLead, 'phone: +910001234567', { state })).status, 'skipped');
        assert.equal(requests.length, total);
    } finally {
        process.env = previousEnv;
        globalThis.fetch = previousFetch;
        OAuth2Client.prototype.getAccessToken = previousGetAccessToken;
    }
});