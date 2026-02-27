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
import { Announces } from "@/app/components/sections/Home/announces";
import { getAvailableEvents } from "@/app/utils/eventAvailability";

export default async function Home() {

  // Fetch platform settings first to determine what modules are enabled
  const platformSettings = await api.platformSettings() || {};

  // Build API calls array based on enabled modules
  const apiCalls = [
    api.homeAbout(),
    api.restaurants(),
    api.hotels(),
    api.siteConfig(),
    api.activities(),
    api.customVideo(),
    api.shabbatsAndHolidays(), // Fetch custom events
  ];

  // Only fetch packages data if the module is enabled
  if (platformSettings.habilitar_packages) {
    apiCalls.push(api.packages());
  }













  // Execute all API calls
  const results = await Promise.all(apiCalls);

  // Destructure results based on what was fetched
  const [aboutData, restaurantsData, hotelsData, siteConfig, activitiesData, customVideoData, customEventsData] = results;
  const packagesData = platformSettings.habilitar_packages ? results[7] : null;






  // Filter custom events for announces and sort by order
  const availableEvents = getAvailableEvents(customEventsData || []);
  const announcesData = availableEvents
    .filter(event => event?.announce?.promote_on_home === true)
    .sort((a, b) => {
      const orderA = a.order !== undefined && a.order !== null ? a.order : 100;
      const orderB = b.order !== undefined && b.order !== null ? b.order : 100;
      return orderA - orderB;
    });

  return (
    <div className="overflow-x-hidden">
      <Hero siteConfig={siteConfig || {}} />
      <div className="w-full bg-blueBackground flex justify-center ">
        <div className="w-full max-w-7xl px-4 sm:px-6 md:px-6 lg:px-4 z-10 -translate-y-[60px] sm:-translate-y-[40px] md:-translate-y-[50px] lg:-translate-y-[70px] 2xl:-translate-y-[70px]  ">
          <CardsHeroWrapper platformSettings={platformSettings} />
        </div>
      </div>
      <Announces announcesData={announcesData} />
      <AboutHome aboutData={aboutData || {}} />
      <FoodHomeSlider restaurantsData={restaurantsData || []} siteConfig={siteConfig || {}} />
      {/* Only render packages sections if the module is enabled */}


      {platformSettings.habilitar_packages && (
        <>
          <PackagesHome packagesData={packagesData || {}} href="/packages" />
          <PackagesVideo packagesData={packagesData || {}} />
        </>
      )}



      {console.log("This: ", customVideoData.home_video.is_active)}



      {customVideoData.home_video.is_active === "Active" && (

        <>
        
        <CustomVideoSection customVideoData={customVideoData.home_video || {}} />
        </>
      )}





        {/* <CustomVideoSection customVideoData={customVideoData.home_video || {}} /> */}





      <>
        <HotelHomeSlider hotelsData={hotelsData || []} singleHotelsActive={platformSettings?.SingleHotelsActive === true} />
        <AttractionsHome activitiesData={activitiesData || []} siteConfig={siteConfig || {}} singleActivitiesActive={platformSettings?.SingleActivitiesActive === true} />
      </>
      <MapSection siteConfig={siteConfig || {}} />
    </div>
  );
}


