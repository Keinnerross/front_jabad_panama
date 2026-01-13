'use client'
import { useEffect, useState } from 'react';
import { IoLocationOutline } from 'react-icons/io5';

// Función para extraer URL del src de un iframe o retornar la URL directa
const extractMapUrl = (input) => {
    if (!input) return '';

    // Si el input contiene <iframe, intentar extraer el src
    if (input.includes('<iframe') && input.includes('src=')) {
        const srcMatch = input.match(/src=["']([^"']+)["']/);
        if (srcMatch && srcMatch[1]) {
            return srcMatch[1];
        }
    }

    // Si no es un iframe, retornar el input tal cual
    return input.trim();
};

export default function SidebarMap({ mapUrl, navigateUrl, title = "Location", distance }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    const processedMapUrl = extractMapUrl(mapUrl);

    return (
        <div className="relative w-full h-76 rounded-xl overflow-hidden bg-gray-100">
            {/* Tag de distancia */}
            {distance && (
                <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-darkBlue px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium shadow-sm">
                    <IoLocationOutline className="text-primary" />
                    <span>{distance} from Chabad</span>
                </div>
            )}

            {isMounted && (
                processedMapUrl ? (
                    // Google Maps iframe
                    <iframe
                        src={processedMapUrl}
                        className="w-full h-full"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                ) : (
                    // Placeholder cuando no hay mapa
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <IoLocationOutline className="text-gray-400 text-4xl mb-2" />
                        <p className="text-gray-500 text-sm font-medium">{title}</p>
                        {navigateUrl && (
                            <a
                                href={navigateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Navigate
                            </a>
                        )}
                    </div>
                )
            )}
        </div>
    );
}
