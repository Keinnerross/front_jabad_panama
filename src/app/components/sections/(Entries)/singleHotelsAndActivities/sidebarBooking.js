'use client';

import { useState } from 'react';
import { IoCalendarOutline } from "react-icons/io5";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import BookingOptionsModal from './bookingOptionsModal';

export default function SidebarBooking({
    sidebar,
    bookingOptions = [],
    fallbackTitle = "Book Now",
    fallbackDescription = ""
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ordenar opciones por order
    const sortedOptions = [...bookingOptions].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Determinar comportamiento del botón
    const hasMultipleOptions = sortedOptions.length > 1;
    const singleOption = sortedOptions.length === 1 ? sortedOptions[0] : null;

    // URL para cuando hay una sola opción
    const singleOptionUrl = singleOption?.buttonUrl?.startsWith('http')
        ? singleOption.buttonUrl
        : singleOption?.buttonUrl
            ? `https://${singleOption.buttonUrl}`
            : '#';

    const handleButtonClick = () => {
        if (hasMultipleOptions) {
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 top-8">
                <div className="space-y-4">
                    <IoCalendarOutline size={26} className="text-primary" />
                    <h3 className="text-xl md:text-2xl font-bold text-darkBlue">
                        {sidebar?.title || fallbackTitle}
                    </h3>
                    <p className="text-gray-text text-sm">
                        {sidebar?.description || fallbackDescription}
                    </p>

                    {/* Botón condicional */}
                    {hasMultipleOptions ? (
                        // Múltiples opciones: abrir modal
                        <button
                            onClick={handleButtonClick}
                            className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            {sidebar?.ButtonText || "Book Now"}
                        </button>
                    ) : sortedOptions.length === 1 ? (
                        // Una sola opción: link directo
                        <ButtonTheme
                            title={singleOption?.buttonText || sidebar?.ButtonText || "Book Now"}
                            href={singleOptionUrl}
                            target="_blank"
                            variation={3}
                            isFull
                        />
                    ) : (
                        // Sin opciones: mostrar botón deshabilitado o nada
                        <ButtonTheme
                            title={sidebar?.ButtonText || "Book Now"}
                            href="#"
                            variation={3}
                            isFull
                        />
                    )}
                </div>
            </div>

            {/* Modal para múltiples opciones */}
            <BookingOptionsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                options={sortedOptions}
                title={sidebar?.title || fallbackTitle}
                description={sidebar?.description || fallbackDescription}
            />
        </>
    );
}
