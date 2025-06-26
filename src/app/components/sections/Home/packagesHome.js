import React from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { GoTriangleRight } from "react-icons/go";

export const PackagesHome = ({ showVideo = true, isHero = true, href = "#" }) => {
  const data = {
    packages: ["Gold", "Platinum", "Ultra Luxury"]
  };

  return (
    <div className="w-full bg-blueBackground">
      {/* Hero Section */}
      <section className={`max-w-7xl mx-auto px-4 sm:px-6 ${showVideo ? "pt-16 md:pb-8 pb-0" : "pt-16 md:pb-16 pb-0"}`}>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Text Content */}
          <div className="w-full lg:w-5/12 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-myBlack mb-6">
              Everything you wanted to know About Chabad of Panama City
            </h1>

            <p className="text-gray-text text-base md:text-base mb-8 leading-relaxed">
              Make the most of your trip with curated experiences designed for Jewish travelers. Whether you're visiting for Shabbat, a holiday, or just looking to explore Panama with peace of mind, our packages combine adventure, comfort, and kosher-friendly services—from tours and cultural spots to relaxing nature getaways.
              <br /><br />
              Let us help you plan a trip that's meaningful, exciting, and easy.
            </p>

            {/* Badges */}
            <div className={`flex flex-wrap gap-4 items-center mb-6 ${!isHero && "hidden"}`}>
              {data?.packages.map((item, i) => (
                <div className="flex gap-1 items-center" key={i}>
                  <FaCheckCircle fill="var(--primary)" />
                  <p className="text-myBlack font-medium">{item}</p>
                </div>
              ))}
            </div>

            <ButtonTheme variation={2} title="Explore Packages" href={href} />
          </div>

          {/* Image Grid */}
          <div className="w-full lg:w-7/12 relative">
            {/* Container que mantiene el aspect ratio */}
            <div className="relative pb-[100%] w-full h-0">
              {/* Cinta decorativa */}
              {isHero && (
                <div className="hidden md:inline absolute top-4 right-4 w-[140px] h-10 bg-red-300 rounded-md z-10" />
              )}

              {/* Imagen inferior derecha */}
              <div className="absolute bottom-[10%] right-0 w-[60%] aspect-square rounded-xl overflow-hidden bg-red-100 z-0" />

              {/* Imagen superior izquierda */}
              <div className="absolute top-0 left-0 w-[65%] aspect-square rounded-xl overflow-hidden bg-red-300 z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {showVideo && (
        <section className="bg-blueBackground pt-8 pb-16 flex justify-center items-center">
          <div className="w-full max-w-7xl px-4 sm:px-6">
            {/* Header Video Section */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-darkBlue">
                Everything about our packages
              </h2>
              <ButtonTheme title="Check Details" href={href} />
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-myBlack aspect-video w-full">
              {/* Video Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[10px] border-white bg-opacity-20 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center">
                    <GoTriangleRight className="text-white text-7xl ml-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};