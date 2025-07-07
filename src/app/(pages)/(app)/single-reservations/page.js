"use client"
import React, { Fragment, useState, useEffect, lazy, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { CategoryTag } from "@/app/components/ui/common/categoryTag";
import { RestaurantsSection } from "@/app/components/sections/(Entries)/(restaurants)/restaurantsSection";
import { getSortedShabbats, formatShabbatDate, pricesRegistrationShabbat } from "@/app/data/shabbatData";

// Lazy load the popup component for better performance
const PopupReservations = lazy(() => 
    import("@/app/components/sections/(Entries)/shabbatHolidays/popupReservations").then(module => ({
        default: module.PopupReservations
    }))
);



export default function SingleReservations() {

    const searchParams = useSearchParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedShabbatData, setSelectedShabbatData] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);

    // Get sorted Shabbats
    const sortedShabbats = getSortedShabbats();

    const handleModal = (value) => {
        setModalOpen(value);
    }


    useEffect(() => {
        const shabbatIndex = searchParams.get('shabbat');
        if (shabbatIndex !== null && sortedShabbats[shabbatIndex]) {
            setSelectedShabbatData(sortedShabbats[shabbatIndex]);
        }
    }, [searchParams, sortedShabbats]);

    const handleMealSelection = (meal) => {
        setSelectedMeal(meal);
        setModalOpen(true);
    };

    const handleGeneralRegistration = () => {
        setSelectedMeal(pricesRegistrationShabbat[0]);
        setModalOpen(true);
    };


    return (

        <Fragment>
            <div className="w-full flex justify-center mt-10  pb-6 md:pb-20">
                <div className="w-full max-w-7xl px-4 md:px-0">
                    {/* Hero Section */}
                    <section className="mb-16">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                            <div className="md:w-[60%] mb-4 md:mb-0">
                                <div>

                                    <h1 className="text-4xl font-bold text-darkBlue md:max-w-[80%]">
                                        Registration for Shabbat and Holiday meals
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
                            <CategoryTag categoryTitle="Shabbat Meals" />
                            <CategoryTag categoryTitle="Kosher Foods" />
                        </div>
                        <div className="w-full h-80 md:h-[500px] rounded-xl  overflow-hidden relative">
                            {/* Replace with Next.js Image component */}
                            <Image fill src="/assets/pictures/shabbat-meals/meals-single.jpg" alt="picture-shabbat-meal" className="w-full h-full object-cover" />
                        </div>
                    </section>




                    {/* Main Content Section */}
                    <div className="flex flex-col lg:flex-row md:gap-12">
                        {/* About Section */}
                        <div className="lg:w-[70%]">
                            <section className="mb-12">
                                <h2 className="text-3xl font-bold text-darkBlue mb-6">
                                    Shabbat times:
                                </h2>
                                <div className="text-gray-text text-sm leading-relaxed space-y-4">
                                    {selectedShabbatData && (
                                        <>

                                            <div className="border border-gray-200 p-4 rounded-2xl">
                                                <h3 className="font-semibold text-myBlack text-base mb-2">Friday night – Friday {new Date(selectedShabbatData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h3>
                                                <ul>
                                                    {selectedShabbatData.fridayNight?.map((event, index) => (
                                                        <li key={index}><strong className="text-myBlack">{event.hora}</strong> {event.activity}</li>
                                                    ))}
                                                </ul>

                                            </div>


                                            <div className="border border-gray-200 p-4 rounded-2xl">

                                                <h3 className="font-semibold text-myBlack text-base mb-2">Shabbat day – Saturday {new Date(selectedShabbatData.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h3>

                                                <ul>
                                                    {selectedShabbatData.shabbatDay?.map((event, index) => (
                                                        <li key={index}><strong className="text-myBlack">{event.hora}</strong> {event.activity}</li>
                                                    ))}

                                                </ul>
                                            </div>

                                        </>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-[30%]">
                            <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">
                                <div className="space-y-6">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full relative mb-4">
                                        <Image src="/assets/icons/restaurants/fork.svg" fill alt="shabbatbox" className="object-cover" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold text-darkBlue">
                                            {selectedShabbatData?.name || "Error to fetch"}
                                        </h3>
                                        <p className="text-gray-text text-sm">
                                            Enjoy a warm stay near the Chabad House, with nearby kosher-friendly hotels and easy access to Shabbat services.
                                        </p>

                                        <ButtonTheme title="Register for Shabbat Meals" variation={2} onClick={handleGeneralRegistration} disableLink={true} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RestaurantsSection />
            
            {/* Lazy loaded popup with suspense boundary */}
            <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div></div>}>
                <PopupReservations
                    isOpen={modalOpen}
                    handleModal={handleModal}
                    selectedMeal={selectedMeal}
                    shabbatData={selectedShabbatData}
                    allMeals={pricesRegistrationShabbat}
                />
            </Suspense>


        </Fragment>
    );
};