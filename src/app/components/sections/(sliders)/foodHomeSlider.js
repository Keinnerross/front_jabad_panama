"use client"
import Link from "next/link"
import { ButtonTheme } from "../../ui/common/buttonTheme"
import { CardFoodSlider } from "../(cards)/cardFoodSlider"
import { CarouselWrapper } from "./carouselWrapper"

export const FoodHomeSlider = () => {
    return (
        <div className="bg-background py-20 flex justify-center items-center w-full flex-col">
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="w-full flex justify-between items-center mb-8">
                    <p className="text-3xl font-bold">Kosher food in Panamá</p>
                    <ButtonTheme title="Explore Restaurants" href="/restaurants"/>
                </div>
            </div>
            <div className="w-full flex justify-center ">
                <div className="w-full max-w-7xl relative min-h-[500px]">
                    <div className="absolute top-0 left-0 w-full">
                        {/* Carousel */}

                        <div className="w-[98vw]">
                            <CarouselWrapper>
                                {[...Array(10)].map((_, i) => (
                                    <Link href="/restaurants" key={i} className="">
                                        <CardFoodSlider />
                                    </Link>
                                ))}
                            </CarouselWrapper>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}
