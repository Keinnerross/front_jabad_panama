
'use client'
import React from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { PackagesVideo } from "./packagesVideo";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { getAssetPath } from "@/app/utils/assetPath";


export const PackagesHome = ({ href, packagesData }) => {




  const data = {
    packages: ["Gold", "Platinum", "Ultra Luxury"]
  };


  const fallbackData = {
    title: "Title Section",
    description_1: "Lorem imspum",
    description_2: "Lorem imspum",
    videoUrl: "",
    show_logo: true,
    agency_logo: null,
    imagesUrl: [getAssetPath("/assets/global/asset001.png"), getAssetPath("/assets/global/asset001.png")]
  };


  // Separamos info de about
  const packagesInfo = packagesData?.hero_packages;
  const pictures = packagesData?.hero_packages?.pictures || [];



  // Procesamos el logo de la agencia
  let processedAgencyLogo = null;
  if (packagesInfo?.agency_logo) {
    // Si es un objeto con url
    if (packagesInfo.agency_logo.url) {
      processedAgencyLogo = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${packagesInfo.agency_logo.url}`;
    } 
    // Si es un array y tiene elementos
    else if (Array.isArray(packagesInfo.agency_logo) && packagesInfo.agency_logo[0]?.url) {
      processedAgencyLogo = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${packagesInfo.agency_logo[0].url}`;
    }
    // Si es directamente una string URL
    else if (typeof packagesInfo.agency_logo === 'string') {
      processedAgencyLogo = packagesInfo.agency_logo.startsWith('http') 
        ? packagesInfo.agency_logo 
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${packagesInfo.agency_logo}`;
    }
  }

  // Procesamos datos con fallback
  const pageData = {
    title: packagesInfo?.title || fallbackData.title,
    description_1: packagesInfo?.description_1 || fallbackData.description_1,
    description_2: packagesInfo?.description_2 || fallbackData.description_2,
    videoUrl: packagesInfo?.videoUrl || fallbackData.videoUrl,
    show_logo: packagesInfo?.show_logo === true,
    agency_logo: processedAgencyLogo,
    pictures: imagesArrayValidation(pictures, fallbackData)
  };

  // Debug logging
  // console.log('PackagesHome Debug:', {
  //   show_logo: pageData.show_logo,
  //   agency_logo: pageData.agency_logo,
  //   packagesInfo: packagesInfo,
  //   packagesInfo_agency_logo: packagesInfo?.agency_logo,
  //   STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL
  // });



// console.log(processedAgencyLogo)




  return (
    <div className="w-full bg-blueBackground">
      {/* Hero Section */}
      <section className={`max-w-7xl mx-auto px-6 md:px-0 pt-16 md:pt-24 lg:pt-28 pb-14 md:pb-20 lg:pb-24`}>
        <div className="flex flex-col lg:flex-row gap-12 ">
          {/* Text Content */}
          <div className="w-full lg:w-5/12 flex flex-col">
            <h1 className="text-4xl md:text-4xl font-bold text-myBlack mb-6">
              {pageData.title}

            </h1>

            <p className="text-gray-text text-base md:text-base leading-relaxed">
              {pageData.description_1}

            </p>
            <br />
            <p className="text-gray-text text-base md:text-base mb-8 leading-relaxed">
              {pageData.description_2}

            </p>

            {/* Badges Section */}
            <div>
              <p className="font-semibold mb-6 text-lg">Check out our plans below: </p>
              {/* Badges */}
              <div className={`flex flex-wrap gap-4 items-center mb-8 `}>
                {(data?.packages || []).map((item, i) => (
                  <div className="flex gap-2 items-center" key={i}>
                    <FaCheckCircle fill="var(--primary)" size={20} />
                    <p className="text-myBlack font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <ButtonTheme variation={2} title="Explore Packages" href={href ? href : packagesData.link_contact_packages} />
          </div>

          {/* Image Grid */}
          <div className="w-full lg:w-7/12 relative">
            {/* Container que mantiene el aspect ratio */}
            <div className="relative pb-[90%] w-full h-0">
              {/* logo*/}

              {pageData.show_logo && pageData.agency_logo && (
                <div className="hidden md:block absolute top-4 right-4 w-[200px] h-10 rounded-md z-10">
                  <Image
                    src={pageData.agency_logo}
                    fill
                    className="object-contain"
                    alt="Agency Logo"
                    priority
                    sizes="200px"
                  />
                </div>
              )}

              {/* Imagen inferior derecha */}
              <div className="absolute bottom-[10%] right-0 w-[60%] aspect-square rounded-xl overflow-hidden  z-0" >
                <Image src={pageData.pictures?.[0] || getAssetPath("/assets/global/asset001.png")} fill className="w-full h-full object-cover" alt="Beautiful river landscape in Boquete, Panama" sizes="(max-width: 1024px) 60vw, 400px" />
              </div>

              {/* Imagen superior izquierda */}
              <div className="absolute top-0 left-0 w-[65%] aspect-square rounded-xl overflow-hidden  z-10">
                <Image src={pageData.pictures?.[1] || getAssetPath("/assets/global/asset001.png")} fill className="w-full h-full object-cover" alt="Scenic mountain views of Boquete, Panama" sizes="(max-width: 1024px) 65vw, 450px" />
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};