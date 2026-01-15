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
import remarkGfm from 'remark-gfm';
// import { pricesRegistrationShabbat } from "@/app/data/shabbatData";

// Lazy load the popup component for better performance
const PopupReservations = lazy(() =>
    import("@/app/components/sections/(Entries)/shabbatHolidays/popupReservations").then(module => ({
        default: module.PopupReservations
    }))
);

// Loading skeleton component
const SingleReservationsSkeleton = () => (
    <div className="w-full flex justify-center mt-10 pb-6 md:pb-20">
        <div className="w-full max-w-7xl px-4 md:px-0">
            {/* Title skeleton */}
            <div className="mb-8">
                <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
            </div>

            {/* Category tags skeleton */}
            <div className="flex gap-4 mb-8">
                <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
            </div>

            {/* Main image skeleton */}
            <div className="w-full h-80 md:h-[500px] bg-gray-200 rounded-xl mb-12 animate-pulse"></div>

            {/* Content skeleton */}
            <div className="flex flex-col lg:flex-row md:gap-12">
                <div className="lg:w-[70%] space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                    <div className="h-32 bg-gray-200 rounded-lg mt-4 animate-pulse"></div>
                    <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="lg:w-[30%]">
                    <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
);

export default function CustomEventSection({ customEventsData, restaurantsData, globalDeliveryZones, pickupAddress = "Sinagoga Address" }) {

    const searchParams = useSearchParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEventData, setSelectedEventData] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [isDataReady, setIsDataReady] = useState(false);

    // Get custom events from API data  
    const customEvents = customEventsData || [];


    const handleModal = (value) => {
        setModalOpen(value);
    }

    useEffect(() => {
        const eventId = searchParams.get('event');

        // Exit early if no ID
        if (!eventId) {
            setIsDataReady(true);
            return;
        }

        // Find custom event by documentId (permanent ID) or fallback to id for backward compatibility
        if (customEvents.length > 0) {
            const selectedEvent = customEvents.find(event =>
                event.documentId === eventId || event.id.toString() === eventId
            );
            if (selectedEvent && selectedEvent.documentId !== selectedEventData?.documentId) {
                setSelectedEventData(selectedEvent);
            }
        }

        // Mark data as ready
        setIsDataReady(true);
    }, [searchParams.get('event'), customEvents.length]); // More specific dependencies

    const handleMealSelection = (meal) => {
        setSelectedMeal(meal);
        setModalOpen(true);
    };

    const handleGeneralRegistration = () => {
        if (selectedEventData?.category_menu?.length > 0) {
            // For custom events, use first category and first option
            const firstCategory = selectedEventData.category_menu[0];
            if (firstCategory?.option?.length > 0) {
                setSelectedMeal(firstCategory.option[0]);
                setModalOpen(true);
            }
        }
    };

    // Show skeleton while loading
    if (!isDataReady || !selectedEventData) {
        return <SingleReservationsSkeleton />;
    }
    return (
        <Fragment>
            <div className="w-full flex justify-center pt-10 pb-6 md:pb-20 border-t border-gray-200">
                <div className="w-full max-w-7xl px-4 md:px-0">
                    {/* Hero Section */}
                    <section className="mb-16">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                            <div className="md:w-[60%] mb-4 md:mb-0">
                                <div>
                                    <h1 className="text-3xl font-bold text-darkBlue md:max-w-[80%]">
                                        {`Registration for ${selectedEventData?.name || 'Event'}`}
                                    </h1>
                                </div>
                            </div>


                            <div className="hidden md:block">
                                <ButtonTheme title="Register Now" variation={2} onClick={handleGeneralRegistration} disableLink={true} />
                            </div>
                            <div className="flex w-full md:hidden mb-6">
                                <ButtonTheme title="Register Now" variation={2} onClick={handleGeneralRegistration} disableLink={true} isFull />
                            </div>
                        </div>
                        <div className="hidden md:flex justify-center md:justify-start items-center gap-4 mb-8">
                            {selectedEventData?.category_menu?.slice(0, 3).map((category, index) => (
                                <CategoryTag key={index} categoryTitle={category.category_name || `Category ${index + 1}`} />
                            ))}
                        </div>

                        <div className="w-full h-80 md:h-[500px] rounded-xl overflow-hidden relative">
                            <Image
                                fill
                                src={
                                    selectedEventData?.cover_picture?.url
                                        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${selectedEventData.cover_picture.url}`
                                        : getAssetPath("/assets/pictures/shabbat-meals/meals-single.jpg")
                                }
                                alt="picture-shabbat-meal"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </section>
                    {/* Main Content Section */}
                    <div className="flex flex-col lg:flex-row md:gap-12">
                        {/* Content Section */}
                        <div className="lg:w-[70%]">
                            <section className="">
                                {false ? (
                                    <>
                                        <h2 className="text-3xl font-bold text-darkBlue mb-6">
                                            Shabbat times:
                                        </h2>
                                        <div className="text-gray-text text-sm leading-relaxed space-y-4">
                                            {selectedEventData && (
                                                <>
                                                    {selectedEventData.event_description && (
                                                        <div className="border border-gray-200 p-4 rounded-2xl mb-4">
                                                            <h3 className="font-semibold text-myBlack text-base mb-2">
                                                                About this Shabbat
                                                            </h3>
                                                            <div className="text-gray-600">
                                                                <ReactMarkdown
                                                                    remarkPlugins={[remarkGfm]}
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
                                                                        br: () => <br className="mb-2" />,
                                                                        hr: () => <hr className="my-4 border-0 h-px bg-gray-300" />,
                                                                        table: ({ children }) => <div className="overflow-x-auto mb-4 border border-gray-300 rounded-lg"><table className="min-w-full border-separate border-spacing-0 bg-white rounded-lg shadow-sm overflow-hidden">{children}</table></div>,
                                                                        thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                                                                        tbody: ({ children }) => <tbody className="bg-white">{children}</tbody>,
                                                                        tr: ({ children }) => <tr>{children}</tr>,
                                                                        th: ({ children }) => <th className="px-4 py-3 text-left text-sm font-semibold text-darkBlue border-r border-gray-300 last:border-r-0 [tr:not(:last-child)_&]:border-b">{children}</th>,
                                                                        td: ({ children }) => <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300 last:border-r-0 [tr:not(:last-child)_&]:border-b">{children}</td>
                                                                    }}
                                                                >
                                                                    {selectedEventData.event_description}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="border border-gray-200 p-4 rounded-2xl">
                                                        <h3 className="font-semibold text-myBlack text-base mb-2">
                                                            Friday night – Friday {new Date(selectedEventData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                        </h3>
                                                        <ul>
                                                            {selectedEventData.fridayNight && Array.isArray(selectedEventData.fridayNight) && selectedEventData.fridayNight.map((event, index) => (
                                                                <li key={index}>
                                                                    <strong className="text-myBlack">{event.hora}</strong> {event.activity}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="border border-gray-200 p-4 rounded-2xl">
                                                        <h3 className="font-semibold text-myBlack text-base mb-2">
                                                            Shabbat day – Saturday {new Date(selectedEventData.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                        </h3>
                                                        <ul>
                                                            {selectedEventData.shabbatDay && Array.isArray(selectedEventData.shabbatDay) && selectedEventData.shabbatDay.map((event, index) => (
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
                                        <h2 className="text-2xl font-bold text-darkBlue mb-4">
                                            Event Details:
                                        </h2>
                                        <div className="text-gray-text text-sm leading-relaxed space-y-4">
                                            <div className="border border-gray-200 p-4 rounded-2xl p-6">
                                                <div className="text-gray-600">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
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
                                                            br: () => <br className="mb-2" />,
                                                            hr: () => <hr className="my-4 border-0 h-px bg-gray-300" />,
                                                            table: ({ children }) => <div className="overflow-x-auto mb-4 border border-gray-300 rounded-lg"><table className="min-w-full border-separate border-spacing-0 bg-white rounded-lg shadow-sm overflow-hidden">{children}</table></div>,
                                                            thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                                                            tbody: ({ children }) => <tbody className="bg-white">{children}</tbody>,
                                                            tr: ({ children }) => <tr>{children}</tr>,
                                                            th: ({ children }) => <th className="px-4 py-3 text-left text-sm font-semibold text-darkBlue border-r border-gray-300 last:border-r-0 [tr:not(:last-child)_&]:border-b">{children}</th>,
                                                            td: ({ children }) => <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300 last:border-r-0 [tr:not(:last-child)_&]:border-b">{children}</td>
                                                        }}
                                                    >
                                                        {selectedEventData?.event_description || "This is a custom event with various options available. Use the registration button to see all available options and select your preferences."}
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
                                            {selectedEventData?.name || "Error to fetch"}
                                        </h3>
                                        <p className="text-gray-text text-sm">
                                            {true ?
                                                `Reserve in advance to make sure everything’s ready for you.` :
                                                'Reserve in advance to make sure everything’s ready for you.'
                                            }
                                        </p>
                                        <ButtonTheme
                                            title={true ? `Register for ${selectedEventData?.name || 'Event'}` : "Register for Shabbat Meals"}
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
                    shabbatData={selectedEventData}
                    allMeals={selectedEventData?.category_menu?.flatMap(cat => cat.option) || []}
                    isCustomEvent={true}
                    eventType={selectedEventData?.event_type}
                    pwywSiteConfigData={selectedEventData?.pay_wy_want_custom_event === true}
                    globalDeliveryZones={globalDeliveryZones}
                    customDeliveryZones={selectedEventData?.custom_delivery_zones}
                    customDeliveryIsActive={selectedEventData?.custom_delivery_is_Active === true}
                    pickupAddress={pickupAddress}
                />
            </Suspense>
        </Fragment>
    );
}