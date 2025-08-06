import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaBookOpen, FaRoute } from "react-icons/fa";
import { CategoryTag } from "../../ui/common/categoryTag";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { getAssetPath } from "@/app/utils/assetPath";
/* import { activitiesData } from "@/app/data/activities"; */


export const AttractionsHome = ({ activitiesData, siteConfig }) => {
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


    let allImages = [];

    const arrayAllImages = (data) => {
        if (Array.isArray(data)) {
            data.forEach(activity => {
                if (activity.imageUrls) {
                    // Si imageUrls es un array, concatenamos sus elementos
                    if (Array.isArray(activity.imageUrls)) {
                        allImages = allImages.concat(activity.imageUrls);
                    }
                    // Si imageUrls es un string, lo añadimos directamente
                    else if (typeof activity.imageUrls === 'string') {
                        allImages.push(activity.imageUrls);
                    }
                }
            });
        }

        return allImages;
    }
    const arrayAllImagesUrl = arrayAllImages(activitiesData);
    const imageUrls = imagesArrayValidation(arrayAllImagesUrl, { imageUrls: [] });
    const displayedActivities = imageUrls.slice(-3);




    const categoriesActivities = (activitiesData && Array.isArray(activitiesData)) ? activitiesData.map((activity) => ({
        title: activity.title || "lorep Ipsum",
        description: activity.description || "lorep Ipsum",
        category: activity.category || "Category"
    })) : []



    const displayedInfoActivities = categoriesActivities.slice(-3)



    return (
        <section className="max-w-[1304px] mx-auto px-4 pb-12 pt-6">
            {/* Title */}
            <h2 className="text-center text-myBlack font-bold text-3xl md:text-4xl mb-12">
                Activities in {siteConfig?.city || "City Name"}
            </h2>
            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {(displayedActivities || []).map((activity, i) => (
                    <div key={i} className="flex flex-col">
                        {/* Image placeholder - will be replaced with Next.js Image component */}
                        <div className="relative w-full h-60 rounded-xl mb-6">
                            {/* Reemplazar con Image cuando esté listo */}
                            <Image
                                src={activity}
                                alt="activities Chabbat Travels"
                                fill
                                className="object-cover rounded-xl"
                            />
                        </div>
                        {/* Category Tag */}
                        <CategoryTag categoryTitle={displayedInfoActivities[i].category} />
                        {/* Content */}
                        <div className="flex flex-col gap-2 mt-6">
                            <h3 className="text-myBlack font-bold text-xl leading-tight">
                                {displayedInfoActivities[i].title}
                            </h3>
                            <p className="text-gray-text font-medium text-sm leading-relaxed">
                                {displayedInfoActivities[i].description}
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