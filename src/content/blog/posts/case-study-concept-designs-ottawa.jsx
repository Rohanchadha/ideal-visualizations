import React from 'react';
import { Link } from 'react-router-dom';
import { driveImg } from '../_galleryImg';

export const meta = {
    slug: 'case-study-concept-designs-ottawa',
    title: 'Case Study: Rendering a Classical Villa for Concept Designs, Ottawa',
    description: 'How Slate Concepts delivered photoreal exterior renders of a classical residential villa for Concept Designs in Ottawa, Canada — across timezones, on the client\u2019s house style.',
    date: '2026-05-22',
    readingTime: 5,
    category: 'Case Study',
    keyword: 'architectural rendering Canada',
    image: driveImg('1PpxhA81OqmT_yL3ky7UUrD5_GoCIKxO8', 1600),
    author: 'Danish',
};

const Img = ({ id, alt }) => (
    <img
        src={driveImg(id, 1200)}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="w-full rounded-2xl border border-gray-200 my-4"
    />
);

export default function Post() {
    return (
        <>
            <p><strong>Client:</strong> Concept Designs (Agampreet) — architectural firm based in Ottawa, Canada.<br /><strong>Project:</strong> Classical residential villa, exterior 3D rendering.<br /><strong>Stack we worked in:</strong> AutoCAD, SketchUp, Lumion, Photoshop.</p>

            <h2>The brief</h2>
            <p>Concept Designs needed exterior visuals of a classical-style residential villa to share with their end client during the design-development phase. The CAD plans and SketchUp massing were already strong; what they needed was a rendering partner who could match the timezone gap, work to a classical materials palette (stone, slate roof, traditional fenestration), and deliver hero shots that read as <em>built</em>, not as a model.</p>

            <Img id="1PpxhA81OqmT_yL3ky7UUrD5_GoCIKxO8" alt="Classical residential villa exterior render — front elevation, Ottawa" />

            <h2>How we worked across timezones</h2>
            <p>Ottawa is 9.5 hours behind Amritsar. Instead of fighting that, we used it: Concept Designs would send revisions at the end of their day, our team in India would turn them around overnight, and a fresh draft would be waiting in their inbox the next morning. Two render rounds happened per 24-hour cycle instead of the typical one — the kind of cadence that quietly compresses a project schedule.</p>

            <h2>What we delivered</h2>
            <ul>
                <li>Two hero exterior renders of the villa — front elevation and angled view — at 4K, in daylight.</li>
                <li>A working SketchUp + Lumion scene (camera positions, lighting, materials) handed back so future revisions could be made in-house if needed.</li>
                <li>Matched, approved materials library: dressed stone façade, slate roofing, classical mouldings, dark-frame glazing.</li>
            </ul>

            <Img id="14XQts_DvQ1onoZXMje4oxG5yuxIIw9YP" alt="Classical residential villa exterior render — angled hero view, Ottawa" />

            <h2>What this project says about working with us from North America</h2>
            <p>You do not need a local studio in Toronto, Ottawa or Vancouver to get reliable, photoreal exteriors at North-American quality. You need a studio that respects your house style, communicates clearly in English, and uses the timezone gap as a feature instead of an excuse. We have written more about that in <Link to="/blog/outsource-3d-rendering-india-usa-canada">outsourcing 3D rendering from the USA and Canada to India</Link>.</p>

            <p><strong>Working on a residential or commercial project in Canada?</strong> Send your CAD or SketchUp files to <a href="mailto:danish@slateconcepts.com">danish@slateconcepts.com</a> or WhatsApp +91 96467 24313 and we will get back to you within one business hour with a quote.</p>
        </>
    );
}
