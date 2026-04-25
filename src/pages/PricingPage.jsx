import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import Prose from '../components/Prose';
import { SITE_URL, ORG_ID } from '../config/seo';

const ROWS = [
    { service: 'Exterior render (single view)', india: '₹[AMOUNT]', intl: '$[AMOUNT]' },
    { service: 'Interior render (single view)', india: '₹[AMOUNT]', intl: '$[AMOUNT]' },
    { service: 'Lighting variant of same view', india: '50% of original', intl: '50% of original' },
    { service: '3D Walkthrough (per minute)', india: '₹[AMOUNT]', intl: '$[AMOUNT]' },
    { service: '360° Virtual Tour (per scene)', india: '₹[AMOUNT]', intl: '$[AMOUNT]' },
    { service: 'Aerial / master-plan render', india: '₹[AMOUNT]', intl: '$[AMOUNT]' },
    { service: 'Architecture planning', india: '₹[AMOUNT] / sq ft', intl: 'Custom quote' },
    { service: 'Interior design (design-only)', india: '₹[AMOUNT] / sq ft', intl: 'Custom quote' },
    { service: 'Turnkey construction', india: '₹[AMOUNT]–₹[AMOUNT] / sq ft', intl: 'Not offered remote' },
];

export default function PricingPage() {
    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Pricing', path: '/pricing' },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: `${SITE_URL}/pricing`,
        about: { '@id': ORG_ID },
    };
    return (
        <>
            <Seo
                title="3D Rendering Pricing | Indicative Rates Across All Services"
                description="Indicative pricing for our 3D rendering, walkthrough, 360° tour, architecture, interior design and turnkey services — India and international rates."
                path="/pricing"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="Indicative rates"
                title="Pricing"
                italic="transparently"
                subtitle="Every project is quoted custom. The numbers below are starting points — your actual quote depends on complexity, turnaround and volume."
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12 pb-12">
                <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-3xl overflow-hidden">
                    <table className="w-full text-left text-sm md:text-base">
                        <thead className="bg-[#52525B] text-white">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Service</th>
                                <th className="px-5 py-3 font-semibold">India clients</th>
                                <th className="px-5 py-3 font-semibold">International (UAE / US / CA)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ROWS.map((r, i) => (
                                <tr key={i} className="border-t border-gray-200">
                                    <td className="px-5 py-3 text-[#52525B] font-medium">{r.service}</td>
                                    <td className="px-5 py-3 text-[#6B7280]">{r.india}</td>
                                    <td className="px-5 py-3 text-[#6B7280]">{r.intl}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="max-w-5xl mx-auto text-xs text-[#6B7280] mt-3 italic">All prices indicative. Final quote depends on scope, file complexity, turnaround and revision policy. Volume discounts kick in at 5+ views per project or via monthly retainer.</p>

                <div className="max-w-3xl mx-auto mt-12">
                    <Prose>
                        <h2>What's included</h2>
                        <ul>
                            <li>3D modeling from your CAD/SketchUp/Revit/PDF plans</li>
                            <li>Materials, textures and lighting</li>
                            <li>Photorealistic rendering and post-production</li>
                            <li><strong>Two free revision rounds per view</strong></li>
                            <li>Final delivery in 4K+ resolution (PNG and JPG)</li>
                            <li>Source files retained 12 months for re-use</li>
                        </ul>

                        <h2>What costs extra</h2>
                        <ul>
                            <li>Rush turnaround (30–50% premium)</li>
                            <li>Revisions beyond the included rounds (billed hourly, quoted upfront)</li>
                            <li>Custom 3D models for unique furniture, fixtures or props</li>
                            <li>Voice-over and bespoke music for walkthroughs</li>
                        </ul>

                        <h2>Volume & retainer pricing</h2>
                        <p>Architecture firms and developers running 10+ views/month get a dedicated artist and discounted rates. Talk to us about retainer structures.</p>

                        <h2>For a deeper guide to what drives 3D rendering cost</h2>
                        <p>Read our <Link to="/blog/3d-rendering-cost">comprehensive 3D rendering cost guide</Link>.</p>
                    </Prose>
                </div>
            </div>

            <CtaBlock title="Want a quote for your specific project?" />
        </>
    );
}
