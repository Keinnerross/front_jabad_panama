'use client'

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { FaCompass } from "react-icons/fa";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { activitiesData } from "@/app/data/activities";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { getAssetPath } from "@/app/utils/assetPath";

export const HeroActivities = ({ activitiesData, copiesData }) => {
    const sectionRef = useRef(null);
    const imagesRef = useRef([]);





    const fallbackData = [
        {
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        },
        {
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        },
        {
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        },
        {
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        },
        {
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        },
        {
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        },
        {
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        },
    ];


    let allImages = [];

    const arrayAllImages = (data) => {
        if (Array.isArray(data)) {
            data.forEach(activity => {
                if (activity.imageUrls) {
                    // Si imageUrls es un array, concatenamos sus elementos
                    if (Array.isArray(activity.imageUrls)) {
                        allImages = allImages.concat(activity.imageUrls);
                    }
                    // Si imageUrls es un string, lo añadimos directamente
                    else if (typeof activity.imageUrls === 'string') {
                        allImages.push(activity.imageUrls);
                    }
                }
            });
        }

        return allImages;
    }


    const arrayAllImagesUrl = arrayAllImages(activitiesData);


    const imageUrls = imagesArrayValidation(arrayAllImagesUrl, { imageUrls: [] });


    console.log(imageUrls);












    // Seleccionar las primeras 7 actividades para mostrar en el hero
    const selectedActivities = (imageUrls || []).slice(-7);

    // Configuración del layout: cuántas imágenes por columna
    const columnLayout = [
        { images: selectedActivities.slice(0, 2), className: "flex-1 flex flex-col gap-6" },
        { images: selectedActivities.slice(2, 5), className: "flex-1 flex flex-col gap-6 -mt-12 -mb-12" },
        { images: selectedActivities.slice(5, 7), className: "flex-1 flex flex-col gap-6" }
    ];


    console.log(columnLayout)



    // Hook para animaciones de scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));

            // Aplicar parallax sutil a cada columna con diferentes velocidades
            imagesRef.current.forEach((column, index) => {
                if (column) {
                    const speed = (index + 1) * 0.3; // Velocidades diferentes para cada columna
                    const translateY = -(scrollProgress * 30 * speed); // Movimiento sutil
                    column.style.transform = `translateY(${translateY}px)`;
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Ejecutar una vez al montar

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);












    // Componente reutilizable para cada imagen
    const ExperienceImage = ({ activityImageUrl, index, columnIndex, imageIndex }) => (
        <div
            className={`
                relative w-full h-64 lg:h-64 rounded-lg overflow-hidden 
                transform transition-all duration-700 ease-out
                hover:scale-105 hover:shadow hover:-translate-y-2
                animate-fade-in-up
            `}
            style={{
                animationDelay: `${(columnIndex * 200) + (imageIndex * 100)}ms`
            }}
        >
            <Image
                src={activityImageUrl}
                alt={"activity"}
                fill
                className="object-cover transition-transform duration-500 ease-out"
            />
            {/* Overlay sutil que aparece en hover */}
        </div>
    );





    return (
        <section ref={sectionRef} className="w-full flex justify-center items-center md:pb-12 md:pt-4">
            <div className="w-full max-w-7xl bg-blueBackground rounded-xl overflow-hidden pt-20 md:pt-0">
                {/* Desktop layout - sin cambios */}
                <div className="hidden lg:flex max-w-7xl w-full gap-8 items-center h-[600px] py-20 pl-20 relative">
                    {/* Texto */}
                    <div className="text-center lg:text-left w-[35%] animate-fade-in-left">
                        <h2 className="text-5xl font-bold mb-4 text-myBlack transform transition-all duration-700 ease-out">
                            {copiesData?.activities?.title || "Explore the best things to see and do in Boquete"}
                        </h2>
                        <p className="text-gray-text text-sm leading-7 mb-6 transform transition-all duration-700 ease-out delay-200">
                            {copiesData?.activities?.description || "From misty mountain trails and vibrant flower gardens to world-class coffee and adrenaline-pumping adventures, Boquete offers unforgettable moments for every kind of explorer."}
                        </p>
                        <div className="transform transition-all duration-700 ease-out delay-400">
                            <ButtonTheme title="Let's explore experiences!" href="#activitiesSection" variation={2} />
                        </div>
                    </div>

                    {/* Galería de imágenes */}
                    <div className="w-[65%] h-full flex gap-6 items-center absolute -right-24">
                        {columnLayout.map((column, columnIndex) => (
                            <div
                                key={columnIndex}
                                ref={el => imagesRef.current[columnIndex] = el}
                                className={`${column.className} transform transition-all duration-1000 ease-out`}
                                style={{
                                    animationDelay: `${columnIndex * 300}ms`
                                }}
                            >
                                {column.images.map((activity, imageIndex) => (
                                    <ExperienceImage
                                        key={imageIndex}
                                        activityImageUrl={activity}
                                        index={columnIndex * 3 + imageIndex}
                                        columnIndex={columnIndex}
                                        imageIndex={imageIndex}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile y Tablet layout */}
                <div className="flex lg:hidden flex-col px-6 py-8">
                    {/* Texto */}
                    <div className="text-center mb-8 animate-fade-in-left">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-myBlack transform transition-all duration-700 ease-out">
                            {copiesData?.activities?.title || "What to See, Do, and Experience During Your Visit"}
                        </h2>
                        <p className="text-gray-text text-sm leading-7 mb-6 transform transition-all duration-700 ease-out delay-200 max-w-md mx-auto">
                            {copiesData?.activities?.description || "From breathtaking views and local flavors to cultural gems and outdoor adventures, every moment here invites you to explore, feel, and connect."}
                        </p>
                        <div className="transform transition-all duration-700 ease-out delay-400">
                            <ButtonTheme title="Let's explore experiences!" href="#activitiesSection" variation={2} />
                        </div>
                    </div>

                    {/* Galería de imágenes - Grid responsive */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {selectedActivities.slice(0, 6).map((activity, index) => (
                            <ExperienceImage
                                key={index}
                                activityImageUrl={activity}
                                index={index}
                                columnIndex={0}
                                imageIndex={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};