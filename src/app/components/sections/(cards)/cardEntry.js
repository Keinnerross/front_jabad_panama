import React from "react";
import Image from "next/image";
import { FiMapPin, FiClock, FiTag } from "react-icons/fi";
import { CategoryTag } from "../../ui/common/categoryTag";
import Link from "next/link";
import { GoTriangleRight } from "react-icons/go";
import { StarsHotel } from "../../ui/common/starsHotel";




export const CardEntry = ({ item, isHotel = false }) => {
    // Sample item data structure (would come from props in real usage)
    const sampleItem = {
        title: "What to do and see in 10 days in New York City",
        description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
        category: "Restaurant",
        tags: ["Fish", "Takeout"],
        location: "New York City, NY",
        hours: "Open until 10pm",
        image: "/what-to-do-and-see-in-10-days-in-new-york-city.png"
    };

    // Use the passed item or fallback to sample data
    const data = item || sampleItem;


    return (
        <div className="w-full flex flex-col md:flex-row bg-white rounded-xl overflow-hidden gap-6">
            {/* Image Section */}
            <div className="relative w-full md:w-[40%]  md:min-w-[40%] h-48 md:h-[250px]">
                <div className="w-full h-full">
                    {/* Replace with Next.js Image component */}
                    <div className="w-full h-full object-cover bg-red-300  rounded-2xl" />
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-[60%] flex flex-col justify-center">
                <div className="w-full flex justify-start gap-4 items-center mb-2">
                    <CategoryTag />
                    <div className="flex flex-wrap gap-2 ">
                        {data.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="text-primary text-sm underline hover:text-darkBlue transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                {/* Tags */}




                <h3 className="text-lg font-bold text-darkBlue mb-2">
                    {data.title}
                </h3>





                <p className={`text-gray-text mb-4 text-sm ${isHotel&& "hidden"}`}>
                    {data.description}
                </p>
                <div className="text-sm text-gray-text font-medium">
                    <p className="mb-1 text-base">
                        Distance from Chabad House:
                    </p>
                    <p className="text-sm">
                        {data.distance ? data.distance : ""}
                    </p>


                </div>


                <div className={`mt-3 ${!isHotel && "hidden"}`}>
                    <StarsHotel rating={4} />
                </div>


                <div className={`flex  items-center" ${isHotel && "hidden"}`}>
                    <GoTriangleRight className="text-primary" size={32} />
                    <Link href="/single-restaurant" className="underline leading-3 text-sm">View Restaurant</Link>
                </div>

            </div>
        </div >
    );
};