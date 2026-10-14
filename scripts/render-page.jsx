import React from 'react';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { SeoContext } from '../src/context/SeoContext';
import { SERVICES } from '../src/content/services';
import { LOCATIONS } from '../src/content/locations';
import { INDUSTRIES } from '../src/content/industries';
import { POSTS } from '../src/content/blog';

export const publishedPaths = [
    '/', '/services', '/portfolio', '/furniture', '/blog', '/about', '/contact', '/process', '/faq', '/privacy-policy',
    ...SERVICES.filter(item => !item.draft).map(item => `/services/${item.slug}`),
    ...LOCATIONS.filter(item => !item.draft).map(item => `/locations/${item.slug}`),
    ...INDUSTRIES.filter(item => !item.draft).map(item => `/industries/${item.slug}`),
    ...POSTS.filter(item => !item.draft).map(item => `/blog/${item.slug}`),
];

export function render(pathname) {
    return new Promise((resolve, reject) => {
        let metadata;
        const app = (
            <SeoContext.Provider value={value => { metadata = value; }}>
                <MemoryRouter initialEntries={[pathname]}><App /></MemoryRouter>
            </SeoContext.Provider>
        );
        const output = new PassThrough();
        output.resume();
        const timer = setTimeout(() => {
            stream.abort();
            reject(new Error(`Rendering timed out: ${pathname}`));
        }, 30000);
        output.on('end', () => {
            clearTimeout(timer);
            try {
                const html = renderToString(app);
                resolve({ html, metadata });
            } catch (error) {
                reject(error);
            }
        });
        output.on('error', error => {
            clearTimeout(timer);
            reject(error);
        });
        const stream = renderToPipeableStream(
            app,
            {
                onAllReady() { stream.pipe(output); },
                onError(error) {
                    clearTimeout(timer);
                    reject(error);
                },
            },
        );
    });
}