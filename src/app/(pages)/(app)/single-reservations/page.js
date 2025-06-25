"use client"
import React, { Fragment, useState } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { CategoryTag } from "@/app/components/ui/common/categoryTag";
import { RestaurantsSection } from "@/app/components/sections/(Entries)/(restaurants)/restaurantsSection";
import { PopupReservations } from "@/app/components/sections/(Entries)/shabbatHolidays/popupReservations";



export default function SingleReservations() {


    const [modalOpen, setModalOpen] = useState(false)


    const handleModal = (vaule) => {
        setModalOpen(vaule)
    }


    const dataEntry = [];

    return (

        <Fragment>
            <div className="w-full flex justify-center py-20">
                <div className="w-full max-w-7xl px-6 md:px-0">
                    {/* Hero Section */}
                    <section className="mb-16 md:mb-24">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                            <div className="md:w-[60%]">
                                <h1 className="text-4xl font-bold text-darkBlue mb-6 md:max-w-[80%]">
                                    Registration for Shabbat and Holiday meals
                                </h1>
                            </div>
                            <ButtonTheme title="Register Now" variation={2} onClick={() => handleModal(true)} disableLink={true} />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <CategoryTag categoryTitle="Shabbat Meals" />
                            <CategoryTag categoryTitle="Kosher Foods" />
                        </div>
                        <div className="w-full h-80 md:h-[500px] rounded-xl bg-red-300 overflow-hidden">
                            {/* Replace with Next.js Image component */}
                            <div className="w-full h-full object-cover bg-red-300" />
                        </div>
                    </section>
                    {/* Main Content Section */}
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* About Section */}
                        <div className="lg:w-[70%]">
                            <section className="mb-12">
                                <h2 className="text-3xl font-bold text-darkBlue mb-6">
                                    SHABBOS MEALS TAKE OUT OPTION
                                </h2>
                                <div className="text-gray-text text-sm leading-relaxed space-y-4">
                                    <h3>Friday night – Friday 12/09/2025</h3>
                                    <p>
                                        Today's events will be held at <strong>CHABAD OF PANAMA CITY PTY</strong>,
                                        C. Gil Colunge 9a, Panamá, Provincia de Panamá, Panama •
                                        <a href="#">Navigate</a>
                                    </p>
                                    <ul>
                                        <li><strong>18:02</strong> Candle lighting time</li>
                                        <li><strong>19:00</strong> Kabbalat Shabbat and Maariv</li>
                                        <li><strong>19:30</strong> Friday night Dinner</li>
                                    </ul>

                                    <h3>Shabbat day – Saturday 13/09/2025</h3>
                                    <p>
                                        Today's events will be held at <strong>CHABAD OF PANAMA CITY PTY</strong>,
                                        C. Gil Colunge 9a, Panamá, Provincia de Panamá, Panama •
                                        <a href="#">Navigate</a>
                                    </p>
                                    <ul>
                                        <li><strong>09:00</strong> Chassidut lesson</li>
                                        <li><strong>10:00</strong> Shabbat morning prayer</li>
                                        <li><strong>12:00</strong> Shabbat Lunch</li>
                                        <li><strong>17:45</strong> Shabbat Mincha prayer</li>
                                        <li><strong>18:50</strong> Shabbat ends</li>
                                    </ul>

                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-[30%]">
                            <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">
                                <div className="space-y-6">
                                    <div className="w-12 h-12 bg-red-300 rounded-full"></div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold text-darkBlue">
                                            {dataEntry.title ? dataEntry.title : "Parashat Ki Tavo"}
                                        </h3>
                                        <p className="text-gray-text text-sm">
                                            Enjoy a warm stay near the Chabad House, with nearby kosher-friendly hotels and easy access to Shabbat services.
                                        </p>

                                        <ButtonTheme title="Register for Shabbat Meals" variation={2} onClick={() => handleModal(true)} disableLink={true} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RestaurantsSection />
            <PopupReservations isOpen={modalOpen} handleModal={handleModal} />


        </Fragment>
    );
};