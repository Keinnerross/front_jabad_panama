import { FoodHomeSlider } from "@/app/components/sections/(sliders)/foodHomeSlider";
import { HotelHomeSlider } from "@/app/components/sections/(sliders)/hotelHomeSlider";
import { MapSection } from "@/app/components/sections/Contact/mapSection";
import { AboutHome } from "@/app/components/sections/Home/aboutHome";
import { AtractionsHome } from "@/app/components/sections/Home/atractionsHome";
import { Hero } from "@/app/components/sections/Home/hero";
import { PackagesHome } from "@/app/components/sections/Home/packagesHome";



export default function Home() {
  return (
    <div>
      <Hero />
      <AboutHome />
      <FoodHomeSlider />
      <PackagesHome />
      <HotelHomeSlider />
      <AtractionsHome/>
      <MapSection />
    </div>
  );
}
