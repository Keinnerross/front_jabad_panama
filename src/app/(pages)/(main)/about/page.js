import React from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { strapiEndpoints, getQuery, fetchAll, api } from "@/app/services/strapiApiFetch.js";
import { AboutIcon } from "@/app/components/ui/icons/aboutIcon";

import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";




export default async function About() {


    //Llamada a la API
    const aboutPageData = await api.aboutPage();


    // Fallback data - Para cuando no hayan datos en la Api
    const fallbackData = {
        title: "Title",
        descriptionShort: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        descriptionLong: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        imageUrls: [] // ← Array vacío, no string vacío
    };




    //Separamos Imagenes de Info
    const aboutPageInfo = aboutPageData?.about_page;
    const pictures = aboutPageInfo?.pictures || [];
    const sidebarData = aboutPageData?.sidebar;




    const pageData = {
        title_1: aboutPageInfo?.title_1 || fallbackData.title,
        title_2: aboutPageInfo?.title_2 || fallbackData.title,
        descriptionShort: aboutPageInfo?.short_description || fallbackData.descriptionShort,
        descriptionLong: aboutPageInfo?.long_description || fallbackData.descriptionLong,
        imageUrls: imagesArrayValidation(pictures, fallbackData)

    };




    return (
        <div className="w-full flex justify-center py-20 border-t border-gray-200">
            <div className="w-full max-w-7xl px-6 md:px-0">
                {/* Hero Section */}
                <section className="mb-16 md:mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                        <div className="md:w-[60%]">
                            <h1 className="text-4xl font-bold text-darkBlue mb-6">
                                {pageData.title_1}
                            </h1>
                            <p className="text-gray-text text-sm leading-relaxed mb-6 md:mb-0">
                                {pageData.descriptionShort}
                            </p>
                        </div>
                        <ButtonTheme title="Browse gallery" href="#gallery" />
                    </div>

                    {/* ← Renderizado condicional de imagen principal */}
                    {pageData.imageUrls.length > 0 && pageData.imageUrls[0] ? (
                        <div className="w-full h-80 md:h-[500px] rounded-xl overflow-hidden relative">
                            <Image
                                src={pageData.imageUrls[0]}
                                alt="Chabad Boquete Cover"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="w-full h-80 md:h-[500px] rounded-xl overflow-hidden relative bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-500">No image available</p>
                        </div>
                    )}
                </section>

                {/* Main Content Section */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* About Section */}
                    <div className="lg:w-[70%]">
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-darkBlue mb-6">
                                {pageData.title_2}
                            </h2>
                            <div className="text-gray-text text-sm leading-relaxed space-y-4">
                                <p>{pageData.descriptionLong}</p>
                            </div>
                        </section>

                        {/* Gallery Section */}
                        <section id="gallery">
                            <h2 className="text-3xl font-bold text-darkBlue mb-8">
                                Photo gallery
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {/* ← Filtra URLs vacías en la galería */}
                                {pageData.imageUrls.slice(1, 7)
                                    .filter(url => url && url !== "" && !url.includes('undefined'))
                                    .map((url, i) => (
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
                                    ))
                                }

                                {/* Mensaje si no hay imágenes */}
                                {pageData.imageUrls.slice(1, 7).filter(url => url && url !== "" && !url.includes('undefined')).length === 0 && (
                                    <div className="col-span-full text-center py-8">
                                        <p className="text-gray-500">No gallery images available</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-[30%]">
                        <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">
                            <div className="">
                                <div className="w-12 h-12 overflow-hidden relative mb-4" >
                                    <AboutIcon />
                                </div>

                                <h3 className="text-2xl font-bold text-darkBlue mb-2">
                                    {sidebarData?.title_sidebar || "Chabad shluchim"}
                                </h3>
                                <p className="text-gray-text text-sm mb-4">
                                    {sidebarData?.description_sidebar || "Our Chabad shluchim bring warmth, education, and spiritual support to Boquete's Jewish community."}
                                </p>

                                <div className="space-y-4">
                                    {sidebarData?.chabad_team?.map((member) => (
                                        <div key={member.id} className="flex items-start gap-3">
                                            <FaUser className="text-darkBlue mt-1 flex-shrink-0" />
                                            <p>
                                                <span className="font-semibold text-darkBlue">
                                                    {member.name}
                                                </span>{" "}
                                                - {member.rol}
                                            </p>
                                        </div>
                                    )) || (
                                        // Fallback content if API data is not available
                                        <>
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
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}