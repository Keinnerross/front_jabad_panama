import React from "react";
import Image from "next/image";
import { FaCompass } from "react-icons/fa";
import { ButtonTheme } from "../../ui/buttonTheme";

export const HeroActivities = () => {
    // Sample data - replace with your CMS data
    const experiences = [
        { id: 1, image: "/the-best-experiences-in-your-city-locallisting-x-webflow-template.png" },
        { id: 2, image: "/image.png" },
        { id: 3, image: "/the-best-experiences-in-your-city-locallisting-x-webflow-template-2.png" },
        { id: 4, image: "/the-best-experiences-in-your-city-locallisting-x-webflow-template-3.png" },
        { id: 5, image: "/the-best-experiences-in-your-city-locallisting-x-webflow-template-4.png" },
        { id: 6, image: "/the-best-experiences-in-your-city-locallisting-x-webflow-template-5.png" },
        { id: 7, image: "/the-best-experiences-in-your-city-locallisting-x-webflow-template-6.png" }
    ];

    return (
        <section className="w-full flex justify-center items-center py-12" >
            <div className="w-full max-w-7xl bg-blueBackground rounded-xl overflow-hidden ">
                <div className="max-w-7xl w-full flex gap-8 items-center h-[500px]">
                    {/* Texto */}
                    <div className="text-center lg:text-left w-[35%] px-12 ">
                        <h2 className="text-3xl font-bold text-darkBlue mb-4 leading-snug">
                            Explore the Best Things to See and Do in Vibrant Panama City
                        </h2>
                        <p className="text-gray-text text-sm leading-7 mb-6">
                            From historic streets and cultural gems to breathtaking nature and thrilling adventures, Panama City offers experiences for every kind of traveler.
                        </p>
                        <ButtonTheme title="Let’s explore experiences!" variation={2} />
                    </div>

                    {/* Galería de imágenes */}
                    <div className="w-[65%] grid grid-cols-3 gap-4">
                        <div className="col-span-1 row-span-1">
                            <div className="w-full h-40 md:h-48 rounded-lg bg-red-300">
                                {/* Imagen dinámica de Strapi */}
                            </div>
                        </div>
                        <div className="col-span-1 row-span-2">
                            <div className="w-full h-80 md:h-96 rounded-lg bg-red-300" />
                        </div>
                        <div className="col-span-1 row-span-1">
                            <div className="w-full h-40 md:h-48 rounded-lg bg-red-300" />
                        </div>
                        <div className="col-span-1 row-span-1">
                            <div className="w-full h-40 md:h-48 rounded-lg bg-red-300" />   
                        </div>
                        <div className="col-span-1 row-span-2">
                            <div className="w-full h-80 md:h-96 rounded-lg bg-red-300" />
                        </div>
                        <div className="col-span-1 row-span-1">
                            <div className="w-full h-40 md:h-48 rounded-lg bg-red-300" />
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};




