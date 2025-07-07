import React from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { aboutData } from "@/app/data/about.Data";

export default function About() {
    return (
        <div className="w-full flex justify-center py-20 border-t border-gray-200">
            <div className="w-full max-w-7xl px-6 md:px-0">
                {/* Hero Section */}
                <section className="mb-16 md:mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                        <div className="md:w-[60%]">
                            <h1 className="text-4xl font-bold text-darkBlue mb-6">
                                {aboutData.title}
                            </h1>
                            <p className="text-gray-text text-sm leading-relaxed mb-6 md:mb-0">
                                {aboutData.descriptionShort}
                            </p>
                        </div>
                        <ButtonTheme title="Browse gallery"href="#gallery"/>
                    </div>
                    <div className="w-full h-80 md:h-[500px] rounded-xl overflow-hidden relative">
                        <Image
                            src={aboutData.imageUrls[0]}
                            alt="Chabad Boquete Cover"
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* Main Content Section */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* About Section */}
                    <div className="lg:w-[70%]">
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-darkBlue mb-6">
                                About Chabad House
                            </h2>
                            <div className="text-gray-text text-sm leading-relaxed space-y-4">
                                <p>{aboutData.descriptionLong}</p>
                            </div>
                        </section>

                        {/* Gallery Section */}
                        <section id="gallery"> 
                            <h2 className="text-3xl font-bold text-darkBlue mb-8">
                                Photo gallery
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {aboutData.imageUrls.slice(1, 7).map((url, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square rounded-xl overflow-hidden relative"
                                    >
                                        <Image
                                            src={url}
                                            alt={`Gallery ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-[30%]">
                        <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">
                            <div className="">

                                <div className="w-12 h-12 overflow-hidden relative mb-4" >
                                    <Image src="/assets/icons/about/about.svg" fill className="object-contain w-full h-full" alt="icon" />
                                </div>


                                <h3 className="text-2xl font-bold text-darkBlue mb-2">
                                    Chabad shluchim
                                </h3>
                                <p className="text-gray-text text-sm mb-4">
                                    Our Chabad shluchim bring warmth, education, and spiritual
                                    support to Boquete's Jewish community.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <FaUser className="text-darkBlue mt-1 flex-shrink-0" />
                                        <p>
                                            <span className="font-semibold text-darkBlue">
                                                Rabbi Yakov Poliwoda
                                            </span>{" "}
                                            - Chabad Shliach
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaUser className="text-darkBlue mt-1 flex-shrink-0" />
                                        <p>
                                            <span className="font-semibold text-darkBlue">
                                                Mrs. Hana Poliwoda
                                            </span>{" "}
                                            - Chabad Shlucha
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
