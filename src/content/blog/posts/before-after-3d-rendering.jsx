import React from 'react';
import { Link } from 'react-router-dom';
import { driveImg } from '../_galleryImg';

export const meta = {
    slug: 'before-after-3d-rendering',
    title: 'CAD to Photoreal: A Tour of Recent Slate Concepts Renders',
    description: 'A walkthrough of recent residential, commercial and hospitality renders from real Slate Concepts projects across India and Canada — what kind of input we get and what kind of output it becomes.',
    date: '2026-03-05',
    readingTime: 6,
    category: 'Showcase',
    keyword: 'before after 3d rendering',
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
            <p>The fastest way to understand what architectural visualization actually delivers is to look at the kind of brief that comes in and the kind of render that goes out. Below is a walk through recent Slate Concepts projects — real clients, real renders — grouped by typology so you can calibrate against your own work.</p>

            <h2>Classical residential villa — Concept Designs, Ottawa</h2>
            <p>SketchUp model and CAD plans in. Hero exterior render out: dressed-stone façade, slate roof, classical fenestration, daylight. Two camera angles delivered. Full project notes in the <Link to="/blog/case-study-concept-designs-ottawa">Concept Designs case study</Link>.</p>
            <Img id="1PpxhA81OqmT_yL3ky7UUrD5_GoCIKxO8" alt="Classical residential villa exterior — Concept Designs, Ottawa" />

            <h2>Modern residential house — Design Anthem Forum, Mohali</h2>
            <p>Architect-finalised design in. Photoreal exterior render plus a full 3D walkthrough animation out — the still does the brochure work, the walkthrough wins the in-meeting moment. See the <Link to="/blog/case-study-design-anthem-forum-mohali">Design Anthem Forum case study</Link>.</p>
            <Img id="1APBR9B_S-bSbvdA2jfDrI5QrzJ2EkBbi" alt="Modern residential house exterior — Design Anthem Forum, Mohali" />

            <h2>Modern residence — Ideal Home Designers, Amritsar</h2>
            <p>One of 45 assets we have delivered for this long-running partnership. Clean modern massing in, photoreal evening exterior out. The full breadth of the work — modern residences, jewellery showrooms, resorts, schools, temples and farmhouses — is in the <Link to="/blog/case-study-ideal-home-designers-amritsar">Ideal Home Designers case study</Link>.</p>
            <Img id="1Wow86cMLyz54OXEZG3iVZC-2svF_WJDZ" alt="Modern residence exterior render — Ideal Home Designers, Amritsar" />

            <h2>Interior set — Kitchen Decor (Jatin Narula), Amritsar</h2>
            <p>SketchUp model plus material specs in. Lived-in interior render out — accurate laminates, calibrated lighting, real reflections. See the <Link to="/blog/case-study-kitchen-decor-amritsar">Kitchen Decor case study</Link> for how we work with interior-designer firms.</p>
            <Img id="1aBcaF9OTygggq61myhahb2wUccr4sT1y" alt="Interior render — Kitchen Decor, Amritsar" />

            <h2>What this kind of work actually costs</h2>
            <p>For a single hero exterior at our standard pace: in the Indian range you would typically expect ₹15,000–₹40,000 per render and 5–10 business days; for international clients it sits in the $800–$3,000 band. The exact figure moves with site context, materials complexity, and how many revision rounds you want bundled in. The full ranges and what moves the price are in our <Link to="/blog/3d-rendering-cost">cost guide</Link>.</p>

            <h2>Want to see what your CAD becomes?</h2>
            <p>Send your CAD or SketchUp files on WhatsApp at +91 96467 24313 or email <a href="mailto:danish@slateconcepts.com">danish@slateconcepts.com</a>. We will turn around a quote within an hour, and you can browse the live <Link to="/portfolio">gallery</Link> in the meantime.</p>
        </>
    );
}
