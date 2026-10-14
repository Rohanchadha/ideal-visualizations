import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { before, after, test } from 'node:test';
import { createServer } from 'vite';
import { load } from 'cheerio';

let server;
let renderer;
before(async () => {
    server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
    renderer = await server.ssrLoadModule('/scripts/render-page.jsx');
});
after(async () => { await server?.close(); });

test('every published page has complete initial HTML and matching metadata', async () => {
    for (const pathname of renderer.publishedPaths) {
        const file = pathname === '/' ? 'dist/index.html' : `dist${pathname}.html`;
        const document = load(await readFile(file, 'utf8'));
        assert.equal(document('h1').length, 1, pathname);
        assert.ok(document('h1').text().trim(), pathname);
        assert.equal(document('link[rel="canonical"]').length, 1, pathname);
        assert.equal(document('link[rel="canonical"]').attr('href'), `https://slateconcepts.com${pathname}`);
        assert.equal(document('meta[property="og:url"]').attr('content'), `https://slateconcepts.com${pathname}`);
        assert.match(document('meta[property="og:image"]').attr('content'), /^https:\/\//);
        assert.doesNotMatch(document('meta[name="robots"]').attr('content'), /noindex/);
        assert.equal(document('#root').attr('data-prerendered'), 'true');
        assert.equal(document('.seo-prerender').length, 0);
        assert.equal(document('#root template, #root [hidden]').length, 0, pathname);
        document('script[type="application/ld+json"]').each((index, element) => {
            const data = JSON.parse(document(element).text());
            if (data['@type'] === 'Article' && data.image) assert.match(data.image, /^https:\/\/[^ ]+$/);
        });
    }
});

test('sitemap contains exactly the published canonical inventory, without invented modification dates', async () => {
    const sitemap = load(await readFile('dist/sitemap.xml', 'utf8'), { xml: true });
    const paths = sitemap('loc').map((index, element) => new URL(sitemap(element).text()).pathname).get();
    assert.deepEqual(paths.sort(), [...renderer.publishedPaths].sort());
    assert.equal(sitemap('lastmod').length, 0);
    assert.ok(!paths.includes('/blog/3d-rendering-cost'));
});

test('deployment uses native static routing and keeps permanent aliases', async () => {
    const config = JSON.parse(await readFile('vercel.json', 'utf8'));
    assert.equal(config.cleanUrls, true);
    assert.equal(config.rewrites, undefined);
    assert.ok(config.redirects.some(item => item.source === '/gallery' && item.destination === '/portfolio' && item.permanent));
    assert.ok(config.redirects.some(item => item.source === '/privacy' && item.destination === '/privacy-policy' && item.permanent));
    const document = load(await readFile('dist/404.html', 'utf8'));
    assert.match(document('meta[name="robots"]').attr('content'), /noindex/);
    assert.equal(document('h1').text().trim(), 'Page not found');
    assert.equal(document('link[rel="canonical"]').length, 0);
});

for (const pathname of ['/not-a-page', '/services/not-a-service', '/locations/not-a-city', '/industries/not-an-industry', '/blog/not-a-post', '/blog/3d-rendering-cost', '/portfolio/not-a-project']) {
    test(`invalid or unpublished route stays not found: ${pathname}`, async () => {
        const result = await renderer.render(pathname);
        assert.equal(result.metadata.noIndex, true);
        assert.equal(load(result.html)('h1').text().trim(), 'Page not found');
    });
}