import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export default function Lightbox({ items, index, onClose, onIndexChange }) {
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [imgLoaded, setImgLoaded] = useState(false);
    const dragRef = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });
    const pinchRef = useRef({ active: false, startDist: 0, startScale: 1 });

    const item = items?.[index];

    const reset = useCallback(() => {
        setScale(1);
        setPos({ x: 0, y: 0 });
    }, []);

    useEffect(() => { reset(); setImgLoaded(false); }, [index, reset]);

    useEffect(() => {
        if (item) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [item]);

    const next = useCallback(() => onIndexChange?.((index + 1) % items.length), [index, items, onIndexChange]);
    const prev = useCallback(() => onIndexChange?.((index - 1 + items.length) % items.length), [index, items, onIndexChange]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === '+' || e.key === '=') setScale(s => Math.min(s + 0.25, 5));
            if (e.key === '-') setScale(s => Math.max(s - 0.25, 1));
            if (e.key === '0') reset();
        };
        if (item) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [item, onClose, next, prev, reset]);

    if (!item) return null;

    const isVideo = item.type === 'video';

    const onWheel = (e) => {
        if (isVideo) return;
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        setScale(s => Math.min(5, Math.max(1, +(s + delta).toFixed(2))));
    };

    const onMouseDown = (e) => {
        if (scale <= 1 || isVideo) return;
        dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y };
    };
    const onMouseMove = (e) => {
        if (!dragRef.current.active) return;
        setPos({
            x: dragRef.current.baseX + (e.clientX - dragRef.current.startX),
            y: dragRef.current.baseY + (e.clientY - dragRef.current.startY),
        });
    };
    const endDrag = () => { dragRef.current.active = false; };

    // Touch: pinch-to-zoom + pan
    const onTouchStart = (e) => {
        if (isVideo) return;
        if (e.touches.length === 2) {
            const [a, b] = e.touches;
            const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
            pinchRef.current = { active: true, startDist: dist, startScale: scale };
        } else if (e.touches.length === 1 && scale > 1) {
            const t = e.touches[0];
            dragRef.current = { active: true, startX: t.clientX, startY: t.clientY, baseX: pos.x, baseY: pos.y };
        }
    };
    const onTouchMove = (e) => {
        if (pinchRef.current.active && e.touches.length === 2) {
            const [a, b] = e.touches;
            const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
            const ratio = dist / pinchRef.current.startDist;
            setScale(Math.min(5, Math.max(1, +(pinchRef.current.startScale * ratio).toFixed(2))));
        } else if (dragRef.current.active && e.touches.length === 1) {
            const t = e.touches[0];
            setPos({
                x: dragRef.current.baseX + (t.clientX - dragRef.current.startX),
                y: dragRef.current.baseY + (t.clientY - dragRef.current.startY),
            });
        }
    };
    const onTouchEnd = () => {
        pinchRef.current.active = false;
        dragRef.current.active = false;
    };

    return (
        <div
            className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center select-none"
            onClick={onClose}
        >
            {/* Top toolbar */}
            <div
                className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-2 p-4 sm:p-6 text-white"
                onClick={(e) => e.stopPropagation()}
            >
                <span className="text-sm font-mono opacity-80">{index + 1} / {items.length}</span>
                <div className="flex items-center gap-2">
                    {!isVideo && (
                        <>
                            <ToolBtn onClick={() => setScale(s => Math.max(1, +(s - 0.25).toFixed(2)))} label="Zoom out"><ZoomOut className="w-5 h-5" /></ToolBtn>
                            <span className="text-xs font-mono w-12 text-center opacity-80">{Math.round(scale * 100)}%</span>
                            <ToolBtn onClick={() => setScale(s => Math.min(5, +(s + 0.25).toFixed(2)))} label="Zoom in"><ZoomIn className="w-5 h-5" /></ToolBtn>
                            <ToolBtn onClick={reset} label="Reset"><RotateCcw className="w-5 h-5" /></ToolBtn>
                        </>
                    )}
                    <ToolBtn onClick={onClose} label="Close"><X className="w-5 h-5" /></ToolBtn>
                </div>
            </div>

            {/* Prev / Next */}
            {items.length > 1 && (
                <>
                    <ToolBtn
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        label="Previous"
                        className="!absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10"
                    >
                        <ChevronLeft className="w-7 h-7" />
                    </ToolBtn>
                    <ToolBtn
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        label="Next"
                        className="!absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10"
                    >
                        <ChevronRight className="w-7 h-7" />
                    </ToolBtn>
                </>
            )}

            {/* Media */}
            <div
                className="w-full h-full flex items-center justify-center overflow-hidden touch-none px-4 sm:pr-[22rem] sm:pl-12"
                onClick={(e) => e.stopPropagation()}
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {isVideo ? (
                    /\/preview$/.test(item.src || '') ? (
                        <iframe
                            key={item.src}
                            src={`${item.src}?vq=hd1080`}
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            title={item.description || 'Walkthrough'}
                            className="w-[90vw] sm:w-[60vw] aspect-video max-h-[85vh] rounded-lg shadow-2xl bg-black"
                        />
                    ) : (
                        <video
                            key={item.src}
                            src={item.src}
                            controls
                            autoPlay
                            playsInline
                            className="max-w-[95vw] max-h-[85vh] rounded-lg shadow-2xl"
                        />
                    )
                ) : (
                    <>
                        {!imgLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#F97316] animate-spin" />
                            </div>
                        )}
                        <img
                            key={item.src}
                            src={item.src}
                            alt={item.alt || item.description || ''}
                            draggable={false}
                            referrerPolicy="no-referrer"
                            onLoad={() => setImgLoaded(true)}
                            style={{
                                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                                cursor: scale > 1 ? (dragRef.current.active ? 'grabbing' : 'grab') : 'zoom-in',
                                transition: dragRef.current.active || pinchRef.current.active ? 'none' : 'transform 0.2s ease-out, opacity 0.25s ease-out',
                                opacity: imgLoaded ? 1 : 0,
                            }}
                            onDoubleClick={() => setScale(s => (s > 1 ? 1 : 2))}
                            className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl will-change-transform"
                        />
                    </>
                )}
            </div>

            {/* Metadata side panel */}
            <MetaPanel item={item} />
        </div>
    );
}

function MetaPanel({ item }) {
    const hasMeta = item && (item.description || item.clientName || item.city || item.theme || item.services?.length || item.software?.length);
    if (!hasMeta) return null;
    const locationLine = [item.city, item.state, item.country].filter(Boolean).join(', ');
    return (
        <aside
            className="hidden sm:flex flex-col absolute right-0 top-0 bottom-0 w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/10 text-white z-[5] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-6 pt-20 space-y-5 text-sm">
                {item.theme && (
                    <span className="inline-block bg-[#F97316] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {item.theme}
                    </span>
                )}
                {item.description && (
                    <h2 className="text-xl font-bold leading-tight">{item.description}</h2>
                )}
                {item.clientName && (
                    <MetaRow label="Client">
                        <div>{item.clientName}</div>
                        {item.clientType && <div className="text-white/50 text-xs mt-0.5">{item.clientType}</div>}
                    </MetaRow>
                )}
                {locationLine && <MetaRow label="Location">{locationLine}</MetaRow>}
                {item.services?.length > 0 && (
                    <MetaRow label="Services">
                        <div className="flex flex-wrap gap-1.5">
                            {item.services.map(s => (
                                <span key={s} className="bg-white/10 text-white/90 text-xs px-2 py-1 rounded-md">{s}</span>
                            ))}
                        </div>
                    </MetaRow>
                )}
                {item.software?.length > 0 && (
                    <MetaRow label="Software">
                        <div className="flex flex-wrap gap-1.5">
                            {item.software.map(s => (
                                <span key={s} className="bg-white/5 text-white/70 text-xs px-2 py-1 rounded-md">{s}</span>
                            ))}
                        </div>
                    </MetaRow>
                )}
            </div>
        </aside>
    );
}

function MetaRow({ label, children }) {
    return (
        <div>
            <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1.5">{label}</div>
            <div className="text-white/90">{children}</div>
        </div>
    );
}

function ToolBtn({ children, onClick, label, className = '' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={`p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors ${className}`}
        >
            {children}
        </button>
    );
}
