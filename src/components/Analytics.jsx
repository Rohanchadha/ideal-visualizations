// Google Analytics 4 helper. Loads gtag.js once, then sends page_view on every
// route change. To enable, set VITE_GA_MEASUREMENT_ID in your .env file
// (e.g. VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX). When unset, this is a no-op so
// dev/local builds don't pollute analytics.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
let initialized = false;

function init() {
    if (initialized || !GA_ID || typeof window === 'undefined') return;
    initialized = true;

    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // We send page_views manually on route change for SPA-correct behavior.
    window.gtag('config', GA_ID, { send_page_view: false });
}

export function trackPageView(path, title) {
    if (!GA_ID || typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href,
    });
}

export function trackEvent(name, params = {}) {
    if (!GA_ID || typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', name, params);
}

export default function Analytics() {
    const { pathname, search } = useLocation();
    useEffect(() => {
        init();
    }, []);
    useEffect(() => {
        if (!GA_ID) return;
        // Defer slightly so document.title has updated from <Seo>
        const t = setTimeout(() => trackPageView(pathname + search), 50);
        return () => clearTimeout(t);
    }, [pathname, search]);
    return null;
}
