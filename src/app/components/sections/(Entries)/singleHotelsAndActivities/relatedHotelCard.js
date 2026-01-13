import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";

export const RelatedHotelCard = ({
    title = "Hotel Name",
    description = "Hotel description here.",
    imageUrl = ""
}) => {
    return (
        <div className="group flex flex-col w-full h-auto rounded-xl transition-all duration-300">
            {/* Contenedor de la imagen */}
            <div className="relative w-full h-[350px] rounded-xl overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                    <h3 className="font-bold text-darkBlue group-hover:text-primary duration-300 ease-in-out text-base md:text-lg leading-tight">
                        {title}
                    </h3>
                    <FiArrowRight className="text-darkBlue group-hover:text-primary group-hover:translate-x-1 duration-300 ease-in-out text-xl mt-0.5 flex-shrink-0" />
                </div>
                <p className="text-gray-text text-sm leading-snug line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default RelatedHotelCard;
