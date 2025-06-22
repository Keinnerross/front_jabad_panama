import React from "react";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

export const PackagesHome = () => {
  return (
    <div className="w-full bg-blueBackground">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Text Content */}
          <div className="lg:w-5/12">
            <h1 className="text-3xl md:text-4xl font-bold text-myBlack mb-6">
              Everything you wanted to know About Chabad of Panama City
            </h1>
            <p className="text-gray-text text-base md:text-lg mb-8 leading-relaxed">
              Make the most of your trip with curated experiences designed for Jewish travelers. Whether you're visiting for Shabbat, a holiday, or just looking to explore Panama with peace of mind, our packages combine adventure, comfort, and kosher-friendly services—from tours and cultural spots to relaxing nature getaways.
              <br /><br />
              Let us help you plan a trip that's meaningful, exciting, and easy.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-darkBlue rounded-lg text-darkBlue font-medium hover:bg-darkBlue hover:text-white transition-colors">
              Explore Packages <FiArrowRight />
            </button>
          </div>

          {/* Image Grid */}
          <div className="lg:w-7/12 relative h-[500px] md:h-[600px]">
            <div className="absolute w-full md:w-3/4 h-3/4 bottom-0 right-0 rounded-xl  overflow-hidden bg-red-300">
              {/* Replace with Next Image */}
              <div className="w-full h-full bg-red-300" />
            </div>
            <div className="absolute w-full md:w-2/3 h-4/5 top-0 left-0 rounded-xl  overflow-hidden bg-red-300">
              {/* Replace with Next Image */}
              <div className="w-full h-full bg-red-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-blueBackground py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-darkBlue text-center mb-12">
            Everything about our packages
          </h2>
          
          <div className="relative rounded-2xl overflow-hidden bg-myBlack aspect-video w-full max-w-5xl mx-auto">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center">
                  <FiArrowRight className="text-white text-2xl md:text-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};