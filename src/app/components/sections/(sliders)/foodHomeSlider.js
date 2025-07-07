"use client"
import Link from "next/link"
import { ButtonTheme } from "../../ui/common/buttonTheme"
import { CardFoodSlider } from "../(cards)/cardFoodSlider"
import { CarouselWrapper } from "./carouselWrapper"
import { foodData } from "@/app/data/restaurantsData"
import { useScrollAppear } from "@/app/customHooks/useScrollAppear"
import { useRef, useState } from "react"
export const FoodHomeSlider = () => {




    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useScrollAppear(
        ref,
        () => setIsVisible(true),
        () => setIsVisible(false)
    );

    return (
        <div ref={ref} className={`${isVisible ? `animate-fade-up opacity-100` : 'opacity-0 translate-y-8'}bg-background pt-20 pb-6 flex justify-center items-center w-full flex-col px-6`}>
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="w-full flex flex-col md:flex-row justify-between md:items-center mb-8">
                    <p className="mb-8 md:mb-0 text-3xl md:text-3xl font-bold">Kosher Restaurants in Boquete</p>

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
                        {foodData?.map((restaurant, i) => (
                            <Link href={`/single-restaurant?id=${restaurant.id}`} key={i} className="">
                                <CardFoodSlider imageUrl={restaurant.imageUrls[0]} title={restaurant.title} description={restaurant.description} />
                            </Link>
                        ))}
                    </CarouselWrapper>
                </div>
            </div>
        </div>
    )
}
