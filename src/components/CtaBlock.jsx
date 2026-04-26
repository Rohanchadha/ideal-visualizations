import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, ArrowUpRight, PhoneCall } from 'lucide-react';
import { whatsappLink, CONTACT } from '../config/site';
import { useUI } from '../context/UIContext';
import { trackEvent } from './Analytics';

export default function CtaBlock({
    title = 'Ready to start your project?',
    subtitle = 'Send us your CAD files, sketches, or just an idea — we\'ll come back with a quote within one business day.',
    whatsappMessage,
    showCallback = true,
}) {
    const { openCallback } = useUI();
    return (
        <section className="px-6 md:px-12 my-16 md:my-24">
            <div className="max-w-5xl mx-auto bg-[#111111] text-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 lg:p-14 relative overflow-hidden">
                {/* Soft accent gradient — non-intrusive */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#F97316]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="max-w-2xl mb-8 md:mb-10">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-4">{title}</h2>
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed">{subtitle}</p>
                    </div>

                    {/* Primary CTAs — equal-width grid, no awkward wrapping */}
                    <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                        <a
                            href={whatsappLink(whatsappMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('cta_whatsapp_click', { location: 'cta_block' })}
                            className="group bg-[#25D366] hover:bg-[#1FB855] text-white px-6 py-4 rounded-2xl font-semibold inline-flex items-center justify-between gap-3 transition-colors"
                        >
                            <span className="inline-flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp us
                            </span>
                            <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                        <a
                            href={`mailto:${CONTACT.email}`}
                            onClick={() => trackEvent('cta_email_click', { location: 'cta_block' })}
                            className="group bg-white text-[#111111] hover:bg-gray-100 px-6 py-4 rounded-2xl font-semibold inline-flex items-center justify-between gap-3 transition-colors"
                        >
                            <span className="inline-flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Email us
                            </span>
                            <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    </div>

                    {/* Secondary actions — text-link style, no button visual noise */}
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
                        {showCallback && (
                            <button
                                onClick={() => { trackEvent('cta_callback_click', { location: 'cta_block' }); openCallback(); }}
                                className="inline-flex items-center gap-2 hover:text-white transition-colors"
                            >
                                <PhoneCall className="w-4 h-4" /> Request a callback
                            </button>
                        )}
                        <Link to="/contact" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                            Or use the contact form <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <span className="text-white/40 hidden md:inline">·</span>
                        <span className="text-white/50">
                            Typically responds within an hour
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
