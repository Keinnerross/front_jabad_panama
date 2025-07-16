'use client'
import React, { useRef, useState } from "react";
import Image from "next/image";
import { FaWhatsapp, FaCheck } from "react-icons/fa";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";

export const AboutHome = ({ aboutData }) => {

/*   console.log("RES", aboutData) */
  // Fallback data
  const fallbackData = {
    primaryDescription: "Primary Description",
    title: "Title Section",
    description1: "Lorem imspum",
    description2: "Lorem imspum",
    whatsappGroupLink: "#",
    itemList: [{ text: "Item list" }],
    imageUrls: [
      "/assets/global/asset001.png",
      "/assets/global/asset001.png",
      "/assets/global/asset001.png"
    ]
  };


  // Separamos info de about
  const homeAboutInfo = aboutData?.home_about;
  const pictures = homeAboutInfo?.pictures || [];

  // Procesamos datos con fallback
  const pageData = {
    primaryDescription: homeAboutInfo?.primary_description || fallbackData.primaryDescription,
    title: homeAboutInfo?.title || fallbackData.title,
    description1: homeAboutInfo?.description_1 || fallbackData.description1,
    description2: homeAboutInfo?.description_2 || fallbackData.description2,
    whatsappGroupLink: homeAboutInfo?.whatsapp_group_link || fallbackData.whatsappGroupLink,
    itemList: homeAboutInfo?.item_list || fallbackData.itemList,
    imageUrls: imagesArrayValidation(pictures, fallbackData)
  };


  const links = {
    cta: "/about",
    wsapGroup: pageData.whatsappGroupLink
  };

  

  return (
    <div id="aboutHero" className="w-full bg-blueBackground md:pt-12 pb-24">
      <div className={`max-w-7xl mx-auto px-4`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="order-1 lg:order-none">
            <div className="text-primary font-bold text-lg md:text-xl tracking-wider mb-2">
              {pageData.primaryDescription}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-myBlack mb-6 leading-tight">
              {pageData.title}
            </h1>

            <p className="text-gray-text text-base mb-8 leading-relaxed">
              {pageData.description1}
            </p>

            <div className="flex items-center gap-3 mb-12 ">
              <FaWhatsapp className="text-2xl text-green-500" />
              <a
                href={links.wsapGroup}
                className="text-myBlack font-medium text-lg underline hover:text-primary transition-colors"
              >
                Join our WhatsApp group
              </a>
            </div>


            <div className="space-y-12">
              <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden ">
                <Image
                  className="w-full h-full object-cover"
                  src={pageData.imageUrls[0]}
                  fill
                  alt="About Boquete Panama Shabbat"
                />
              </div>

              <div className="relative w-full h-64 md:h-80 lg:h-[500px] rounded-2xl overflow-hidden mb-6 ">
                <Image
                  className="w-full h-full object-cover"
                  src={pageData.imageUrls[2]}
                  fill
                  alt="About Boquete Panama Shabbat"
                />
              </div>
            </div>
          </div>

          <div className="relative order-2">
            <div className="hidden md:flex justify-end items-center h-36 ">
              <ButtonTheme title="Join our Shabbat Table!" variation={3} href={links.cta} />
            </div>

            <div className="hidden md:inline-block relative w-full h-64 md:h-80 lg:h-[700px] rounded-2xl overflow-hidden mb-14 ">
              <Image
                className="w-full h-full object-cover"
                src={pageData.imageUrls[1]}
                fill
                alt="About Boquete Panama Shabbat"
              />
            </div>

            <p className="text-gray-text text-base mb-12 leading-relaxed">
              {pageData.description2}
            </p>

            <div className="space-y-4">
              {pageData.itemList.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary rounded-full w-6 h-6 min-w-6 min-h-6 flex justify-center items-center flex-shrink-0">
                    <FaCheck className="text-white text-sm flex-shrink-0" />
                  </div>
                  <span className="text-myBlack font-bold text-lg">
                    {item.text}
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