import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';

export default function NotFoundPage() {
    const { pathname } = useLocation();
    return (
        <>
            <Seo title="Page Not Found | Slate Concepts" description="This page is unavailable. Explore our home construction services or contact Slate Concepts in Amritsar." path={pathname} noIndex />
            <PageHero eyebrow="404" title="Page not found" subtitle="This address is unavailable or the page has moved." />
            <div className="mx-auto flex max-w-5xl flex-wrap gap-6 px-6 pb-24 md:px-12">
                <Link to="/" className="inline-flex items-center gap-2 font-semibold text-[#52525B]">Home <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/services/turnkey-construction" className="inline-flex items-center gap-2 font-semibold text-[#F97316]">Home construction <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/contact" className="inline-flex items-center gap-2 font-semibold text-[#52525B]">Contact us <ArrowRight className="h-4 w-4" /></Link>
            </div>
        </>
    );
}