// Vercel Serverless Function — Node 20 runtime
// Handles callback form submissions: validates, sends a notification email
// to the studio inbox, and sends an auto-response to the lead.
//
// Required environment variables (set in Vercel dashboard + local .env):
//   SMTP_HOST              e.g. smtp.gmail.com / smtp.zoho.com / smtp.resend.com
//   SMTP_PORT              e.g. 465 (SSL) or 587 (STARTTLS)
//   SMTP_SECURE            "true" for 465, "false" for 587
//   SMTP_USER              full username (usually the email address)
//   SMTP_PASS              app password / SMTP token (NEVER your real password)
//   SMTP_FROM              "Slate Concept Studios <noreply@slateconcepts.com>"
//   LEADS_TO               comma-separated recipients, e.g. "danish@slateconcepts.com"
//   LEADS_CC               (optional) comma-separated CC list
//
// Local dev: run `vercel dev` (Vercel CLI) so this function is reachable at
// http://localhost:3000/api/callback. Plain `vite` won't expose /api/*.

import nodemailer from 'nodemailer';

// ---------- Simple in-memory rate limit (per cold-start instance) ----------
// Vercel serverless instances are reused for warm requests, so this acts as
// a soft throttle. Not a substitute for a real KV/Redis solution at scale.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;        // 1 minute
const RATE_LIMIT_MAX = 5;                       // max submissions per IP per window
const ipBuckets = new Map();                    // ip -> [timestamps]

function isRateLimited(ip) {
    if (!ip) return false;
    const now = Date.now();
    const arr = (ipBuckets.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    arr.push(now);
    ipBuckets.set(ip, arr);
    return arr.length > RATE_LIMIT_MAX;
}

// ---------- Validation ----------
const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const clean = (s, max = 500) => String(s ?? '').trim().slice(0, max);
const escapeHtml = (s) => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// ---------- Email templates ----------
function notificationHtml(lead) {
    const row = (label, value) => `
        <tr>
            <td style="padding:10px 14px;background:#f7f7f5;border:1px solid #eaeaea;font-weight:600;color:#111;width:170px;font-size:14px;">${label}</td>
            <td style="padding:10px 14px;background:#fff;border:1px solid #eaeaea;color:#111;font-size:14px;">${escapeHtml(value)}</td>
        </tr>`;
    return `<!doctype html><html><body style="margin:0;padding:0;background:#f1f1ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
            <div style="background:#0e0e0e;color:#fff;border-radius:20px 20px 0 0;padding:28px 32px;">
                <p style="margin:0 0 4px 0;color:#F97316;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">New Callback Request</p>
                <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:-0.01em;">${escapeHtml(lead.name)}</h1>
                <p style="margin:6px 0 0 0;color:#a1a1aa;font-size:14px;">wants to talk about <strong style="color:#fff;">${escapeHtml(lead.service)}</strong></p>
            </div>
            <div style="background:#fff;border-radius:0 0 20px 20px;padding:24px 32px;">
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    ${row('Name', lead.name)}
                    ${row('Phone', lead.phone)}
                    ${row('Email', lead.email)}
                    ${row('Country', lead.country)}
                    ${row('City', lead.city)}
                    ${row('Service', lead.service)}
                    ${row('Message', lead.message || '—')}
                    ${row('Submitted', lead.submittedAt)}
                    ${row('Source IP', lead.ip || '—')}
                </table>
                <div style="margin-top:24px;padding-top:20px;border-top:1px solid #eaeaea;">
                    <a href="https://wa.me/${(lead.phone || '').replace(/[^\d]/g, '')}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600;font-size:14px;margin-right:8px;">WhatsApp ${escapeHtml(lead.name.split(' ')[0])}</a>
                    <a href="mailto:${escapeHtml(lead.email)}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600;font-size:14px;">Reply by Email</a>
                </div>
            </div>
            <p style="text-align:center;color:#71717a;font-size:12px;margin:20px 0 0 0;">Sent automatically by slateconcepts.com · Reply to this email and it will go directly to the lead.</p>
        </div>
    </body></html>`;
}

function autoResponseHtml(lead) {
    return `<!doctype html><html><body style="margin:0;padding:0;background:#f1f1ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
            <div style="background:#0e0e0e;color:#fff;border-radius:24px;padding:36px 36px 32px 36px;">
                <p style="margin:0 0 6px 0;color:#F97316;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;">Slate Concept Studios</p>
                <h1 style="margin:0 0 16px 0;font-size:26px;font-weight:700;letter-spacing:-0.01em;line-height:1.2;">Thanks, ${escapeHtml(lead.name.split(' ')[0])} — we've got it.</h1>
                <p style="margin:0 0 14px 0;color:#d4d4d8;font-size:15px;line-height:1.6;">We've received your enquiry about <strong style="color:#fff;">${escapeHtml(lead.service)}</strong> and one of us will personally call you back at <strong style="color:#fff;">${escapeHtml(lead.phone)}</strong> within one business day.</p>
                <p style="margin:0 0 24px 0;color:#d4d4d8;font-size:15px;line-height:1.6;">If anything is time-sensitive, the fastest channel is WhatsApp:</p>
                <a href="https://wa.me/919646724313" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:14px 22px;border-radius:14px;font-weight:600;font-size:15px;">Message us on WhatsApp →</a>
                <hr style="border:0;border-top:1px solid #27272a;margin:28px 0;" />
                <p style="margin:0;color:#71717a;font-size:13px;line-height:1.6;">
                    <strong style="color:#a1a1aa;">In the meantime</strong> — feel free to browse our recent work at
                    <a href="https://ideal-visualizations.vercel.app/portfolio" style="color:#F97316;text-decoration:none;">our portfolio</a>.
                </p>
            </div>
            <p style="text-align:center;color:#71717a;font-size:12px;margin:20px 0 0 0;">
                Slate Concept Studios · Amritsar, India<br/>
                +91 96467 24313 · danish@slateconcepts.com
            </p>
        </div>
    </body></html>`;
}

// ---------- Handler ----------
export default async function handler(req, res) {
    // CORS — same-origin in production, but allow OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end();
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const ip = (req.headers['x-forwarded-for']?.toString().split(',')[0].trim()) || req.socket?.remoteAddress || '';
    if (isRateLimited(ip)) {
        return res.status(429).json({ ok: false, error: 'Too many requests. Please try again in a minute.' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
    }
    body = body || {};

    // Honeypot — bots will fill this hidden field; humans never see it.
    if (body.website && String(body.website).trim() !== '') {
        // Pretend success so bots don't retry
        return res.status(200).json({ ok: true });
    }

    const lead = {
        name: clean(body.name, 120),
        country: clean(body.country, 80),
        city: clean(body.city, 80),
        service: clean(body.service, 120),
        phone: clean(body.phone, 40),
        email: clean(body.email, 160),
        message: clean(body.message, 2000),
        submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        ip,
    };

    // Validation
    const errors = [];
    if (!lead.name) errors.push('name');
    if (!lead.country) errors.push('country');
    if (!lead.city) errors.push('city');
    if (!lead.service) errors.push('service');
    if (!/^[+\d][\d\s-]{5,}$/.test(lead.phone)) errors.push('phone');
    if (!isEmail(lead.email)) errors.push('email');
    if (errors.length) {
        return res.status(400).json({ ok: false, error: 'Validation failed', fields: errors });
    }

    // SMTP config check
    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, LEADS_TO, LEADS_CC } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || !LEADS_TO) {
        console.error('Missing SMTP environment variables');
        return res.status(500).json({ ok: false, error: 'Email service not configured' });
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: SMTP_SECURE === 'true',
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    try {
        // 1) Notification email to studio
        await transporter.sendMail({
            from: SMTP_FROM,
            to: LEADS_TO.split(',').map(s => s.trim()),
            cc: LEADS_CC ? LEADS_CC.split(',').map(s => s.trim()) : undefined,
            replyTo: `${lead.name} <${lead.email}>`,
            subject: `New callback — ${lead.name} · ${lead.service}`,
            html: notificationHtml(lead),
            text: `New Callback Request\n\nName: ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nCountry: ${lead.country}\nCity: ${lead.city}\nService: ${lead.service}\nMessage: ${lead.message || '—'}\nSubmitted: ${lead.submittedAt}\nIP: ${lead.ip}`,
        });

        // 2) Auto-response to lead (best-effort — don't fail the whole request if this errors)
        try {
            await transporter.sendMail({
                from: SMTP_FROM,
                to: lead.email,
                replyTo: LEADS_TO.split(',')[0].trim(),
                subject: `We've received your enquiry, ${lead.name.split(' ')[0]} — Slate Concept Studios`,
                html: autoResponseHtml(lead),
                text: `Hi ${lead.name.split(' ')[0]},\n\nThanks for reaching out to Slate Concept Studios. We've received your enquiry about ${lead.service} and one of us will personally call you back at ${lead.phone} within one business day.\n\nIf anything is time-sensitive, message us on WhatsApp: https://wa.me/919646724313\n\n— Slate Concept Studios\nAmritsar, India · +91 96467 24313`,
            });
        } catch (autoErr) {
            console.error('Auto-response failed (notification still sent):', autoErr.message);
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('SMTP send failed:', err);
        return res.status(502).json({ ok: false, error: 'Could not send email. Please try WhatsApp or call us directly.' });
    }
}
