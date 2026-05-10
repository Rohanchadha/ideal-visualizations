import React from 'react';
import { Link } from 'react-router-dom';
import { driveImg } from '../_galleryImg';

export const meta = {
    slug: 'case-study-kitchen-decor-amritsar',
    title: 'Case Study: Interior Renders for Kitchen Decor (Jatin Narula), Amritsar',
    description: 'A behind-the-scenes look at the interior 3D rendering work Slate Concepts delivers for Kitchen Decor in Amritsar — modular kitchens, living rooms and lived-in interior sets.',
    date: '2026-05-19',
    readingTime: 5,
    category: 'Case Study',
    keyword: 'interior 3d rendering for designers',
    image: driveImg('1aBcaF9OTygggq61myhahb2wUccr4sT1y', 1600),
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
            <p><strong>Client:</strong> Kitchen Decor (Jatin Narula) — interior design firm based in Amritsar, India.<br /><strong>Project type:</strong> Interior 3D rendering across modular kitchen, living and bedroom sets.<br /><strong>Why this partnership matters:</strong> Kitchen Decor is exactly the kind of designer-led firm we built our interior service for — strong design, sharp client expectations, no in-house viz team.</p>

            <h2>The brief</h2>
            <p>Jatin and his team design interiors that they want clients to walk into <em>before</em> a single piece of joinery is cut. That means renders that read like a photograph, not like a 3D model — accurate materials, soft natural light, real reflections in marble and gloss laminates, props that feel like they belong to the family that lives there.</p>

            <Img id="1aBcaF9OTygggq61myhahb2wUccr4sT1y" alt="Kitchen Decor — modular kitchen interior render, Amritsar" />

            <h2>How we work with interior designers</h2>
            <p>Interior renders live and die on three things: materials accuracy, lighting calibration, and styling. With Kitchen Decor we have a tight loop on all three:</p>
            <ul>
                <li><strong>Materials:</strong> exact laminate codes, stone slabs and fabric swatches are shared up front so the render matches what gets specified to the contractor.</li>
                <li><strong>Lighting:</strong> we calibrate to the building\u2019s real window orientation and the cove / pendant / spot strategy from the lighting plan.</li>
                <li><strong>Styling:</strong> we keep a shared moodboard so accessories and props feel consistent across rooms in the same project.</li>
            </ul>

            <Img id="1sfvZloO7zPUAevTn2p-WCTvHrcS8jFGP" alt="Kitchen Decor — interior render with detailed materials and lighting, Amritsar" />

            <h2>What gets delivered per room</h2>
            <ul>
                <li>2\u20133 hero camera angles per room at 4K.</li>
                <li>One revision round included; additional rounds at a flat per-render rate.</li>
                <li>Final TIFF / JPG outputs ready for client presentations and marketing.</li>
            </ul>

            <Img id="1BDhp7TlI3CVQaWj6WphN1nnDltgUSzDo" alt="Kitchen Decor — interior set, Amritsar" />

            <h2>Why this is the model for designer firms</h2>
            <p>Kitchen Decor doesn\u2019t need to hire a junior 3D artist, manage their leave, license Lumion, or figure out post in Photoshop. They get studio-grade interior renders on a per-project basis, on the same timeline as a junior would take in-house, at a fraction of the loaded cost. We have written about that economic case in detail in <Link to="/blog/3d-rendering-for-interior-designers">3D rendering for interior designers</Link> and <Link to="/blog/in-house-vs-outsource-rendering">in-house vs outsource rendering</Link>.</p>

            <p><strong>Are you an interior designer in Amritsar, Delhi or anywhere in India?</strong> Send your SketchUp files and a moodboard to <a href="mailto:danish@slateconcepts.com">danish@slateconcepts.com</a> or WhatsApp +91 96467 24313 — we will quote within an hour and start within the week.</p>
        </>
    );
}
