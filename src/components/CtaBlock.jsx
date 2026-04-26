import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, PhoneCall, ArrowUpRight, Clock } from 'lucide-react';
import { whatsappLink, CONTACT } from '../config/site';
import { useUI } from '../context/UIContext';
import { trackEvent } from './Analytics';

export default function CtaBlock({
    title = 'Ready to start your project?',
    subtitle = "Send us your CAD files, sketches, or just an idea — we'll come back with a quote within one business day.",
    whatsappMessage,
    showCallback = true,
}) {
    const { openCallback } = useUI();
    return (
        <section className="px-6 md:px-12 my-16 md:my-24">
            <div className="relative max-w-5xl mx-auto bg-[#0E0E0E] text-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/[0.06]">
                {/* Soft accent — single, subtle */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#F97316]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-12 p-8 md:p-12 lg:p-14">
                    {/* Left: copy */}
                    <div className="flex flex-col">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
                            {title}
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
                            {subtitle}
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/50">
                            <Clock className="w-4 h-4" />
                            Typically responds within an hour
                        </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex flex-col gap-3 lg:justify-center">
                        <a
                            href={whatsappLink(whatsappMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('cta_whatsapp_click', { location: 'cta_block' })}
                            className="group flex items-center justify-between gap-4 bg-[#25D366] hover:bg-[#1FB855] text-white pl-5 pr-4 py-4 rounded-2xl font-semibold text-base transition-colors"
                        >
                            <span className="inline-flex items-center gap-3">
                                <MessageCircle className="w-5 h-5 shrink-0" />
                                Talk on WhatsApp
                            </span>
                            <ArrowUpRight className="w-5 h-5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>

                        <a
                            href={`mailto:${CONTACT.email}`}
                            onClick={() => trackEvent('cta_email_click', { location: 'cta_block' })}
                            className="group flex items-center justify-between gap-4 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white pl-5 pr-4 py-4 rounded-2xl font-semibold text-base transition-colors"
                        >
                            <span className="inline-flex items-center gap-3">
                                <Mail className="w-5 h-5 shrink-0" />
                                Email us
                            </span>
                            <ArrowUpRight className="w-5 h-5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>

                        {showCallback && (
                            <button
                                onClick={() => { trackEvent('cta_callback_click', { location: 'cta_block' }); openCallback(); }}
                                className="group flex items-center justify-between gap-4 bg-transparent hover:bg-white/[0.04] text-white/80 hover:text-white pl-5 pr-4 py-4 rounded-2xl font-medium text-base transition-colors"
                            >
                                <span className="inline-flex items-center gap-3">
                                    <PhoneCall className="w-5 h-5 shrink-0" />
                                    Request a callback
                                </span>
                                <ArrowUpRight className="w-5 h-5 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        )}

                        <Link
                            to="/contact"
                            className="text-sm text-white/50 hover:text-white/80 transition-colors mt-1 inline-flex items-center gap-1"
                        >
                            Prefer the contact form? <span className="underline underline-offset-4">Open it →</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
