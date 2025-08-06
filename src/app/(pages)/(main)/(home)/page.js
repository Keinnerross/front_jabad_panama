import React from "react";
import { FoodHomeSlider } from "@/app/components/sections/(sliders)/foodHomeSlider";
import { HotelHomeSlider } from "@/app/components/sections/(sliders)/hotelHomeSlider";
import { MapSection } from "@/app/components/sections/Contact/mapSection";
import { AboutHome } from "@/app/components/sections/Home/aboutHome";
import { AttractionsHome } from "@/app/components/sections/Home/attractionsHome";
import { CardsHeroWrapper } from "@/app/components/sections/Home/CardsHeroWrapper";
import { Hero } from "@/app/components/sections/Home/hero";
import { PackagesHome } from "@/app/components/sections/Home/packagesHome";
import { PackagesVideo } from "@/app/components/sections/Home/packagesVideo";
import { api } from "@/app/services/strapiApiFetch";
import { CustomVideoSection } from "@/app/components/sections/Home/customVideoHome";

export default async function Home() {

  // Llamadas a la API como server component
  const [aboutData, restaurantsData, hotelsData, siteConfig, packagesData, activitiesData, customVideoData] = await Promise.all([
    api.homeAbout(),
    api.restaurants(),
    api.hotels(),
    api.siteConfig(),
    api.packages(),
    api.activities(),
    api.customVideo(),

  ]);

  return (
    <div className="overflow-x-hidden">
      <Hero siteConfig={siteConfig || {}} />
      <div className="w-full bg-blueBackground flex justify-center ">
        <div className="w-full max-w-7xl px-4  mx:px-0 z-10 -translate-y-[50px] md:-translate-y-[70px] lg:-translate-y-[70px]">
          <CardsHeroWrapper />
        </div>
      </div>

      <AboutHome aboutData={aboutData || {}} />
      <FoodHomeSlider restaurantsData={restaurantsData || []} siteConfig={siteConfig || {}} />
      {/*   <PackagesHome packagesData={packagesData || {}} href="/packages" />
      <PackagesVideo packagesData={packagesData || {}} /> */}
      <CustomVideoSection customVideoData={customVideoData.home_video || {}} />
      <HotelHomeSlider hotelsData={hotelsData || []} />
      <AttractionsHome activitiesData={activitiesData || []} siteConfig={siteConfig || {}} />
      <MapSection siteConfig={siteConfig || {}} />
    </div>
  );
}


