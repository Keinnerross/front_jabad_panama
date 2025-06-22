import { CardHero } from "../(cards)/cardHero"

export const CardsHeroSection = () => {
    return (
        <div className="max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1">
            <CardHero/>
            <CardHero />
            <CardHero />
            <CardHero />
            <CardHero />
            <CardHero />
        </div>

    )
}

