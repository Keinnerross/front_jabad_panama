"use client"
import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { NotificationPopup } from "@/app/components/ui/common/notificationPopup";
import Link from "next/link";
import { City } from "@/app/components/ui/illustrations/city";
import { CategoryTag } from "@/app/components/ui/common/categoryTag";
import { CardShabbatMeals } from "@/app/components/sections/(cards)/cardShabbatMeals";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { formatShabbatDate } from "@/app/utils/formatShabbatDate";
import { CandlesIcon } from "@/app/components/ui/icons/candlesIcon";
import { SunIcon } from "@/app/components/ui/icons/sunIcon";
import { AboutIcon } from "@/app/components/ui/icons/aboutIcon";
import { getAssetPath } from "@/app/utils/assetPath";

export default function ShabbatHolidaysSection({ aboutPicturesData, shabbatsAndHolidaysData, shabbatTimes, ShabbatHolidaysPage, popUpsData }) {

    const [selectedShabbat, setSelectedShabbat] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [nearestEvent, setNearestEvent] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredEvents, setFilteredEvents] = useState({ shabbatHoliday: [], custom: [] });
    const [showEventSelect, setShowEventSelect] = useState(false);

    // Get sorted Shabbats from API data
    const sortedShabbats = Array.isArray(shabbatsAndHolidaysData) ? shabbatsAndHolidaysData : [];

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Set client-side flag and calculate nearest event + filter events
    useEffect(() => {
        setIsClient(true);
        
        // Get nearest event (Shabbat or Holiday) - only on client
        const getNearestEvent = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const upcomingEvents = sortedShabbats.filter(event => {
                const eventStart = new Date(event.startDate);
                eventStart.setHours(0, 0, 0, 0);
                return eventStart >= today;
            });
            
            const nearestEvent = upcomingEvents.sort((a, b) => 
                new Date(a.startDate) - new Date(b.startDate)
            )[0];
            
            return nearestEvent;
        };

        // Filter and process events on client side to avoid hydration issues
        const processEvents = () => {
            const shabbatHolidayEvents = sortedShabbats.filter(event => 
                event.type_of_event === 'shabbat or holiday'
            );
            
            const customEvents = sortedShabbats.filter(event => {
                if (event.type_of_event !== 'custom') return false;
                
                // Check availability for custom events based on repeat_control
                if (!event.repeat_control) return true;
                
                const now = new Date();
                const currentHour = now.getHours();
                const currentDay = now.getDay(); // 0=Sunday, 1=Monday, etc.
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                
                const { repeat_mode, date, start_date, end_date, all_day, hour_start, hour_end, weekly_repeat } = event.repeat_control;
                
                // Handle different repeat modes
                switch (repeat_mode) {
                    case 'once':
                        if (!date) return true;
                        const eventDate = new Date(date + 'T00:00:00');
                        const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                        
                        // Check if event is today
                        if (today.getTime() !== eventDateOnly.getTime()) return false;
                        
                        // Debug logging for once
                        console.log('Once validation:', {
                            date, 
                            eventDateOnly: eventDateOnly.toDateString(),
                            today: today.toDateString(),
                            all_day, hour_start, hour_end,
                            currentHour
                        });
                        
                        // Check time if not all day
                        if (all_day) {
                            console.log('Once - all day event - available');
                            return true;
                        }
                        
                        if (hour_start && hour_end) {
                            const [startHour, startMin] = hour_start.split(':').map(Number);
                            const [endHour, endMin] = hour_end.split(':').map(Number);
                            const currentMinutes = currentHour * 60 + now.getMinutes();
                            const startMinutes = startHour * 60 + startMin;
                            const endMinutes = endHour * 60 + endMin;
                            
                            console.log('Once - time validation:', {
                                currentMinutes, startMinutes, endMinutes,
                                available: currentMinutes >= startMinutes && currentMinutes <= endMinutes
                            });
                            
                            return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
                        }
                        return true;
                        
                    case 'range':
                        if (!start_date || !end_date) return true;
                        const startDate = new Date(start_date + 'T00:00:00');
                        const endDate = new Date(end_date + 'T00:00:00');
                        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                        
                        // Debug logging
                        console.log('Range validation:', {
                            start_date, end_date, 
                            startDateOnly: startDateOnly.toDateString(),
                            endDateOnly: endDateOnly.toDateString(),
                            today: today.toDateString(),
                            all_day, hour_start, hour_end
                        });
                        
                        // Check if today is within range
                        if (today < startDateOnly || today > endDateOnly) {
                            console.log('Date out of range');
                            return false;
                        }
                        
                        // Check time if not all day
                        if (all_day) {
                            console.log('All day event - available');
                            return true;
                        }
                        
                        if (hour_start && hour_end) {
                            const [startHour, startMin] = hour_start.split(':').map(Number);
                            const [endHour, endMin] = hour_end.split(':').map(Number);
                            const currentMinutes = currentHour * 60 + now.getMinutes();
                            const startMinutes = startHour * 60 + startMin;
                            const endMinutes = endHour * 60 + endMin;
                            
                            console.log('Time validation:', {
                                currentMinutes, startMinutes, endMinutes,
                                available: currentMinutes >= startMinutes && currentMinutes <= endMinutes
                            });
                            
                            return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
                        }
                        return true;
                        
                    case 'weekly':
                        if (!weekly_repeat) return true;
                        
                        // Map current day to day name
                        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        const currentDayName = dayNames[currentDay];
                        
                        // Check if current day is enabled
                        if (!weekly_repeat[currentDayName]) return false;
                        
                        // Check time for specific day
                        const dayAllDay = weekly_repeat[`${currentDayName.toLowerCase()}_all_day`];
                        if (!dayAllDay) {
                            const dayStart = weekly_repeat[`${currentDayName.toLowerCase()}_hour_start`];
                            const dayEnd = weekly_repeat[`${currentDayName.toLowerCase()}_hour_end`];
                            
                            if (dayStart && dayEnd) {
                                const [startHour, startMin] = dayStart.split(':').map(Number);
                                const [endHour, endMin] = dayEnd.split(':').map(Number);
                                const currentMinutes = currentHour * 60 + now.getMinutes();
                                const startMinutes = startHour * 60 + startMin;
                                const endMinutes = endHour * 60 + endMin;
                                
                                return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
                            }
                        }
                        return true;
                        
                    default:
                        return true;
                }
            });
            
            return { shabbatHoliday: shabbatHolidayEvents, custom: customEvents };
        };

        const events = processEvents();
        setNearestEvent(getNearestEvent());
        setFilteredEvents(events);
        
        // If no custom events available, auto-select shabbat-holidays
        if (events.custom.length === 0 && !selectedCategory) {
            setSelectedCategory('shabbat-holidays');
        }
    }, [sortedShabbats]);






    const heroImages = aboutPicturesData.imageUrls;
    const picutreUrlShabbatBox = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${ShabbatHolidaysPage.shabbat_box_section.picture.url} `



    // Get current or next Shabbat data for display
    const currentShabbat = (Array.isArray(sortedShabbats) ? sortedShabbats : []).find(shabbat => {
        const today = new Date();
        const shabbatStart = new Date(shabbat.startDate);
        return shabbatStart >= today;
    }) || (Array.isArray(sortedShabbats) ? sortedShabbats[0] : null);

    // console.log('currentShabbat:', currentShabbat);
    // console.log('sortedShabbats length:', sortedShabbats.length);

    // Format event date in the requested format: (dd-dd/mm/yyyy)
    const formatEventDate = (event) => {
        if (!event || !event.startDate || !event.endDate) return '';
        
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        
        const startDay = startDate.getDate().toString().padStart(2, '0');
        const endDay = endDate.getDate().toString().padStart(2, '0');
        const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
        const year = startDate.getFullYear();
        
        return `(${startDay}-${endDay}/${month}/${year})`;
    };

    const dataCardsHero = [
        {
            title: "Shabbat begins",
            icon: CandlesIcon,
            href: "/restaurants",
            hour: shabbatTimes?.candleLighting || "18:20",
        },
        {
            title: "Shabbat ends",
            icon: SunIcon,
            href: "/tourist-info",
            hour: shabbatTimes?.havdalah || "19:12",
        },
    ];
    return (
        <Fragment>

            <section className="w-full bg-blueBackground py-20 px-6 md:px-8 lg:px-12 relative pb-28 ">
                <div className="max-w-[90vw] mx-auto">
                    {/* Grid Layout for Images and Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* Left Image Grid */}
                        <div className="hidden md:flex flex-col gap-6">
                            <div className="flex gap-6">
                                <div className="w-48 h-48 md:w-52 md:h-52 rounded-lg overflow-hidden relative">
                                    <Image
                                        src={heroImages[0]}
                                        alt="ShabbatBox in Shabbat"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="w-48 h-48 md:w-52 md:h-52 rounded-lg overflow-hidden relative">
                                    <Image
                                        src={heroImages[1]}
                                        alt="ShabbatBox in Shabbat"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-6 justify-end">
                                <div className="w-48 h-48 md:w-52 md:h-52 rounded-lg overflow-hidden relative">
                                    <Image
                                        src={heroImages[2]}
                                        alt="ShabbatBox in Shabbat"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="w-48 h-48 md:w-52 md:h-52 rounded-lg overflow-hidden relative">
                                    <Image
                                        src={heroImages[3]}
                                        alt="ShabbatBox in Shabbat"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Center Content */}
                        <div className="lg:col-span-1 text-center space-y-6">
                            <h2 className="text-5xl font-bold text-darkBlue leading-tight">
                                {ShabbatHolidaysPage.title_main || "Title Section Shabbat and Holidays"}
                            </h2>
                            <p className="text-gray-text  text-base  leading-relaxed max-w-2xl mx-auto">
                                {ShabbatHolidaysPage.description_main || "description section Shabbat and Holidays"}
                            </p>


                            {ShabbatHolidaysPage.show_nearest_event && isClient && nearestEvent && (
                                <div className="text-center mb-2">
                                    <h3 className="text-xl font-bold text-myBlack">
                                        {nearestEvent.name || 'Upcoming Event'}
                                    </h3>
                                    <p className="text-base text-gray-text mt-1">
                                        {formatEventDate(nearestEvent)}
                                    </p>
                                </div>
                            )}


                        </div>

                        {/* Right Image Grid */}
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-6 justify-end">
                                <div className="w-48 h-48 md:w-52 md:h-52 rounded-lg overflow-hidden relative">
                                    <Image
                                        src={heroImages[4]}
                                        alt="ShabbatBox in Shabbat"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="w-48 h-48 md:w-52 md:h-52 rounded-lg overflow-hidden relative">
                                    <Image
                                        src={heroImages[5]}
                                        alt="ShabbatBox in Shabbat"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-48 h-48 md:w-52 md:h-52 rounded-lg overflow-hidden relative">
                                    <Image
                                        src={heroImages[6]}
                                        alt="ShabbatBox in Shabbat"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="w-48 h-48 md:w-52 md:h-52 rounded-lg overflow-hidden relative">
                                    <Image
                                        src={heroImages[7]}
                                        alt="ShabbatBox in Shabbat"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="md:absolute md:-bottom-[80px] flex flex-col md:flex-row gap-10 z-20 md:left-1/2 md:-translate-x-1/2 mt-10 md:mt-0">
                    {(dataCardsHero || []).map((dataCard, i) => (
                        <div key={i}>
                            <CardShabbatMeals data={dataCard} />
                        </div>
                    ))}
                </div>


            </section>

            <section className="w-full flex justify-center items-center bg-white py-0 md:pt-48 md:pb-20 px-6 ">
                <div className="w-full bg-darkBlue max-w-7xl mx-auto  rounded-2xl relative overflow-hidden -translate-y-10">
                    <div className="flex flex-col lg:flex-row gap-8 md:gap-12 z-10 relative px-8 md:px-20 py-10 md:py-32">
                        {/* Left Content Section */}
                        <div className="lg:w-1/2 flex flex-col gap-6 text-white">
                            {/* Logo/Icon */}
                            <div className="w-20 h-20  bg-primary/10 rounded-full flex justify-center items-center" >

                                <div className="rounded-full  w-16 h-16 relative">
                                    <AboutIcon />
                                </div>
                            </div>

                            {/* Heading */}
                            <h2 className="text-3xl font-bold leading-tight">
                                {ShabbatHolidaysPage.register_for_meal_section?.title || "Title Register for Shabbat and Holidays"}
                            </h2>

                            {/* Description */}
                            <p className="text-blueBackground text-base ">
                                {ShabbatHolidaysPage.register_for_meal_section?.description || "Description Register for Shabbat and Holidays"}

                            </p>

                            {/* Features List */}
                            <div className="mt-4">
                                <h3 className="text-lg font-bold mb-4">What's included?</h3>
                                <ul className="space-y-4">
                                    {ShabbatHolidaysPage.register_for_meal_section?.item_included.map((item, i) => (

                                        <li className="flex items-start gap-3" key={i}>
                                            <div className="bg-primary rounded-full w-6 h-6 min-w-6 min-h-6 flex justify-center items-center flex-shrink-0">
                                                <FaCheck className="text-white text-sm flex-shrink-0" />
                                            </div>
                                            <span className="text-blueBackground font-medium">{item.text}</span>
                                        </li>
                                    ))}


                                </ul>
                            </div>
                        </div>

                        {/* Right Form Section */}
                        <div className="lg:w-1/2 bg-white rounded-xl border border-gray-200 shadow-md p-6 md:p-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-darkBlue mb-8">
                                {ShabbatHolidaysPage.register_for_meal_section.title_form || "Title Form Register for Shabbat and Holidays"}
                            </h3>

                            {/* Category Selector - only show if there are custom events */}
                            {!showEventSelect && isClient && filteredEvents.custom.length > 0 && (
                                <div className="mb-8">
                                    <div className="relative cursor-pointer">
                                        <select
                                            className="w-full p-4 border border-gray-text rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                                            value={selectedCategory}
                                            onChange={(e) => {
                                                setSelectedCategory(e.target.value);
                                                setSelectedShabbat('');
                                            }}
                                        >
                                            <option value="">For which date would you like to register?</option>
                                            <option value="shabbat-holidays">Shabbat and Holidays</option>
                                            {filteredEvents.custom.map((event, index) => (
                                                <option key={event.id || index} value={`custom-${event.id}`}>
                                                    {event.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute top-1 inset-y-0 right-4 flex items-center pointer-events-none cursor-pointer bg-white h-[90%]">
                                            <MdKeyboardArrowDown className="text-xl" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Event Date Selector */}
                            {((showEventSelect && selectedCategory === 'shabbat-holidays') || (selectedCategory === 'shabbat-holidays' && filteredEvents.custom.length === 0)) && (
                                <div className="mb-8">
                                    <div className="relative cursor-pointer">
                                        <select
                                            className="w-full p-4 border border-gray-text rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                                            value={selectedShabbat}
                                            onChange={(e) => setSelectedShabbat(e.target.value)}
                                        >
                                            <option value="">Select a Shabbat date</option>
                                            {isClient && filteredEvents.shabbatHoliday
                                                .filter(event => new Date(event.startDate) >= new Date())
                                                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                                                .map((event, index) => (
                                                    <option key={event.id || index} value={event.id}>
                                                        {event.name} ({formatShabbatDate(event)})
                                                    </option>
                                                ))}
                                        </select>
                                        <div className="absolute top-1 inset-y-0 right-4 flex items-center pointer-events-none cursor-pointer bg-white h-[90%]">
                                            <MdKeyboardArrowDown className="text-xl" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                {/* Back Button */}
                                {showEventSelect && (
                                    <button
                                        onClick={() => {
                                            setShowEventSelect(false);
                                            setSelectedShabbat('');
                                        }}
                                        className="w-full sm:w-auto px-8 py-4 border-2 border-gray-400 font-medium rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                                    >
                                        Back
                                    </button>
                                )}
                                
                                {/* Main Action Button */}
                                {selectedCategory && selectedCategory.startsWith('custom-') ? (
                                    <Link
                                        href={`/single-reservations?shabbat=${selectedCategory.replace('custom-', '')}`}
                                        className="w-full sm:w-auto px-8 py-4 border-2 border-darkBlue font-medium rounded-lg transition-colors duration-200 text-darkBlue hover:bg-blueBackground cursor-pointer"
                                    >
                                        Register
                                    </Link>
                                ) : (showEventSelect && selectedShabbat) || (selectedCategory === 'shabbat-holidays' && filteredEvents.custom.length === 0 && selectedShabbat) ? (
                                    <Link
                                        href={`/single-reservations?shabbat=${selectedShabbat}`}
                                        className="w-full sm:w-auto px-8 py-4 border-2 border-darkBlue font-medium rounded-lg transition-colors duration-200 text-darkBlue hover:bg-blueBackground cursor-pointer"
                                    >
                                        Register
                                    </Link>
                                ) : selectedCategory === 'shabbat-holidays' && !showEventSelect && filteredEvents.custom.length > 0 && filteredEvents.shabbatHoliday.length > 0 ? (
                                    <button
                                        onClick={() => setShowEventSelect(true)}
                                        className="w-full sm:w-auto px-8 py-4 border-2 border-darkBlue font-medium rounded-lg transition-colors duration-200 text-darkBlue hover:bg-blueBackground cursor-pointer"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        className="w-full sm:w-auto px-8 py-4 border-2 border-gray-400 font-medium rounded-lg transition-colors duration-200 text-gray-400 cursor-not-allowed"
                                        disabled
                                    >
                                        Register
                                    </button>
                                )}
                            </div>

                            {/* Footer Note */}
                            <p className="mt-10 text-base text-gray-text ">
                                Registration is quick and easy in a few simple steps
                            </p>

                            {/* Legal Text */}
                            <p className="mt-6 text-base text-gray-500">
                                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 transform ">
                        <City />
                    </div>
                </div>
            </section>


            <section id="shabbatBox" className="w-full pb-12 md:pb-20 px-6 sm:px-6 lg:px-8 bg-white flex justify-center ">
                <div className="max-w-7xl w-full">
                    {/* Header Section */}
                    <div className="w-full text-center mb-12 md:mb-16 flex items-center flex-col ">

                        <h2 className=" text-4xl font-bold text-darkBlue mb-4 leading-tight md:w-[50%]">
                            {ShabbatHolidaysPage.title_secundary || "Title Secundary section Shabbat and Holidays"}

                        </h2>
                        <p className="text-gray-text text-base md:text-lg max-w-2xl mx-auto">
                            {ShabbatHolidaysPage.description_secundary || "Description Secundary section Shabbat and Holidays"}

                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6 overflow-hidden  rounded-2xl border border-gray-200">

                        {/* Image Section */}
                        <div className="lg:col-span-1 h-64 md:h-96 lg:h-[536px] overflow-hidden relative">
                            <Image src={picutreUrlShabbatBox || getAssetPath("/assets/pictures/shabbat-meals/shabbatbox-single.png")} alt="shabbat box" fill className="w-full h-full object-cover" />
                        </div>

                        {/* Content Section */}
                        <div className="lg:col-span-1 bg-white p-6 md:p-8 lg:p-12 ">
                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-3 mb-6">

                                {ShabbatHolidaysPage?.shabbat_box_section?.tags?.map((tag, i) => (
                                    <div key={i}>
                                        <CategoryTag categoryTitle={tag.tag_name || "tag"} />
                                    </div>
                                ))}
                            </div>

                            {/* Main Content */}
                            <div className="space-y-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-darkBlue leading-tight">
                                    {ShabbatHolidaysPage?.shabbat_box_section.title || "Title"}
                                </h3>
                                <p className="text-gray-text text-base  leading-relaxed">
                                    {ShabbatHolidaysPage?.shabbat_box_section.description || "Description"}

                                </p>
                                <ButtonTheme title={ShabbatHolidaysPage.shabbat_box_section.button_text || "Text Button"} href="/single-shabbatbox" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {popUpsData
                ?.filter(item => item.location === "shabbat-holidays")
                .map((item, i) => {
                    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${item.picture.url}`;
                    
                    return (
                        <NotificationPopup
                            key={item.id || i}
                            show={showPopup}
                            onClose={() => setShowPopup(false)}
                            title={item.title || "Title Popup"}
                            tag={item.tag || "Delivery"}
                            description={item.description || "Description Popup"}
                            buttonText={item.button_text || "Text Button Popup"}
                            buttonHref={item.button_url || "#"}
                            backgroundImage={url || getAssetPath("/assets/pictures/poppup-shabbatbox/pic.jpg")}
                        />
                    );
                })
            }
        </Fragment>
    );
};