'use client'

import { CardHero } from "../(cards)/cardHero"
import { FoodIcon } from "@/app/components/ui/icons/FoodIcon"
import { TouristInfoIcon } from "@/app/components/ui/icons/touristInfoIcon"
import { ShabbatIcon } from "@/app/components/ui/icons/shabbatIcon"
import { PackagesIcon } from "@/app/components/ui/icons/packagesIcon"
import { AccommodationsIcon } from "@/app/components/ui/icons/AccommodationsIcon"
import { ActivitiesIcon } from "@/app/components/ui/icons/activitiesIcon"

export const CardsHeroSection = ({ platformSettings }) => {
    const baseCards = [
        {
            title: "Kosher Food",
            icon: <FoodIcon size={40} />,
            href: "/restaurants",
        },
        {
            title: "Tourist Info",
            icon: <TouristInfoIcon size={40} />,
            href: "/visitor-information",
        },
        {
            title: "Shabbat/Holiday Meals",
            icon: <ShabbatIcon size={40} />,
            href: "/shabbat-holidays",
        },
    ];

    // Conditionally add the Packages card
    if (platformSettings?.habilitar_packages) {
        baseCards.push({
            title: "All-Inclusive Packages",
            icon: <PackagesIcon size={40} />,
            href: "/packages",
        });
    }

    // Add the remaining cards
    baseCards.push(
        {
            title: "Accommodations",
            icon: <AccommodationsIcon size={40} />,
            href: "/accommodations",
        },
        {
            title: "Activities",
            icon: <ActivitiesIcon size={40} />,
            href: "/activities",
        }
    );

    const dataCardsHero = baseCards;
    
    // Determine grid classes based on number of cards
    const gridClasses = dataCardsHero.length === 5 
        ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full lg:max-w-5xl lg:mx-auto"
        : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full";

    return (
        <>
            <div className={gridClasses}>
                {dataCardsHero.map((dataCard, i) => {
                    // For mobile: center the 5th card when there are 5 cards total
                    const isLastOddCard = dataCardsHero.length === 5 && i === 4;
                    const cardClasses = isLastOddCard 
                        ? "flex justify-center items-center opacity-0 translate-y-6 col-span-2 sm:col-span-1"
                        : "flex justify-center items-center opacity-0 translate-y-6";
                    
                    return (
                        <div
                            key={i}
                            className={cardClasses}
                            style={{
                                animation: `slideUpFadeCard 0.6s ease-out ${0.05 * i + 1}s forwards`
                            }}
                        >
                            <CardHero data={dataCard} />
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                @keyframes slideUpFadeCard {
                    from { opacity: 0; transform: translateY(1.5rem) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </>
    );
};