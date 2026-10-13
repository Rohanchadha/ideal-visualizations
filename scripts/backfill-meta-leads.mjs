import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import dotenv from 'dotenv';
import { GRAPH_API, mapMetaLead } from '../api/meta-leads-webhook.js';
import { getMetaCrmState, upsertMetaLead } from '../api/_lib/sheets.js';

export async function fetchFormLeads(formId, { token, fetchImpl = fetch } = {}) {
    if (!/^\d+$/.test(formId || '')) throw new Error('Form ID must contain digits only');
    if (!token) throw new Error('Missing META_PAGE_ACCESS_TOKEN');
    const leads = [];
    const cursors = new Set();
    let after;
    do {
        const url = new URL(`${GRAPH_API}/${formId}/leads`);
        url.searchParams.set('fields', 'id,created_time,ad_id,form_id,field_data');
        url.searchParams.set('limit', '100');
        if (after) url.searchParams.set('after', after);
        const response = await fetchImpl(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        if (!response.ok || data.error) {
            throw new Error(`Meta API HTTP ${response.status}; code ${data.error?.code || 'unknown'}, subcode ${data.error?.error_subcode || 'none'}`);
        }
        if (!Array.isArray(data.data)) throw new Error('Meta returned no lead list');
        leads.push(...data.data.map(lead => ({ ...lead, form_id: lead.form_id || formId })));
        after = data.paging?.next ? data.paging?.cursors?.after : undefined;
        if (data.paging?.next && !after) throw new Error('Missing pagination cursor; import stopped to avoid incomplete history');
        if (after && cursors.has(after)) throw new Error('Repeated Meta pagination cursor; import stopped');
        if (after) cursors.add(after);
    } while (after);
    return leads;
}

export async function importMetaHistory(leads, { dryRun = true, includeTests = false, state, save = upsertMetaLead } = {}) {
    const mapped = leads.map(lead => mapMetaLead(lead));
    state ??= await getMetaCrmState();
    const result = { dryRun, fetched: leads.length, imported: 0, updated: 0, skipped: 0, testLeadsSkipped: 0 };
    const seen = new Set();
    for (const item of mapped.sort((first, second) => first.lead['Created On'].localeCompare(second.lead['Created On']))) {
        if (item.isTest && !includeTests) {
            result.testLeadsSkipped += 1;
            continue;
        }
        const id = item.lead['Meta Lead ID'];
        if (seen.has(id)) {
            result.skipped += 1;
            continue;
        }
        seen.add(id);
        const saved = await save(item.lead, item.rawAnswers, { state, dryRun, author: 'Meta Historical Import' });
        result[saved.status] += 1;
    }
    return result;
}

async function main() {
    const args = process.argv.slice(2);
    const allowed = arg => ['--write', '--include-tests', '--help'].includes(arg) ||
        ['--form=', '--file=', '--env-file='].some(prefix => arg.startsWith(prefix));
    if (args.some(arg => !allowed(arg))) throw new Error('Unknown option; use --help');
    if (args.includes('--help')) {
        console.log('Usage: node scripts/backfill-meta-leads.mjs --form=FORM_ID [--form=OTHER_ID] [--env-file=PATH] [--write] [--include-tests]');
        console.log('Alternatively use --file=PATH with a JSON array or an exported Graph response; do not include tokens or paging URLs.');
        console.log('Default is a read-only preview. --write imports into the configured Sheet.');
        return;
    }
    const option = prefix => args.find(arg => arg.startsWith(prefix))?.slice(prefix.length);
    dotenv.config({ path: option('--env-file=') || '.env', quiet: true });
    const file = option('--file=');
    const forms = args.filter(arg => arg.startsWith('--form=')).map(arg => arg.slice('--form='.length));
    if ((!file && !forms.length) || (file && forms.length)) throw new Error('Choose either --file or one or more --form options');
    let leads;
    if (file) {
        const payload = JSON.parse(await readFile(file, 'utf8'));
        leads = Array.isArray(payload) ? payload : payload.data;
        if (!Array.isArray(leads)) throw new Error('JSON file must contain a lead array or a Graph response with data');
        if (!Array.isArray(payload) && payload.paging?.next) throw new Error('Export contains more pages; fetch all history using --form instead');
    } else {
        leads = [];
        for (const form of forms) leads.push(...await fetchFormLeads(form, { token: process.env.META_PAGE_ACCESS_TOKEN }));
    }
    console.log(JSON.stringify(await importMetaHistory(leads, {
        dryRun: !args.includes('--write'), includeTests: args.includes('--include-tests'),
    })));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch(error => {
        console.error('Meta backfill stopped:', error.message);
        process.exitCode = 1;
    });
}