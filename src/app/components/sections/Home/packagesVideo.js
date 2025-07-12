'use client'
import React from "react";
import dynamic from "next/dynamic";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { GoTriangleRight } from "react-icons/go";

// Componente separado para el iframe de YouTube
const YouTubeEmbed = ({ videoUrl }) => (
  <iframe
    className="w-full h-full"
    src={videoUrl}
    title="All-inclusive Kosher vacations to Boquete, Panama"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  />
);

// Importación dinámica del iframe para evitar problemas de hidratación
const DynamicYouTubeEmbed = dynamic(() => Promise.resolve(YouTubeEmbed), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-800">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[10px] border-white bg-opacity-20 flex items-center justify-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center">
          <GoTriangleRight className="text-white text-7xl ml-2" />
        </div>
      </div>
    </div>
  )
});

export const PackagesVideo = ({ title = "Everything about our packages", buttonText = "Check Details", href = "#", packagesData }) => {









/*   console.log(packagesData) */



  const fallbackData = {
    videoUrl: "  https://www.youtube.com/embed/2u9dYbs1KCE?autoplay=1&mute=1",

  };



  // Separamos info de about
  const packagesInfo = packagesData?.hero_packages;

  // Procesamos datos con fallback
  const pageData = {
    videoUrl: packagesInfo?.videoUrl || fallbackData.videoUrl,
  };















  return (
    <section className="bg-white pt-8 pb-16 flex justify-center items-center">
      <div className="w-full max-w-7xl px-6 md:px-0">
        {/* Header Video Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darkBlue">
            {title}
          </h2>
          <ButtonTheme title={buttonText} href={href} />
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-myBlack aspect-video w-full z-20">
          <DynamicYouTubeEmbed videoUrl={pageData.videoUrl} />
        </div>
      </div>
    </section>
  );
};