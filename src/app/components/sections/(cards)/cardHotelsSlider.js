import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocationIcon } from "../../ui/icons/locationIcon";
import { CategoryTag } from "../../ui/common/categoryTag";

export const CardHotelsSlider = ({ hotel, singlePageActive = true }) => {
  const [isHover, setIsHover] = useState(false);

  // Wrapper component - Link if active, div if not
  const Wrapper = singlePageActive ? Link : 'div';
  const wrapperProps = singlePageActive
    ? { href: `/single-hotel/${hotel.id}` }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`w-full md:w-auto px-4 md:px-0 h-full group block ${singlePageActive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="md:flex mr-4 md:mr-8 h-full w-[87vw] md:w-[750px] md:h-[330px] rounded-xl overflow-hidden bg-white shadow-[inset_0_0_0_1px_theme(colors.gray.200)]">
        {/* Image Section */}
        <div className="relative w-full md:w-[40%] min-h-[200px] h-[200px] md:h-full overflow-hidden">
          <Image
            src={hotel.imageUrls[0]}
            alt={hotel.title || "Hotels"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 300px"
          />


          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <CategoryTag categoryTitle={hotel?.category || "Hotel"} />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-[60%] flex items-center gap-2">
          <div className="p-10">
            <h3 className={`text-2xl font-semibold text-darkBlue mb-4 overflow-hidden max-h-18 duration-300 ease-in-out ${singlePageActive ? 'group-hover:text-primary' : ''}`}>
              {hotel?.title ?? "Hotel Residence Inn by Marriott"}
            </h3>

            <p className="text-gray-text mb-6">
              {hotel?.description}
            </p>

            <div className="border-t border-gray-200 pt-4" />

            <div className="flex items-start gap-1 mb-4">
              <LocationIcon />
              <p className="text-darkBlue text-base font-medium">
                {hotel?.address}
              </p>
            </div>

            {singlePageActive && (
              <span className={`inline-block px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                isHover
                  ? 'bg-primary text-white'
                  : 'border-2 border-darkBlue text-darkBlue hover:bg-blueBackground'
              }`}>
                View Details
              </span>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
