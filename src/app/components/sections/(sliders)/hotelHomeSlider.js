"use client"
import Link from "next/link"
import { ButtonTheme } from "../../ui/common/buttonTheme"
import { CardFoodSlider } from "../(cards)/cardFoodSlider"
import { CarouselWrapper } from "./carouselWrapper"
import { CardHotelsSlider } from "../(cards)/cardHotelsSlider"

import { hotelsData } from "@/app/data/hoteles"

export const HotelHomeSlider = () => {
    return (
        <div className="bg-background py-20 flex justify-center items-center w-full flex-col  ">
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="w-full flex justify-between items-center mb-10 ">
                    <p className="text-4xl font-semibold">Recommended places to stay in</p>
                    <ButtonTheme title="Browse all places" href="/accommodations" />
                </div>
            </div>


            <div className="w-full flex justify-center ">
                <div className="w-full max-w-7xl relative min-h-[300px]">
                    <div className="w-full">
                        {/* Carousel */}

                        <CarouselWrapper>
                            {hotelsData?.map((hotel, i) => (
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
