import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import Prose from '../components/Prose';
import { SITE_URL, ORG_ID } from '../config/seo';

export default function AboutPage() {
    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        url: `${SITE_URL}/about`,
        about: { '@id': ORG_ID },
        mainEntity: {
            '@type': 'Person',
            name: 'Danish',
            jobTitle: 'Founder & Principal',
            worksFor: { '@id': ORG_ID },
        },
    };
    return (
        <>
            <Seo
                title="About Ideal Visualizations | 10+ Years of Architectural 3D Rendering"
                description="The story behind Ideal Visualizations — founded by Danish in Amritsar, 1500+ projects across India, the UAE, the US and Canada over 10+ years."
                path="/about"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
            />
            <PageHero
                eyebrow="Our story"
                title="A studio built on"
                italic="precision and longevity"
                subtitle="Founded in Amritsar by Danish. 1500+ projects across India, the UAE, the US and Canada. One studio, one accountable team."
                breadcrumb={breadcrumb}
            />

            <div className="px-6 md:px-12 pb-12">
                <div className="max-w-3xl mx-auto">
                    <Prose>
                        <h2>How we got here</h2>
                        <p>Ideal Visualizations was founded by Danish in Amritsar with a simple thesis: architects, designers and developers deserve photoreal visualisations that match their ambition — without paying global studio prices, missing deadlines or being passed between freelancers.</p>
                        <p>Over 10+ years, that thesis has played out across 1500+ projects. We have rendered luxury villas in Chandigarh, off-plan towers in Dubai, condo developments in Toronto, restaurant fitouts in Amritsar and commercial pitches in New York. Each project has tightened the pipeline, deepened the team and sharpened the eye.</p>

                        <h2>What makes us different</h2>
                        <ul>
                            <li><strong>Full-stack studio.</strong> We don't only render. We also plan, design and build. That means our renders carry a working architect's eye for what is buildable, what costs money and what reads well in the field.</li>
                            <li><strong>Accountable team, not freelancers.</strong> Every project has a named lead. No rotating cast. No mid-project handoffs.</li>
                            <li><strong>India-base pricing, international-grade communication.</strong> Same-day WhatsApp response. English-language working environment. Time-zone overlap with Asia, Europe, the Middle East and the East Coast of North America.</li>
                            <li><strong>NDA-first.</strong> Every project starts with your NDA signed. Your unbuilt work stays confidential.</li>
                        </ul>

                        <h2>The team</h2>
                        <p><em>[Danish to add: team size, key team member names + roles, headshots if available.]</em></p>

                        <h2>Software & tools</h2>
                        <p>3ds Max + V-Ray and Corona for photorealism. Lumion for fast turnarounds. Unreal Engine for real-time and VR. AutoCAD, Revit and SketchUp for planning. Adobe Photoshop and After Effects for post-production.</p>

                        <h2>Where we work from</h2>
                        <p>Our headquarters is in Amritsar, Punjab. Walk-in consultations are available for local clients. Everyone else, we serve remotely with same-day WhatsApp turnaround.</p>

                        <h2>Where to next</h2>
                        <p>Browse our <Link to="/services">services</Link>, see <Link to="/portfolio">recent case studies</Link>, read the <Link to="/blog">blog</Link>, or jump straight to the <Link to="/contact">contact page</Link>.</p>
                    </Prose>
                </div>
            </div>

            <CtaBlock />
        </>
    );
}
