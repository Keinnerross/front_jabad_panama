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
import { getShabbatTimesForDate } from "@/app/services/shabbatTimesApi";
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

export default function SingleReservationsSection({ shabbatsAndHolidaysData, restaurantsData, shabbatsRegisterPricesData, upcomingShabbatEvents, pageData, pwywSiteConfigData }) {

    // Use API data instead of static data
    const pricesRegistrationShabbat = shabbatsRegisterPricesData || [];
    const searchParams = useSearchParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedShabbatData, setSelectedShabbatData] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [isCustomEvent, setIsCustomEvent] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);
    const [shabbatTimes, setShabbatTimes] = useState(null);

    // Get sorted Shabbats from API data  
    const sortedShabbats = shabbatsAndHolidaysData || [];


    const handleModal = (value) => {
        setModalOpen(value);
    }

    useEffect(() => {
        const eventId = searchParams.get('event') || searchParams.get('shabbat'); // Support both params for backward compatibility

        // Exit early if no ID
        if (!eventId) {
            setIsDataReady(true);
            return;
        }

        // First, try to find in Hebcal events
        if (upcomingShabbatEvents && upcomingShabbatEvents.length > 0) {
            const hebcalEvent = upcomingShabbatEvents.find(event => event.id === eventId);
            if (hebcalEvent) {
                // Calculate correct end date (Shabbat ends on Saturday)
                const startDate = new Date(hebcalEvent.date);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 1); // Add one day for Shabbat end
                
                // Convert Hebcal event to expected format
                setSelectedShabbatData({
                    id: hebcalEvent.id,
                    name: hebcalEvent.title,
                    hebrew_name: hebcalEvent.hebrew,
                    startDate: hebcalEvent.date,
                    endDate: endDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                    formattedDate: hebcalEvent.formattedDate,
                    displayDate: hebcalEvent.formattedDate, // Keep the original formatted date
                    type_of_event: 'shabbat or holiday',
                    category_menu: [],
                    description: `Join us for ${hebcalEvent.title} on ${hebcalEvent.formattedDate}`,
                    leyning: hebcalEvent.leyning,
                    hdate: hebcalEvent.hdate
                });
                setIsCustomEvent(false);
                
                // Fetch specific Shabbat info for this event's date
                getShabbatTimesForDate(hebcalEvent.date).then(times => {
                    setShabbatTimes(times);
                    setIsDataReady(true);
                });
                return;
            }
        }

        // If not found in Hebcal, try Strapi data (for backward compatibility)
        if (sortedShabbats.length > 0) {
            const selectedEvent = sortedShabbats.find(event => event.id.toString() === eventId);
            if (selectedEvent && selectedEvent.id !== selectedShabbatData?.id) {
                setSelectedShabbatData(selectedEvent);
                // Custom Events tienen event_type (reservation/delivery), NO type_of_event
                // Si tiene event_type, es un Custom Event
                setIsCustomEvent(!!selectedEvent.event_type);
                
                // Si es un evento de Shabbat/Holiday (no custom), obtener info de Shabbat
                if (selectedEvent.type_of_event === 'shabbat or holiday' && selectedEvent.startDate) {
                    getShabbatTimesForDate(selectedEvent.startDate).then(times => {
                        setShabbatTimes(times);
                    });
                }
            }
        }

        // Mark data as ready
        setIsDataReady(true);
    }, [searchParams.get('event'), searchParams.get('shabbat'), sortedShabbats.length, upcomingShabbatEvents]); // More specific dependencies

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

    // Show skeleton while loading
    if (!isDataReady || !selectedShabbatData) {
        return <SingleReservationsSkeleton />;
    }
    return (
        <Fragment>
            <div className="w-full flex justify-center pt-10 pb-6 md:pb-20 border-t border-gray-200">
                <div className="w-full max-w-7xl px-4 md:px-0">
                    {/* Hero Section */}
                    <section className="mb-16">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                            <div className="md:w-[60%] mb-4 md:mb-0">
                                <div>
                                    <h1 className="text-4xl font-bold text-darkBlue md:max-w-[80%]">
                                        {isCustomEvent
                                            ? (selectedShabbatData?.event_type === 'delivery'
                                                ? `${selectedShabbatData?.name || 'Custom Event'} Order`
                                                : `Registration for ${selectedShabbatData?.name || 'Custom Event'}`)
                                            : (selectedShabbatData
                                                ? `Registration for ${selectedShabbatData.name || selectedShabbatData.title}`
                                                : 'Registration for Shabbat and Holiday meals')}
                                    </h1>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <ButtonTheme title={isCustomEvent && selectedShabbatData?.event_type === 'delivery' ? "Order Now" : "Register Now"} variation={2} onClick={handleGeneralRegistration} disableLink={true} />
                            </div>
                            <div className="flex w-full md:hidden">
                                <ButtonTheme title={isCustomEvent && selectedShabbatData?.event_type === 'delivery' ? "Order Now" : "Register Now"} variation={2} onClick={handleGeneralRegistration} disableLink={true} isFull />
                            </div>
                        </div>
                        

                        <div className="w-full h-80 md:h-[500px] rounded-xl overflow-hidden relative">
                            <Image
                                fill
                                src={
                                    pageData?.main_picture?.url
                                        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.main_picture.url}`
                                        : (isCustomEvent && selectedShabbatData?.cover_picture?.url
                                            ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${selectedShabbatData.cover_picture.url}`
                                            : getAssetPath("/assets/pictures/shabbat-meals/meals-single.jpg"))
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
                                            Service Information:
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

                                                    {pageData?.shabbat_description_hours_and_activities?.trim() ? (
                                                        <div className="border border-gray-200 p-4 rounded-2xl">
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
                                                                {pageData.shabbat_description_hours_and_activities}
                                                            </ReactMarkdown>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {/* Friday Night Section - Solo mostrar si hay datos */}
                                                            {(shabbatTimes?.candleLighting || shabbatTimes?.parashat || shabbatTimes?.torah || shabbatTimes?.hdate ||
                                                              (selectedShabbatData.fridayNight && selectedShabbatData.fridayNight.length > 0)) && (
                                                                <div className="border border-gray-200 p-4 rounded-2xl">
                                                                    <h3 className="font-semibold text-myBlack text-base mb-2">
                                                                        Friday night – Friday {new Date(selectedShabbatData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                                    </h3>
                                                                    <ul className="space-y-2">
                                                                        {shabbatTimes?.candleLighting && (
                                                                            <li>
                                                                                <strong className="text-myBlack">Candle Lighting:</strong> {shabbatTimes.candleLighting}
                                                                            </li>
                                                                        )}
                                                                        {shabbatTimes?.parashat && (
                                                                            <li>
                                                                                <strong className="text-myBlack">Torah Portion:</strong> {shabbatTimes.parashat}
                                                                                {shabbatTimes.hebrew && (
                                                                                    <span className="text-gray-500 ml-2">({shabbatTimes.hebrew})</span>
                                                                                )}
                                                                            </li>
                                                                        )}
                                                                        {shabbatTimes?.torah && (
                                                                            <li>
                                                                                <strong className="text-myBlack">Torah Reading:</strong> {shabbatTimes.torah}
                                                                            </li>
                                                                        )}
                                                                        {shabbatTimes?.hdate && (
                                                                            <li>
                                                                                <strong className="text-myBlack">Hebrew Date:</strong> {shabbatTimes.hdate}
                                                                            </li>
                                                                        )}
                                                                        {selectedShabbatData.fridayNight && Array.isArray(selectedShabbatData.fridayNight) &&
                                                                         selectedShabbatData.fridayNight.map((event, index) => (
                                                                            <li key={index}>
                                                                                <strong className="text-myBlack">{event.hora}</strong> {event.activity}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {/* Shabbat Day Section - Solo mostrar si hay datos */}
                                                            {(shabbatTimes?.haftarah || shabbatTimes?.maftir || shabbatTimes?.mevarchim || shabbatTimes?.havdalah ||
                                                              (selectedShabbatData.shabbatDay && selectedShabbatData.shabbatDay.length > 0)) && (
                                                                <div className="border border-gray-200 p-4 rounded-2xl">
                                                                    <h3 className="font-semibold text-myBlack text-base mb-2">
                                                                        Shabbat day – Saturday {new Date(selectedShabbatData.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                                    </h3>
                                                                    <ul className="space-y-2">
                                                                        {shabbatTimes?.haftarah && (
                                                                            <li>
                                                                                <strong className="text-myBlack">Haftarah:</strong> {shabbatTimes.haftarah}
                                                                            </li>
                                                                        )}
                                                                        {shabbatTimes?.maftir && (
                                                                            <li>
                                                                                <strong className="text-myBlack">Maftir:</strong> {shabbatTimes.maftir}
                                                                            </li>
                                                                        )}
                                                                        {shabbatTimes?.mevarchim && (
                                                                            <li>
                                                                                <strong className="text-myBlack">Special:</strong> {shabbatTimes.mevarchim}
                                                                                {shabbatTimes.molad && (
                                                                                    <div className="text-gray-500 text-sm mt-1">{shabbatTimes.molad}</div>
                                                                                )}
                                                                            </li>
                                                                        )}
                                                                        {shabbatTimes?.havdalah && (
                                                                            <li>
                                                                                <strong className="text-myBlack">Havdalah:</strong> {shabbatTimes.havdalah}
                                                                            </li>
                                                                        )}
                                                                        {selectedShabbatData.shabbatDay && Array.isArray(selectedShabbatData.shabbatDay) &&
                                                                         selectedShabbatData.shabbatDay.map((event, index) => (
                                                                            <li key={index}>
                                                                                <strong className="text-myBlack">{event.hora}</strong> {event.activity}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
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
                                            {pageData?.description_sidebar ||
                                                (isCustomEvent ?
                                                    (selectedShabbatData?.event_type === 'delivery'
                                                        ? `Order from ${selectedShabbatData?.name || 'this special event'}. Place your order in advance and enjoy a unique experience with our community.`
                                                        : `Join us for ${selectedShabbatData?.name || 'this special event'}. Register in advance to secure your spot and enjoy a unique experience with our community.`)
                                                    : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Join us for a meaningful Shabbat or holiday experience by registering in advance for our communal meals.')
                                            }
                                        </p>
                                        <ButtonTheme
                                            title={pageData?.text_button_sidebar || (isCustomEvent && selectedShabbatData?.event_type === 'delivery' ? "Order now!" : "Register now!")}
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

            {pageData?.show_restaurants_sections && (
                <RestaurantsSection restaurantsData={restaurantsData} />
            )}

            {/* Lazy loaded popup with suspense boundary */}
            <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div></div>}>
                <PopupReservations
                    isOpen={modalOpen}
                    handleModal={handleModal}
                    selectedMeal={selectedMeal}
                    shabbatData={selectedShabbatData}
                    allMeals={isCustomEvent ? (selectedShabbatData?.category_menu?.flatMap(cat => cat.option) || []) : pricesRegistrationShabbat}
                    isCustomEvent={isCustomEvent}
                    enableLocalPricing={pageData?.enable_local_pricing || false}
                    pwywSiteConfigData={
                        isCustomEvent
                            ? (selectedShabbatData?.pay_wy_want_custom_event === true)
                            : (pwywSiteConfigData?.pay_wy_want_reservations === true)
                    }
                />
            </Suspense>
        </Fragment>
    );
}