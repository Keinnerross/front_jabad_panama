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
            title: "Package List",
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(3,minmax(0,1fr))] lg:grid-cols-6 gap-4 w-full px-4">
            {dataCardsHero.map((dataCard, i) => (
                <div key={i} className="flex justify-center items-center">
                    <CardHero data={dataCard} />
                </div>
            ))}
        </div>
    );
};
