// Centralized site contact + service info
export const CONTACT = {
    phone: '+91 9646724313',
    phoneRaw: '919646724313', // for wa.me / tel: links
    email: 'danish@slateconcepts.com',
    instagram: 'https://www.instagram.com/idealvisualizations?igsh=MWptd2d5emdxOHJrYg==',
    behance: 'https://www.behance.net/idealvisuali',
    whatsappMessage: "Hi Ideal Visualizations! I'd like to discuss a project.",
};

export const whatsappLink = (msg = CONTACT.whatsappMessage) =>
    `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(msg)}`;

// Lead form endpoint — handled by api/callback.js (Vercel Serverless Function
// using nodemailer + SMTP). Configure SMTP_* env vars in Vercel dashboard.
export const CALLBACK_ENDPOINT = '/api/callback';

export const SERVICES_OFFERED = [
    'Architecture Planning',
    'Elevation Designing',
    'Interior Designing',
    'Turnkey Projects',
    'Exterior Renders',
    'Interior Renders',
    'Walkthroughs',
    '360 Views',
    'Photoshop Rendered Plans',
    'Other',
];

// Compact country list with phone codes & a curated list of cities
export const COUNTRIES = [
    {
        code: 'IN', name: 'India', dial: '+91',
        cities: ['Amritsar', 'Chandigarh', 'Jalandhar', 'Ludhiana', 'Mohali', 'Bathinda', 'Manali', 'Shimla', 'Delhi', 'Mumbai', 'Bangalore', 'Noida', 'Gurgaon', 'Hyderabad', 'Kolkata', 'Pune', 'Other']
    },
    { code: 'AE', name: 'UAE', dial: '+971', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Other'] },
    { code: 'US', name: 'United States', dial: '+1', cities: ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Houston', 'Other'] },
    { code: 'GB', name: 'United Kingdom', dial: '+44', cities: ['London', 'Manchester', 'Birmingham', 'Other'] },
    { code: 'CA', name: 'Canada', dial: '+1', cities: ['Toronto', 'Vancouver', 'Calgary', 'Montreal', 'Other'] },
    { code: 'AU', name: 'Australia', dial: '+61', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Other'] },
    { code: 'SG', name: 'Singapore', dial: '+65', cities: ['Singapore', 'Other'] },
    { code: 'SA', name: 'Saudi Arabia', dial: '+966', cities: ['Riyadh', 'Jeddah', 'Dammam', 'Other'] },
    { code: 'QA', name: 'Qatar', dial: '+974', cities: ['Doha', 'Other'] },
    { code: 'OTHER', name: 'Other', dial: '+', cities: ['Other'] },
];

// Gallery assets are auto-generated from /public/gallery/{images,videos}
// via scripts/build-gallery-manifest.js (runs on predev / prebuild).
export { GALLERY_IMAGES, GALLERY_VIDEOS } from './galleryManifest';
