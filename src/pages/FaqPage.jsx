import React from 'react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import { SITE_URL, ORG_ID } from '../config/seo';

const FAQS = [
    { q: 'What file formats do you accept?', a: '.dwg, .dxf, .skp, .rvt, .3dm, .max, .fbx, .obj and PDF plans. We also work from hand sketches if that is all you have.' },
    { q: 'How long does a 3D render take?', a: '5–10 business days per view for stills, 10–15 business days per minute for walkthroughs, 7–12 business days for a typical 360° tour. Rush available at 30–50% premium.' },
    { q: 'How much does a 3D render cost?', a: 'Indicative starting points: ₹15,000–₹40,000 per view in India, $250–$600 internationally. Final quote depends on complexity, turnaround and volume. See our pricing page for full breakdown.' },
    { q: 'How many revisions are included?', a: 'Two free revision rounds per view. Additional revisions are billed at our hourly rate, quoted upfront. Most projects close in one round.' },
    { q: 'Do you sign NDAs?', a: 'Yes. We sign your NDA, or use ours, before any files move. Your unbuilt projects stay confidential.' },
    { q: 'What software do you use?', a: '3ds Max + V-Ray and Corona for photorealism, Lumion for fast turnarounds, Unreal Engine for real-time and VR, AutoCAD/Revit/SketchUp for planning.' },
    { q: 'Do you work with international clients?', a: 'Yes. We serve clients across India, the UAE, the US, Canada and the UK. Communication via WhatsApp, email and Zoom. Time-zone overlap is good with all four regions.' },
    { q: 'Can I see drafts before final delivery?', a: 'Yes. Every project includes a clay test render for layout sign-off before we go to final lighting and materials.' },
    { q: 'What payment methods do you accept?', a: 'India: bank transfer, UPI. International: wire transfer, Wise, PayPal. We invoice in INR, USD, AED or CAD as you prefer.' },
    { q: 'Do you offer retainer pricing for architecture firms?', a: 'Yes. Firms running 10+ views/month get a dedicated artist, discounted rates and SLA-backed turnaround.' },
    { q: 'Can you white-label for marketing agencies?', a: 'Yes. Full white-label and NDA available for agencies and design firms.' },
    { q: 'Do you do 3D walkthroughs and 360° tours, not just stills?', a: 'Yes — we deliver cinematic 4K 60fps walkthroughs and interactive 360° virtual tours alongside stills. Walkthroughs come with a 9:16 vertical cut for Instagram and YouTube Shorts at no extra charge.' },
    { q: 'Can you match my supplier\'s exact materials?', a: 'Yes. Send the supplier link, sample photo or material code and we will match it to within visual tolerance.' },
    { q: 'Do you also do architecture planning and interior design, not just rendering?', a: 'Yes. We are a full-stack studio — planning, elevation design, interior design, turnkey construction and 3D rendering all under one roof.' },
    { q: 'Where are you based?', a: 'Our headquarters is in Amritsar, Punjab, India. We serve clients globally — remote-first by default, with walk-in consultations available locally.' },
];

export default function FaqPage() {
    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'FAQ', path: '/faq' },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        url: `${SITE_URL}/faq`,
        about: { '@id': ORG_ID },
        mainEntity: FAQS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };
    return (
        <>
            <Seo
                title="FAQ | Ideal Visualizations — 3D Rendering Questions Answered"
                description="Frequently asked questions about our 3D rendering services — file formats, turnaround, pricing, revisions, NDAs, software, payment and more."
                path="/faq"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="Answers"
                title="Frequently asked"
                italic="questions"
                subtitle="Everything you might want to know before sending us your first file."
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12 pb-12">
                <div className="max-w-3xl mx-auto space-y-3">
                    {FAQS.map((f, i) => (
                        <details key={i} className="group bg-white border border-gray-200 rounded-2xl p-5">
                            <summary className="font-bold text-[#52525B] cursor-pointer list-none flex justify-between items-center gap-4">
                                <span>{f.q}</span>
                                <span className="text-[#F97316] group-open:rotate-45 transition-transform text-2xl leading-none shrink-0">+</span>
                            </summary>
                            <p className="text-[#6B7280] text-sm md:text-base leading-relaxed mt-3">{f.a}</p>
                        </details>
                    ))}
                </div>
            </div>

            <CtaBlock title="Still have questions?" subtitle="WhatsApp us — we usually respond within an hour." />
        </>
    );
}
