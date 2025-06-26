import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";

export const CardFoodSlider = ({
    title = "La Finka",
    description = "Eros pellentesque volutpat viverra ac non vitae cursus velit at lobortis.on vitae cursus velit at lobortis.",
    imageUrl = ""
}) => {
    return (

<div className="group flex flex-col min-w-[280px] max-w-[280px] h-auto md:h-[474px] rounded-xl overflow-hidden transition-all duration-300 mr-8">

            {/* Contenedor de la imagen */}
            <div className="relative w-full aspect-square md:h-[320px] rounded-xl overflow-hidden bg-red-300">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-blueBackground flex items-center justify-center text-gray-text">
                        Preview Image
                    </div>
                )}
            </div>

            {/* Contenido de texto */}
            <div className="flex flex-col gap-2 mt-4">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-darkBlue text-xl md:text-[22.5px] leading-tight">
                        {title}
                    </h3>
                    <FiArrowRight className="text-darkBlue text-xl mt-1" />
                </div>
                <p className="font-medium text-gray-text text-sm md:text-base] leading-snug">
                    {description}
                </p>
            </div>
        </div>
    );
};