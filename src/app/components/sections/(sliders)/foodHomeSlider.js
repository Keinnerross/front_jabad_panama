"use client"
import Link from "next/link"
import { ButtonTheme } from "../../ui/common/buttonTheme"
import { CardFoodSlider } from "../(cards)/cardFoodSlider"
import { CarouselWrapper } from "./carouselWrapper"
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation"
import { getAssetPath } from "@/app/utils/assetPath"






export const FoodHomeSlider = ({ restaurantsData, siteConfig }) => {


    // Datos de fallback
    const fallbackData = [
        {
            id: 1,
            title: "Lorem Restaurant",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            imageUrls: [getAssetPath("/assets/pictures/home/about-home-1.jpg")]
        },
        {
            id: 2,
            title: "Ipsum Cafe",
            description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            imageUrls: [getAssetPath("/assets/global/asset001.png")]
        }
    ];


    // Datos Api Construidos

    const processedData = (restaurantsData && Array.isArray(restaurantsData)) ? restaurantsData.map(restaurant => ({
        id: restaurant.documentId || "#",
        title: restaurant.name || restaurant.title,
        description: restaurant.description,
        imageUrls: imagesArrayValidation(restaurant.imageUrls, { imageUrls: [getAssetPath("/assets/global/asset001.png")] }) || [],
    })) : [];



    const dataToUse = processedData.length > 0 ? processedData : fallbackData;




    return (
        <div className={` bg-background pt-20 pb-6 flex justify-center items-center w-full flex-col px-6`}>
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="w-full flex flex-col md:flex-row justify-between md:items-center mb-8">
                    <p className="mb-8 md:mb-0 text-3xl md:text-3xl font-bold">
                        Kosher Restaurants in {siteConfig?.city || "City Name"}
                    </p>

                    <div className="inline md:hidden">
                        <ButtonTheme title="Explore restaurants" href="/restaurants" isFull />
                    </div>

                    <div className="hidden md:inline">
                        <ButtonTheme title="Explore restaurants" href="/restaurants" />
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center ">
                <div className="w-full max-w-7xl relative min-h-[500px]">
                    {/* Carousel */}
                    <CarouselWrapper>
                        {(dataToUse || []).map((restaurant, i) =>

                        (
                            <Link href={`/single-restaurant/${restaurant.id}`} key={i} className="">
                                <CardFoodSlider imageUrl={restaurant.imageUrls[0]} title={restaurant.title} description={restaurant.description} />
                            </Link>
                        )

                        )}
                    </CarouselWrapper>
                </div>
            </div>
        </div>
    )
}
