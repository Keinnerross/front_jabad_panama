"use client";
import React from "react";
import { TourCard } from "../(cards)/TourCard";
import { CardsHeroSection } from "./cardsHeroSection";
import Link from "next/link";
import Image from "next/image";
import { useSiteConfig } from "@/app/context/SiteConfigContext";

export const Hero = ({ siteConfig }) => {



    // Fallback data - Para cuando no hayan datos en la Api
    const fallbackData = {
        site_title: "Title",
        site_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        hero_image: "assets/global/asset001.png" // ← Array vacío, no string vacío
    };



    const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    const bgUrl = `${url}${siteConfig.hero_image?.url}`

    // console.log("HERO", siteConfig);


    const sectionData = {
        site_title: siteConfig?.site_title || fallbackData.site_title,
        site_description: siteConfig?.site_description || fallbackData.site_description,
        hero_image: bgUrl || fallbackData.hero_image
        /*   imageUrls: imagesArrayValidation(pictures, fallbackData) */
    };





    return (
        <section className="relative h-[65vh] w-full overflow-hidden">
            {/* Imagen de fondo con animación sutil */}
            <div className="w-full h-full absolute inset-0 bg-[url('#')] bg-cover bg-center">

                <Image
                    src={sectionData.hero_image}
                    fill
                    className="w-full h-full object-cover opacity-0"
                    alt={sectionData.site_title}
                    sizes="100vw"
                    style={{
                        animation: 'fadeInZoom 2s ease-out forwards',
                        borderRadius: '0'
                    }}
                    priority={true}
                    onError={(e) => {
                        console.warn('Hero image failed to load, using fallback');
                        e.target.src = '/boquete_website/assets/pictures/home/hero.jpg';
                    }}
                />

            </div>

            {/* Overlay con animación de fade */}
            <div
                className="absolute inset-0 bg-dark opacity-50"
                style={{
                    animation: 'fadeIn 1.5s ease-out forwards'
                }}
            />

            {/* Contenido principal con animaciones escalonadas */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 sm:px-8 md:px-12 lg:px-16 text-center text-white overflow-hidden">
                <h1
                    className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] text-3xl sm:text-4xl md:text-5xl  lg:text-5xl 2xl:text-6xl font-bold opacity-0 translate-y-8"
                    style={{
                        animation: 'slideUpFade 1s ease-out 0.3s forwards'
                    }}
                >

                    {sectionData.site_title}

                </h1>

                <div
                    className="mt-4 text-sm md:text-base text-accent opacity-0 translate-y-6 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]"
                    style={{
                        animation: 'slideUpFade 1s ease-out 0.8s forwards'
                    }}
                >


                    <p>{sectionData.site_description}</p>

                </div>
                <Link
                    href="/visitor-information"
                    className="mt-6 bg-primary hover:bg-primary transition-all duration-300 px-8 py-3 rounded-lg font-bold text-white opacity-0 translate-y-4 hover:scale-105 hover:shadow-lg transform"
                    style={{
                        animation: 'slideUpFade 1s ease-out 1.3s forwards'
                    }}
                >
                    Visitor Information
                </Link>
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 0.5;
                    }
                }

                @keyframes fadeInZoom {
                    from {
                        opacity: 0;
                        transform: scale(1.1);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes slideUpFade {
                    from {
                        opacity: 0;
                        transform: translateY(2rem);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
};