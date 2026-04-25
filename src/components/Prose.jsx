import React from 'react';

/**
 * Tailwind doesn't ship with @tailwindcss/typography by default in v4 here,
 * so this is a hand-rolled prose container with sensible defaults.
 */
export default function Prose({ children, className = '' }) {
    return (
        <div className={`prose-custom max-w-none text-[#3f3f46] leading-relaxed text-[17px] ${className}`}>
            {children}
        </div>
    );
}
