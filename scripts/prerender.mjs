import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { load } from 'cheerio';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(root, 'dist');
const template = await readFile(join(outputDirectory, 'index.html'), 'utf8');
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });

function addJsonLd(document, id, data) {
    if (!data) return;
    const script = document('<script type="application/ld+json"></script>');
    script.attr('id', id).text(JSON.stringify(data).replace(/</g, '\\u003c'));
    document('head').append(script);
}

try {
    const { render, publishedPaths } = await server.ssrLoadModule('/scripts/render-page.jsx');
    const { SITE_URL } = await server.ssrLoadModule('/src/config/seo.js');
    assert.equal(new Set(publishedPaths).size, publishedPaths.length, 'Duplicate published routes');
    for (const pathname of [...publishedPaths, '/404']) {
        const { html, metadata } = await render(pathname);
        assert.equal(metadata?.path, pathname, `Missing route metadata: ${pathname}`);
        const document = load(template);
        document('#root').html(html).attr('data-prerendered', 'true');
        document('title').text(metadata.title);
        const canonical = new URL(pathname, SITE_URL).href;
        const tags = [
            ['meta[name="description"]', metadata.description],
            ['meta[name="robots"]', metadata.noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'],
            ['meta[property="og:title"]', metadata.title],
            ['meta[property="og:description"]', metadata.description],
            ['meta[property="og:url"]', canonical],
            ['meta[property="og:image"]', metadata.image],
            ['meta[property="og:type"]', metadata.type],
            ['meta[name="twitter:title"]', metadata.title],
            ['meta[name="twitter:description"]', metadata.description],
            ['meta[name="twitter:image"]', metadata.image],
        ];
        for (const [selector, value] of tags) {
            assert.equal(document(selector).length, 1, `Missing or duplicate ${selector}`);
            document(selector).attr('content', value);
        }
        document('link[rel="canonical"]').remove();
        if (!metadata.noIndex) document('head').append(document('<link rel="canonical">').attr('href', canonical));
        document('#seo-jsonld-page, #seo-jsonld-breadcrumb').remove();
        addJsonLd(document, 'seo-jsonld-page', metadata.jsonLd);
        if (metadata.breadcrumb?.length) addJsonLd(document, 'seo-jsonld-breadcrumb', {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: metadata.breadcrumb.map((item, index) => ({
                '@type': 'ListItem', position: index + 1, name: item.name, item: new URL(item.path, SITE_URL).href,
            })),
        });
        assert.equal(document('h1').length, 1, `Expected one visible page heading: ${pathname}`);
        assert.equal(document('#root template, #root [hidden]').length, 0, `Unresolved or hidden route content: ${pathname}`);
        assert.equal(document('link[rel="canonical"]').length, metadata.noIndex ? 0 : 1);
        document('script[type="application/ld+json"]').each((index, element) => JSON.parse(document(element).text()));
        const filename = join(outputDirectory, pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`);
        await mkdir(dirname(filename), { recursive: true });
        await writeFile(filename, document.html());
    }
    const sitemap = load('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', { xml: true });
    for (const pathname of publishedPaths) {
        sitemap('urlset').append(sitemap('<url></url>').append(sitemap('<loc></loc>').text(new URL(pathname, SITE_URL).href)));
    }
    await writeFile(join(outputDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n${sitemap.xml()}\n`);
    console.log(`Prerendered and checked ${publishedPaths.length} published pages plus 404; sitemap matches published inventory.`);
} finally {
    await server.close();
}