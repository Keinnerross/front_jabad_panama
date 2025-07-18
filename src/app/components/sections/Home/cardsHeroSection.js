'use client'

import { CardHero } from "../(cards)/cardHero"
import { FoodIcon } from "@/app/components/ui/icons/FoodIcon"
import { TouristInfoIcon } from "@/app/components/ui/icons/touristInfoIcon"
import { ShabbatIcon } from "@/app/components/ui/icons/shabbatIcon"
import { PackagesIcon } from "@/app/components/ui/icons/packagesIcon"
import { AccommodationsIcon } from "@/app/components/ui/icons/AccommodationsIcon"
import { ActivitiesIcon } from "@/app/components/ui/icons/activitiesIcon"

export const CardsHeroSection = () => {
    const dataCardsHero = [
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
        {
            title: "All-Inclusive Packages",
            icon: <PackagesIcon size={40} />,
            href: "/packages",
        },
        {
            title: "Accommodations",
            icon: <AccommodationsIcon size={40} />,
            href: "/accommodations",
        },
        {
            title: "Activities",
            icon: <ActivitiesIcon size={40} />,
            href: "/activities",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(3,minmax(0,1fr))] lg:grid-cols-6 gap-4 w-full ">
            {dataCardsHero.map((dataCard, i) => (
                <div
                    key={i}
                    className="flex justify-center items-center opacity-0 translate-y-6"
                    style={{
                        animation: `slideUpFadeCard 0.6s ease-out ${0.05 * i + 1}s forwards`
                    }}
                >
                    <CardHero data={dataCard} />
                </div>
            ))}

            <style jsx>{`
                @keyframes slideUpFadeCard {
                    from {
                        opacity: 0;
                        transform: translateY(1.5rem) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
};