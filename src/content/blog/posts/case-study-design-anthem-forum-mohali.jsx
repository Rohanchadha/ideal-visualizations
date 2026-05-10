import React from 'react';
import { Link } from 'react-router-dom';
import { driveImg } from '../_galleryImg';

export const meta = {
    slug: 'case-study-design-anthem-forum-mohali',
    title: 'Case Study: Modern Residential Walkthrough for Design Anthem Forum, Mohali',
    description: 'How Slate Concepts paired a hero exterior render with a full 3D walkthrough animation for Design Anthem Forum\u2019s modern residential project in Mohali.',
    date: '2026-05-16',
    readingTime: 5,
    category: 'Case Study',
    keyword: '3d walkthrough animation',
    image: driveImg('1APBR9B_S-bSbvdA2jfDrI5QrzJ2EkBbi', 1600),
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

const DriveVideo = ({ id, title }) => (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-black">
        <iframe
            src={`https://drive.google.com/file/d/${id}/preview?vq=hd1080`}
            title={title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="h-full w-full"
        />
    </div>
);

export default function Post() {
    return (
        <>
            <p><strong>Client:</strong> Design Anthem Forum — architectural firm based in Mohali, India.<br /><strong>Project:</strong> Modern residential house — exterior 3D rendering plus a full 3D walkthrough animation.<br /><strong>Why this is one of our favourite case studies:</strong> it shows how a <em>still</em> render and a <em>moving</em> walkthrough do completely different jobs, and how a project benefits from having both.</p>

            <h2>The brief</h2>
            <p>Design Anthem Forum had finalised the design of a contemporary residential house and needed two things in parallel:</p>
            <ol>
                <li>A photoreal hero exterior render to anchor the client presentation and printed boards.</li>
                <li>A short 3D walkthrough animation the client could watch on a phone, share with family, and use to imagine actually moving through the house.</li>
            </ol>

            <h2>The hero exterior render</h2>
            <p>The still render had to do the heavy lifting on first impression — clean modern volumes, warm natural materials, daylight, and the project read as <em>built</em>, not as a model.</p>

            <Img id="1APBR9B_S-bSbvdA2jfDrI5QrzJ2EkBbi" alt="Design Anthem Forum — modern residential house exterior render, Mohali" />

            <h2>The walkthrough animation</h2>
            <p>The walkthrough is where the project comes alive. It moves the client from the street, around the façade, and through the key arrival sequences — which is exactly the moment a still render cannot reproduce. We covered when this kind of animation is the right call (versus a static 360 tour) in <Link to="/blog/walkthrough-vs-360-tour">walkthrough vs 360 tour</Link>.</p>

            <DriveVideo id="1YqRVfdMpziCtj6KnJ6tdWiDcsH5F7cQY" title="Design Anthem Forum — modern residential walkthrough animation" />

            <h2>Why pair a still and a walkthrough?</h2>
            <ul>
                <li><strong>The still render</strong> is the <em>poster</em>: it owns the brochure, the email, the printed board, the social tile.</li>
                <li><strong>The walkthrough</strong> is the <em>experience</em>: it is what wins the in-meeting moment when the client is sitting next to the architect and finally <em>feels</em> the design.</li>
                <li>Together they cover both ends of the sales conversation — first impression and final conviction.</li>
            </ul>

            <h2>Working with architectural firms in Punjab and Chandigarh</h2>
            <p>Mohali, Chandigarh, Amritsar and Delhi are home turf for us. We have worked across this region with both small studios and larger firms, and our process is built to slot into the way Indian architectural practices actually run their projects.</p>

            <p><strong>Need a hero render plus a walkthrough for your next residential or commercial project?</strong> Email <a href="mailto:danish@slateconcepts.com">danish@slateconcepts.com</a> or WhatsApp +91 96467 24313. We will turn around a quote within an hour.</p>
        </>
    );
}
