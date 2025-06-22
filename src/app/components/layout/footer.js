import React from "react";
import Image from "next/image";
import { FiMail } from "react-icons/fi";

export const Footer = () => {
  // Datos de navegación que podrían venir de Strapi
  const menuSections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", path: "/" },
        { name: "About us", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Donations", path: "/donate" }
      ]
    },
    {
      title: "Activities",
      links: [
        { name: "Restaurants", path: "/activities/restaurants" },
        { name: "Activities", path: "/activities" },
        { name: "Packages", path: "/packages" },
        { name: "Accomodations", path: "/accomodations" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Shabbat Box", path: "/services/shabbat-box" },
        { name: "Reservations", path: "/reservations" }
      ]
    },
    {
      title: "Attractions",
      links: [
        { 
          name: "Waterfalls", 
          path: "/attractions/waterfalls",
          image: "/waterfalls.jpg" 
        },
        { 
          name: "Panama City", 
          path: "/attractions/panama-city",
          image: "/panama-city.jpg" 
        },
        { 
          name: "Gondola Trip", 
          path: "/attractions/gondola-trip",
          image: "/gondola.jpg" 
        }
      ]
    },
    {
      title: "Help",
      links: [
        { name: "Tourist Info", path: "/help/tourist-info" },
        { name: "Community", path: "/community" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "FAQS", path: "/faqs" },
        { name: "Terms & Conditions", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" }
      ]
    }
  ];

  return (
    <footer className="w-full bg-blueBackground pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 mb-12">
          {/* Columnas de menú */}
          {menuSections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-darkBlue font-bold text-lg mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {section.title === "Attractions" ? (
                      <a 
                        href={link.path} 
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-md bg-red-300 overflow-hidden flex-shrink-0">
                          {/* Imagen de Next.js */}
                          <div className="w-full h-full bg-red-300" />
                        </div>
                        <span className="text-gray-text group-hover:text-primary transition-colors text-base">
                          {link.name}
                        </span>
                      </a>
                    ) : (
                      <a 
                        href={link.path} 
                        className="text-gray-text hover:text-primary transition-colors text-base"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-darkBlue rounded-xl p-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-start gap-4 max-w-md">
              <div className="bg-primary p-3 rounded-lg">
                <FiMail className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">
                  Stay Connected with Chabad Panama
                </h3>
                <p className="text-blue-100">
                  Get updates about Shabbat meals, upcoming holidays, and
                  community events while you're visiting Panama.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <FiMail className="absolute right-3 top-3.5 text-gray-400" />
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap">
                Keep Me Posted
              </button>
            </div>
          </div>
        </div>

        {/* Derechos de autor */}
          <p className="mt-4 text-center text-gray-500">© {new Date().getFullYear()} Chabad Panama. All rights reserved.</p>
      </div>
    </footer>
  );
};