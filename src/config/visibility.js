// Single source of truth for content visibility.
// Any content item (service, industry, location, portfolio item, blog post)
// with `draft: true` is excluded from:
//   - hub/listing pages (ServicesHub, PortfolioHub, BlogIndex, Footer columns)
//   - related/cross-link surfaces
//   - the generated sitemap.xml
// And the per-item route either redirects to its parent hub OR renders with
// `noIndex` when previewed via `?preview=1` (for staging review).

export const isPublished = (item) => !!item && !item.draft;

export const onlyPublished = (arr) => (arr || []).filter(isPublished);

// In-browser preview escape hatch so Danish can review unfinished pages without
// shipping them. Append `?preview=1` to any draft URL to bypass the redirect.
export const isPreviewMode = () => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === '1';
};
