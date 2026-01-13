'use client'
import { useState } from 'react';
import Image from 'next/image';
import { GoTriangleRight } from 'react-icons/go';
import { IoImagesOutline } from 'react-icons/io5';
import GalleryModal from './galleryModal';

// Función para obtener thumbnail de YouTube
const getYoutubeThumbnail = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1].split('?')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
        videoId = url.split('v=')[1].split('&')[0];
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};

export default function GallerySection({ imageUrls = [], videoUrl = null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Construir array de items de galería
    const galleryItems = [];

    // Si hay video, va primero
    if (videoUrl) {
        galleryItems.push({ type: 'video', url: videoUrl });
    }

    // Agregar todas las imágenes
    imageUrls.forEach(url => {
        galleryItems.push({ type: 'image', url });
    });

    const totalItems = galleryItems.length;
    const extraCount = totalItems > 3 ? totalItems - 3 : 0;

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
    };

    // Componente para renderizar un item (imagen o video thumbnail)
    const GalleryItem = ({ item, index, className = '', showOverlay = false, overlayCount = 0, showPhotoCount = false }) => {
        const isVideo = item?.type === 'video';

        if (!item) {
            return <div className={`bg-gray-200 ${className}`} />;
        }

        const thumbnailUrl = isVideo ? getYoutubeThumbnail(item.url) : null;

        return (
            <div
                className={`relative cursor-pointer overflow-hidden rounded-2xl group ${className}`}
                onClick={() => openModal(index)}
            >
                {isVideo ? (
                    // Video thumbnail con imagen de YouTube
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center relative overflow-hidden">
                        {thumbnailUrl && (
                            <Image
                                src={thumbnailUrl}
                                alt="Video thumbnail"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="z-10 w-24 h-24 md:w-32 md:h-32 rounded-full border-[10px] border-white flex items-center justify-center bg-white/20 group-hover:bg-white/30 transition-colors">
                            <GoTriangleRight className="text-white text-6xl md:text-7xl ml-2" />
                        </div>
                    </div>
                ) : (
                    // Image
                    <Image
                        src={item.url}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                )}

                {/* Overlay para "+N more" */}
                {showOverlay && overlayCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xl md:text-2xl font-semibold">
                            +{overlayCount} more
                        </span>
                    </div>
                )}

                {/* Tag indicador de media clickeables */}
                {showPhotoCount && totalItems > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm">
                        <IoImagesOutline className="text-base" />
                        <span>{totalItems} media</span>
                    </div>
                )}
            </div>
        );
    };

    // Si no hay items, mostrar placeholder
    if (totalItems === 0) {
        return (
            <div className="flex items-center justify-center relative rounded-2xl overflow-hidden w-full max-w-7xl mx-auto bg-gray-200 h-[300px] md:h-[500px]">
                <span className="text-gray-400">No media available</span>
            </div>
        );
    }

    // Layout para 1 item
    if (totalItems === 1) {
        return (
            <>
                <div className="relative w-full max-w-7xl mx-auto h-[300px] md:h-[500px]">
                    <GalleryItem item={galleryItems[0]} index={0} className="w-full h-full" showPhotoCount />
                </div>
                <GalleryModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    items={galleryItems}
                    currentIndex={currentIndex}
                    onPrev={goToPrev}
                    onNext={goToNext}
                />
            </>
        );
    }

    // Layout para 2 items
    if (totalItems === 2) {
        return (
            <>
                <div className="flex flex-col md:flex-row gap-2 w-full max-w-7xl mx-auto h-[400px] md:h-[500px]">
                    <GalleryItem item={galleryItems[0]} index={0} className="flex-1 w-full" showPhotoCount />
                    <GalleryItem item={galleryItems[1]} index={1} className="flex-1 w-full" />
                </div>
                <GalleryModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    items={galleryItems}
                    currentIndex={currentIndex}
                    onPrev={goToPrev}
                    onNext={goToNext}
                />
            </>
        );
    }

    // Layout para 3+ items
    return (
        <>
            {/* Mobile: columna con imagen grande arriba y 2 pequeñas abajo */}
            {/* Desktop: fila con 2/3 izquierda y 1/3 derecha dividida */}
            <div className="flex flex-col md:flex-row gap-2 w-full max-w-7xl mx-auto h-[450px] md:h-[500px]">
                {/* Imagen principal */}
                <GalleryItem
                    item={galleryItems[0]}
                    index={0}
                    className="flex-1 md:flex-[2] w-full"
                    showPhotoCount
                />

                {/* Contenedor de imágenes secundarias */}
                <div className="flex flex-row md:flex-col gap-2 h-[150px] md:h-full md:flex-1">
                    <GalleryItem
                        item={galleryItems[1]}
                        index={1}
                        className="flex-1 h-full md:h-1/2"
                    />
                    <GalleryItem
                        item={galleryItems[2]}
                        index={2}
                        className="flex-1 h-full md:h-1/2"
                        showOverlay={extraCount > 0}
                        overlayCount={extraCount}
                    />
                </div>
            </div>
            <GalleryModal
                isOpen={isModalOpen}
                onClose={closeModal}
                items={galleryItems}
                currentIndex={currentIndex}
                onPrev={goToPrev}
                onNext={goToNext}
            />
        </>
    );
}
