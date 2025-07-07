'use client'
import { CardHero } from "../(cards)/cardHero"

export const CardsHeroSection = () => {
    const dataCardsHero = [
        {
            title: "Kosher Food",
            icon: "/assets/icons/home/food.svg",
            href: "/restaurants",
        },
        {
            title: "Tourist Info",
            icon: "/assets/icons/home/tourist-info.svg",
            href: "/tourist-info",
        },
        {
            title: "Shabbat/Holiday Meals",
            icon: "/assets/icons/home/shabbat.svg",
            href: "/shabbat-holidays",
        },
        {
            title: "All-Inclusive Packages",
            icon: "/assets/icons/home/packages.svg",
            href: "/packages",
        },
        {
            title: "Accommodations",
            icon: "/assets/icons/home/accommodations.svg",
            href: "/accommodations",
        },
        {
            title: "Activities",
            icon: "/assets/icons/home/activities.svg",
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