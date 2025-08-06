







'use client'
import React from "react";
import dynamic from "next/dynamic";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { GoTriangleRight } from "react-icons/go";

// Componente separado para el iframe de YouTube
const YouTubeEmbed = ({ videoUrl }) => (
    <iframe
        className="w-full h-full"
        src={videoUrl}
        title="All-inclusive Kosher vacations to Boquete, Panama"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
    />
);

// Importación dinámica del iframe para evitar problemas de hidratación
const DynamicYouTubeEmbed = dynamic(() => Promise.resolve(YouTubeEmbed), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[10px] border-white bg-opacity-20 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center">
                    <GoTriangleRight className="text-white text-7xl ml-2" />
                </div>
            </div>
        </div>
    )
});

export const CustomVideoSection = ({ customVideoData }) => {

    // Verificar si el componente está activo
    if (!customVideoData || customVideoData.is_active === 'Disabled') {
        return null; // No renderizar nada si está deshabilitado
    }

    // Función para convertir URLs de YouTube a formato embed con autoplay y mute
    const convertToEmbedUrl = (url) => {
        if (!url) return '';

        let embedUrl = '';

        // Si ya es embed, extraer el videoId para reconstruir con parámetros
        if (url.includes('youtube.com/embed/')) {
            const videoId = url.split('youtube.com/embed/')[1].split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        // Convertir youtu.be a embed
        else if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        // Convertir youtube.com/watch a embed
        else if (url.includes('youtube.com/watch')) {
            const videoId = url.split('v=')[1].split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        else {
            return url;
        }

        // Agregar parámetros de autoplay y mute a todos los videos
        return `${embedUrl}?autoplay=1&mute=1`;
    };

    // Validación de datos
    const fallbackData = {
        videoUrl: "https://www.youtube.com/embed/2u9dYbs1KCE?autoplay=1&mute=1",
    };

    // Procesamos datos con fallback y conversión automática
    const rawVideoUrl = customVideoData?.video_url || fallbackData.videoUrl;
    const pageData = {
        videoUrl: convertToEmbedUrl(rawVideoUrl),
    };

    return (
        <section className="pt-16 pb-16 md:pt-20 md:pb-26 flex justify-center items-center bg-blueBackground">
            <div className="w-full max-w-7xl px-6 md:px-0">
                {/* Header Video Section */}
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-darkBlue">
                        {customVideoData.title || "Title Section Video"}
                    </h2>
                    <ButtonTheme title={customVideoData.button_text || "Button Text"} href={customVideoData.button_link} />
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-myBlack aspect-video w-full z-20">
                    <DynamicYouTubeEmbed videoUrl={pageData.videoUrl} />
                </div>
            </div>
        </section>
    );
};