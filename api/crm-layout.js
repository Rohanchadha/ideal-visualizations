import crypto from 'node:crypto';
import { formatCrmSheet, verifyCrmLayout } from './_lib/sheets.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST required' });
    const secret = process.env.CRM_LAYOUT_TOKEN;
    const authorization = req.headers.authorization;
    if (!secret || typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }
    const hash = value => crypto.createHash('sha256').update(value).digest();
    if (!crypto.timingSafeEqual(hash(secret), hash(authorization.slice(7)))) {
        return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }
    try {
        const result = await formatCrmSheet();
        return res.status(200).json({ ok: true, ...result, ...await verifyCrmLayout() });
    } catch {
        return res.status(502).json({ ok: false, error: 'CRM layout update failed; check Google Sheets configuration' });
    }
}