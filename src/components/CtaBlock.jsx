import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, ArrowRight } from 'lucide-react';
import { whatsappLink, CONTACT } from '../config/site';

export default function CtaBlock({
    title = 'Ready to start your project?',
    subtitle = 'Send us your CAD files, sketches, or just an idea — we’ll come back with a quote within one business day.',
    whatsappMessage,
    showContactLink = true,
}) {
    return (
        <section className="my-16 md:my-24">
            <div className="max-w-5xl mx-auto bg-[#111111] text-white rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/15 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{title}</h2>
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed">{subtitle}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={whatsappLink(whatsappMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] hover:bg-[#1FB855] text-white px-6 py-3.5 rounded-full font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <MessageCircle className="w-5 h-5" /> Talk on WhatsApp
                        </a>
                        <a
                            href={`mailto:${CONTACT.email}`}
                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3.5 rounded-full font-semibold inline-flex items-center justify-center gap-2"
                        >
                            <Mail className="w-5 h-5" /> Email Us
                        </a>
                        {showContactLink && (
                            <Link
                                to="/contact"
                                className="text-white/80 hover:text-white px-2 py-3.5 inline-flex items-center justify-center gap-2"
                            >
                                Or fill the form <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
