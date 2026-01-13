'use client'
import { useEffect, useState, useRef } from "react";
import { ButtonTheme } from "../../ui/common/buttonTheme"

export const MapSection = ({ siteConfig }) => {

  // Función para extraer URL del src de un iframe o retornar la URL directa
  const extractMapUrl = (input) => {
    if (!input) return '';
    
    // Si el input contiene <iframe, intentar extraer el src
    if (input.includes('<iframe') && input.includes('src=')) {
      // Buscar el patrón src="..." o src='...'
      const srcMatch = input.match(/src=["']([^"']+)["']/);
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1];
      }
    }
    
    // Si no es un iframe, retornar el input tal cual (eliminar espacios extras)
    return input.trim();
  };

  const fallbackData = {
    phone: "+1 2345 6789",
    address: "Mare Tranquillitatis",
    city: "The Moon 🌙",
    mapUrl: null, // No URL means we'll show the moon map
    navigateUrl: "https://moon.nasa.gov/"
  };

  const sectionData = {
    phone: siteConfig?.phone || fallbackData.phone,
    address: siteConfig?.address || fallbackData.address,
    city: siteConfig?.city || fallbackData.city,
    mapUrl: extractMapUrl(siteConfig?.mapUrl) || fallbackData.mapUrl,
    navigateUrl: siteConfig?.navigateUrl || fallbackData.navigateUrl
  };


  const [isMounted, setIsMounted] = useState(false);
  
  // States for draggable moon map
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef(null);
  
  useEffect(() => setIsMounted(true), []);
  
  // Handle drag start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };
  
  // Handle touch start for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
    e.preventDefault();
  };
  
  // Handle drag move
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate boundaries based on container and image size (200% = 2x container size)
    // Image is 200% of container, so extra 100% needs to be contained
    // For a 200% image: can move from 0 to -(containerWidth)
    const containerWidth = mapContainerRef.current?.offsetWidth || 800;
    const containerHeight = mapContainerRef.current?.offsetHeight || 500;
    
    // With 200% size, the image extends 100% beyond the container
    const maxX = 0; // Can't move right beyond starting position
    const minX = -containerWidth; // Can move left by full container width
    const maxY = 0; // Can't move up beyond starting position  
    const minY = -containerHeight; // Can move down by full container height
    
    setPosition({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    });
  };
  
  // Handle touch move for mobile
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    const containerWidth = mapContainerRef.current?.offsetWidth || 800;
    const containerHeight = mapContainerRef.current?.offsetHeight || 500;
    
    const maxX = 0;
    const minX = -containerWidth;
    const maxY = 0;
    const minY = -containerHeight;
    
    setPosition({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    });
  };
  
  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  return (
    <section className="w-full flex justify-center items-center pt-16 md:pt-24 lg:pt-28 pb-14 md:pb-20 lg:pb-24 px-6 md:px-0">
      <div className="max-w-7xl w-7xl mx-auto flex flex-col justify-center items-center gap-10 ">
        <h2 className="text-center text-myBlack font-bold text-3xl md:text-4xl">
          You will find us here
        </h2>
        <div className="flex justify-between items-center w-full md:w-[70%] text-gray-800 font-medium gap-4 md:gap-0">
          <div>
            <p>{sectionData.city}</p>
            <p>{sectionData.address}</p>
            <p>{sectionData.phone}</p>
          </div>
          <div>
            <ButtonTheme title="Navigate" href={sectionData.navigateUrl} variation={3} />
          </div>
        </div>
        <div className="w-full h-[200px] md:h-[500px] rounded-3xl overflow-hidden ">
          {isMounted && (
            !sectionData.mapUrl ? (
              // Moon map fallback when no configuration
              <div 
                ref={mapContainerRef}
                className="w-full h-full relative bg-gray-900 overflow-hidden select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ 
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
              >
                <div 
                  className="absolute"
                  style={{
                    width: '200%',
                    height: '200%',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    backgroundImage: "url('https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#1a1a1a',
                    filter: 'brightness(0.8) contrast(1.2)',
                    transition: isDragging ? 'none' : 'all 0.1s ease-out',
                    pointerEvents: 'none'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-4 left-4 text-white z-10 pointer-events-none">
                  <p className="text-xl font-bold">🌙 Mare Tranquillitatis</p>
                  <p className="text-sm opacity-80">Chabad of The Moon</p>
                  <p className="text-xs opacity-60 mt-1">Drag to explore</p>
                </div>
              </div>
            ) : (
              // Regular map when configured
              <iframe
                src={sectionData.mapUrl}
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            )
          )}
        </div>
      </div>
    </section>
  )
}
