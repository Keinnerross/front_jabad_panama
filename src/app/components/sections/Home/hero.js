"use client";
import React from "react";
import { TourCard } from "../(cards)/TourCard";
import { CardsHeroSection } from "./cardsHeroSection";
import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
    return (

        <section className="relative h-[75vh] min-h-[480px] w-full">
            <div className="w-full h-full absolute inset-0 bg-[url('#')] bg-cover bg-center">
                <Image src="/assets/pictures/home/hero.jpg" fill className="w-full h-full object-cover" alt="" />
            </div>
            <div className="absolute inset-0 bg-[#111828] opacity-50" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white overflow-hidden">
                <h1 className="sm:w-[30%] md:w-[40%] text-3xl md:text-6xl font-bold ">Chabad of Boquete, Panama</h1>
                <p className="mt-4 text-sm md:text-base text-[#f4f7fb]">Welcome to your Jewish home in the mountains</p>
                <Link href="/tourist-info" className="mt-6 bg-primary hover:bg-primary transition-colors px-8 py-3 rounded-lg font-bold text-white">Visitor Information</Link>
            </div>

        </section>
    );
};
