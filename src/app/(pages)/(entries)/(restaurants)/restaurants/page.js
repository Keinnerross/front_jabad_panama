import React, { Fragment } from "react";
import Image from "next/image";
import { EntryLayout } from "@/app/components/sections/(Entries)/entryLayout";
import { CardEntry } from "@/app/components/sections/(cards)/cardEntry";

export default function Restaurants() {


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
    return (
        <Fragment>
            <section className="relative flex flex-col items-center w-full bg-blueBackground pb-20 md:pb-0 md:h-[516px] overflow-hidden">
                {/* Gradient bottom */}
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground z-10" />

                {/* Main content container */}
                <div className="w-full max-w-7xl px-4 md:px-6 h-full flex items-center justify-center">
                    {/* Text content - using flex for centering */}
                    <div className="w-full flex flex-col items-center justify-center text-center py-12 md:py-0">
                        <h1 className="md:w-[50%] text-4xl md:text-5xl lg:text-[46px] font-bold text-darkBlue mb-6 leading-tight">
                            Discover Kosher food in Panama City
                        </h1>

                        <p className="text-base  text-gray-text max-w-2xl mx-auto">
                            Panama city offers plenty of options for getting kosher food, both
                            for eating out and grocery shopping. There are close to 40 kosher
                            establishments in Panama City of almost all imaginable varieties:
                            pizzerias, casual, Israeli-style shwarma/falafel, sushi bars, fancy
                            formal dining restaurants, bakeries, deli's, ice-cream parlors,
                            Starbucks-style coffee house, and more.
                        </p>
                    </div>

                </div>

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
        </Fragment >
    );
};