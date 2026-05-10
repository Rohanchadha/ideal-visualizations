import React from 'react';
import { Link } from 'react-router-dom';
import { driveImg } from '../_galleryImg';

export const meta = {
    slug: 'case-study-ideal-home-designers-amritsar',
    title: 'Case Study: Ideal Home Designers, Amritsar — 45 Renders, Walkthroughs & Construction Visuals',
    description: 'How we became the long-term 3D visualization partner for Ideal Home Designers in Amritsar — exterior renders, interior sets, walkthrough animations and on-site construction documentation across 45 deliverables.',
    date: '2026-05-25',
    readingTime: 7,
    category: 'Case Study',
    keyword: 'architectural rendering case study amritsar',
    image: driveImg('1Wow86cMLyz54OXEZG3iVZC-2svF_WJDZ', 1600),
    author: 'Danish',
};

const Img = ({ id, alt }) => (
    <img src={driveImg(id, 1200)} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full rounded-2xl border border-gray-200 my-4" />
);

export default function Post() {
    return (
        <>
            <p><strong>Client:</strong> Ideal Home Designers · <strong>Lead:</strong> Raman · <strong>Location:</strong> Amritsar, Punjab · <strong>Type:</strong> Architectural firm · <strong>Total deliverables:</strong> 40 stills + 5 animated walkthroughs.</p>

            <h2>The brief</h2>
            <p>Ideal Home Designers run a residential-led architectural practice in Amritsar. They needed a single visualization partner who could keep up with a varied pipeline — modern villas one week, a temple the next, a primary school after that — without the firm having to retrain a new vendor on every project.</p>

            <h2>What we delivered</h2>
            <p>Across the engagement we have produced:</p>
            <ul>
                <li><strong>Exterior 3D rendering</strong> for modern residences, a resort, a classical jewellery showroom, a primary school, a Radha Krishna temple, modern farmhouses and a hut residential project.</li>
                <li><strong>Interior 3D rendering</strong> for kitchens, living rooms, bedrooms and pooja rooms.</li>
                <li><strong>Elevation design</strong> as part of the architectural pre-construction phase.</li>
                <li><strong>3D walkthrough animation</strong> — five separate animated walkthroughs.</li>
                <li><strong>Interior design</strong> support and material/palette boards.</li>
                <li><strong>Turnkey construction</strong> documentation visuals from active sites.</li>
            </ul>

            <h2>Selected work</h2>
            <Img id="1Wow86cMLyz54OXEZG3iVZC-2svF_WJDZ" alt="Modern residential exterior, Amritsar" />
            <p><em>Modern residential — exterior hero shot for a marketing pitch.</em></p>

            <Img id="123QBooSYNOdaDlGXKnpDv1Nmgk3kH8hH" alt="Classical jewellery showroom exterior" />
            <p><em>Classical jewellery showroom — façade with ornamentation, evening lighting.</em></p>

            <Img id="1qnHeoW_39U7mcVatrMCx7-_nM71FWSB4" alt="Resort exterior render" />
            <p><em>Resort — full-property exterior with landscape integration.</em></p>

            <Img id="1jggF-5w_I7xaP9_S1LFdHEXnwmvCkYmj" alt="Primary school exterior render" />
            <p><em>Primary school — daylight exterior to support a public-facing presentation.</em></p>

            <Img id="1H_KsTOeqG2ImUJ_6IEvue6Dp_eHEI8-X" alt="Radha Krishna temple exterior" />
            <p><em>Radha Krishna temple — religious typology with traditional detailing.</em></p>

            <Img id="1sJJmeSj3CouF9161yIJApf2SuBaxw4HG" alt="Modern farmhouse exterior" />
            <p><em>Modern farmhouse — contemporary residential exterior.</em></p>

            <Img id="1R4d-JS1nv3xViBDg_00ZtuApduLi1ZmM" alt="Hut residential exterior" />
            <p><em>Hut residential project — vernacular form, contemporary execution.</em></p>

            <h2>Why it works as a long-term partnership</h2>
            <p>Three things keep this collaboration efficient:</p>
            <ol>
                <li><strong>Shared house style.</strong> Two years in, we know which lighting, lens and post-processing choices match the firm's brand.</li>
                <li><strong>One brief, all media.</strong> Stills, animations and construction visuals come out of the same model — no duplicate setup costs.</li>
                <li><strong>Local context.</strong> Both teams are in Amritsar. Site visits, material samples and quick approvals happen face-to-face when needed.</li>
            </ol>

            <h2>Numbers</h2>
            <ul>
                <li>45 final deliverables · 40 stills + 5 walkthrough animations</li>
                <li>Project types: residential, religious, hospitality, education, retail</li>
                <li>Phases covered: concept → planning → marketing → construction documentation</li>
            </ul>

            <p>See every asset in the <Link to="/portfolio">complete gallery</Link>. Want to set up a similar long-term arrangement for your firm? Read <Link to="/blog/outsource-3d-rendering-architecture-firms">how architecture firms outsource 3D rendering</Link>, or message us on WhatsApp at +91 96467 24313.</p>
        </>
    );
}
