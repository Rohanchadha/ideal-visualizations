// Helpers that derive curated image lists from the auto-generated gallery manifest
// (src/config/galleryManifest.js). Used by ServicePage and LocationPage to surface
// real client work in an SEO-friendly way (descriptive alt text, semantic context).

import { GALLERY_IMAGES, GALLERY_VIDEOS } from './galleryManifest';

// Map our service slug → the service-name strings present in the manifest's `services`
// array, plus an optional theme fallback. Order is descending priority — primary
// matches first, fallbacks afterwards.
const SERVICE_SLUG_TO_MANIFEST = {
    'exterior-3d-rendering': { services: ['Exterior 3D Rendering'], themes: ['Exterior'] },
    'interior-3d-rendering': { services: ['Interior 3D rendering'], themes: ['Interior'] },
    '3d-walkthrough-animation': { services: ['3D Walkthrough Animation'], themes: [] },
    '360-virtual-tour': { services: ['360° Virtual Tour', '360° Virtual Tours'], themes: [] },
    'architecture-planning': { services: [], themes: ['Plan'] },
    'elevation-design': { services: ['Elevation Design'], themes: ['Exterior'] },
    'interior-design': { services: ['Interior Design'], themes: ['Interior'] },
    'turnkey-construction': { services: ['Turnkey Construction Project'], themes: ['Construction'] },
};

const buildAlt = (item, serviceLabel) => {
    const bits = [];
    if (item.description && item.description.trim()) bits.push(item.description.trim());
    if (serviceLabel) bits.push(serviceLabel);
    if (item.city) bits.push(item.city);
    if (item.country) bits.push(item.country);
    return bits.join(' — ') || `${serviceLabel || '3D'} project render`;
};

// Returns an array of { src, thumb, alt } items. Limited to `max` results.
export function imagesForService(slug, max = 6) {
    const cfg = SERVICE_SLUG_TO_MANIFEST[slug];
    if (!cfg) return [];

    const matched = [];
    const seen = new Set();

    // Pass 1 — service-name match
    for (const it of GALLERY_IMAGES) {
        if (matched.length >= max) break;
        if (!it.services || !it.services.length) continue;
        if (cfg.services.some((s) => it.services.includes(s))) {
            if (!seen.has(it.id)) { seen.add(it.id); matched.push(it); }
        }
    }
    // Pass 2 — theme fallback (only if we still need more)
    if (matched.length < max && cfg.themes.length) {
        for (const it of GALLERY_IMAGES) {
            if (matched.length >= max) break;
            if (cfg.themes.includes(it.theme) && !seen.has(it.id)) {
                seen.add(it.id);
                matched.push(it);
            }
        }
    }

    const label = SERVICE_LABELS[slug] || '';
    return matched.map((it) => ({
        ...it,
        alt: buildAlt(it, label),
    }));
}

const SERVICE_LABELS = {
    'exterior-3d-rendering': 'exterior 3D rendering',
    'interior-3d-rendering': 'interior 3D rendering',
    '3d-walkthrough-animation': '3D walkthrough',
    '360-virtual-tour': '360° virtual tour',
    'architecture-planning': 'architecture planning',
    'elevation-design': 'elevation design',
    'interior-design': 'interior design',
    'turnkey-construction': 'turnkey construction',
};

// Map our location slug → the city-name strings present in the manifest. Some
// location slugs cover multiple cities (e.g. chandigarh covers Mohali too).
const LOCATION_SLUG_TO_CITIES = {
    'amritsar': ['Amritsar'],
    'chandigarh': ['Mohali', 'Chandigarh', 'Panchkula'],
    'delhi-ncr': ['Delhi', 'New Delhi', 'Noida', 'Gurgaon', 'Faridabad'],
    'mumbai': ['Mumbai'],
    'dubai': ['Dubai'],
    'toronto': ['Toronto', 'Ottawa', 'Mississauga', 'Brampton'],
    'new-york': ['New York', 'Brooklyn', 'Manhattan'],
};

export function imagesForLocation(slug, max = 6) {
    const cities = LOCATION_SLUG_TO_CITIES[slug] || [];
    if (!cities.length) return [];

    const matched = [];
    for (const it of GALLERY_IMAGES) {
        if (matched.length >= max) break;
        if (it.city && cities.includes(it.city)) matched.push(it);
    }
    return matched.map((it) => ({
        ...it,
        alt: buildAlt(it, it.theme ? `${it.theme.toLowerCase()} 3D render` : '3D render'),
    }));
}

// Optional: surface a single location video (for walkthrough service or city pages)
export function videosForLocation(slug, max = 2) {
    const cities = LOCATION_SLUG_TO_CITIES[slug] || [];
    if (!cities.length) return [];
    return GALLERY_VIDEOS.filter((v) => v.city && cities.includes(v.city)).slice(0, max);
}

export function videosForService(slug, max = 2) {
    if (slug !== '3d-walkthrough-animation') return [];
    return GALLERY_VIDEOS.slice(0, max);
}

// Map industry slug → client-type strings in the manifest, plus theme fallbacks
// so we always have enough images to fill the strip even when the primary client
// type is sparse.
const INDUSTRY_SLUG_TO_MANIFEST = {
    'architecture-firms': {
        clientTypes: ['Architectural Firm'],
        themes: ['Exterior', 'Interior', 'Plan'],
        label: 'architecture firm',
    },
    'interior-designers': {
        clientTypes: ['Interior Designers'],
        themes: ['Interior'],
        label: 'interior design',
    },
    'builders-developers': {
        clientTypes: ['Builders/Developer'],
        themes: ['Exterior', 'Construction'],
        label: 'real estate development',
    },
};

export function imagesForIndustry(slug, max = 6) {
    const cfg = INDUSTRY_SLUG_TO_MANIFEST[slug];
    if (!cfg) return [];

    const matched = [];
    const seen = new Set();

    // Pass 1 — exact client-type match
    for (const it of GALLERY_IMAGES) {
        if (matched.length >= max) break;
        if (it.clientType && cfg.clientTypes.includes(it.clientType) && !seen.has(it.id)) {
            seen.add(it.id);
            matched.push(it);
        }
    }
    // Pass 2 — theme fallback to top up the strip
    if (matched.length < max && cfg.themes.length) {
        for (const it of GALLERY_IMAGES) {
            if (matched.length >= max) break;
            if (cfg.themes.includes(it.theme) && !seen.has(it.id)) {
                seen.add(it.id);
                matched.push(it);
            }
        }
    }

    return matched.map((it) => ({
        ...it,
        alt: buildAlt(it, `${cfg.label} 3D render`),
    }));
}
