import { FoodHomeSlider } from "@/app/components/sections/(sliders)/foodHomeSlider";
import { HotelHomeSlider } from "@/app/components/sections/(sliders)/hotelHomeSlider";
import { MapSection } from "@/app/components/sections/Contact/mapSection";
import { AboutHome } from "@/app/components/sections/Home/aboutHome";
import { AttractionsHome } from "@/app/components/sections/Home/attractionsHome";
import { CardsHeroSection } from "@/app/components/sections/Home/cardsHeroSection";
import { Hero } from "@/app/components/sections/Home/hero";
import { PackagesHome } from "@/app/components/sections/Home/packagesHome";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />

      <div className="w-full bg-blueBackground flex justify-center ">
        <div className="w-full max-w-7xl px-4 z-10 -translate-y-[50px] md:-translate-y-[70px] lg:-translate-y-[70px]">
          <CardsHeroSection />
        </div>
      </div>
      <AboutHome />
      <FoodHomeSlider />
      <PackagesHome href="/packages" title="All inclusive packages: Leave the thinking to us" />
      <HotelHomeSlider />
      <AttractionsHome />
      <MapSection />
    </div>
  );
}