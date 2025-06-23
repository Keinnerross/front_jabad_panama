import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaHotel, FaBuilding, FaHome } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { ButtonTheme } from "../../ui/buttonTheme";
import { LocationIcon } from "../../ui/icons/locationIcon";
import { CategoryTag } from "../../ui/categoryTag";

export const CardHotelsSlider = ({ hotel }) => {
    return (
        <div className="flex flex-col md:flex-row w-[556px] mx-auto mb-8 rounded-xl overflow-hidden bg-white shadow-[inset_0_0_0_1px_theme(colors.gray.100)]">
            {/* Image Section */}
            <div className="relative w-full md:w-2/5 h-full md:h-auto">
                {/* Placeholder for dynamic image from Strapi */}
                <div className="w-full h-full bg-red-300 relative">
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <CategoryTag categoryTitle="Hotel" />

                    </div>

                  
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-3/5 p-6  flex flex-col gap-2">
                <h3 className="text-xl font-bold text-darkBlue">
                    {hotel?.name ?? "Hotel Residence Inn by Marriott "}
                </h3>
                <p className="text-gray-text text-sm pb-2">
                    {hotel?.description ?? "Urna amet tristique enim hac convallis lacus lorem tempus eget vivamus orci viverra lorem amet."}
                </p>

                <div className="border-t border-gray-200 pt-4 "></div>

                <div className="flex items-start gap-1 pb-2">
                    <LocationIcon />
                    <p className="text-darkBlue text-base font-medium">{hotel?.address ?? "472 Border St. Freeport, NY 1152"}</p>
                </div>

                <ButtonTheme title="View Details" variation={2} />
            </div>
        </div>
    );
};
