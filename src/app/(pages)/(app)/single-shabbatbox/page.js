import React, { Fragment } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { CategoryTag } from "@/app/components/ui/common/categoryTag";
import { RestaurantsSection } from "@/app/components/sections/(Entries)/(restaurants)/restaurantsSection";

export default function SingleReservations() {

    const dataEntry = [];

    return (

        <Fragment>
            <div className="w-full flex justify-center pt-16 pb-10">
                <div className="w-full max-w-7xl px-6 md:px-0">
                    {/* Hero Section */}
                    <section className="mb-16 md:mb-24">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                            <div className="md:w-[60%]">
                                <h1 className="text-4xl font-bold text-darkBlue md:max-w-[80%]">
                                    Shabbos in a Box
                                    Order Your Shabbos Meals
                                </h1>
                            </div>
                            <ButtonTheme title="Order food for Shabbat" variation={2} />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <CategoryTag categoryTitle="Shabbat Box" />
                            <CategoryTag categoryTitle="Kosher Food" />
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
                                    <p>
                                        <strong className="text-primary">SHABBOS IN A BOX</strong> was created to make your kosher vacation easier and to enjoy freshly made kosher shabbat meals while visiting Panama.
                                    </p>

                                    <p>
                                        Whether your hotel is too far to walk to Chabad or you wish to have a cosy Shabbos meal in the comfort of your privacy, SHABBOS IN A BOX will surely exceed your expectations.
                                    </p>

                                    <p>
                                        Our food is freshly prepared by our devoted chef. It is beautifully packaged with all the warmth and love that Chabad knows to share.
                                    </p>

                                    <p>
                                        Orders can be placed until Tuesday 11:00am of that same week.
                                    </p>

                                    <p>
                                        This reservation form is made for particulars, if you are interested to order Shabbos catering for a group (12+ guests) please contact us and we will happily attend you.
                                    </p>

                                    <p>
                                        Looking forward to servicing
                                    </p>

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

                                        <ButtonTheme title="Register for Shabbat Meals" variation={2} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RestaurantsSection />
        </Fragment>
    );
};