"use client"
import React, { Fragment, useState, useEffect, lazy, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { CategoryTag } from "@/app/components/ui/common/categoryTag";
import { RestaurantsSection } from "@/app/components/sections/(Entries)/(restaurants)/restaurantsSection";
import { ForkIcon } from "@/app/components/ui/icons/forkIcon";
import { getAssetPath } from "@/app/utils/assetPath";
import ReactMarkdown from 'react-markdown';
// import { pricesRegistrationShabbat } from "@/app/data/shabbatData";

// Lazy load the popup component for better performance
const PopupReservations = lazy(() =>
    import("@/app/components/sections/(Entries)/shabbatHolidays/popupReservations").then(module => ({
        default: module.PopupReservations
    }))
);

export default function SingleReservationsSection({ shabbatsAndHolidaysData, restaurantsData, shabbatsRegisterPricesData }) {
    
    // Use API data instead of static data
    const pricesRegistrationShabbat = shabbatsRegisterPricesData || [];
    const searchParams = useSearchParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedShabbatData, setSelectedShabbatData] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [isCustomEvent, setIsCustomEvent] = useState(false);

    // Get sorted Shabbats from API data  
    const sortedShabbats = shabbatsAndHolidaysData || [];


    const handleModal = (value) => {
        setModalOpen(value);
    }

    useEffect(() => {
        const shabbatId = searchParams.get('shabbat');
        if (shabbatId !== null && sortedShabbats.length > 0) {
            // Find event by ID (not index)
            const selectedEvent = sortedShabbats.find(event => event.id.toString() === shabbatId);
            if (selectedEvent) {
                setSelectedShabbatData(selectedEvent);
                setIsCustomEvent(selectedEvent.type_of_event === 'custom');
            }
        }
    }, [searchParams, sortedShabbats]);

    const handleMealSelection = (meal) => {
        setSelectedMeal(meal);
        setModalOpen(true);
    };

    const handleGeneralRegistration = () => {
        if (isCustomEvent && selectedShabbatData?.category_menu?.length > 0) {
            // For custom events, use first category and first option
            const firstCategory = selectedShabbatData.category_menu[0];
            if (firstCategory?.option?.length > 0) {
                setSelectedMeal(firstCategory.option[0]);
                setModalOpen(true);
            }
        } else if (pricesRegistrationShabbat && pricesRegistrationShabbat.length > 0) {
            // For shabbat/holiday events, use pricing data
            setSelectedMeal(pricesRegistrationShabbat[0]);
            setModalOpen(true);
        }
    };








    return (
        <Fragment>
            <div className="w-full flex justify-center mt-10 pb-6 md:pb-20">
                <div className="w-full max-w-7xl px-4 md:px-0">
                    {/* Hero Section */}
                    <section className="mb-16">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                            <div className="md:w-[60%] mb-4 md:mb-0">
                                <div>
                                    <h1 className="text-4xl font-bold text-darkBlue md:max-w-[80%]">
                                        {isCustomEvent ? `Registration for ${selectedShabbatData?.name || 'Custom Event'}` : 'Registration for Shabbat and Holiday meals'}
                                    </h1>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <ButtonTheme title="Register Now" variation={2} onClick={handleGeneralRegistration} disableLink={true} />
                            </div>

                            <div className="flex w-full md:hidden">
                                <ButtonTheme title="Register Now" variation={2} onClick={handleGeneralRegistration} disableLink={true} isFull />
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start items-center gap-4 mb-8">
                            {isCustomEvent ? (
                                selectedShabbatData?.category_menu?.slice(0, 3).map((category, index) => (
                                    <CategoryTag key={index} categoryTitle={category.category_name || `Category ${index + 1}`} />
                                ))
                            ) : (
                                <>
                                    <CategoryTag categoryTitle="Shabbat Meals" />
                                    <CategoryTag categoryTitle="Kosher Foods" />
                                </>
                            )}
                        </div>

                        <div className="w-full h-80 md:h-[500px] rounded-xl overflow-hidden relative">
                            <Image 
                                fill 
                                src={
                                    isCustomEvent && selectedShabbatData?.cover_picture?.url 
                                        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${selectedShabbatData.cover_picture.url}`
                                        : getAssetPath("/assets/pictures/shabbat-meals/meals-single.jpg")
                                } 
                                alt="picture-shabbat-meal" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </section>

                    {/* Main Content Section */}
                    <div className="flex flex-col lg:flex-row md:gap-12">
                        {/* About Section */}
                        <div className="lg:w-[70%]">
                            <section className="mb-12">
                                {!isCustomEvent ? (
                                    <>
                                        <h2 className="text-3xl font-bold text-darkBlue mb-6">
                                            Shabbat times:
                                        </h2>
                                        <div className="text-gray-text text-sm leading-relaxed space-y-4">
                                            {selectedShabbatData && (
                                                <>
                                                    {selectedShabbatData.event_description && (
                                                        <div className="border border-gray-200 p-4 rounded-2xl mb-4">
                                                            <h3 className="font-semibold text-myBlack text-base mb-2">
                                                                About this Shabbat
                                                            </h3>
                                                            <div className="text-gray-600">
                                                                <ReactMarkdown
                                                                    components={{
                                                                        h1: ({ children }) => <h1 className="text-2xl font-bold text-darkBlue mb-4">{children}</h1>,
                                                                        h2: ({ children }) => <h2 className="text-xl font-bold text-darkBlue mb-3">{children}</h2>,
                                                                        h3: ({ children }) => <h3 className="text-lg font-bold text-darkBlue mb-2">{children}</h3>,
                                                                        h4: ({ children }) => <h4 className="text-base font-bold text-darkBlue mb-2">{children}</h4>,
                                                                        p: ({ children }) => <p className="mb-3 text-gray-600">{children}</p>,
                                                                        strong: ({ children }) => <strong className="font-semibold text-myBlack">{children}</strong>,
                                                                        ul: ({ children }) => <ul className="list-disc ml-4 space-y-1">{children}</ul>,
                                                                        ol: ({ children }) => <ol className="list-decimal ml-4 space-y-1">{children}</ol>,
                                                                        li: ({ children }) => <li className="mb-1 text-gray-600">{children}</li>,
                                                                        a: ({ href, children }) => <a href={href} className="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                                                                        br: () => <br className="mb-2" />
                                                                    }}
                                                                >
                                                                    {selectedShabbatData.event_description}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="border border-gray-200 p-4 rounded-2xl">
                                                        <h3 className="font-semibold text-myBlack text-base mb-2">
                                                            Friday night – Friday {new Date(selectedShabbatData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                        </h3>
                                                        <ul>
                                                            {selectedShabbatData.fridayNight && Array.isArray(selectedShabbatData.fridayNight) && selectedShabbatData.fridayNight.map((event, index) => (
                                                                <li key={index}>
                                                                    <strong className="text-myBlack">{event.hora}</strong> {event.activity}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="border border-gray-200 p-4 rounded-2xl">
                                                        <h3 className="font-semibold text-myBlack text-base mb-2">
                                                            Shabbat day – Saturday {new Date(selectedShabbatData.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                        </h3>
                                                        <ul>
                                                            {selectedShabbatData.shabbatDay && Array.isArray(selectedShabbatData.shabbatDay) && selectedShabbatData.shabbatDay.map((event, index) => (
                                                                <li key={index}>
                                                                    <strong className="text-myBlack">{event.hora}</strong> {event.activity}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-bold text-darkBlue mb-6">
                                            Event Details:
                                        </h2>
                                        <div className="text-gray-text text-sm leading-relaxed space-y-4">
                                            <div className="border border-gray-200 p-4 rounded-2xl">
                                                <div className="text-gray-600">
                                                    <ReactMarkdown
                                                        components={{
                                                            h1: ({ children }) => <h1 className="text-2xl font-bold text-darkBlue mb-4">{children}</h1>,
                                                            h2: ({ children }) => <h2 className="text-xl font-bold text-darkBlue mb-3">{children}</h2>,
                                                            h3: ({ children }) => <h3 className="text-lg font-bold text-darkBlue mb-2">{children}</h3>,
                                                            h4: ({ children }) => <h4 className="text-base font-bold text-darkBlue mb-2">{children}</h4>,
                                                            p: ({ children }) => <p className="mb-3 text-gray-600">{children}</p>,
                                                            strong: ({ children }) => <strong className="font-semibold text-myBlack">{children}</strong>,
                                                            ul: ({ children }) => <ul className="list-disc ml-4 space-y-1">{children}</ul>,
                                                            ol: ({ children }) => <ol className="list-decimal ml-4 space-y-1">{children}</ol>,
                                                            li: ({ children }) => <li className="mb-1 text-gray-600">{children}</li>,
                                                            a: ({ href, children }) => <a href={href} className="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                                                            br: () => <br className="mb-2" />
                                                        }}
                                                    >
                                                        {selectedShabbatData?.event_description || "This is a custom event with various options available. Use the registration button to see all available options and select your preferences."}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-[30%]">
                            <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">
                                <div className="space-y-6">
                                    <div className="w-8 h-8 bg-blueBackground rounded-full relative mb-4 flex items-center justify-center">
                                        <ForkIcon className="text-primary" size={20} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold text-darkBlue">
                                            {selectedShabbatData?.name || "Error to fetch"}
                                        </h3>
                                        <p className="text-gray-text text-sm">
                                            {isCustomEvent ? 
                                                `Join us for ${selectedShabbatData?.name || 'this special event'}. Register in advance to secure your spot and enjoy a unique experience with our community.` :
                                                'Join us for a meaningful Shabbat or holiday experience by registering in advance for our communal meals. Whether you\'re traveling, new to the area, or just looking to connect, there\'s always a seat for you at our table.'
                                            }
                                        </p>
                                        <ButtonTheme 
                                            title={isCustomEvent ? `Register for ${selectedShabbatData?.name || 'Event'}` : "Register for Shabbat Meals"} 
                                            variation={2} 
                                            onClick={handleGeneralRegistration} 
                                            disableLink={true} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RestaurantsSection restaurantsData={restaurantsData} />

            {/* Lazy loaded popup with suspense boundary */}
            <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div></div>}>
                <PopupReservations
                    isOpen={modalOpen}
                    handleModal={handleModal}
                    selectedMeal={selectedMeal}
                    shabbatData={selectedShabbatData}
                    allMeals={isCustomEvent ? (selectedShabbatData?.category_menu?.flatMap(cat => cat.option) || []) : pricesRegistrationShabbat}
                    isCustomEvent={isCustomEvent}
                />
            </Suspense>
        </Fragment>
    );
}