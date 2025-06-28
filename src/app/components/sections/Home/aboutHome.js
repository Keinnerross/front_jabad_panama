import React from "react";
import Image from "next/image";
import { FaWhatsapp, FaCheck } from "react-icons/fa";
import { ButtonTheme } from "../../ui/common/buttonTheme";

export const AboutHome = () => {
  return (
    <div className="w-full bg-blueBackground md:pt-0 pb-24 ">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Text Content */}
          <div className="order-1 lg:order-none">
            {/* Subtitle */}
            <div className="text-primary font-bold text-lg md:text-xl tracking-wider mb-2">
              Chabad OF BOQUETE, PANAMA
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-myBlack mb-6 leading-tight">
              A Kosher-Friendly Mountain Town
            </h1>

            {/* Description */}
            <p className="text-gray-text text-base  mb-8 leading-relaxed">
              Surrounded by mountains and fresh air, our Chabad House keeps things warm and simple. Minyan, good food, real people, and a relaxed vibe. Whether you’re just passing through or staying a while, you will feel at home with us.
            </p>

            {/* WhatsApp Link */}
            <div className="flex items-center gap-3 mb-12 ">
              <FaWhatsapp className="text-2xl text-green-500" />
              <a
                href="#"
                className="text-myBlack font-medium text-lg underline hover:text-primary transition-colors"
              >
                Join our WhatsApp group
              </a>

            </div>

            {/*  Images */}
            <div className="space-y-12">
              <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-red-300">
                {/* Replace with Next Image */}
                <Image className="w-full h-full object-cover " src="/assets/pictures/home/about-home-1.jpg" fill alt="About Boquete Panama Shabbat" />

              </div>

              <div className="relative w-full h-64 md:h-80 lg:h-[500px] rounded-2xl overflow-hidden mb-6 bg-red-300">
                {/* Replace with Next Image */}
                <Image className="w-full h-full object-cover " src="/assets/pictures/home/about-home-3.png" fill alt="About Boquete Panama Shabbat" />
              </div>
            </div>
          </div>

          {/* Right Column - Images and Content */}
          <div className="relative order-2">
            {/* CTA Button - Floating */}
            <div className="hidden md:flex justify-end items-center h-36 ">

              <ButtonTheme title="Join our Shabbat Table!" variation={3} href="/shabbat-holidays" />
            </div>

            {/* Main Image */}
            <div className="hidden md:inline-block relative w-full h-64 md:h-80 lg:h-[700px] rounded-2xl overflow-hidden mb-14 bg-red-300 ">
              {/* Replace with Next Image */}
              <Image className="w-full h-full object-cover " src="/assets/pictures/home/about-home-2.png" fill alt="About Boquete Panama Shabbat" />

            </div>



            {/* Description */}
            <p className="text-gray-text text-base  mb-12 leading-relaxed">
            Whether you're visiting Boquete or live here year-round, our Shabbat is your Shabbat. Connect with new friends, swap stories over homemade challah, and find a sense of belonging that stays with you long after Havdalah.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                "The best Shluchim!",
                "Kid-friendly programs on Shabbat and during the week.",
                "Healthy and delicious meals.",
                "WhatsApp group for all your travel and Shabbat questions.",
                "A brand new, large tree house.",
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