import React, { Fragment } from "react";
import Image from "next/image";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { CardHero } from "@/app/components/sections/(cards)/cardHero";
import { City } from "@/app/components/ui/illustrations/city";
import { FaUtensils, FaTruck } from "react-icons/fa";
import { CategoryTag } from "@/app/components/ui/common/categoryTag";

export default function ShabbatAndHolidays() {

    const picturesSize = "200px";
    const picturesGap = "6"

    return (

        <Fragment>

            <section className="w-full bg-blueBackground py-20 px-4 md:px-8 lg:px-12 relative pb-28">
                <div className="max-w-[90vw] mx-auto">
                    {/* Grid Layout for Images and Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* Left Image Grid */}

                        <div className="flex flex-col gap-6">
                            <div className="flex gap-6">
                                <div className={`w-[${picturesSize}] h-[${picturesSize}] bg-red-300 rounded-lg aspect-square`} />
                                <div className={`w-[${picturesSize}] h-[${picturesSize}] bg-red-300 rounded-lg aspect-square`} />
                            </div>
                            <div className="flex gap-6 justify-end">
                                <div className={`w-[${picturesSize}] h-[${picturesSize}] bg-red-300 rounded-lg aspect-square`} />
                                <div className={`w-[${picturesSize}] h-[${picturesSize}] bg-red-300 rounded-lg aspect-square`} />
                            </div>
                        </div>

                        {/* Center Content */}
                        <div className="lg:col-span-1 text-center space-y-6">
                            <h2 className="text-4xl font-bold text-darkBlue leading-tight">
                                Shabbat and Holiday in Panama City
                            </h2>
                            <p className="text-gray-text  text-base  leading-relaxed max-w-2xl mx-auto">
                                Celebrate Shabbat and Jewish holidays in Panama with comfort,
                                connection, and community. From meaningful services to delicious
                                kosher meals and family-friendly experiences, we help make your
                                stay spiritually enriching and unforgettable.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <ButtonTheme title="Register for Shabbat" variation={2} />
                                <ButtonTheme title="About Shabbat Box" />
                            </div>
                        </div>

                        {/* Right Image Grid */}
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-6 justify-end">
                                <div className={`w-[${picturesSize}] h-[${picturesSize}] bg-red-300 rounded-lg aspect-square`} />
                                <div className={`w-[${picturesSize}] h-[${picturesSize}] bg-red-300 rounded-lg aspect-square`} />
                            </div>
                            <div className="flex gap-6 ">
                                <div className={`w-[${picturesSize}] h-[${picturesSize}] bg-red-300 rounded-lg aspect-square`} />
                                <div className={`w-[${picturesSize}] h-[${picturesSize}] bg-red-300 rounded-lg aspect-square`} />
                            </div>
                        </div>

                    </div>
                </div>


                <div className="absolute -bottom-[80px] flex gap-10 z-20 left-1/2 -translate-x-1/2">
                    <CardHero />
                    <CardHero />
                </div>


            </section>

            <section className="w-full flex justify-center items-center bg-white py-32">
                <div className="w-full bg-darkBlue max-w-6xl mx-auto  rounded-2xl relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row gap-8 md:gap-12 z-10 relative px-20 py-32">
                        {/* Left Content Section */}
                        <div className="lg:w-1/2 flex flex-col gap-6 text-white">
                            {/* Logo/Icon */}
                            <div className="w-16 h-16 bg-blueBackground rounded-full flex items-center justify-center">
                                <div className="w-8 h-12 bg-red-300" /> {/* Replace with actual icon */}
                            </div>

                            {/* Heading */}
                            <h2 className="text-3xl font-bold leading-tight">
                                Registration for Shabbat and Holiday Meals
                            </h2>

                            {/* Description */}
                            <p className="text-blueBackground text-base ">
                                Experience the warmth of Shabbat and Jewish holidays in Panama City by registering in advance with our <span className="font-bold">Chabad House.</span>
                            </p>

                            {/* Features List */}
                            <div className="mt-4">
                                <h3 className="text-lg font-bold mb-4">What's included?</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-red-300 mt-0.5" /> {/* Icon */}
                                        <span className="text-blueBackground font-medium">Inspiring services & divrei Torah</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-red-300 mt-0.5" /> {/* Icon */}
                                        <span className="text-blueBackground font-medium">Traditional meals shared in community</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-red-300 mt-0.5" /> {/* Icon */}
                                        <span className="text-blueBackground font-medium">A sense of belonging wherever you come from</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Form Section */}
                        <div className="lg:w-1/2 bg-white rounded-xl border border-gray-200 shadow-md p-6 md:p-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-darkBlue mb-8">
                                For which date would you like to register?
                            </h3>

                            {/* Date Selector */}
                            <div className="mb-8">
                                <div className="relative">
                                    <select className="w-full p-4 border border-gray-text rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                        <option>Parashat Beha'alotcha (13-14/06/2025)</option>
                                        <option>Parashat Beha'alotcha (13-14/06/2025)</option>
                                        <option>Parashat Beha'alotcha (13-14/06/2025)</option>
                                        <option>Parashat Beha'alotcha (13-14/06/2025)</option>
                                        <option>Parashat Beha'alotcha (13-14/06/2025)</option>
                                        {/* Add more options dynamically */}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                        <div className="w-4 h-4 bg-red-300" /> {/* Dropdown icon */}
                                    </div>
                                </div>
                            </div>

                            {/* Register Button */}
                            <button className="w-full sm:w-auto px-8 py-4 border-2 border-darkBlue text-darkBlue font-medium rounded-lg hover:bg-blueBackground transition-colors duration-200">
                                Register
                            </button>

                            {/* Footer Note */}
                            <p className="mt-8 text-xs text-gray-text text-center">
                                Registration is quick and easy in a few simple steps
                            </p>

                            {/* Legal Text */}
                            <p className="mt-6 text-[10px] text-gray-500">
                                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 transform ">
                        <City />
                    </div>
                </div>
            </section>



            <section className="w-full pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 bg-white flex justify-center ">
                <div className="max-w-7xl w-full">
                    {/* Header Section */}
                    <div className="w-full text-center mb-12 md:mb-16 flex items-center flex-col ">

                        <h2 className=" text-4xl font-bold text-darkBlue mb-4 leading-tight w-[50%]">
                            Kosher food for Shabbat and Holiday in Panama City
                        </h2>
                        <p className="text-gray-text text-base md:text-lg max-w-2xl mx-auto">
                            Lorem ipsum dolor sit amet, consectetur adipiscing eli pulvinar enim
                            vestibulum aliquet eros non faucibus suspendisse sit venenatis arcu.
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6 overflow-hidden  rounded-2xl border border-gray-200">

                        {/* Image Section */}
                        <div className="lg:col-span-1 h-64 md:h-96 lg:h-[536px] bg-red-300 relative">
                            {/* Replace with Next.js Image component */}
                            <div className="w-full h-full object-cover bg-red-300" />
                        </div>

                        {/* Content Section */}
                        <div className="lg:col-span-1 bg-white p-6 md:p-8 lg:p-12 ">
                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <CategoryTag title="Meat" />
                                <CategoryTag title="Delivery" />
                            </div>

                            {/* Main Content */}
                            <div className="space-y-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-darkBlue leading-tight">
                                    Shabbos in a Box – Order Your Shabbos Meals
                                </h3>
                                <p className="text-gray-text text-base  leading-relaxed">
                                    Whether you're visiting for a weekend or a Jewish holiday, enjoy
                                    delicious kosher meals prepared with care. From traditional
                                    Shabbat dinners to festive holiday menus, we've got you
                                    covered—delivered to your hotel or served in a warm community
                                    setting.
                                </p>
                                <ButtonTheme title="Reserve Your Box" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </Fragment>

    );
};