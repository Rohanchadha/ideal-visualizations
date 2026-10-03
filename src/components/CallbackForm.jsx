import React, { useEffect, useMemo, useState } from 'react';
import { X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { COUNTRIES, SERVICES_OFFERED, CALLBACK_ENDPOINT, whatsappLink, WHATSAPP_PROJECT_BRIEF } from '../config/site';
import { trackEvent } from './Analytics';

const MAX_QUALIFIER = 120;

export default function CallbackForm({ open, onClose }) {
    const [form, setForm] = useState({
        name: '',
        countryCode: 'IN',
        city: '',
        service: '',
        dial: '+91',
        phone: '',
        email: '',
        area: '',
        budget: '',
        startDate: '',
        message: '',
        website: '', // honeypot — must stay empty
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const country = useMemo(
        () => COUNTRIES.find(c => c.code === form.countryCode) || COUNTRIES[0],
        [form.countryCode]
    );

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        if (open) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Please enter your name';
        if (!form.countryCode) e.countryCode = 'Select a country';
        if (!form.city) e.city = 'Select a city';
        if (!form.service) e.service = 'Select a service';
        if (!/^\d{6,15}$/.test(form.phone.replace(/\s|-/g, ''))) e.phone = 'Enter a valid phone number';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Enter a valid email address';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setStatus('submitting');
        setErrorMsg('');
        try {
            const res = await fetch(CALLBACK_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    country: country.name,
                    city: form.city,
                    service: form.service,
                    phone: `${country.dial} ${form.phone}`,
                    email: form.email,
                    area: form.area,
                    budget: form.budget,
                    startDate: form.startDate,
                    message: form.message,
                    website: form.website, // honeypot
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) {
                throw new Error(data.error || 'Network response was not ok');
            }
            trackEvent('callback_submit_success', {
                service: form.service,
                country: country.name,
                city: form.city,
            });
            setStatus('success');
        } catch (err) {
            console.error(err);
            trackEvent('callback_submit_error', { message: err.message });
            setErrorMsg(err.message || 'Something went wrong.');
            setStatus('error');
        }
    };

    const reset = () => {
        setForm({ name: '', countryCode: 'IN', city: '', service: '', dial: '+91', phone: '', email: '', area: '', budget: '', startDate: '', message: '', website: '' });
        setErrors({});
        setErrorMsg('');
        setStatus('idle');
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Request a callback"
                className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto overscroll-contain bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-[#52525B] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {status === 'success' ? (
                    <div className="py-12 text-center">
                        <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <h3 className="text-2xl font-bold text-[#52525B] mb-2">Request received!</h3>
                        <p className="text-[#6B7280] mb-6">Thanks for reaching out. We'll get in touch to discuss your requirements and whether the project is a fit.</p>
                        <button
                            onClick={() => { reset(); onClose?.(); }}
                            className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-3 rounded-full font-semibold transition-colors"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h3 className="text-2xl sm:text-3xl font-bold text-[#52525B] tracking-tight">
                                Request a <span className="font-serif italic font-normal text-[#F97316]">Callback</span>
                            </h3>
                            <span className="mt-3 inline-flex items-center gap-1.5 bg-[#F97316]/10 text-[#F97316] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                ✦ A conversation about project fit
                            </span>
                            <p className="text-[#6B7280] text-sm mt-3">
                                Share your details and we'll get back to talk through your requirements, the
                                likely scope and next steps. Submitting this form doesn't book an appointment
                                or purchase a service.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Honeypot — hidden from humans, bots will fill it and get rejected */}
                            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                                <label>
                                    Website (leave blank)
                                    <input
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={form.website}
                                        onChange={(e) => update('website', e.target.value)}
                                    />
                                </label>
                            </div>

                            <Field label="Full Name" error={errors.name}>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => update('name', e.target.value)}
                                    placeholder="John Doe"
                                    className={inputCls(errors.name)}
                                />
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Country" error={errors.countryCode}>
                                    <select
                                        value={form.countryCode}
                                        onChange={(e) => {
                                            const c = COUNTRIES.find(x => x.code === e.target.value);
                                            setForm(p => ({ ...p, countryCode: e.target.value, dial: c?.dial || '+', city: '' }));
                                        }}
                                        className={inputCls(errors.countryCode)}
                                    >
                                        {COUNTRIES.map(c => (
                                            <option key={c.code} value={c.code}>{c.name}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="City" error={errors.city}>
                                    <select
                                        value={form.city}
                                        onChange={(e) => update('city', e.target.value)}
                                        className={inputCls(errors.city)}
                                    >
                                        <option value="">Select a city</option>
                                        {country.cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field label="Service Required" error={errors.service}>
                                <select
                                    value={form.service}
                                    onChange={(e) => update('service', e.target.value)}
                                    className={inputCls(errors.service)}
                                >
                                    <option value="">Select a service</option>
                                    {SERVICES_OFFERED.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Phone Number" error={errors.phone}>
                                <div className="flex gap-2">
                                    <span className="inline-flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-[#52525B] text-sm font-medium shrink-0">
                                        {country.dial}
                                    </span>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => update('phone', e.target.value)}
                                        placeholder="9876543210"
                                        className={inputCls(errors.phone)}
                                    />
                                </div>
                            </Field>

                            <Field label="Email" error={errors.email}>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update('email', e.target.value)}
                                    placeholder="you@email.com"
                                    className={inputCls(errors.email)}
                                />
                            </Field>

                            <div className="pt-1">
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3">
                                    Helpful, but optional
                                </p>
                                <div className="space-y-4">
                                    <Field label="Approximate plot / built-up area (optional)">
                                        <input
                                            type="text"
                                            value={form.area}
                                            onChange={(e) => update('area', e.target.value)}
                                            maxLength={MAX_QUALIFIER}
                                            placeholder="e.g. 2,000 sq ft built-up"
                                            className={inputCls(false)}
                                        />
                                    </Field>
                                    <Field label="Expected investment range (optional)">
                                        <input
                                            type="text"
                                            value={form.budget}
                                            onChange={(e) => update('budget', e.target.value)}
                                            maxLength={MAX_QUALIFIER}
                                            placeholder="e.g. ₹40–50 lakh, or 'not decided yet'"
                                            className={inputCls(false)}
                                        />
                                    </Field>
                                    <Field label="Preferred start date (optional)">
                                        <input
                                            type="text"
                                            value={form.startDate}
                                            onChange={(e) => update('startDate', e.target.value)}
                                            maxLength={MAX_QUALIFIER}
                                            placeholder="e.g. in 3 months, or 'just exploring'"
                                            className={inputCls(false)}
                                        />
                                    </Field>
                                </div>
                            </div>

                            <Field label="Tell us about your project (optional)">
                                <textarea
                                    value={form.message}
                                    onChange={(e) => update('message', e.target.value)}
                                    placeholder="Project type, requirements, references…"
                                    rows={4}
                                    className={inputCls(false) + ' resize-none'}
                                />
                            </Field>

                            {status === 'error' && (
                                <div className="flex flex-col gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{errorMsg || 'Something went wrong. Your details are still here — please try again.'}</span>
                                    </div>
                                    <a
                                        href={whatsappLink(WHATSAPP_PROJECT_BRIEF)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackEvent('cta_whatsapp_click', { location: 'callback_error' })}
                                        className="self-start font-semibold text-[#128C7E] underline underline-offset-4"
                                    >
                                        Message us on WhatsApp instead →
                                    </a>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 text-white px-6 py-3.5 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                {status === 'submitting' ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                                ) : 'Submit Request'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="block text-sm font-medium text-[#52525B] mb-1.5">{label}</span>
            {children}
            {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
        </label>
    );
}

function inputCls(error) {
    return `w-full px-4 py-3 rounded-xl border bg-white text-[#52525B] placeholder-gray-400 outline-none transition-colors focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 ${error ? 'border-red-400' : 'border-gray-200'}`;
}
