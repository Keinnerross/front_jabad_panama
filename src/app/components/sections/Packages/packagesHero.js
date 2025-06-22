"use client";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";

export const packagesHero = () => {

  return (
    <section className="bg-blueBackground py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-center justify-between">
        {/* Texto */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <h2 className="text-3xl font-bold text-myBlack mb-6">
            Explore the Best Things to See and Do in Vibrant Panama City
          </h2>
          <p className="text-gray-text text-base leading-relaxed mb-6">
            From historic streets and cultural gems to breathtaking nature and
            thrilling adventures, Panama City offers experiences for every kind
            of traveler.
          </p>
          <button className="px-6 py-3 bg-darkBlue text-white font-medium rounded-lg text-sm hover:opacity-90 transition">Let’s explore experiences!
          </button>
        </div>

        {/* Galería de imágenes */}
        <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-3">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden bg-red-300 aspect-square"
            >
              <Image
                src="https://via.placeholder.com/300"
                alt={`Panama image ${i + 1}`}
                width={300}
                height={300}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
