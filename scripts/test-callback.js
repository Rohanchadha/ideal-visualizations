// Local test for api/callback.js — bypasses Vercel/Vite entirely.
// Loads .env, mocks req/res, calls the handler. SMTP fires for real.
//
// Usage:  node scripts/test-callback.js you@example.com

import 'dotenv/config';
import handler from '../api/callback.js';

const recipientEmail = process.argv[2] || 'rohan.chadha@gmail.com';

const mockReq = {
    method: 'POST',
    headers: { 'x-forwarded-for': '127.0.0.1' },
    socket: { remoteAddress: '127.0.0.1' },
    body: {
        name: 'Local Test Lead',
        country: 'India',
        city: 'Amritsar',
        service: 'Interior Renders',
        phone: '+91 9876543210',
        email: recipientEmail,
        message: 'This is a test submission from scripts/test-callback.js — please ignore.',
        website: '', // honeypot empty
    },
};

const mockRes = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) {
        console.log(`\n← Response  ${this.statusCode}`);
        console.log(JSON.stringify(payload, null, 2));
        if (this.statusCode >= 200 && this.statusCode < 300) {
            console.log(`\n✅ Success. Check inboxes:`);
            console.log(`   • ${process.env.LEADS_TO}  (notification)`);
            console.log(`   • ${recipientEmail}  (auto-response)`);
        } else {
            console.log(`\n❌ Failed.`);
        }
        return this;
    },
    end() { return this; },
};

console.log(`→ POST /api/callback`);
console.log(`   recipient (lead email): ${recipientEmail}`);
console.log(`   notification to:        ${process.env.LEADS_TO}`);
console.log(`   smtp host:              ${process.env.SMTP_HOST}`);
console.log(`   smtp user:              ${process.env.SMTP_USER}\n`);

await handler(mockReq, mockRes);
