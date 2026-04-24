import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export default function Lightbox({ items, index, onClose, onIndexChange }) {
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const dragRef = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });
    const pinchRef = useRef({ active: false, startDist: 0, startScale: 1 });

    const item = items?.[index];

    const reset = useCallback(() => {
        setScale(1);
        setPos({ x: 0, y: 0 });
    }, []);

    useEffect(() => { reset(); }, [index, reset]);

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
                className="w-full h-full flex items-center justify-center overflow-hidden touch-none"
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
                    <video
                        src={item.src}
                        controls
                        autoPlay
                        playsInline
                        className="max-w-[95vw] max-h-[85vh] rounded-lg shadow-2xl"
                    />
                ) : (
                    <img
                        src={item.src}
                        alt={item.alt || ''}
                        draggable={false}
                        style={{
                            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                            cursor: scale > 1 ? (dragRef.current.active ? 'grabbing' : 'grab') : 'zoom-in',
                            transition: dragRef.current.active || pinchRef.current.active ? 'none' : 'transform 0.2s ease-out',
                        }}
                        onDoubleClick={() => setScale(s => (s > 1 ? 1 : 2))}
                        className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl will-change-transform"
                    />
                )}
            </div>
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
