import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [], className = '' }) {
    if (!items.length) return null;
    return (
        <nav aria-label="Breadcrumb" className={`text-xs sm:text-sm text-[#6B7280] ${className}`}>
            <ol className="flex flex-wrap items-center gap-1.5">
                {items.map((item, i) => {
                    const last = i === items.length - 1;
                    return (
                        <li key={item.path} className="flex items-center gap-1.5">
                            {last ? (
                                <span className="text-[#52525B] font-medium" aria-current="page">{item.name}</span>
                            ) : (
                                <Link to={item.path} className="hover:text-[#F97316] transition-colors">{item.name}</Link>
                            )}
                            {!last && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
