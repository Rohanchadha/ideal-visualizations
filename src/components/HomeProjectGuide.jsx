import React from 'react';
import { Link } from 'react-router-dom';
import { PencilRuler, KeyRound, ArrowRight } from 'lucide-react';

const OPTIONS = [
    {
        icon: <PencilRuler className="w-7 h-7" />,
        title: 'Design only',
        lead: 'We design. You appoint the team that builds.',
        points: [
            'Scope can cover architectural planning, elevations or interior design.',
            'Drawings, specifications, visualization and revision rounds are defined in the proposal.',
            'You appoint the execution team unless we explicitly agree otherwise.',
            'Site visits and contractor coordination are only included when separately specified.',
            'A rendering or visualization service on its own does not include construction responsibility.',
        ],
        to: '/services/architecture-planning',
        cta: 'Architectural planning',
    },
    {
        icon: <KeyRound className="w-7 h-7" />,
        title: 'Turnkey design and execution',
        lead: 'We carry the design and the agreed execution through to handover.',
        points: [
            'Our responsibility runs from design through handover, within the agreed scope.',
            'We confirm the site location and whether we can execute there before committing.',
            'The proposal sets out materials, procurement, approvals, contractor coordination, site supervision, payment stages and exclusions.',
            'You still make the key decisions and approvals along the way.',
            'Fees, programme and construction cost depend on your brief and specifications.',
        ],
        to: '/services/turnkey-construction',
        cta: 'Turnkey construction',
    },
];

export default function HomeProjectGuide() {
    return (
        <section id="how-we-work-with-you" className="py-20 md:py-28 px-6 md:px-12 bg-[#E4E4E7]/40">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mb-12 md:mb-16">
                    <h2 className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">
                        How we can work together
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-[#52525B] leading-[1.08] tracking-tight">
                        Design only, or{' '}
                        <span className="font-serif italic font-normal text-[#F97316]">design and execution.</span>
                    </h3>
                    <p className="mt-6 text-[#6B7280] text-base md:text-lg leading-relaxed">
                        Knowing which of these you need is usually the first thing to settle. We confirm
                        responsibilities, deliverables and exclusions in writing before any appointment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {OPTIONS.map((o) => (
                        <div key={o.title} className="bg-white border border-gray-200 rounded-[2rem] p-8 md:p-10 flex flex-col">
                            <div className="text-[#F97316] mb-5">{o.icon}</div>
                            <h4 className="text-2xl font-bold text-[#52525B] mb-2">{o.title}</h4>
                            <p className="text-[#52525B] font-medium mb-5">{o.lead}</p>
                            <ul className="space-y-3 text-[#6B7280] leading-relaxed mb-8">
                                {o.points.map((p, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F97316] shrink-0" />
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to={o.to}
                                className="mt-auto inline-flex items-center gap-2 font-semibold text-[#F97316] hover:gap-3 transition-all"
                            >
                                {o.cta} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>

                <p className="mt-8 text-sm text-[#6B7280] max-w-3xl">
                    We do not quote a universal per-square-foot rate or a guaranteed completion date before
                    seeing the brief, the site and the specifications.
                </p>
            </div>
        </section>
    );
}
