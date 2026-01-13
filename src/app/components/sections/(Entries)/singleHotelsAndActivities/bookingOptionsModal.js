'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import BookingOptionCard from './bookingOptionCard';

export default function BookingOptionsModal({
    isOpen,
    onClose,
    options = [],
    title = "Book your stay with us!",
    description = ""
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

    // Cerrar con ESC
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') handleClose();
    }, [handleClose]);

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

    if (!isOpen && !isClosing) return null;

    // Ordenar opciones por order
    const sortedOptions = [...options].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Usar portal para renderizar fuera del stacking context del sidebar
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${!isVisible || isClosing ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className={`relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-200 ${!isVisible || isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    <IoClose className="text-gray-500 text-2xl" />
                </button>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto max-h-[90vh]">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-2">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-gray-text text-base">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Grid de cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sortedOptions.map((option) => (
                            <BookingOptionCard
                                key={option.id}
                                title={option.title}
                                description={option.description}
                                buttonText={option.buttonText}
                                buttonUrl={option.buttonUrl}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
