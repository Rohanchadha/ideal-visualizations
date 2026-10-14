import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { captureAttribution, getAttribution } from '../src/config/attribution.js';

const originalWindow = globalThis.window;
afterEach(() => {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
});

function setBrowser(search) {
    const storage = new Map();
    globalThis.window = {
        location: { search },
        sessionStorage: {
            getItem: (key) => storage.get(key) ?? null,
            setItem: (key, value) => storage.set(key, value),
        },
    };
}

for (const [search, expected] of [
    ['?utm_source=google&utm_medium=organic&utm_campaign=amritsar-gbp', 'Organic/Website'],
    ['?utm_source=google-business-profile&utm_medium=organic', 'Organic/Website'],
    ['?utm_source=Google&utm_medium=CPC', 'Google Ads'],
    ['?gclid=example', 'Google Ads'],
    ['?gbraid=example', 'Google Ads'],
    ['?wbraid=example', 'Google Ads'],
    ['?utm_source=google', 'Organic/Website'],
    ['?utm_source=instagram&utm_medium=paid_social', 'Meta Ads'],
    ['?fbclid=example', 'Meta Ads'],
    ['?utm_source=facebook', 'Meta Ads'],
    ['?utm_source=facebook&utm_medium=social', 'Referral'],
    ['?utm_source=newsletter&utm_campaign=autumn', 'newsletter'],
]) {
    test(`classifies ${search}`, () => {
        setBrowser(search);
        captureAttribution();
        assert.equal(getAttribution().source, expected);
    });
}

test('preserves the GBP campaign through untagged navigation', () => {
    setBrowser('?utm_source=google&utm_medium=organic&utm_campaign=amritsar-gbp');
    captureAttribution();
    window.location.search = '';
    captureAttribution();
    assert.deepEqual(getAttribution(), { source: 'Organic/Website', campaign: 'amritsar-gbp' });
});

test('handles absent browser, inaccessible storage and invalid stored JSON', () => {
    delete globalThis.window;
    assert.doesNotThrow(captureAttribution);
    assert.deepEqual(getAttribution(), { source: '', campaign: '' });
    setBrowser('');
    window.sessionStorage.getItem = () => '{invalid';
    assert.deepEqual(getAttribution(), { source: '', campaign: '' });
    window.location.search = '?gclid=example';
    window.sessionStorage.setItem = () => { throw new Error('Storage unavailable'); };
    assert.doesNotThrow(captureAttribution);
});