'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CategoryTag } from "../../ui/common/categoryTag";
import Link from "next/link";
import { StarsHotel } from "../../ui/common/starsHotel";

export const CardEntry = ({ item, isHotel = false, isRestaurant = false, singlePageActive = true }) => {
  const data = item;
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  // Reset loading state when image URL changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [data.imageUrls[0]]);



  return (
    <div className="w-full flex flex-col md:flex-row overflow-hidden gap-6">
      {/* Image Section */}
      <div className="relative w-full md:w-[40%] md:min-w-[40%] h-[350px] md:h-[250px]">
        {/* Skeleton Loader - Always visible when loading */}
        <div className={`absolute inset-0 bg-gray-200 rounded-2xl animate-pulse transition-opacity duration-300 ${
          isImageLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl skeleton-shimmer"></div>
        </div>
        
        {/* Image with key to force remount on URL change */}
        <Image
          key={data.imageUrls[0]}
          src={data.imageUrls[0]}
          fill
          alt={data.title || "restaurant"}
          className={`w-full h-full object-cover rounded-2xl transition-opacity duration-300 ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="(max-width: 768px) 100vw, 40vw"
          onLoad={() => setIsImageLoading(false)}
          onLoadingComplete={() => setIsImageLoading(false)}
          priority={false}
        />
      </div>
      {/* Content Section */}
      <div className="w-full md:w-[60%] flex flex-col justify-center px-4 md:px-0">
        {/* Category + Tags */}
        <div className="w-full flex justify-start gap-4 items-center mb-4">
          <CategoryTag categoryTitle={data.category} />

          <div className="flex flex-wrap gap-2">
            {(data.tags || []).map((tag, index) => (
              <span
                key={index}
                className="text-primary text-sm underline hover:text-darkBlue transition-colors cursor-pointer"
              >
                {tag.tag_name}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-darkBlue mb-2">{data.title}</h3>

        {/* Description */}
        {!isHotel && (
          <p className="text-gray-text mb-4 text-sm">{data.description}</p>
        )}

        {/* Distance / Duration */}
        {isHotel && (
          <div className="text-sm text-gray-text font-medium mb-2">
            <p className="mb-1 text-base">Distance from Chabad House:</p>
            <p className="text-sm">{data.distance ? data.distance : ""}</p>
          </div>
        )}

        {/* Hotel Rating */}
        {isHotel && (


          <div>
            <div className="mb-4">
              <StarsHotel rating={data.stars || 4} />
            </div>
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              {/* View button - only show if singlePageActive */}
              {singlePageActive && (
                <div className="flex items-center gap-2">
                  <svg
                    width="11"
                    height="13"
                    viewBox="0 0 11 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 5.63397C11.1667 6.01888 11.1667 6.98113 10.5 7.36603L2.25 12.1292C1.58333 12.5141 0.749999 12.0329 0.749999 11.2631L0.75 1.73686C0.75 0.967059 1.58333 0.485934 2.25 0.870834L10.5 5.63397Z"
                      fill="var(--primary)"
                    />
                  </svg>
                  <Link href={`/single-hotel/${data.id}`} className="underline leading-3 text-sm">
                    View {data.category}
                  </Link>
                </div>
              )}

              {/* Navigate button */}
              {data.navigate_url && (
                <div className="flex items-center gap-2">
                  <svg
                    width="11"
                    height="13"
                    viewBox="0 0 11 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 5.63397C11.1667 6.01888 11.1667 6.98113 10.5 7.36603L2.25 12.1292C1.58333 12.5141 0.749999 12.0329 0.749999 11.2631L0.75 1.73686C0.75 0.967059 1.58333 0.485934 2.25 0.870834L10.5 5.63397Z"
                      fill="var(--primary)"
                    />
                  </svg>
                  <a href={data.navigate_url} target="_blank" rel="noopener noreferrer" className="underline leading-3 text-sm">
                    Navigate
                  </a>
                </div>
              )}
            </div>
          </div>

        )}

        {/* CTA Link */}
        {!isHotel && (
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            {isRestaurant ? (
              <>
                <svg
                  width="11"
                  height="13"
                  viewBox="0 0 11 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 5.63397C11.1667 6.01888 11.1667 6.98113 10.5 7.36603L2.25 12.1292C1.58333 12.5141 0.749999 12.0329 0.749999 11.2631L0.75 1.73686C0.75 0.967059 1.58333 0.485934 2.25 0.870834L10.5 5.63397Z"
                    fill="var(--primary)"
                  />
                </svg>
                {data.is_direct_link && data.direct_link ? (
                  <a href={data.direct_link} className="underline leading-3 text-sm">
                    {data.category === "Event" ? "View Food Event" :
                     data.category === "Delivery" ? "View Delivery Service" :
                     "View Restaurant"}
                  </a>
                ) : (
                  <Link href={`/single-restaurant/${data.id}`} className="underline leading-3 text-sm">
                    {data.category === "Event" ? "View Food Event" :
                     data.category === "Delivery" ? "View Delivery Service" :
                     "View Restaurant"}
                  </Link>
                )}
              </>
            ) : singlePageActive ? (
              <>
                <svg
                  width="11"
                  height="13"
                  viewBox="0 0 11 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 5.63397C11.1667 6.01888 11.1667 6.98113 10.5 7.36603L2.25 12.1292C1.58333 12.5141 0.749999 12.0329 0.749999 11.2631L0.75 1.73686C0.75 0.967059 1.58333 0.485934 2.25 0.870834L10.5 5.63397Z"
                    fill="var(--primary)"
                  />
                </svg>
                <Link
                  href={`/single-activities/${data.id}`}
                  className="underline md:leading-3 text-sm"
                >
                  View Activity
                </Link>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div >
  );
};
