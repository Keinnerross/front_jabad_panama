import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaBookOpen, FaRoute } from "react-icons/fa";
import { CategoryTag } from "../../ui/common/categoryTag";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { activitiesData } from "@/app/data/activities";

export const AttractionsHome = () => {
    // Obtener solo las primeras 3 actividades
    const displayedActivities = activitiesData.slice(0, 3);

    return (
        <section className="max-w-[1304px] mx-auto px-4 pb-12 pt-6">
            {/* Title */}
            <h2 className="text-center text-myBlack font-bold text-3xl md:text-4xl mb-12">
                Activities in Boquete, Panama
            </h2>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {displayedActivities.map((activity, i) => (
                    <div key={i} className="flex flex-col">
                        {/* Image placeholder - will be replaced with Next.js Image component */}
                        <div className="relative w-full h-60 rounded-xl mb-6">
                            {/* Reemplazar con Image cuando esté listo */}
                            <Image
                                src={activity.imageUrls}
                                alt={activity.title}
                                fill
                                className="object-cover rounded-xl"
                            />
                        </div>

                        {/* Category Tag */}
                        <CategoryTag categoryTitle={activity.category} />

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
                <ButtonTheme title="Browse all Attractions" href="/activities" />
            </div>
        </section>
    );
};