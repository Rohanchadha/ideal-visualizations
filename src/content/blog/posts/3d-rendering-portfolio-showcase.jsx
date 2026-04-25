import React from 'react';
import { Link } from 'react-router-dom';

export const meta = {
    slug: '3d-rendering-portfolio-showcase',
    title: '3D Rendering Portfolio: 15 Projects Across 3 Continents',
    description: 'A curated showcase of 15 architectural 3D rendering projects by Ideal Visualizations across India, the UAE and North America — residential, commercial, hospitality.',
    date: '2026-05-28',
    readingTime: 5,
    category: 'Showcase',
    keyword: '3d rendering portfolio',
    image: '/3D-Images/2 (2).jpg',
    author: 'Danish',
};

export default function Post() {
    return (
        <>
            <p>Fifteen projects across three continents — residential, commercial, hospitality, off-plan and turnkey — that cover the range of work we do. Each links to its case study with full project notes; full image galleries live on our <Link to="/portfolio">portfolio</Link> and <Link to="/gallery">gallery</Link> pages.</p>

            <h2>India</h2>
            <ul>
                <li><Link to="/portfolio/luxury-villa-chandigarh">Luxury Villa, Chandigarh</Link> — exterior + interior renders for an architect.</li>
                <li><Link to="/portfolio/commercial-tower-gurgaon">Commercial Tower, Gurgaon</Link> — hero render + 90s walkthrough.</li>
                <li><Link to="/portfolio/modern-bungalow-mohali">Modern Bungalow, Mohali</Link> — full turnkey project with rendered milestones.</li>
                <li><Link to="/portfolio/restaurant-fitout-amritsar">Restaurant Fitout, Amritsar</Link> — interior renders + turnkey execution.</li>
                <li><Link to="/portfolio/residential-tower-mumbai">Residential Tower, Mumbai</Link> — pre-launch asset bundle.</li>
                <li><Link to="/portfolio/co-working-office-bangalore">Co-Working Office, Bangalore</Link> — interior pitch renders.</li>
                <li><Link to="/portfolio/villa-cluster-noida">Villa Cluster, Noida</Link> — aerial master plan + fly-through.</li>
                <li><Link to="/portfolio/heritage-renovation-amritsar">Heritage Renovation, Amritsar</Link> — preservation-led planning + interiors.</li>
            </ul>

            <h2>UAE</h2>
            <ul>
                <li><Link to="/portfolio/boutique-hotel-dubai">Boutique Hotel, Dubai</Link> — hospitality interiors + 360° tour.</li>
                <li><Link to="/portfolio/penthouse-dubai">Penthouse Interior, Dubai</Link> — luxury interior set + 360° tour.</li>
            </ul>

            <h2>North America</h2>
            <ul>
                <li><Link to="/portfolio/condo-development-toronto">Condo Development, Toronto</Link> — pre-construction launch bundle.</li>
                <li><Link to="/portfolio/commercial-fitout-new-york">Commercial Fitout, New York</Link> — pitch-grade interiors in 7 days.</li>
            </ul>

            <h2>More to come</h2>
            <p>This is a representative sample. Browse the <Link to="/gallery">full gallery</Link> for the complete archive of recent work, or the <Link to="/portfolio">portfolio</Link> for project-by-project case studies.</p>

            <p><strong>Want to start your project?</strong> Talk to us on WhatsApp at +91 96467 24313 or email idealvisualization@gmail.com.</p>
        </>
    );
}
