// Generates public/sitemap.xml from content modules. Run via npm prebuild.
// We re-import the data modules directly. They are pure JS / JSX-meta-only
// for blog posts so we read filenames as a fallback.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SITE_URL = 'https://ideal-visualizations.vercel.app';

// Static read of slug arrays from the data modules via dynamic import.
async function load() {
    const services = await import(url.pathToFileURL(path.join(root, 'src/content/services.js')).href);
    const industries = await import(url.pathToFileURL(path.join(root, 'src/content/industries.js')).href);
    const locations = await import(url.pathToFileURL(path.join(root, 'src/content/locations.js')).href);
    const portfolio = await import(url.pathToFileURL(path.join(root, 'src/content/portfolio.js')).href);
    return { services, industries, locations, portfolio };
}

// Read blog post slugs from filenames in src/content/blog/posts/
function readBlogSlugs() {
    const dir = path.join(root, 'src/content/blog/posts');
    return fs.readdirSync(dir)
        .filter((f) => f.endsWith('.jsx'))
        .map((f) => f.replace(/\.jsx$/, ''));
}

// Read blog meta by parsing each module file (regex; avoids importing JSX in Node)
function readBlogMeta(slug) {
    const file = path.join(root, 'src/content/blog/posts', `${slug}.jsx`);
    const txt = fs.readFileSync(file, 'utf8');
    const dateM = txt.match(/date:\s*'([^']+)'/);
    const draftM = txt.match(/draft:\s*(true|false)/);
    return {
        slug,
        date: dateM ? dateM[1] : new Date().toISOString().slice(0, 10),
        draft: draftM ? draftM[1] === 'true' : false,
    };
}

function urlEntry(loc, lastmod, changefreq = 'monthly', priority = 0.6) {
    return `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
    const today = new Date().toISOString().slice(0, 10);
    const { services, industries, locations, portfolio } = await load();
    const blog = readBlogSlugs().map(readBlogMeta).filter((b) => !b.draft).sort((a, b) => (a.date < b.date ? 1 : -1));

    const published = (arr) => (arr || []).filter((x) => !x.draft);

    const urls = [];
    // Top-level
    urls.push(urlEntry('/', today, 'weekly', 1.0));
    urls.push(urlEntry('/services', today, 'monthly', 0.9));
    urls.push(urlEntry('/portfolio', today, 'monthly', 0.9));
    urls.push(urlEntry('/gallery', today, 'monthly', 0.8));
    urls.push(urlEntry('/blog', today, 'weekly', 0.8));
    urls.push(urlEntry('/about', today, 'yearly', 0.6));
    urls.push(urlEntry('/contact', today, 'yearly', 0.7));
    urls.push(urlEntry('/process', today, 'yearly', 0.6));
    urls.push(urlEntry('/pricing', today, 'monthly', 0.7));
    urls.push(urlEntry('/faq', today, 'monthly', 0.6));

    published(services.SERVICES).forEach((s) => urls.push(urlEntry(`/services/${s.slug}`, today, 'monthly', 0.85)));
    published(industries.INDUSTRIES).forEach((i) => urls.push(urlEntry(`/industries/${i.slug}`, today, 'monthly', 0.8)));
    published(locations.LOCATIONS).forEach((l) => urls.push(urlEntry(`/locations/${l.slug}`, today, 'monthly', 0.75)));
    published(portfolio.PORTFOLIO).forEach((p) => urls.push(urlEntry(`/portfolio/${p.slug}`, today, 'monthly', 0.7)));
    blog.forEach((b) => urls.push(urlEntry(`/blog/${b.slug}`, b.date, 'monthly', 0.65)));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

    const outPath = path.join(root, 'public/sitemap.xml');
    fs.writeFileSync(outPath, xml);
    console.log(`Sitemap written: ${outPath} (${urls.length} URLs)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
