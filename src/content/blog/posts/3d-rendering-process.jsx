import React from 'react';
import { Link } from 'react-router-dom';

export const meta = {
    slug: '3d-rendering-process',
    title: 'Our 3D Rendering Process: From CAD File to Final Delivery in 7 Steps',
    description: 'A behind-the-scenes look at the seven-step 3D rendering process we use on every project — brief, modeling, materials, lighting, rendering, post-production, delivery.',
    date: '2026-04-02',
    readingTime: 9,
    category: 'Process',
    keyword: '3d rendering process',
    image: '/3D-Images/2-37.jpg.jpeg',
    author: 'Danish',
};

export default function Post() {
    return (
        <>
            <p>Every photoreal render that leaves our studio moves through the same seven steps. The discipline of the process is what makes the output predictable — same brief, same artist, same software, same quality every time. This post walks you through what actually happens between the moment you send us a CAD file and the moment we hand back a finished frame.</p>

            <h2>Step 1 — Inquiry and brief</h2>
            <p>The cycle starts with a conversation. WhatsApp, email or a call. We need to know: what is the project, where, what file format are you on, how many views, what mood/style, what deadline. We ask for reference images of buildings or interiors you like the look of — three to five is plenty. Within an hour we come back with a quote and a turnaround commitment.</p>

            <h2>Step 2 — File handoff and NDA</h2>
            <p>You send us your CAD, SketchUp, Revit or PDF files plus material references. If confidentiality matters, we sign your NDA before any file moves. WhatsApp works under 100 MB; WeTransfer or Google Drive for anything larger.</p>

            <h2>Step 3 — 3D modeling</h2>
            <p>We rebuild your geometry to render-quality standards. This means clean topology, proper unit setup, joinery as actual 3D geometry rather than 2D symbols, and proper UV mapping for materials to come. For a typical residential project this takes 1–2 days. For complex commercial or hospitality, 2–4 days.</p>

            <h2>Step 4 — Material and texture assignment</h2>
            <p>Every surface gets a physically-based material — diffuse, roughness, normal, displacement, sometimes subsurface scattering for stone and skin. We work from your supplier links or sample photos where available, or our curated PBR material library otherwise. This step is where interior renders earn their reputation for difficulty: a hundred materials in a single living room is not unusual.</p>

            <h2>Step 5 — Lighting setup and camera angles</h2>
            <p>The single biggest difference between an average render and a great one is lighting. We set sun position, sky model, time of day, interior lighting (warm vs neutral vs cool), accent lighting (track lights, pendants, cove lighting). Camera angles are set to your preferences and to lensing decisions our art director makes — focal length, height, tilt, atmospheric haze.</p>

            <h2>Step 6 — Rendering and post-production</h2>
            <p>The render itself runs on our render farm — typically overnight for a hero exterior, several hours for an interior. The raw render is then post-processed in Photoshop: colour grade, atmospheric depth, sky enhancement, entourage (people, cars, plants), and final sharpening for the target output medium (screen, print, hoarding).</p>

            <h2>Step 7 — Review, revisions and final delivery</h2>
            <p>You see a draft preview by day 3 of a 5–10 day project. We collect your feedback in one consolidated round, revise, and deliver a near-final by day 6. One more revision round, then final delivery at high resolution in PNG, JPG or your preferred format.</p>

            <h2>What this looks like in practice</h2>
            <p>For a single exterior hero view of a residential project, this seven-step cycle takes 5–8 business days. For a set of 6 interior renders of an apartment, 8–12 business days. For a 90-second walkthrough, 14–18 business days.</p>
            <p>See our <Link to="/process">visual process page</Link> for the same content as a graphic, and <Link to="/blog/3d-rendering-turnaround-time">turnaround benchmarks</Link> for service-by-service times.</p>

            <h2>How to make the process faster</h2>
            <p>Send clean files. Send clear references. Designate one decision-maker. Consolidate feedback. Pay for rush when the deadline is real. Our <Link to="/blog/files-for-3d-rendering">CAD prep checklist</Link> covers this in detail.</p>

            <p><strong>Ready to start a project?</strong> Talk to us on WhatsApp at +91 96467 24313 or email danish@slateconcepts.com.</p>
        </>
    );
}
