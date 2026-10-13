import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
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
        if (url.includes('columnMetadata')) {
            const { PROPERTY_TYPES, PROJECT_STAGES, LEAD_STAGES } = await import('../api/_lib/sheets.js');
            result = { sheets: [{ properties: { title: 'Leads' }, data: [
                ...[7, 15].map(startColumn => ({ startColumn, columnMetadata: [{ hiddenByUser: true }] })),
                ...[[9, PROPERTY_TYPES], [10, PROJECT_STAGES], [20, LEAD_STAGES]].map(([startColumn, values]) => ({
                    startColumn, rowData: [{ values: [{ dataValidation: { condition: { values: values.map(userEnteredValue => ({ userEnteredValue })) } } }] }],
                })),
                { startColumn: 26, rowData: [{ values: [{ effectiveValue: { stringValue: 'Latest Note' } }] }, { values: [{ effectiveValue: { stringValue: 'Example note' } }] }] },
            ] }] };
        } else if (url.includes('includeGridData=true')) {
            const errorValue = { type: 'ERROR' };
            result = { sheets: [{ data: [{ startRow: 1, rowData: [
                { values: [{ userEnteredValue: { formulaValue: '=+91 076960 98468' }, effectiveValue: { errorValue } }] },
                { values: [{ userEnteredValue: { stringValue: '07696098468' } }] },
                { values: [{ userEnteredValue: { formulaValue: '=SUM(A1:A5)' }, effectiveValue: { errorValue } }] },
                { values: [{ userEnteredValue: { formulaValue: '=123456+987654' }, effectiveValue: { errorValue } }] },
            ] }] }] };
        } else if (url.includes('/values/Leads!A2:A')) {
            result = { values: [['TEST'], ['META-100001']] };
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
        const { formatCrmSheet, appendLead, appendNote, LEADS_COLUMNS, PROPERTY_TYPES, PROJECT_STAGES } = await import('../api/_lib/sheets.js');
        assert.deepEqual(await formatCrmSheet(), { formattedTabs: ['Leads', 'Notes'], repairedPhones: 1 });
        const updates = requests.at(-1).body.requests;
        const repairs = updates.filter(request => request.updateCells?.start.columnIndex === 4);
        assert.equal(repairs.length, 1);
        assert.deepEqual(repairs[0].updateCells.start, { sheetId: 12, rowIndex: 1, columnIndex: 4 });
        assert.equal(repairs[0].updateCells.rows[0].values[0].userEnteredValue.stringValue, '+91 076960 98468');
        assert.equal(updates.filter(request => request.setBasicFilter).length, 1);
        assert.equal(updates.filter(request => request.addBanding).length, 1);
        assert.equal(updates.filter(request => request.updateSheetProperties?.fields.includes('frozen')).length, 2);
        assert.ok(updates.some(request => request.repeatCell?.cell.userEnteredFormat?.numberFormat?.type === 'TEXT'));
        assert.ok(updates.some(request => request.updateDimensionProperties?.properties.pixelSize === 640));
        assert.ok(updates.some(request => request.setDataValidation?.range.startColumnIndex === LEADS_COLUMNS.indexOf('Lead Stage')));
        const dropdowns = updates.filter(request => request.setDataValidation).map(request => request.setDataValidation);
        assert.deepEqual(dropdowns.find(rule => rule.range.startColumnIndex === LEADS_COLUMNS.indexOf('Property Type')).rule.condition.values.map(value => value.userEnteredValue), PROPERTY_TYPES);
        assert.deepEqual(dropdowns.find(rule => rule.range.startColumnIndex === LEADS_COLUMNS.indexOf('Project Stage')).rule.condition.values.map(value => value.userEnteredValue), PROJECT_STAGES);
        assert.ok(dropdowns.find(rule => rule.range.startColumnIndex === LEADS_COLUMNS.indexOf('Lead Stage')).rule.condition.values.some(value => value.userEnteredValue === 'Not Qualified'));
        assert.deepEqual(updates.filter(request => request.updateDimensionProperties?.properties.hiddenByUser && request.updateDimensionProperties.range.sheetId === 12).map(request => request.updateDimensionProperties.range.startIndex), [7, 15]);
        assert.ok(updates.some(request => request.updateCells?.start.columnIndex === 26 && request.updateCells.rows[0].values[0].userEnteredValue.formulaValue?.includes('$A2')));
        const before = requests.length;
        assert.deepEqual(await formatCrmSheet(), { formattedTabs: [], repairedPhones: 0 });
        assert.equal(requests.length, before + 1);
        for (const sheet of sheets) sheet.developerMetadata[0].metadataValue = '1';
        await formatCrmSheet();
        const migration = requests.at(-1).body.requests;
        assert.ok(!migration.some(request => request.updateSheetProperties?.fields.includes('frozen')));
        assert.ok(!migration.some(request => request.addBanding || request.setBasicFilter));
        assert.ok(!migration.some(request => request.updateDimensionProperties?.properties.pixelSize === 170));
        assert.deepEqual(await formatCrmSheet(), { formattedTabs: [], repairedPhones: 0 });
        const { verifyCrmLayout } = await import('../api/_lib/sheets.js');
        assert.deepEqual(await verifyCrmLayout(), { layoutReady: true, hiddenColumns: 2, dropdownColumns: 3, notesWithPreview: 1, notePreviewErrors: 0 });
        for (const phone of ['+91 076960 98468', '07696098468']) {
            await appendLead({ 'Lead ID': 'TEST', 'Mobile Number': phone });
            const request = requests.at(-1);
            assert.equal(new URL(request.url).searchParams.get('valueInputOption'), 'RAW');
            assert.equal(request.body.values[0][LEADS_COLUMNS.indexOf('Mobile Number')], phone);
        }
        await appendNote('TEST', '=not a formula');
        const noteRequest = requests.findLast(request => request.url.includes('/values/Notes!A1:append'));
        assert.equal(new URL(noteRequest.url).searchParams.get('valueInputOption'), 'RAW');
        assert.equal(noteRequest.body.values[0][4], '=not a formula');
        assert.match(noteRequest.body.values[0][5], /^[a-f0-9-]{36}$/);
        assert.ok(requests.at(-1).body.values[0][0].includes('$A2'));
        const { upsertMetaLead } = await import('../api/_lib/sheets.js');
        const state = { sheetIds: { Leads: 12, Notes: 15 }, leads: [], notes: [] };
        const metaLead = { 'Meta Lead ID': '100001', 'Meta Form ID': '200001', 'Mobile Number': '+910001234567' };
        assert.equal((await upsertMetaLead(metaLead, 'phone: +910001234567', { state })).status, 'imported');
        const batch = requests.findLast(request => request.url.endsWith(':batchUpdate')).body.requests;
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

test('layout maintenance is disabled without its own secret', async () => {
    const { default: handler } = await import('../api/crm-layout.js');
    const previous = process.env.CRM_LAYOUT_TOKEN;
    const response = { code: 0, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
    try {
        delete process.env.CRM_LAYOUT_TOKEN;
        await handler({ method: 'POST', headers: { authorization: 'Bearer fake-layout-secret' } }, response);
        assert.equal(response.code, 401);
        process.env.CRM_LAYOUT_TOKEN = 'fake-layout-secret';
        await handler({ method: 'POST', headers: { authorization: 'Bearer wrong' } }, response);
        assert.equal(response.code, 401);
        await handler({ method: 'GET', headers: {} }, response);
        assert.equal(response.code, 405);
    } finally {
        if (previous === undefined) delete process.env.CRM_LAYOUT_TOKEN;
        else process.env.CRM_LAYOUT_TOKEN = previous;
    }
});

test('lead notes sidebar preserves identity, treats text literally and detects edit conflicts', async () => {
    const makeSheet = (name, data) => {
        const sheet = {
            getName: () => name,
            getLastRow: () => data.length,
            getMaxColumns: () => 27,
            hideColumns: () => {},
            getDataRange: () => sheet.getRange(1, 1, data.length, Math.max(...data.map(row => row.length))),
            getRange(row, column, height = 1, width = 1) {
                const set = value => {
                    data[row - 1] ||= [];
                    data[row - 1][column - 1] = value;
                };
                return {
                    getDisplayValue: () => data[row - 1]?.[column - 1] || '',
                    getDisplayValues: () => Array.from({ length: height }, (_, offset) => Array.from({ length: width }, (_, index) => data[row + offset - 1]?.[column + index - 1] || '')),
                    setValue: set,
                    setFormula: set,
                    setRichTextValue: value => set(value.text),
                    setValues: values => values.forEach((items, offset) => items.forEach((value, index) => {
                        data[row + offset - 1] ||= [];
                        data[row + offset - 1][column + index - 1] = value;
                    })),
                };
            },
        };
        return sheet;
    };
    const leadData = [['Lead ID', 'Created On', 'Updated On', 'Name'], ['LEAD-ONE', '', '', 'First'], ['LEAD-TWO', '', '', 'Second']];
    const noteData = [['Lead ID', 'Timestamp', 'Author', 'Note Type', 'Note Text'], ['LEAD-ONE', '2026-01-01', 'System', 'Auto', 'Original capture'], ['LEAD-ONE', '2026-01-02', 'Owner', 'Manual', 'Call scheduled']];
    const sheets = { Leads: makeSheet('Leads', leadData), Notes: makeSheet('Notes', noteData) };
    let selectedRow = 2;
    let counter = 0;
    let releases = 0;
    const spreadsheet = {
        getSheetByName: name => sheets[name],
        getActiveRange: () => ({ getSheet: () => sheets.Leads, getRow: () => selectedRow, getNumRows: () => 1 }),
    };
    const context = vm.createContext({
        SpreadsheetApp: {
            getActiveSpreadsheet: () => spreadsheet,
            newRichTextValue: () => ({ text: '', setText(text) { this.text = text; return this; }, build() { return { text: this.text }; } }),
        },
        LockService: { getDocumentLock: () => ({ tryLock: () => true, releaseLock: () => { releases++; } }) },
        Session: { getActiveUser: () => ({ getEmail: () => '' }) },
        Utilities: { getUuid: () => `00000000-0000-4000-8000-${String(++counter).padStart(12, '0')}`, formatDate: () => '2026-10-06 12:00:00' },
    });
    vm.runInContext(await readFile(new URL('./crm-notes.gs.js', import.meta.url), 'utf8'), context);
    const view = context.crmGetSelectedLeadNotes();
    assert.equal(view.id, 'LEAD-ONE');
    assert.equal(view.notes.length, 2);
    assert.equal(view.notes.find(note => note.type === 'Auto').editable, false);
    const manual = view.notes.find(note => note.type === 'Manual');
    assert.ok(manual.id);
    [leadData[1], leadData[2]] = [leadData[2], leadData[1]];
    [noteData[1], noteData[2]] = [noteData[2], noteData[1]];
    const edit = { leadId: view.id, mode: 'edit', noteId: manual.id, text: '=not a formula <script>', expectedText: manual.text, expectedEditedOn: manual.editedOn };
    context.crmSaveLeadNote(edit);
    assert.equal(noteData.find(row => row[5] === manual.id)[4], edit.text);
    assert.equal(noteData.find(row => row[5] === manual.id)[7], 'Team Member');
    assert.equal(leadData[2][2], '2026-10-06 12:00:00 UTC');
    assert.ok(leadData[2][26].includes('$A3'));
    assert.equal(leadData[1][2], '');
    assert.throws(() => context.crmSaveLeadNote(edit), /Someone changed/);
    const auto = view.notes.find(note => note.type === 'Auto');
    assert.throws(() => context.crmSaveLeadNote({ ...edit, noteId: auto.id }), /Only existing manual/);
    const add = { leadId: view.id, mode: 'add', noteId: '11111111-1111-4111-8111-111111111111', text: '+91 00000\nSite visit booked' };
    context.crmSaveLeadNote(add);
    context.crmSaveLeadNote(add);
    assert.equal(noteData.filter(row => row[5] === add.noteId).length, 1);
    assert.equal(noteData.find(row => row[5] === add.noteId)[4], add.text);
    selectedRow = 1;
    assert.throws(() => context.crmGetSelectedLeadNotes(), /Select one lead/);
    assert.ok(releases >= 7);
    assert.equal(noteData.find(row => row[3] === 'Auto')[4], 'Original capture');
});