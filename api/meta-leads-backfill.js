import crypto from 'node:crypto';
import { fetchFormLeads, importMetaHistory } from '../scripts/backfill-meta-leads.mjs';

export const config = { maxDuration: 300 };

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST required' });
    const secret = process.env.CRM_BACKFILL_TOKEN;
    const authorization = req.headers.authorization;
    if (!secret || typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }
    const hash = value => crypto.createHash('sha256').update(value).digest();
    if (!crypto.timingSafeEqual(hash(secret), hash(authorization.slice(7)))) {
        return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }
    const { formIds, write = false, includeTests = false } = req.body || {};
    if (!Array.isArray(formIds) || !formIds.length || formIds.length > 10 ||
        !formIds.every(id => typeof id === 'string' && /^\d+$/.test(id)) ||
        typeof write !== 'boolean' || typeof includeTests !== 'boolean') {
        return res.status(400).json({ ok: false, error: 'Provide formIds as numeric strings and boolean write/includeTests options' });
    }
    try {
        const leads = [];
        for (const formId of new Set(formIds)) {
            leads.push(...await fetchFormLeads(formId, { token: process.env.META_PAGE_ACCESS_TOKEN }));
        }
        const result = await importMetaHistory(leads, { dryRun: !write, includeTests });
        return res.status(200).json({ ok: true, ...result });
    } catch {
        return res.status(502).json({ ok: false, error: 'Backfill stopped; check Meta token permissions, CRM configuration, and ambiguous legacy rows before retrying' });
    }
}