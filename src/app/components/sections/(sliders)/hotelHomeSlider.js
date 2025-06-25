"use client"
import Link from "next/link"
import { ButtonTheme } from "../../ui/common/buttonTheme"
import { CardFoodSlider } from "../(cards)/cardFoodSlider"
import { CarouselWrapper } from "./carouselWrapper"
import { CardHotelsSlider } from "../(cards)/cardHotelsSlider"

export const HotelHomeSlider = () => {
    return (
        <div className="bg-background py-20 flex justify-center items-center w-full flex-col">
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="w-full flex justify-between items-center mb-8">
                    <p className="text-3xl font-bold">Recommended places to stay in</p>
                    <ButtonTheme title="Browse all places" href="/accommodations"/>
                </div>
            </div>
            <div className="w-full flex justify-center ">
                <div className="w-full max-w-7xl relative min-h-[300px]">
                    <div className="absolute top-0 left-0 w-full">
                        {/* Carousel */}

                        <div className="w-[98vw]">
                            <CarouselWrapper>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="">
                                        <CardHotelsSlider />
                                    </div>
                                ))}
                            </CarouselWrapper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
