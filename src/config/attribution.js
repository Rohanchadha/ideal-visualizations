// Captures ad-attribution signals from the URL on first page load of a
// session and persists them in sessionStorage so they survive client-side
// navigation (e.g. landing on an ad → browsing → submitting the form later).
//
// Call `captureAttribution()` once at app startup (see main.jsx), then read
// `getAttribution()` wherever a lead is submitted (CallbackForm.jsx).

const STORAGE_KEY = 'slate_lead_attribution';

function detectSource(params) {
    if (params.get('fbclid') || params.get('utm_source') === 'facebook' || params.get('utm_source') === 'instagram') {
        return 'Meta Ads';
    }
    if (params.get('gclid') || params.get('utm_source') === 'google') {
        return 'Google Ads';
    }
    const utmSource = params.get('utm_source');
    if (utmSource) return utmSource; // e.g. "referral", "newsletter"
    return null; // unknown at capture time — treated as Organic/Website downstream
}

export function captureAttribution() {
    if (typeof window === 'undefined') return;
    try {
        const params = new URLSearchParams(window.location.search);
        const hasAnySignal = ['utm_source', 'utm_campaign', 'utm_medium', 'fbclid', 'gclid'].some(k => params.has(k));
        if (!hasAnySignal) return; // don't overwrite an existing stored value with nothing

        const source = detectSource(params);
        const data = {
            source: source || 'Organic/Website',
            campaign: params.get('utm_campaign') || '',
            medium: params.get('utm_medium') || '',
            capturedAt: new Date().toISOString(),
        };
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // sessionStorage unavailable (e.g. private mode edge cases) — ignore
    }
}

export function getAttribution() {
    if (typeof window === 'undefined') return { source: '', campaign: '' };
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return { source: '', campaign: '' };
        const data = JSON.parse(raw);
        return { source: data.source || '', campaign: data.campaign || '' };
    } catch {
        return { source: '', campaign: '' };
    }
}
