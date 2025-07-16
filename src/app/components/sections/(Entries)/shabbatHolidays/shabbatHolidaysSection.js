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

export default function ShabbatHolidaysSection({ aboutPicturesData, shabbatsAndHolidaysData, shabbatTimes }) {

    const [selectedShabbat, setSelectedShabbat] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Get sorted Shabbats from API data
    const sortedShabbats = shabbatsAndHolidaysData || [];

    // console.log('shabbatsAndHolidaysData:', shabbatsAndHolidaysData);




    const heroImages = aboutPicturesData.imageUrls;




    // Get current or next Shabbat data for display
    const currentShabbat = sortedShabbats.find(shabbat => {
        const today = new Date();
        const shabbatStart = new Date(shabbat.startDate);
        return shabbatStart >= today;
    }) || sortedShabbats[0];

    // console.log('currentShabbat:', currentShabbat);
    // console.log('sortedShabbats length:', sortedShabbats.length);

    const dataCardsHero = [
        {
            title: "Shabbat begins",
            icon: "/assets/icons/shabbat-meals/candles.svg",
            href: "/restaurants",
            hour: shabbatTimes?.candleLighting || "18:20",
        },
        {
            title: "Shabbat ends",
            icon: "/assets/icons/shabbat-meals/sun.svg",
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
                                Experience Shabbat and Jewish Holidays
                            </h2>
                            <p className="text-gray-text  text-base  leading-relaxed max-w-2xl mx-auto">
                                Celebrate Shabbat and Jewish holidays with comfort, connection, and community. From meaningful services to delicious kosher meals and family-friendly experiences, we help make your stay spiritually enriching and unforgettable.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                {/*     <ButtonTheme title="Register for Shabbat" variation={2} />
                                <ButtonTheme title="About Shabbat Box" /> */}
                            </div>
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
                    {dataCardsHero?.map((dataCard, i) => (
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
                            <div className="w-20 h-20  bg-[#F4F7FB] rounded-full flex justify-center items-center" >

                                <div className="rounded-full  w-16 h-16 relative">
                                    <Image src="/assets/icons/about/about.svg" fill className="object-contain w-full h-full" alt="icon" />
                                </div>
                            </div>

                            {/* Heading */}
                            <h2 className="text-3xl font-bold leading-tight">
                                Registration for Shabbat and Holiday Meals
                            </h2>

                            {/* Description */}
                            <p className="text-blueBackground text-base ">
                                Experience the warmth of Shabbat and Jewish holidays by registering in advance with our <span className="font-bold">Chabad House</span>
                            </p>

                            {/* Features List */}
                            <div className="mt-4">
                                <h3 className="text-lg font-bold mb-4">What's included?</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="bg-primary rounded-full w-6 h-6 min-w-6 min-h-6 flex justify-center items-center flex-shrink-0">
                                            <FaCheck className="text-white text-sm flex-shrink-0" />
                                        </div>
                                        <span className="text-blueBackground font-medium">Inspiring services & divrei Torah</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="bg-primary rounded-full w-6 h-6 min-w-6 min-h-6 flex justify-center items-center flex-shrink-0">
                                            <FaCheck className="text-white text-sm flex-shrink-0" />
                                        </div>
                                        <span className="text-blueBackground font-medium">Traditional meals shared in community</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="bg-primary rounded-full w-6 h-6 min-w-6 min-h-6 flex justify-center items-center flex-shrink-0">
                                            <FaCheck className="text-white text-sm flex-shrink-0" />
                                        </div>
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
                                <div className="relative cursor-pointer ">
                                    <select
                                        className="w-full p-4 border border-gray-text rounded-lg  appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                                        value={selectedShabbat}
                                        onChange={(e) => setSelectedShabbat(e.target.value)}
                                    >
                                        <option value="">Select a Shabbat date</option>
                                        {sortedShabbats
                                            .filter(shabbat => new Date(shabbat.startDate) >= new Date())
                                            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                                            .map((shabbat, index) => (
                                                <option key={shabbat.id || index} value={sortedShabbats.indexOf(shabbat)} className="cursor-pointer">
                                                    {shabbat.name} ({formatShabbatDate(shabbat)})
                                                </option>
                                            ))}
                                    </select>
                                    <div className="absolute top-1 inset-y-0 right-4 flex items-center pointer-events-none cursor-pointer bg-white h-[90%]">
                                        <MdKeyboardArrowDown className="text-xl" />
                                    </div>
                                </div>
                            </div>

                            {/* Register Button */}
                            <Link
                                href={selectedShabbat !== '' ? `/single-reservations?shabbat=${selectedShabbat}` : '#'}
                                className={`w-full sm:w-auto px-8 py-4 border-2 border-darkBlue font-medium rounded-lg transition-colors duration-200 ${selectedShabbat !== ''
                                    ? 'text-darkBlue hover:bg-blueBackground cursor-pointer'
                                    : 'text-gray-400 border-gray-400 cursor-not-allowed'
                                    }`}
                                onClick={(e) => {
                                    if (selectedShabbat === '') {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                Register
                            </Link>

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
                            Kosher food for Shabbat and Holiday
                        </h2>
                        <p className="text-gray-text text-base md:text-lg max-w-2xl mx-auto">
                            Enjoy fresh, delicious kosher meals prepared with care for Shabbat and Jewish holidays. Whether you're joining the community or celebrating on your own, pre-order to ensure everything is ready in time.
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6 overflow-hidden  rounded-2xl border border-gray-200">

                        {/* Image Section */}
                        <div className="lg:col-span-1 h-64 md:h-96 lg:h-[536px] overflow-hidden relative">
                            <Image src="/assets/pictures/shabbat-meals/shabbatbox-single.png" alt="shabbat box" fill className="w-full h-full object-cover" />
                        </div>

                        {/* Content Section */}
                        <div className="lg:col-span-1 bg-white p-6 md:p-8 lg:p-12 ">
                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <CategoryTag categoryTitle="Meat" />
                                <CategoryTag categoryTitle="Delivery" />
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
                                <ButtonTheme title="Reserve Your Box" href="/single-shabbatbox" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Notification Popup */}
            <NotificationPopup
                show={showPopup}
                onClose={() => setShowPopup(false)}
                title="Shabbat Box!"
                description="Our Shabbat Box brings you homemade kosher meals, delivered with care to your hotel, apartment, or home—so you can enjoy a warm and meaningful Shabbat in Panama."
                buttonText="Find out more"
                buttonHref="/shabbat-holidays#shabbatBox"
                backgroundImage="/assets/pictures/about/pic_about (1).jpg"

            />

        </Fragment>
    );
};