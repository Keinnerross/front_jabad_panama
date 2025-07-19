'use client'
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { CardEntry } from "../../(cards)/cardEntry";
import { EntryLayout } from "../entryLayout";
import { getAssetPath } from "@/app/utils/assetPath";

export const RestaurantsSection = ({ restaurantsData }) => {







    // Datos de fallback
    const fallbackData = [
        {
            id: 1,
            title: "Lorem Restaurant",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            category: "Kosher",

            imageUrls: [getAssetPath("/assets/global/asset001.png")]


        },
        {
            id: 2,
            title: "Ipsum Cafe",
            description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            category: "Kosher",
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        }
    ];


    // Datos Api Construidos

    const processedData = (restaurantsData && Array.isArray(restaurantsData)) ? restaurantsData.map(restaurant => ({
        id: restaurant.documentId || "#",
        title: restaurant.name || restaurant.title,
        description: restaurant.description,
        category: restaurant.category,
        imageUrls: imagesArrayValidation(restaurant.imageUrls, { imageUrls: [getAssetPath("/assets/global/asset001.png")] }) || [],
    })) : [];



    const dataToUse = processedData.length > 0 ? processedData : fallbackData;



    return (
        <div >
            <EntryLayout
                data={dataToUse}
                filterKey="category"
                renderItem={(item) => <CardEntry item={item} isRestaurant />}
            />
        </div>
    )
}




