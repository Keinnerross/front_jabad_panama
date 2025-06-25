import { CardHero } from "../(cards)/cardHero"

export const CardsHeroSection = () => {


    const dataCardsHero = [
        {
            title: "Kosher Food",
            icon: "/icons/kosher-food.svg",
            href: "/restaurants",
        },
        {
            title: "Tourist Info",
            icon: "/icons/tourist-info.svg",
            href: "/tourist-info",
        },
        {
            title: "Shabbat/Holiday Meals",
            icon: "/icons/shabbat-meals.svg",
            href: "/shabbat-holidays",
        },
        {
            title: "Package List",
            icon: "/icons/package-list.svg",
            href: "/packages",
        },
        {
            title: "Accommodations",
            icon: "/icons/accommodations.svg",
            href: "/accommodations",
        },
        {
            title: "Activities",
            icon: "/icons/activities.svg",
            href: "/activities",
        },
    ]

    return (
        <div className="max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1">

            {dataCardsHero?.map((dataCard, i) => (
                <div key={i}>
                    <CardHero title={dataCard.title} href={dataCard.href} />
                </div>
            ))}
        </div>

    )
}

