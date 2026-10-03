import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import Prose from '../components/Prose';
import { SITE_URL, ORG_ID } from '../config/seo';

const HOME_STAGES = [
    {
        n: 1,
        title: 'Discuss your home',
        body: 'Tell us your city, the approximate area you are planning, what you need, your investment range and when you want to start. You do not need existing drawings to enquire.',
    },
    {
        n: 2,
        title: 'Agree the scope',
        body: 'We define whether the work is design-only or turnkey, then set out fees, revision rounds, milestones, responsibilities and exclusions before anyone is appointed.',
    },
    {
        n: 3,
        title: 'Develop and review the design',
        body: 'You review layouts, materials, elevations and — where visualization is included in the scope — 3D views. Decisions are approved before execution or further changes.',
    },
    {
        n: 4,
        title: 'Execute and hand over',
        body: 'Turnkey projects proceed through the agreed execution scope to handover. Design-only clients use their own appointed execution team; any site support from us is agreed separately.',
    },
];

const STEPS = [
    { n: 1, title: 'Brief', body: 'You send us your CAD, SketchUp, Revit or PDF plans, plus a few reference images and a one-paragraph brief. We respond within one business day with scope clarifications.' },
    { n: 2, title: 'Quote & timeline', body: 'We send a fixed-fee quote with deliverables, revision policy and a specific business-day delivery date. NDA signed before any file moves.' },
    { n: 3, title: '3D modeling', body: 'We rebuild the geometry to render-quality standards. For interiors, we model walls, ceilings, joinery and built-ins. For exteriors, the full massing plus immediate context.' },
    { n: 4, title: 'Materials & lighting', body: 'PBR-accurate materials mapped to your specifications. Lighting set to the agreed time-of-day and mood. We share a clay test render for layout sign-off before going to final.' },
    { n: 5, title: 'Render', body: 'Final renders submitted to our render farm in V-Ray, Corona, Lumion or Unreal — whichever fits the brief.' },
    { n: 6, title: 'Post-production', body: 'Multi-pass post in Photoshop: colour grading, atmospheric depth, entourage (people, vehicles, foliage), final sharpening.' },
    { n: 7, title: 'Review & revisions', body: 'You review the draft. Two free revision rounds per view. Additional rounds are billed at our hourly rate, quoted upfront. Most projects close in one round.' },
    { n: 8, title: 'Delivery', body: 'Final files in PNG (4K+ resolution by default), JPG and any other format you need. Source files retained for 12 months for re-use or revisions.' },
];

export default function ProcessPage() {
    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Process', path: '/process' },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: `${SITE_URL}/process`,
        about: { '@id': ORG_ID },
    };
    return (
        <>
            <Seo
                title="Our Process | Planning, Designing and Building Your Home"
                description="How a home project runs with Slate — discussing your requirements, agreeing the scope, developing the design and executing it — plus our separate visualization-only workflow."
                path="/process"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="How we work"
                title="From first conversation to"
                italic="handover"
                subtitle="A clear residential journey — and a separate workflow for visualization-only commissions."
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12 pb-12">
                {/* Residential journey */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#52525B] tracking-tight mb-3">
                        Your home, step by step
                    </h2>
                    <p className="text-[#6B7280] leading-relaxed mb-8">
                        For homeowners planning a new residence, interiors or a renovation.
                    </p>
                    <div className="space-y-4">
                        {HOME_STAGES.map((s) => (
                            <div key={s.n} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex gap-5">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-[#F97316] text-white font-bold text-lg flex items-center justify-center">{s.n}</div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-[#52525B] mb-2">{s.title}</h3>
                                    <p className="text-[#6B7280] leading-relaxed">{s.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-[#6B7280] mt-6">
                        Programme and cost depend on the brief, the site and the specifications, so we do not
                        publish a single universal delivery schedule for home projects.
                    </p>
                </div>

                {/* Visualization-only workflow */}
                <div className="max-w-4xl mx-auto mt-20 pt-12 border-t border-gray-200">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#52525B] tracking-tight mb-3">
                        Visualization-only workflow
                    </h2>
                    <p className="text-[#6B7280] leading-relaxed mb-8">
                        A separate service for architects, designers, developers and clients who only need
                        renders, walkthroughs or 360° tours. The turnaround times and revision allowances
                        below apply to image delivery only — they are not construction schedules or
                        residential design terms.
                    </p>
                    <div className="space-y-4">
                        {STEPS.map((s) => (
                            <div key={s.n} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex gap-5">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-[#52525B] text-white font-bold text-lg flex items-center justify-center">{s.n}</div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-[#52525B] mb-2">{s.title}</h3>
                                    <p className="text-[#6B7280] leading-relaxed">{s.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mt-12">
                    <Prose>
                        <h2>Typical visualization turnaround</h2>
                        <p>These apply to visualization deliverables only.</p>
                        <ul>
                            <li>Exterior or interior still: <strong>5–10 business days</strong> per view.</li>
                            <li>3D walkthrough: <strong>10–15 business days</strong> per minute of finished animation.</li>
                            <li>360° tour: <strong>7–12 business days</strong> for a typical 4–6 scene tour.</li>
                            <li>Rush available at 30–50% premium — typically 2–3 days for stills.</li>
                        </ul>
                        <p>For more on what drives turnaround, see our <Link to="/blog/3d-rendering-turnaround-time">turnaround guide</Link>.</p>

                        <h2>What we need for a visualization brief</h2>
                        <ul>
                            <li>Plans, elevations and sections (CAD, SketchUp, BIM or PDF).</li>
                            <li>Material references (supplier links, sample photos, brand books).</li>
                            <li>Reference images of renders you like — style, lighting and mood.</li>
                            <li>Time-of-day preference (daylight, twilight, night) and any specific atmospheric notes.</li>
                        </ul>
                        <p>Full file checklist in our <Link to="/blog/files-for-3d-rendering">CAD prep guide</Link>.</p>
                    </Prose>
                </div>
            </div>

            <CtaBlock />
        </>
    );
}
