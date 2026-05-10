import React from 'react';
import { Link } from 'react-router-dom';
import { driveImg } from '../_galleryImg';

export const meta = {
    slug: '3d-rendering-portfolio-showcase',
    title: 'Recent Work: Real 3D Rendering Projects from Amritsar to Ottawa',
    description: 'A walk through real client projects we have rendered for architects, interior designers and homeowners — across Amritsar, Pathankot, Mohali, Delhi, Batala and Ottawa.',
    date: '2026-05-28',
    readingTime: 6,
    category: 'Showcase',
    keyword: '3d rendering portfolio',
    image: driveImg('1Wow86cMLyz54OXEZG3iVZC-2svF_WJDZ', 1600),
    author: 'Danish',
};

const Card = ({ id, alt }) => (
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
            <p>This is a real walk through a slice of recent client work — eight projects across India and Canada that show the range of services we deliver. Every image and every client name in this post is drawn directly from the project archive. Browse the <Link to="/portfolio">full gallery</Link> for the complete set, or use the filters there to narrow by theme, country or service.</p>

            <h2>Ideal Home Designers — Amritsar, India</h2>
            <p><em>Architectural firm · 45 assets across exterior, interior, plan and construction phases.</em></p>
            <p>Our largest ongoing partnership. Ideal Home Designers run a residential-led architectural practice in Amritsar, and over the past two years we have produced exterior renders, interior sets, planning visuals and on-site construction documentation for projects ranging from modern villas and farmhouses to a Radha Krishna temple and a primary school.</p>
            <Card id="1Wow86cMLyz54OXEZG3iVZC-2svF_WJDZ" alt="Modern residential house exterior, Amritsar" />
            <Card id="1qnHeoW_39U7mcVatrMCx7-_nM71FWSB4" alt="Resort exterior render" />
            <Card id="1H_KsTOeqG2ImUJ_6IEvue6Dp_eHEI8-X" alt="Radha Krishna temple exterior render" />
            <p><strong>Services rendered:</strong> Exterior 3D Rendering, Interior 3D Rendering, Elevation Design, 3D Walkthrough Animation, Interior Design, Turnkey Construction Project. <Link to="/portfolio">See all 45 assets</Link>.</p>

            <h2>Concept Designs — Ottawa, Canada</h2>
            <p><em>Architectural firm · classical residential villa.</em></p>
            <p>A fully remote engagement with Agampreet at Concept Designs in Ottawa. We delivered exterior 3D renders for a classical residential villa using SketchUp, AutoCAD, Lumion and Photoshop — coordinating across timezones from our Amritsar studio.</p>
            <Card id="1PpxhA81OqmT_yL3ky7UUrD5_GoCIKxO8" alt="Classical residential villa, Ottawa, Canada" />
            <Card id="14XQts_DvQ1onoZXMje4oxG5yuxIIw9YP" alt="Classical residential villa, Ottawa - alternate view" />
            <p><strong>Services rendered:</strong> Exterior 3D Rendering, 3D Walkthrough Animation, Interior 3D Rendering, Interior Design.</p>

            <h2>Planet Design and Associates — Pathankot, India</h2>
            <p><em>Architectural firm · commercial outlet exteriors.</em></p>
            <p>Manjinder at Planet Design briefed us on a commercial outlet — exterior renders for a client pitch followed by walkthrough animation work.</p>
            <Card id="1j9HVhg2SwCVZCqP4pBjdw7nBBpBs8xGT" alt="Commercial outlet exterior, Pathankot" />
            <p><strong>Services rendered:</strong> Exterior 3D Rendering, 3D Walkthrough Animation.</p>

            <h2>Design Anthem Forum — Mohali, India</h2>
            <p><em>Architectural firm · modern residential house.</em></p>
            <p>Exterior render plus a walkthrough animation for a modern residential project.</p>
            <Card id="1APBR9B_S-bSbvdA2jfDrI5QrzJ2EkBbi" alt="Modern residential house exterior, Mohali" />
            <p><strong>Services rendered:</strong> Exterior 3D Rendering, 3D Walkthrough Animation.</p>

            <h2>EDC Architects — Delhi, India</h2>
            <p><em>Builder/developer · modern commercial building.</em></p>
            <p>Exterior renders and elevation design for a modern commercial build in Delhi.</p>
            <Card id="11X-cWVKTDB1sQ-2faxb21KsnhBl_Hlav" alt="Modern commercial building exterior, Delhi" />
            <p><strong>Services rendered:</strong> Exterior 3D Rendering, Elevation Design.</p>

            <h2>Kitchen Decor (Jatin Narula) — Amritsar, India</h2>
            <p><em>Interior designer · residential interior sets.</em></p>
            <p>Interior 3D rendering and design support for a kitchen-and-living interior project.</p>
            <Card id="1aBcaF9OTygggq61myhahb2wUccr4sT1y" alt="Residential interior render" />
            <Card id="1sfvZloO7zPUAevTn2p-WCTvHrcS8jFGP" alt="Residential interior render - alternate view" />
            <p><strong>Services rendered:</strong> Interior 3D Rendering, Interior Design.</p>

            <h2>Akash Bhutani — Amritsar, India</h2>
            <p><em>Individual home owner · interior renders.</em></p>
            <p>A direct-to-homeowner engagement: interior 3D renders to lock material and palette decisions before site work began.</p>
            <Card id="1P8hOF2rMgfaBXMP5twA_unCS1uQP0MM4" alt="Interior render for individual homeowner, Amritsar" />
            <p><strong>Services rendered:</strong> Interior 3D Rendering, Interior Design.</p>

            <h2>Ankit Bansal — Batala, India</h2>
            <p><em>Individual home owner · interior renders.</em></p>
            <p>Interior design and 3D rendering work for a home in Batala.</p>
            <Card id="1v27lFw8LVkiUudB0eMEwpbPKgf6ifgiB" alt="Interior render, Batala" />
            <p><strong>Services rendered:</strong> Interior Design, Interior 3D Rendering.</p>

            <h2>The bigger picture</h2>
            <p>The eight projects above are a representative slice. The full gallery contains 67 stills and 7 animated walkthroughs across architectural firms, builders/developers, interior designers and individual homeowners — covering everything from elevation design and planning to turnkey construction documentation.</p>

            <p><strong>Want to see if your project would fit?</strong> Browse the <Link to="/portfolio">complete gallery</Link>, then talk to us on WhatsApp at +91 96467 24313 or email danish@slateconcepts.com.</p>
        </>
    );
}
