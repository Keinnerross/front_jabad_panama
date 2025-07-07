"use client";
import React from "react";
import { TourCard } from "../(cards)/TourCard";
import { CardsHeroSection } from "./cardsHeroSection";
import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
    return (
        <section className="relative h-[65vh]  w-full overflow-hidden">
            {/* Imagen de fondo con animación sutil */}
            <div className="w-full h-full absolute inset-0 bg-[url('#')] bg-cover bg-center">
                <Image
                    src="/assets/pictures/home/hero.jpg"
                    fill
                    className="w-full h-full object-cover animate-pulse"
                    alt=""
                    style={{
                        animation: 'fadeInZoom 2s ease-out forwards'
                    }}
                />
            </div>

            {/* Overlay con animación de fade */}
            <div
                className="absolute inset-0 bg-[#111828] opacity-50"
                style={{
                    animation: 'fadeIn 1.5s ease-out forwards'
                }}
            />

            {/* Contenido principal con animaciones escalonadas */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white overflow-hidden">
                <h1
                    className="sm:w-[30%] md:w-[40%] text-4xl md:text-6xl font-bold opacity-0 translate-y-8"
                    style={{
                        animation: 'slideUpFade 1s ease-out 0.3s forwards'
                    }}
                >
                    Chabad of Boquete, Panama
                </h1>

                <p
                    className="mt-4 text-sm md:text-base text-[#f4f7fb] opacity-0 translate-y-6"
                    style={{
                        animation: 'slideUpFade 1s ease-out 0.8s forwards'
                    }}
                >
                    Welcome to your Jewish home in the mountains
                </p>

                <Link
                    href="/#aboutHero"
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