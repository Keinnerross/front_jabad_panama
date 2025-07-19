'use client'
import React, { Fragment, useState, lazy, Suspense } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { CategoryTag } from "@/app/components/ui/common/categoryTag";
import { RestaurantsSection } from "@/app/components/sections/(Entries)/(restaurants)/restaurantsSection";
import ReactMarkdown from 'react-markdown';
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { ForkIcon } from "@/app/components/ui/icons/forkIcon";
import { getAssetPath } from "@/app/utils/assetPath";

// Lazy load the popup component for better performance
const PopupShabbatBox = lazy(() => 
    import("@/app/components/sections/(Entries)/shabbatHolidays/popupShabbatBox").then(module => ({
        default: module.PopupShabbatBox
    }))
);

export default function SingleShabbatBoxSection({ shabbatBoxOptionsData, shabbatsAndHolidaysData, restaurantsData, shabbatBoxSingleData }) {
    const [isShabbatBoxModalOpen, setIsShabbatBoxModalOpen] = useState(false);
    
    // Use API data
    const shabbatBoxOptions = shabbatBoxOptionsData || [];
    const shabbatAndHolidays = shabbatsAndHolidaysData || [];
    
    // Extract page content data
    const pageData = shabbatBoxSingleData || {};
    const sidebarData = pageData?.sidebar;
    
    // Handle cover image
    const coverImageUrl = pageData?.picture?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.picture.url}` : getAssetPath("/assets/pictures/shabbat-meals/shabbatbox-single.png");
    
    // Fallback data
    const fallbackData = {
        title: "Shabbos in a Box Order Your Shabbos Meals",
        description: "**SHABBOS IN A BOX** was created to make your kosher vacation easier and to enjoy freshly made kosher shabbat meals while visiting Panama.",
        sidebarTitle: "Parashat Ki Tavo",
        sidebarDescription: "Enjoy a warm stay near the Chabad House, with nearby kosher-friendly hotels and easy access to Shabbat services."
    };
    
    // console.log('shabbatBoxOptions:', shabbatBoxOptions);
    // console.log('shabbatAndHolidays:', shabbatAndHolidays);

    const dataEntry = [];

    return (
        <Fragment>
            <div className="w-full flex justify-center pt-10 pb-10 md:pb-0 border-t border-gray-200">
                <div className="w-full max-w-7xl px-6 md:px-0">
                    {/* Hero Section */}
                    <section className="mb-12 md:mb-16">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                            <div className="md:w-[60%] mb-4 md:mb-0">
                                <h1 className="text-4xl font-bold text-darkBlue md:max-w-[80%]">
                                    Shabbos in a Box
                                    Order Your Shabbos Meals
                                </h1>
                            </div>
                            <ButtonTheme
                                title="Order food for Shabbat"
                                variation={2}
                                onClick={() => setIsShabbatBoxModalOpen(true)}
                                disableLink={true}
                            />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <CategoryTag categoryTitle="Shabbat Box" />
                            <CategoryTag categoryTitle="Kosher Food" />
                        </div>
                        <div className="w-full h-80 md:h-[500px] rounded-xl overflow-hidden relative">
                            <Image src={coverImageUrl} fill alt="shabbat Box" className="w-full h-full object-cover" />
                        </div>
                    </section>
                    
                    {/* Main Content Section */}
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* About Section */}
                        <div className="lg:w-[70%]">
                            <section className="mb-6">
                                <h2 className="text-3xl font-bold text-darkBlue mb-6">
                                    {pageData?.title || "SHABBOS MEALS TAKE OUT OPTION"}
                                </h2>
                                <div className="text-gray-text text-sm leading-relaxed space-y-4">
                                    <ReactMarkdown 
                                        components={{
                                            p: ({children}) => <p className="mb-4">{children}</p>,
                                            strong: ({children}) => <strong className="text-primary font-bold">{children}</strong>,
                                            em: ({children}) => <em className="italic">{children}</em>
                                        }}
                                    >
                                        {pageData?.description || fallbackData.description}
                                    </ReactMarkdown>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-[30%]">
                            <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">
                                <div>
                                    <div className="w-8 h-8 bg-blueBackground rounded-full relative mb-4 flex items-center justify-center">
                                        <ForkIcon className="text-primary" size={20} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-darkBlue mb-2">
                                        {sidebarData?.title_sidebar || fallbackData.sidebarTitle}
                                    </h3>
                                    <p className="text-gray-text text-sm mb-6">
                                        {sidebarData?.description_sidebar || fallbackData.sidebarDescription}
                                    </p>

                                    <ButtonTheme
                                        title="Order Your Shabbat Box"
                                        variation={2}
                                        onClick={() => setIsShabbatBoxModalOpen(true)}
                                        disableLink={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RestaurantsSection restaurantsData={restaurantsData} />
            
            {/* Lazy loaded Shabbat Box Popup with suspense boundary */}
            <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div></div>}>
                <PopupShabbatBox
                    isOpen={isShabbatBoxModalOpen}
                    handleModal={setIsShabbatBoxModalOpen}
                    shabbatBoxOptions={shabbatBoxOptions}
                    shabbatAndHolidays={shabbatAndHolidays}
                    shabbatBoxSingleData={pageData}
                />
            </Suspense>
        </Fragment>
    );
};