import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaHotel, FaBuilding, FaHome } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { LocationIcon } from "../../ui/icons/locationIcon";
import { CategoryTag } from "../../ui/common/categoryTag";

export const CardHotelsSlider = ({ hotel }) => {
    return (

        <div className="w-screen md:w-auto px-4 md:px-0 h-full">
            <div className="md:flex mr-8 h-full w-full md:w-[750px] md:h-[330px] rounded-xl overflow-hidden bg-white shadow-[inset_0_0_0_1px_theme(colors.gray.100)] ">

                {/* Image Section */}
                <div className="relative w-full md:w-[40%] min-h-[200px] h-[200px]  md:min-h-auto md:h-full bg-red-200">
                    {/* Placeholder for dynamic image from Strapi */}
                    <div className="w-full h-full bg-red-300 relative" />
                    {/* Category Badge */}

                    <div className="absolute top-4 left-4">
                        <CategoryTag categoryTitle="Hotel" />
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-[60%] flex items-center gap-2">
                    <div className="p-10">

                        <h3 className="text-3xl font-semibold text-darkBlue mb-4 overflow-hidden max-h-18">
                            {hotel?.name ?? "Hotel Residence Inn by Marriott"}
                        </h3>

                        <p className="text-gray-text  mb-6">
                            {hotel?.description ?? "Urna amet tristique enim hac convallis lacus lorem tempus eget vivamus orci viverra lorem amet."}
                        </p>

                        <div className="border-t border-gray-200 pt-4 "></div>

                        <div className="flex items-start gap-1 mb-3">
                            <LocationIcon />
                            <p className="text-darkBlue text-base font-medium">{hotel?.address ?? "472 Border St. Freeport, NY 1152"}</p>
                        </div>

                        <ButtonTheme title="View Details" variation={2} />
                    </div>
                </div>


            </div>
        </div>
    );
};
