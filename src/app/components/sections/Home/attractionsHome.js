import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaBookOpen, FaRoute } from "react-icons/fa";
import { CategoryTag } from "../../ui/common/categoryTag";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { getAssetPath } from "@/app/utils/assetPath";
/* import { activitiesData } from "@/app/data/activities"; */


export const AttractionsHome = ({ activitiesData, siteConfig, singleActivitiesActive = true }) => {
    // Obtener solo las primeras 3 actividades

    const fallbackData = [
        {
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        },
        {
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        },
        {
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        },

    ];


    // Procesar actividades con imagen única
    const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    const processedActivities = (activitiesData && Array.isArray(activitiesData))
        ? activitiesData
            .map(activity => ({
                id: activity.documentId || activity.id,
                title: activity.title || "Activity",
                description: activity.description || "",
                category: activity.category || "Category",
                // Usar medium para cards en home (~750px) - imageUrl es ahora un array
                imageUrl: activity.imageUrl?.[0]?.formats?.medium?.url
                    ? `${url}${activity.imageUrl[0].formats.medium.url}`
                    : activity.imageUrl?.[0]?.url
                        ? `${url}${activity.imageUrl[0].url}`
                        : getAssetPath("/assets/global/asset001.png"),
                order: activity.order !== undefined && activity.order !== null ? activity.order : 100
            }))
            .sort((a, b) => a.order - b.order)
        : fallbackData.map((item, index) => ({
            id: `fallback-${index}`,
            title: "Activity",
            description: "",
            category: "Category",
            imageUrl: item.imageUrls[0],
            order: 100
        }));
    
    // Obtener solo las primeras 3 actividades (ya ordenadas)
    const displayedActivities = processedActivities.slice(0, 3);







    return (
        <section className="max-w-[1304px] mx-auto px-4 pt-14 md:pt-20  pb-16 md:pb-20">
            {/* Title */}
            <h2 className="text-center text-myBlack font-bold text-3xl md:text-4xl mb-12">
                Activities in {siteConfig?.city || "City Name"}
            </h2>
            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {(displayedActivities || []).map((activity, i) => {
                    // Wrapper component - Link if active, div if not
                    const Wrapper = singleActivitiesActive ? Link : 'div';
                    const wrapperProps = singleActivitiesActive
                        ? { href: `/single-activities/${activity.id}` }
                        : {};

                    return (
                        <Wrapper
                            key={i}
                            {...wrapperProps}
                            className={`flex flex-col group ${singleActivitiesActive ? 'cursor-pointer' : ''}`}
                        >
                            {/* Image */}
                            <div className="relative w-full h-60 rounded-xl mb-6 overflow-hidden">
                                <Image
                                    src={activity.imageUrl}
                                    alt={activity.title}
                                    fill
                                    className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                            {/* Category Tag - if category exists in activity */}
                            {activity.category && <CategoryTag categoryTitle={activity.category} />}
                            {/* Content */}
                            <div className="flex flex-col gap-2 mt-6">
                                <h3 className={`text-myBlack font-bold text-xl leading-tight transition-colors duration-300 ${singleActivitiesActive ? 'group-hover:text-primary' : ''}`}>
                                    {activity.title}
                                </h3>
                                <p className="text-gray-text font-medium text-sm leading-relaxed">
                                    {activity.description}
                                </p>
                            </div>
                        </Wrapper>
                    );
                })}
            </div>
            <div className="flex justify-center items-center">
                <ButtonTheme title="Browse all Attractions" href="/activities" />
            </div>
        </section>
    );
};