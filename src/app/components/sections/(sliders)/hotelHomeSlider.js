"use client"
import Link from "next/link"
import { ButtonTheme } from "../../ui/common/buttonTheme"
import { CardFoodSlider } from "../(cards)/cardFoodSlider"
import { CarouselWrapper } from "./carouselWrapper"
import { CardHotelsSlider } from "../(cards)/cardHotelsSlider"
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation"
import { CategoryTag } from "../../ui/common/categoryTag"

/* import { hotelsData } from "@/app/data/hoteles" */

export const HotelHomeSlider = ({ hotelsData }) => {



    // Datos de fallback
    const fallbackData = [
        {
            id: 1,
            title: "Lorem Restaurant",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            imageUrls: ["/assets/pictures/home/about-home-1.jpg"],
            category: "category"
        },
        {
            id: 2,
            title: "Ipsum Cafe",
            description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            imageUrls: ["/assets/global/asset001.png"],
            category: "category",
            address: "address",
            website: "website",

        }
    ];


    // Datos Api Construidos
    const processedData = hotelsData?.map(hotel => ({
        id: hotel.documentId || "#",
        title: hotel.title,
        description: hotel.description,
        address: hotel.address,
        website: hotel.website,

        imageUrls: imagesArrayValidation(hotel.imageUrls, fallbackData) || [],
        category: hotel.category
    })) || [];


    console.log(processedData)


    const dataToUse = processedData.length > 0 ? processedData : fallbackData;








    return (
        <div className="bg-background py-20 flex justify-center items-center w-full flex-col  ">
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="w-full md:flex justify-between items-center mb-10 px-4 md:px-0 space-y-4 md:space-y-0">
                    <p className="text-4xl font-semibold">Recommended places to stay in</p>
                    <ButtonTheme title="Browse all places" href="/accommodations" />
                </div>
            </div>


            <div className="w-full flex justify-center ">
                <div className="w-full max-w-7xl relative min-h-[300px]">
                    <div className="w-full">
                        {/* Carousel */}

                        <CarouselWrapper>
                            {dataToUse?.map((hotel, i) => (
                                <div key={i} className="">
                                    <CardHotelsSlider hotel={hotel} />
                                </div>
                            ))}

                        </CarouselWrapper>
                    </div>
                </div>
            </div>
        </div>
    )
}
