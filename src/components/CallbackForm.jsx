import React, { useEffect, useMemo, useState } from 'react';
import { X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { COUNTRIES, SERVICES_OFFERED, FORMSUBMIT_ENDPOINT } from '../config/site';

export default function CallbackForm({ open, onClose }) {
    const [form, setForm] = useState({
        name: '',
        countryCode: 'IN',
        city: '',
        service: '',
        dial: '+91',
        phone: '',
        email: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error

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
        try {
            const res = await fetch(FORMSUBMIT_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    _subject: `New Callback Request — ${form.name}`,
                    _template: 'table',
                    _captcha: 'false',
                    Name: form.name,
                    Country: country.name,
                    City: form.city,
                    Service_Required: form.service,
                    Phone: `${country.dial} ${form.phone}`,
                    Email: form.email,
                    Message: form.message || '—',
                }),
            });
            if (!res.ok) throw new Error('Network response was not ok');
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    const reset = () => {
        setForm({ name: '', countryCode: 'IN', city: '', service: '', dial: '+91', phone: '', email: '', message: '' });
        setErrors({});
        setStatus('idle');
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
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
                        <p className="text-[#6B7280] mb-6">Thanks for reaching out. We'll call you back shortly.</p>
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
                            <p className="text-[#6B7280] text-sm mt-2">Fill in the details and we'll get back to you within 24 hours.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
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

                            <Field label="Tell us about your project (optional)">
                                <textarea
                                    value={form.message}
                                    onChange={(e) => update('message', e.target.value)}
                                    placeholder="Project type, timeline, references…"
                                    rows={4}
                                    className={inputCls(false) + ' resize-none'}
                                />
                            </Field>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    Something went wrong. Please try again or WhatsApp us directly.
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
