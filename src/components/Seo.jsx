import { useContext, useEffect } from 'react';
import { SITE_URL, DEFAULT_OG_IMAGE, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '../config/seo';
import { SeoContext } from '../context/SeoContext';

/**
 * Lightweight SEO head manager. Updates <title>, meta description, canonical,
 * OG/Twitter tags, and injects per-page JSON-LD blocks. Cleans up on unmount
 * so navigating between routes restores the default head from index.html.
 */
function setMeta(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el && value != null) el.setAttribute(attr, value);
}

function injectJsonLd(id, data) {
    if (!data) return;
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('script');
        el.type = 'application/ld+json';
        el.id = id;
        document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
}

export default function Seo({
    title,
    description,
    path = '/',
    image = DEFAULT_OG_IMAGE,
    type = 'website',
    jsonLd = null,
    breadcrumb = null, // [{ name, path }]
    noIndex = false,
}) {
    const collectSeo = useContext(SeoContext);
    if (collectSeo) collectSeo({ title: title || DEFAULT_TITLE, description: description || DEFAULT_DESCRIPTION, path, image: new URL(image || DEFAULT_OG_IMAGE, SITE_URL).href, type, jsonLd, breadcrumb, noIndex });
    const jsonLdString = JSON.stringify(jsonLd);
    const breadcrumbString = JSON.stringify(breadcrumb);

    useEffect(() => {
        const fullTitle = title || DEFAULT_TITLE;
        const desc = description || DEFAULT_DESCRIPTION;
        const canonical = new URL(path, SITE_URL).href;
        const imageUrl = new URL(image || DEFAULT_OG_IMAGE, SITE_URL).href;

        const prev = {
            title: document.title,
            desc: document.querySelector('meta[name="description"]')?.getAttribute('content'),
            canon: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
            robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
            ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
            ogDesc: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
            ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
            ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
            ogType: document.querySelector('meta[property="og:type"]')?.getAttribute('content'),
            twTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
            twDesc: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'),
            twImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content'),
        };

        document.title = fullTitle;
        setMeta('meta[name="description"]', 'content', desc);
        const canonicalLink = document.querySelector('link[rel="canonical"]') || document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = canonical;
        if (!canonicalLink.parentNode) document.head.appendChild(canonicalLink);
        setMeta('meta[name="robots"]', 'content', noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
        setMeta('meta[property="og:title"]', 'content', fullTitle);
        setMeta('meta[property="og:description"]', 'content', desc);
        setMeta('meta[property="og:url"]', 'content', canonical);
        setMeta('meta[property="og:image"]', 'content', imageUrl);
        setMeta('meta[property="og:type"]', 'content', type);
        setMeta('meta[name="twitter:title"]', 'content', fullTitle);
        setMeta('meta[name="twitter:description"]', 'content', desc);
        setMeta('meta[name="twitter:image"]', 'content', imageUrl);

        // Per-page JSON-LD (page-scoped, removed on unmount)
        const pageData = JSON.parse(jsonLdString);
        if (pageData) injectJsonLd('seo-jsonld-page', pageData);

        // Breadcrumb JSON-LD
        const breadcrumbItems = JSON.parse(breadcrumbString);
        if (breadcrumbItems && breadcrumbItems.length) {
            injectJsonLd('seo-jsonld-breadcrumb', {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbItems.map((b, i) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    name: b.name,
                    item: `${SITE_URL}${b.path}`,
                })),
            });
        }

        return () => {
            document.title = prev.title;
            if (prev.desc) setMeta('meta[name="description"]', 'content', prev.desc);
            if (prev.canon) canonicalLink.href = prev.canon;
            else canonicalLink.remove();
            if (prev.robots) setMeta('meta[name="robots"]', 'content', prev.robots);
            if (prev.ogTitle) setMeta('meta[property="og:title"]', 'content', prev.ogTitle);
            if (prev.ogDesc) setMeta('meta[property="og:description"]', 'content', prev.ogDesc);
            if (prev.ogUrl) setMeta('meta[property="og:url"]', 'content', prev.ogUrl);
            if (prev.ogImage) setMeta('meta[property="og:image"]', 'content', prev.ogImage);
            if (prev.ogType) setMeta('meta[property="og:type"]', 'content', prev.ogType);
            if (prev.twTitle) setMeta('meta[name="twitter:title"]', 'content', prev.twTitle);
            if (prev.twDesc) setMeta('meta[name="twitter:description"]', 'content', prev.twDesc);
            if (prev.twImage) setMeta('meta[name="twitter:image"]', 'content', prev.twImage);
            document.getElementById('seo-jsonld-page')?.remove();
            document.getElementById('seo-jsonld-breadcrumb')?.remove();
        };
    }, [title, description, path, image, type, jsonLdString, breadcrumbString, noIndex]);

    return null;
}
