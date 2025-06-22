import React from "react";
import Image from "next/image";
import { FaWhatsapp, FaCheck } from "react-icons/fa";

export const AboutHome = () => {
  return (
    <div className="w-full bg-blueBackground py-12 md:pb-24 md:pt-[150px]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Text Content */}
          <div className="order-1 lg:order-none">
            {/* Subtitle */}
            <div className="text-primary font-bold text-lg md:text-xl tracking-wider mb-2">
              CHABAD IN PANAMA
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-myBlack mb-6 leading-tight">
              Where Community Embraces You
            </h1>

            {/* Description */}
            <p className="text-gray-text text-base md:text-lg mb-8 leading-relaxed">
              At Chabad of Panama City, we don't just celebrate Shabbat—we create
              lasting experiences. From our exclusive Lavazza Coffee Corner to
              joyful children's programs, every detail is designed to make you
              feel at home. Enjoy breakfast after minyan, warm hugs, and the
              company of incredible people.
            </p>

            {/* WhatsApp Link */}
            <div className="flex items-center gap-3 mb-12 lg:mb-16">
              <FaWhatsapp className="text-2xl text-green-500" />
              <a
                href="#"
                className="text-myBlack font-medium text-lg underline hover:text-primary transition-colors"
              >
                Join our WhatsApp group
              </a>
            </div>

            {/* Bottom Image */}
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden bg-red-300">
              {/* Replace with Next Image */}
              <div className="w-full h-full bg-red-300" />
            </div>
          </div>

          {/* Right Column - Images and Content */}
          <div className="relative order-2">
            {/* CTA Button - Floating */}
            <div className="flex justify-end">

              <div className=" bg-primary px-6 py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-colors mb-20">
                <span className="text-white font-bold text-lg">
                  Join Our Shabbat Table!
                </span>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-64 md:h-80 lg:h-[500px] rounded-lg overflow-hidden mb-6 bg-red-300">
              {/* Replace with Next Image */}
              <div className="w-full h-full bg-red-300" />
            </div>

            {/* Description */}
            <p className="text-gray-text text-base md:text-lg mb-8 leading-relaxed">
              Whether you're visiting Panama or live here year-round, our Shabbat
              is your Shabbat. Connect with new friends, swap stories over
              homemade challah, and find a sense of belonging that stays with
              you long after Havdalah.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                "Premium coffee with Lavazza to start your day.",
                "Kid-friendly programs that turn Shabbat into a celebration.",
                "In-house chef crafting soulful meals.",
                "WhatsApp group for all your travel and Shabbat questions.",
                "Cozy lounge to connect with the community.",
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <FaCheck className="text-primary text-xl mt-0.5 flex-shrink-0" />
                  <span className="text-myBlack font-bold text-lg">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};