import React, { Fragment } from "react";
import Image from "next/image";
import { EntryLayout } from "@/app/components/sections/(Entries)/entryLayout";
import { CardEntry } from "@/app/components/sections/(cards)/cardEntry";
import { HeroActivities } from "@/app/components/sections/Activities/heroActivities";
import { ActivitiesContinueLayout } from "@/app/components/sections/Activities/activitiesContinueLayout";
import { ButtonTheme } from "@/app/components/ui/buttonTheme";
import { FaEnvelope, FaArrowRight, FaUmbrellaBeach, FaHiking, FaHome } from "react-icons/fa";
import { CategoryTag } from "@/app/components/ui/categoryTag";
import { PackagesHome } from "@/app/components/sections/Home/packagesHome";


export default function Restaurants() {

    const packages = [
        {
            id: 1,
            title: "Pay Once",
            description: "Pay safely in the US and leave your wallet at home, we'll prepay every aspect of your trip.",
            image: "/new-york-NY.png",
            icon: <FaArrowRight />
        },
        {
            id: 2,
            title: "All-inclusive packages",
            description: "Including all your Kosher meals, hotels, transfers and activities. Activities are custom tailored to the ages in your group.",
            image: "/chicago-IL.png",
            icon: <FaArrowRight />
        },
        {
            id: 3,
            title: "3 price tiers",
            description: "Gold: $3500\nPlatinum: $4500\nUltra Luxury: Custom\nVarying in part, by hotel options.",
            image: "/san-francisco-CA.png",
            icon: <FaArrowRight />
        },
        {
            id: 4,
            title: "Optional",
            description: "Spend a day in Panama City, see the Canal, visit the old city, enjoy lunch and race back to the airport on your way to Boquete.",
            image: "/miami-FL.png",
            icon: <FaArrowRight />
        }
    ];
    // Content data - can be moved to a separate file or fetched from CMS
    const contentItems = [
        {
            id: 1,
            title: "What to do and see in 10 days in New York City",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
            category: "Restaurant",
            tags: ["Fish", "Takeout"],
            location: "",
            image: "/what-to-do-and-see-in-10-days-in-new-york-city.png"
        },
        {
            id: 2,
            title: "A beginner's guide on how to plan your travel budget",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
            category: "Bakery",
            tags: ["Dairy", "Parve"],
            location: "",
            image: "/a-beginner-s-guide-on-how-to-plan-your-travel-budget.png"
        },
        {
            id: 3,
            title: "16 restaurants that you must visit in Chicago, Illinois",
            description: "Super Kosher, Calle Ramon H. Jurado, Panama City, Panama",
            category: "Bakery",
            tags: ["Dairy", "Takeout"],
            location: "Panama City, Panama",
            image: "/16-restaurants-that-you-must-visit-in-chicago-illinois.png"
        },
        {
            id: 4,
            title: "How to make a travel plan to visit a city on a budget",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
            category: "Bakery",
            tags: ["Family", "Fish"],
            location: "",
            image: "/how-to-make-a-travel-plan-to-visit-a-city-on-a-budget.png"
        },
        {
            id: 5,
            title: "10 tips for how to find cheap plane tickets in 2023",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
            category: "Restaurant",
            tags: ["Near", "Parve"],
            location: "",
            image: "/10-tips-for-how-to-find-cheap-plane-tickets-in-2023.png"
        },
        {
            id: 6,
            title: "The ultimate travel guide for Miami, Florida",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
            category: "Restaurant",
            tags: ["Dairy", "Parve"],
            location: "",
            image: "/the-ultimate-travel-guide-for-miami-florida.png"
        }
    ];

    const adventures = [
        {
            id: 1,
            title: "ZIPLINE DAY",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet, justo at porta malesuada.",
            category: "Guides",
            image: "/a-beginner-s-guide-on-how-to-plan-your-travel-budget.png"
        },
        {
            id: 2,
            title: "CANGILONES DAY",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet, justo at porta malesuada.",
            category: "Tour",
            image: "/16-restaurants-that-you-must-visit-in-chicago-illinois.png"
        },
        {
            id: 3,
            title: "RANCH DAY",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet, justo at porta malesuada.",
            category: "Family",
            image: "/how-to-make-a-travel-plan-to-visit-a-city-on-a-budget.png"
        }
    ];

    return (
        <Fragment>
            <section className="relative flex flex-col items-center w-full bg-white ">
                {/* HERO */}
                <HeroActivities />
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-40 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div>

                <div className="absolute top-1/3 right-0 w-60 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div>
            </section>



            <EntryLayout>
                {contentItems.map((item) => (
                    <CardEntry key={item.id} item={item} />
                ))}
            </EntryLayout>



            <PackagesHome showVideo={false} />

            <section className="w-full flex justify-center items-center">


                <div className="w-full max-w-7xl px-4 py-12 md:py-24">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h2 className="text-3xl font-bold text-darkBlue">
                            Why Packages?
                        </h2>

                        <ButtonTheme title="Explore Packages" />
                    </div>



                    {/* TAREA PENDIENTE: HACER ESTO UN COMPONENTE ↓↓↓↓↓ */}
                    {/* Packages Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="bg-white ">
                                {/* Image */}
                                <div className="relative h-[300px] w-full ">
                                    <div className="w-full h-full bg-red-300 rounded-xl overflow-hidden">
                                        {/* Replace with Next.js Image component */}
                                        <div className="w-full h-full object-cover bg-red-300" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="pt-4 px-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-darkBlue">{pkg.title}</h3>
                                        <span className="text-darkBlue text-lg">{pkg.icon}</span>
                                    </div>

                                    <p className="text-gray-text whitespace-pre-line text-sm">
                                        {pkg.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>






            {/* TAREA PENDIENTE: HACER ESTO UN COMPONENTE ↓↓↓↓↓ */}
            <div className="w-full flex justify-center items-center">


                {/* Newsletter Section */}

                <div className="w-full max-w-7xl">


                    <section className="bg-darkBlue text-white rounded-xl overflow-hidden mb-12">
                        <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col lg:flex-row items-center">
                            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
                                <div className="w-full h-64 md:h-96 bg-red-300 rounded-lg overflow-hidden">
                                    {/* Replace with Next.js Image component */}
                                    <div className="w-full h-full object-cover bg-red-300" />
                                </div>
                            </div>

                            <div className="lg:w-1/2">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                    Get our exclusive packages straight to your inbox
                                </h2>

                                <p className="text-blue-100 mb-8">
                                    Stay updated with hand-picked experiences, Shabbat-friendly tours,
                                    and Jewish travel tips made for your time in Panama. Don't miss
                                    out—our most popular packages fill up fast!
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-grow">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <FaEnvelope />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap">
                                        Count me in
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Main Content */}
                    <div className="px-4 md:px-0 pb-20 py-12">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <h2 className="text-3xl font-bold text-darkBlue">
                                Your Panama Adventure Continues!
                            </h2>

                            <ButtonTheme title="Check Details" />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-16">
                            {/* Featured Hotel Card */}
                            <div className="lg:w-[40%]">

                                <div className="border border-gray-200 rounded-2xl overflow-hidden ">
                                    <div className="h-64 md:h-80 bg-red-300 rounded-xl overflow-hidden">
                                        {/* Replace with Next.js Image component */}
                                        <div className="w-full h-full object-cover bg-red-300" />
                                    </div>

                                    <div className="p-8 space-y-4">

                                        <CategoryTag />

                                        <h3 className="text-2xl font-bold text-darkBlue">
                                            Hotels for all budgets and tastes!
                                        </h3>

                                        <p className="text-gray-text text-sm">
                                            From cozy budget stays to luxurious suites, our curated selection
                                            of hotels ensures there's something perfect for every traveler.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Adventure Cards */}
                            <div className="lg:w-[60%] space-y-6">
                                {adventures.map((adventure) => (
                                    <div key={adventure.id} className="flex flex-col sm:flex-row rounded-xl overflow-hidden">
                                        <div className="sm:w-1/3 h-48 bg-red-300 rounded-xl overflow-hidden">
                                            {/* Replace with Next.js Image component */}
                                            <div className="w-full h-full object-cover bg-red-300" />
                                        </div>

                                        <div className="sm:w-2/3 bg-white p-6 space-y-4">
                                            <CategoryTag />

                                            <h3 className="text-xl font-bold text-darkBlue ">
                                                {adventure.title}
                                            </h3>

                                            <p className="text-gray-text text-sm">
                                                {adventure.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </Fragment >
    );
};



