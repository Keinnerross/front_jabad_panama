import { FoodHomeSlider } from "@/app/components/sections/(sliders)/foodHomeSlider";
import { HotelHomeSlider } from "@/app/components/sections/(sliders)/hotelHomeSlider";
import { MapSection } from "@/app/components/sections/Contact/mapSection";
import { AboutHome } from "@/app/components/sections/Home/aboutHome";
import { AttractionsHome } from "@/app/components/sections/Home/attractionsHome";
import { CardsHeroSection } from "@/app/components/sections/Home/cardsHeroSection";
import { Hero } from "@/app/components/sections/Home/hero";
import { PackagesHome } from "@/app/components/sections/Home/packagesHome";
import { api } from "@/app/services/strapiApiFetch";


export default async function Home() {
  const aboutData = await api.homeAbout();
  const restaurantsData = await api.restaurants();
  const hotelsData = await api.hotels();
  const siteConfig = await api.siteConfig();







  return (
    <div className="overflow-x-hidden">
      <Hero siteConfig={siteConfig} />
      <div className="w-full bg-blueBackground flex justify-center ">
        <div className="w-full max-w-7xl px-4  mx:px-0 z-10 -translate-y-[50px] md:-translate-y-[70px] lg:-translate-y-[70px]">
          <CardsHeroSection />
        </div>
      </div>
      <AboutHome aboutData={aboutData} />
      <FoodHomeSlider restaurantsData={restaurantsData} />
      <PackagesHome href="/packages" title="All inclusive packages: Leave the thinking to us" />
      <HotelHomeSlider hotelsData={hotelsData} />
      <AttractionsHome />
      <MapSection siteConfig={siteConfig} />
    </div>
  );
}


