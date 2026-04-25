import React from 'react';
import Breadcrumbs from './Breadcrumbs';

export default function PageHero({ eyebrow, title, italic, subtitle, breadcrumb }) {
    return (
        <section className="relative pt-32 md:pt-40 pb-12 md:pb-16 px-6 md:px-12 bg-white">
            <div className="max-w-5xl mx-auto">
                {breadcrumb && <Breadcrumbs items={breadcrumb} className="mb-6" />}
                {eyebrow && (
                    <p className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-xs md:text-sm">
                        {eyebrow}
                    </p>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#52525B] leading-[1.1] tracking-tight">
                    {title}{' '}
                    {italic && <span className="font-serif italic font-normal text-[#F97316]">{italic}</span>}
                </h1>
                {subtitle && (
                    <p className="mt-6 max-w-3xl text-[#6B7280] text-lg md:text-xl leading-relaxed">{subtitle}</p>
                )}
            </div>
        </section>
    );
}
