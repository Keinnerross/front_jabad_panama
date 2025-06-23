import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaBookOpen, FaRoute } from "react-icons/fa";
import { CategoryTag } from "../../ui/categoryTag";
import { ButtonTheme } from "../../ui/buttonTheme";

export const AtractionsHome = () => {
    const activities = [
        {
            id: 1,
            title: "Jewish Heritage Tour of Panama City",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit enim eget tellus pulvinar lorem euismod sit.",
            category: "Activities",
            icon: <FaMapMarkerAlt className="text-primary" />,
        },
        {
            id: 2,
            title: "Los Salto Waterfalls in El Valle",
            description: "Sagittis sit enim volutpat at eget pharetra magna habitasse faucibus donec eu fringilla egestas in.",
            category: "Guides",
            icon: <FaBookOpen className="text-primary" />,
        },
        {
            id: 3,
            title: "Cacao or Coffee Farm Tours",
            description: "Sed lacus mauris viverra tincidunt aenean sodales rhoncus dui est amet varius quam dui potenti nunc.",
            category: "Tour",
            icon: <FaRoute className="text-primary" />,
        },
    ];

    return (
        <section className="max-w-[1304px] mx-auto px-4 py-16">
            {/* Title */}
            <h2 className="text-center text-myBlack font-bold text-3xl md:text-4xl mb-12">
                Attractions in Panama City
            </h2>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {activities?.map((activity) => (
                    <div key={activity.id} className="flex flex-col">
                        {/* Image placeholder - will be replaced with Next.js Image component */}
                        <div className="relative w-full h-60 rounded-xl bg-red-300 mb-6">
                            {/* This would be replaced with: */}
                            {/* <Image 
                src={activity.imageUrl} 
                alt={activity.title}
                fill
                className="object-cover rounded-xl"
              /> */}
                        </div>

                        {/* Category Tag */}
                        <CategoryTag />

                        {/* Content */}
                        <div className="flex flex-col gap-2 mt-6">
                            <h3 className="text-myBlack font-bold text-xl leading-tight">
                                {activity.title}
                            </h3>
                            <p className="text-gray-text font-medium text-sm leading-relaxed">
                                {activity.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center">
                <ButtonTheme title="Browse all Attractions" />
            </div>


        </section>
    );
};