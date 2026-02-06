import React from "react"
import {
    IoWifi,
    IoRestaurant,
    IoCar,
    IoAirplane,
    IoBed,
    IoTime,
    IoLocation,
    IoCall,
    IoStar,
    IoHeart,
    IoCheckmarkCircle,
    IoShield,
    IoWater,
    IoSnow,
    IoSunny,
    IoWalk
} from "react-icons/io5";

// Mapa de iconos disponibles
const iconMap = {
    wifi: IoWifi,
    restaurant: IoRestaurant,
    car: IoCar,
    airplane: IoAirplane,
    bed: IoBed,
    time: IoTime,
    location: IoLocation,
    call: IoCall,
    star: IoStar,
    heart: IoHeart,
    check: IoCheckmarkCircle,
    shield: IoShield,
    pool: IoWater,
    ac: IoSnow,
    sunny: IoSunny,
    walking: IoWalk,
};

const HightlightCard = ({ title = "Kosher meals available", description = "Enjoy freshly prepared kosher food during your stay.", icon = "check" }) => {
    // Obtener el componente de icono o usar el default
    const IconComponent = iconMap[icon?.toLowerCase()] || iconMap.check;

    return (
        <div className="flex w-full items-start gap-2.5 px-4 py-3 md:px-4 md:py-6 relative rounded-lg overflow-hidden border border-solid border-gray-200 hover:border-primary hover:shadow-sm transition-all duration-200 cursor-pointer">
            <div className="items-start gap-2.5 flex-1 grow flex relative">
                    <IconComponent className="text-text flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-col flex-1 min-w-0 items-start gap-px flex relative">
                    <div className="font-bold text-darkBlue text-sm md:text-base leading-tight break-words w-full">
                        {title}
                    </div>
                    <p className="text-gray-text text-xs md:text-sm leading-relaxed line-clamp-2 w-full">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HightlightCard;