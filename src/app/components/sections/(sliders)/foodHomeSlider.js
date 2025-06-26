"use client"
import Link from "next/link"
import { ButtonTheme } from "../../ui/common/buttonTheme"
import { CardFoodSlider } from "../(cards)/cardFoodSlider"
import { CarouselWrapper } from "./carouselWrapper"

export const FoodHomeSlider = () => {
    return (
        <div className="bg-background py-20 flex justify-center items-center w-full flex-col px-6">
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="w-full flex flex-col md:flex-row justify-between md:items-center mb-8">
                    <p className="mb-8 md:mb-0 text-3xl md:text-3xl font-bold">Kosher food in Panamá</p>

                    <div className="inline md:hidden">
                        <ButtonTheme title="Explore restaurants" href="/restaurants" isFull />
                    </div>

                    <div className="hidden md:inline">
                        <ButtonTheme title="Explore restaurants" href="/restaurants"  />
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center ">
                <div className="w-full max-w-7xl relative min-h-[500px]">
                    {/* Carousel */}

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
    )
}
