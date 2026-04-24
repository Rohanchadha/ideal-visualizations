#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SRC_DIR = path.join(root, 'public/gallery/images');
const OUT_DIR = path.join(root, 'public/gallery/optimized');

const FULL_MAX_W = 1920;
const FULL_QUALITY = 82;
const THUMB_MAX_W = 600;
const THUMB_QUALITY = 75;

if (!fs.existsSync(SRC_DIR)) { console.error('No source dir:', SRC_DIR); process.exit(0); }
fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs.readdirSync(SRC_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

// Slug includes extension hint to avoid collisions like 1.jpg vs 1.png
const slug = (name) => {
    const ext = path.extname(name).replace(/^\./, '').toLowerCase().replace(/jpeg/, 'jpg');
    const stem = name
        .replace(/\.[^.]+$/, '')
        .replace(/\.(jpg|jpeg|png|webp)$/gi, '')
        .replace(/[^a-zA-Z0-9-_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    return `${stem}-${ext}`;
};

const isStale = (src, out) => !fs.existsSync(out) || fs.statSync(src).mtimeMs > fs.statSync(out).mtimeMs;

const processed = { full: 0, thumb: 0, skipped: 0, failed: 0 };

await Promise.all(files.map(async (file) => {
    const src = path.join(SRC_DIR, file);
    const base = slug(file);
    const fullOut = path.join(OUT_DIR, `${base}.webp`);
    const thumbOut = path.join(OUT_DIR, `${base}.thumb.webp`);
    try {
        if (isStale(src, fullOut)) {
            await sharp(src, { failOn: 'none' }).rotate()
                .resize({ width: FULL_MAX_W, withoutEnlargement: true })
                .webp({ quality: FULL_QUALITY }).toFile(fullOut);
            processed.full++;
        } else processed.skipped++;
        if (isStale(src, thumbOut)) {
            await sharp(src, { failOn: 'none' }).rotate()
                .resize({ width: THUMB_MAX_W, withoutEnlargement: true })
                .webp({ quality: THUMB_QUALITY }).toFile(thumbOut);
            processed.thumb++;
        }
    } catch (err) {
        console.warn(`⚠️  Failed: ${file} — ${err.message}`);
        processed.failed++;
    }
}));

console.log(`✅ Optimized ${files.length} images (full: ${processed.full}, thumb: ${processed.thumb}, up-to-date: ${processed.skipped}, failed: ${processed.failed})`);
