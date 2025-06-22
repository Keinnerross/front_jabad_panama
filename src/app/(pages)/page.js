

import { Hero } from "../components/sections/Home/hero";
import { AboutHome } from '../components/sections/Home/aboutHome'
import { PackagesHome } from "../components/sections/Home/packagesHome";
import { MapSection } from "../components/sections/Contact/mapSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutHome />
      <PackagesHome />
      <MapSection />
    </div>
  );
}
