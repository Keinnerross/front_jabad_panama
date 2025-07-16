import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";

export const CardFoodSlider = ({
    title = "La Finka",
    description = "Eros pellentesque volutpat viverra ac non vitae cursus velit at lobortis.on vitae cursus velit at lobortis.",
    imageUrl = ""

}) => {
    return (


        <div className="group flex flex-col min-w-[280px] max-w-[280px] h-auto md:h-[474px] rounded-xl transition-all duration-300 mr-8">

            {/* Contenedor de la imagen */}
            <div className="relative w-full aspect-square md:h-[320px] rounded-xl overflow-hidden ">
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
                <div className="flex justify-between items-start ">
                    <h3 className="font-bold text-darkBlue group-hover:text-primary duration-400 ease-in-out text-xl md:text-[22.5px] leading-tight">
                        {title}
                    </h3>
                    <FiArrowRight className="text-darkBlue group-hover:text-primary group-hover:translate-x-1 duration-400 ease-in-out text-2xl mt-1" />
                </div>
                <p className="text-gray-text text-sm leading-snug pt-2 w-[80%]">
                    {description}
                </p>
            </div>
        </div>
    );
};