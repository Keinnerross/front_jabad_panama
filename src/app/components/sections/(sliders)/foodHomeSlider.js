"use client"
import Link from "next/link"
import Image from "next/image"
import { FiArrowRight } from "react-icons/fi"
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

    const processedData = (restaurantsData && Array.isArray(restaurantsData)) ? restaurantsData
        .map(restaurant => ({
            id: restaurant.documentId || "#",
            title: restaurant.name || restaurant.title,
            description: restaurant.description,
            imageUrls: imagesArrayValidation(restaurant.imageUrls, { imageUrls: [getAssetPath("/assets/global/asset001.png")] }, 'medium') || [],
            is_direct_link: restaurant.is_direct_link || false,
            direct_link: restaurant.direct_link || null,
            order: restaurant.order !== undefined && restaurant.order !== null ? restaurant.order : 100
        }))
        .sort((a, b) => a.order - b.order) : [];



    const dataToUse = processedData.length > 0 ? processedData : fallbackData;
    const count = dataToUse.length;

    const renderLinkedCard = (restaurant, i, cardContent) => {
        if (restaurant.is_direct_link && restaurant.direct_link) {
            return <a href={restaurant.direct_link} key={i}>{cardContent}</a>;
        }
        return <Link href={`/single-restaurant/${restaurant.id}`} key={i}>{cardContent}</Link>;
    };

    const renderFeatured = () => {
        const restaurant = dataToUse[0];
        const content = (
            <div className="group flex flex-col md:flex-row gap-6 md:gap-10 rounded-xl overflow-hidden transition-all duration-300">
                <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[360px] rounded-xl overflow-hidden">
                    {restaurant.imageUrls[0] ? (
                        <Image
                            src={restaurant.imageUrls[0]}
                            alt={restaurant.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-blueBackground flex items-center justify-center text-gray-text">
                            Preview Image
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-center gap-3 w-full md:w-1/2 py-2 md:py-8">
                    <h3 className="font-bold text-darkBlue group-hover:text-primary duration-400 ease-in-out text-2xl md:text-3xl leading-tight">
                        {restaurant.title}
                    </h3>
                    <p className="text-gray-text text-base leading-relaxed md:w-[85%]">
                        {restaurant.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-semibold mt-2">
                        <span>View Details</span>
                        <FiArrowRight className="group-hover:translate-x-1 duration-400 ease-in-out text-xl" />
                    </div>
                </div>
            </div>
        );
        return renderLinkedCard(restaurant, 0, content);
    };

    const renderGrid = () => {
        const gridCols = count === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : count === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";

        const gridConstraint = "";
        const gridGap = count <= 3 ? "gap-6 lg:gap-8" : "gap-6";

        return (
            <div className={`grid ${gridCols} ${gridGap} ${gridConstraint}`}>
                {dataToUse.map((restaurant, i) =>
                    renderLinkedCard(
                        restaurant,
                        i,
                        <CardFoodSlider
                            imageUrl={restaurant.imageUrls[0]}
                            title={restaurant.title}
                            description={restaurant.description}
                            gridMode
                            imageAspect={count === 2 ? "aspect-[4/3]" : "aspect-[3/4]"}
                        />
                    )
                )}
            </div>
        );
    };

    const renderCarousel = () => (
        <CarouselWrapper>
            {dataToUse.map((restaurant, i) =>
                renderLinkedCard(
                    restaurant,
                    i,
                    <CardFoodSlider
                        imageUrl={restaurant.imageUrls[0]}
                        title={restaurant.title}
                        description={restaurant.description}
                    />
                )
            )}
        </CarouselWrapper>
    );

    return (
        <div className={`bg-background pt-16 md:pt-24 lg:pt-28 pb-14 md:pb-20 lg:pb-24 flex justify-center items-center w-full flex-col px-6`}>
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="w-full flex flex-col md:flex-row justify-between md:items-center mb-8">
                    <p className="mb-8 md:mb-0 text-3xl md:text-3xl font-bold">
                        Kosher Food in {siteConfig?.city || "City Name"}
                    </p>

                    <div className="inline md:hidden">
                        <ButtonTheme title="Explore Kosher Food" href="/restaurants" isFull />
                    </div>

                    <div className="hidden md:inline">
                        <ButtonTheme title="Explore Kosher Food" href="/restaurants" />
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <div className={`w-full max-w-7xl relative ${count >= 5 ? "min-h-[500px]" : ""}`}>
                    {count === 1 && renderFeatured()}
                    {count >= 2 && count <= 4 && renderGrid()}
                    {count >= 5 && renderCarousel()}
                </div>
            </div>
        </div>
    )
}
