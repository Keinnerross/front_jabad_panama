'use client'
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { GoTriangleRight } from 'react-icons/go';

// Función para convertir URLs de YouTube a formato embed
const convertToEmbedUrl = (url) => {
    if (!url) return '';

    let embedUrl = '';

    if (url.includes('youtube.com/embed/')) {
        const videoId = url.split('youtube.com/embed/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    else if (url.includes('youtube.com/watch')) {
        const videoId = url.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    else {
        return url;
    }

    return embedUrl;
};

export default function GalleryModal({
    isOpen,
    onClose,
    items,
    currentIndex,
    onPrev,
    onNext
}) {
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Función de cierre con animación
    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsVisible(false);
            onClose();
        }, 200);
    }, [onClose]);

    // Cerrar con ESC, navegar con flechas
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') handleClose();
        if (e.key === 'ArrowLeft') onPrev();
        if (e.key === 'ArrowRight') onNext();
    }, [handleClose, onPrev, onNext]);

    // Animación de entrada
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setIsVisible(true));
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            // Calcular ancho del scrollbar para evitar shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [isOpen, handleKeyDown]);

    if ((!isOpen && !isClosing) || !items || items.length === 0) return null;

    const currentItem = items[currentIndex];
    const isVideo = currentItem?.type === 'video';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${!isVisible || isClosing ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleClose}
            />

            {/* Close button */}
            <button
                onClick={handleClose}
                className={`absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 md:p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 cursor-pointer ${!isVisible || isClosing ? 'opacity-0' : 'opacity-100'}`}
            >
                <IoClose className="text-white text-xl md:text-2xl" />
            </button>

            {/* Navigation - Previous */}
            {items.length > 1 && (
                <button
                    onClick={onPrev}
                    className={`absolute left-2 md:left-4 z-20 p-2 md:p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 cursor-pointer ${!isVisible || isClosing ? 'opacity-0' : 'opacity-100'}`}
                >
                    <IoChevronBack className="text-white text-xl md:text-2xl" />
                </button>
            )}

            {/* Content */}
            <div className={`relative z-10 w-full max-w-5xl mx-10 md:mx-16 max-h-[85vh] flex items-center justify-center transition-all duration-200 pointer-events-none ${!isVisible || isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                {isVideo ? (
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black pointer-events-auto">
                        <iframe
                            className="w-full h-full"
                            src={convertToEmbedUrl(currentItem.url)}
                            title="Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-[70vh] md:h-[85vh] pointer-events-auto">
                        <Image
                            src={currentItem.url}
                            alt={`Gallery image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1280px) 100vw, 1280px"
                        />
                    </div>
                )}
            </div>

            {/* Navigation - Next */}
            {items.length > 1 && (
                <button
                    onClick={onNext}
                    className={`absolute right-2 md:right-4 z-20 p-2 md:p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 cursor-pointer ${!isVisible || isClosing ? 'opacity-0' : 'opacity-100'}`}
                >
                    <IoChevronForward className="text-white text-xl md:text-2xl" />
                </button>
            )}

            {/* Indicators */}
            {items.length > 1 && (
                <div className={`absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 transition-opacity duration-200 ${!isVisible || isClosing ? 'opacity-0' : 'opacity-100'}`}>
                    {items.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                                idx === currentIndex ? 'bg-white' : 'bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Counter */}
            <div className={`absolute bottom-4 md:bottom-6 right-3 md:right-6 z-20 bg-black/50 px-2 py-1 rounded-full text-white/90 text-xs md:text-sm transition-opacity duration-200 ${!isVisible || isClosing ? 'opacity-0' : 'opacity-100'}`}>
                {currentIndex + 1} / {items.length}
            </div>
        </div>
    );
}
