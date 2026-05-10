#!/usr/bin/env node
/**
 * Pulls the public Google Sheet (Slate Designs - Assets) and produces
 * src/config/galleryManifest.js with rich per-asset metadata.
 *
 * Source of truth:
 *   https://docs.google.com/spreadsheets/d/1198Q00DPa5Rsk2atWGEDBzxD53f4-pmLdrbu8tUVzFw
 *
 * Drive images & videos are served directly from Google's CDN — we never
 * download or commit them. To update the gallery: edit the sheet, then
 * redeploy (or restart `npm run dev`).
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SHEET_ID = '1198Q00DPa5Rsk2atWGEDBzxD53f4-pmLdrbu8tUVzFw';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

// ---------- helpers ----------

/** Tiny RFC4180 CSV parser (handles quoted fields with commas + newlines). */
function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else {
                field += c;
            }
        } else {
            if (c === '"') inQuotes = true;
            else if (c === ',') { row.push(field); field = ''; }
            else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
            else if (c === '\r') { /* skip */ }
            else field += c;
        }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(cell => cell && cell.trim().length));
}

function extractDriveId(link) {
    if (!link) return null;
    // common patterns:
    //   /file/d/<ID>/view
    //   open?id=<ID>
    //   /uc?id=<ID>
    let m = link.match(/\/file\/d\/([a-zA-Z0-9_-]{10,})/);
    if (m) return m[1];
    m = link.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
    if (m) return m[1];
    return null;
}

function driveImageUrl(id, size = 2000) {
    // googleusercontent CDN — works for "anyone with link" Drive images,
    // and is much faster than drive.google.com/thumbnail.
    return `https://lh3.googleusercontent.com/d/${id}=w${size}`;
}

function driveVideoEmbedUrl(id) {
    return `https://drive.google.com/file/d/${id}/preview`;
}

function splitMulti(s) {
    if (!s) return [];
    return s.split(/[,;]/).map(x => x.trim()).filter(Boolean);
}

// ---------- main ----------

async function main() {
    console.log(`→ Fetching gallery sheet…`);
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status} ${res.statusText}`);
    const csv = await res.text();
    const rows = parseCSV(csv);
    if (!rows.length) throw new Error('Sheet was empty.');

    const headers = rows[0].map(h => h.trim());
    const idx = (name) => headers.indexOf(name);
    const cols = {
        sno: idx('S.No.'),
        link: idx('Drive Link'),
        type: idx('Asset Type'),
        theme: idx('Theme'),
        country: idx('Country'),
        state: idx('State'),
        city: idx('City'),
        clientType: idx('Client Type'),
        clientName: idx('Client Name'),
        services: idx('Services Offered'),
        software: idx('Softwares Used'),
        description: idx('Description'),
    };

    const images = [];
    const videos = [];
    let skipped = 0;

    for (const r of rows.slice(1)) {
        const link = (r[cols.link] || '').trim();
        const id = extractDriveId(link);
        if (!id) { skipped++; continue; }

        const type = (r[cols.type] || '').trim().toLowerCase();
        const base = {
            id,
            sno: (r[cols.sno] || '').trim(),
            theme: (r[cols.theme] || '').trim() || null,
            country: (r[cols.country] || '').trim() || null,
            state: (r[cols.state] || '').trim() || null,
            city: (r[cols.city] || '').trim() || null,
            clientType: (r[cols.clientType] || '').trim() || null,
            clientName: (r[cols.clientName] || '').trim() || null,
            services: splitMulti(r[cols.services]),
            software: splitMulti(r[cols.software]),
            description: (r[cols.description] || '').trim() || null,
            driveLink: link,
        };

        if (type === 'video') {
            videos.push({
                ...base,
                type: 'video',
                src: driveVideoEmbedUrl(id), // iframe embed
                poster: driveImageUrl(id, 800),
                thumb: driveImageUrl(id, 400), // tiny thumb for grid card
            });
        } else {
            images.push({
                ...base,
                type: 'image',
                src: driveImageUrl(id, 1600), // lightbox size
                thumb: driveImageUrl(id, 400), // grid card size — 4× less data than before
            });
        }
    }

    const banner = `// Auto-generated by scripts/build-gallery-from-sheet.js — do not edit manually.\n// Source: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n// Generated: ${new Date().toISOString()}\n`;

    const manifest = `${banner}\nexport const GALLERY_IMAGES = ${JSON.stringify(images, null, 2)};\n\nexport const GALLERY_VIDEOS = ${JSON.stringify(videos, null, 2)};\n`;

    const out = path.join(root, 'src/config/galleryManifest.js');
    fs.writeFileSync(out, manifest);

    console.log(`✓ Wrote ${out}`);
    console.log(`   Images: ${images.length}   Videos: ${videos.length}   Skipped (no Drive id): ${skipped}`);
}

main().catch(e => { console.error(e); process.exit(1); });
