import React from 'react';
import { Link } from 'react-router-dom';
import { PencilRuler, KeyRound, ArrowRight } from 'lucide-react';

const OPTIONS = [
    {
        icon: <PencilRuler className="w-7 h-7" />,
        title: 'Design only',
        lead: 'We design. You appoint the team that builds.',
        points: [
            'Planning, elevations and interiors, as agreed.',
            'Drawings, specifications and revisions defined upfront.',
            'You appoint builders; site support is separately agreed.',
        ],
        to: '/services/architecture-planning',
        cta: 'Architectural planning',
    },
    {
        icon: <KeyRound className="w-7 h-7" />,
        title: 'Turnkey design and execution',
        lead: 'Design and agreed execution, through to handover.',
        points: [
            'Execution availability confirmed for your site and scope.',
            'Materials, supervision, costs and exclusions in the proposal.',
            'You approve key decisions and payment stages.',
        ],
        to: '/services/turnkey-construction',
        cta: 'Turnkey construction',
    },
];

export default function HomeProjectGuide() {
    return (
        <section id="how-we-work-with-you" className="py-14 md:py-20 px-6 md:px-12 bg-[#E4E4E7]/40">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mb-8 md:mb-10">
                    <h2 className="text-[#F97316] font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">
                        How we can work together
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#52525B] leading-[1.08] tracking-tight">
                        Design only, or{' '}
                        <span className="font-serif italic font-normal text-[#F97316]">design and execution.</span>
                    </h3>
                    <p className="mt-4 text-[#6B7280] text-base leading-relaxed">
                        We agree scope, deliverables and responsibilities before work begins.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {OPTIONS.map((o) => (
                        <div key={o.title} className="bg-white border border-gray-200 rounded-[2rem] p-6 md:p-7 flex flex-col">
                            <div className="text-[#F97316] mb-3">{o.icon}</div>
                            <h4 className="text-xl md:text-2xl font-bold text-[#52525B] mb-2">{o.title}</h4>
                            <p className="text-[#52525B] text-sm md:text-base font-medium mb-4">{o.lead}</p>
                            <ul className="space-y-2 text-sm md:text-base text-[#6B7280] leading-relaxed mb-5">
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

                <p className="mt-6 text-sm text-[#6B7280] max-w-3xl">
                    Pricing and timelines are confirmed after reviewing your brief, site and specifications.
                </p>
            </div>
        </section>
    );
}
