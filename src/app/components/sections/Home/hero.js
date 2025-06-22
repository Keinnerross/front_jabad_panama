"use client";
import React from "react";
import { TourCard } from "../(cards)/TourCard";
import { CardsHeroSection } from "./cardsHeroSection";

export const Hero = () => {
    return (

        <section className="relative h-[70vh] min-h-[500px] w-full">
            <div className="absolute inset-0 bg-[url('#')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-[#111828] opacity-50" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                    Chabad of Panama
                    <br />
                    City Panama
                </h1>

                <p className="mt-4 text-sm md:text-base text-[#f4f7fb]">
                    Welcome to Panama City Panama
                </p>

                <button className="mt-6 bg-[#fc5761] hover:bg-[#e5444f] transition-colors px-8 py-3 rounded-lg font-bold text-white text-sm">
                    Travel Information
                </button>
            </div>

            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
                <CardsHeroSection />
            </div>

        </section>


    );
};
