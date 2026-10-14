// Captures ad-attribution signals from the URL on first page load of a
// session and persists them in sessionStorage so they survive client-side
// navigation (e.g. landing on an ad → browsing → submitting the form later).
//
// Call `captureAttribution()` once at app startup (see main.jsx), then read
// `getAttribution()` wherever a lead is submitted (CallbackForm.jsx).

const STORAGE_KEY = 'slate_lead_attribution';

function detectSource(params) {
    const source = params.get('utm_source')?.trim().toLowerCase();
    const medium = params.get('utm_medium')?.trim().toLowerCase();
    const paid = ['cpc', 'ppc', 'paid', 'paidsearch', 'paid_search', 'paid-social', 'paid_social', 'paidsocial', 'display'].includes(medium);
    if (params.get('gclid') || params.get('gbraid') || params.get('wbraid') || (source === 'google' && paid)) {
        return 'Google Ads';
    }
    if (params.get('fbclid') || ((source === 'facebook' || source === 'instagram') && (paid || !medium))) {
        return 'Meta Ads';
    }
    if (['google', 'google-business-profile', 'gbp', 'bing'].includes(source) || medium === 'organic') {
        return 'Organic/Website';
    }
    if (source === 'facebook' || source === 'instagram') return 'Referral';
    if (source) return params.get('utm_source');
    return null; // unknown at capture time — treated as Organic/Website downstream
}

export function captureAttribution() {
    if (typeof window === 'undefined') return;
    try {
        const params = new URLSearchParams(window.location.search);
        const hasAnySignal = ['utm_source', 'utm_campaign', 'utm_medium', 'fbclid', 'gclid', 'gbraid', 'wbraid'].some(k => params.has(k));
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
