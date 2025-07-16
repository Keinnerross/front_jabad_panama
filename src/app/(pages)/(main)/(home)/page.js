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


export default async function Home() {


  const aboutData = await api.homeAbout();

  const restaurantsData = await api.restaurants();
  const hotelsData = await api.hotels();
  const siteConfig = await api.siteConfig();
  const packagesData = await api.packages();
  const activitiesData = await api.activities();




  return (
    <div className="overflow-x-hidden">
      <Hero siteConfig={siteConfig} />
      <div className="w-full bg-blueBackground flex justify-center ">
        <div className="w-full max-w-7xl px-4  mx:px-0 z-10 -translate-y-[50px] md:-translate-y-[70px] lg:-translate-y-[70px]">
          <CardsHeroWrapper />
        </div>
      </div>

      <AboutHome aboutData={aboutData} />
      <FoodHomeSlider restaurantsData={restaurantsData} />
      <PackagesHome packagesData={packagesData} href="/packages" />
      <PackagesVideo packagesData={packagesData} />
      <HotelHomeSlider hotelsData={hotelsData} />
      <AttractionsHome activitiesData={activitiesData} />
      <MapSection siteConfig={siteConfig} />
    </div>
  );
}


