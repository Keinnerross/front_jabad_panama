
import React from "react";
import Image from "next/image";
import { FiMail } from "react-icons/fi";
import { api } from "@/app/services/strapiApiFetch";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { NewsletterForm } from "../ui/newsletter/NewsletterForm";


export const Footer = async () => {
  const siteConfig = await api.siteConfig();
  const activitiesData = await api.activities();

  const fallbackData = [
    {
      imageUrls: ["/assets/global/asset001.png"]
    },
    {
      imageUrls: ["/assets/global/asset001.png"]
    },
    {
      imageUrls: ["/assets/global/asset001.png"]
    },

  ];


  let allImages = [];

  const arrayAllImages = (data) => {
    if (Array.isArray(data)) {
      data.forEach(activity => {
        if (activity.imageUrls) {
          // Si imageUrls es un array, concatenamos sus elementos
          if (Array.isArray(activity.imageUrls)) {
            allImages = allImages.concat(activity.imageUrls);
          }
          // Si imageUrls es un string, lo añadimos directamente
          else if (typeof activity.imageUrls === 'string') {
            allImages.push(activity.imageUrls);
          }
        }
      });
    }

    return allImages;
  }
  const arrayAllImagesUrl = arrayAllImages(activitiesData);
  const imageUrls = imagesArrayValidation(arrayAllImagesUrl, fallbackData);

  const categoriesActivities = activitiesData?.map((activity) => ({
    title: activity.title || "lorep Ipsum",
  }))
  const displayedActivitiesPictures = imageUrls.slice(-3);
  const displayedInfoActivities = categoriesActivities.slice(-3)




  // Datos de navegación que podrían venir de Strapi
  const menuSections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", path: "/" },
        { name: "About us", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Donations", path: "/donations" }
      ]
    },
    {
      title: "Activities",
      links: [
        { name: "Restaurants", path: "/restaurants" },
        { name: "Activities", path: "/activities" },
        { name: "Packages", path: "/packages" },
        { name: "Accommodations", path: "/accommodations" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Shabbat Box", path: "/shabbat-holidays" },
        { name: "Reservations", path: "/shabbat-holidays" }
      ]
    },
    {
      title: "Attractions",
      links: displayedInfoActivities.map((activity, i) => ({
        name: activity.title,
        path: "/packages",
        image: displayedActivitiesPictures[i]
      }))
    },
    {
      title: "Help",
      links: [
        { name: "Tourist Info", path: "/visitor-information" },
        { name: "Community", path: "/visitor-information" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "FAQS", path: "/#" },
        { name: "Terms & Conditions", path: "/#" },
        { name: "Privacy Policy", path: "/#" }
      ]
    }
  ];

  return (
    <footer className="w-full bg-blueBackground pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:px-0">
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
                      <a href={link.path} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 relative rounded-md overflow-hidden flex-shrink-0">
                          <Image src={link.image} alt={link.name} fill className="object-cover" />
                        </div>
                        <span className="text-gray-text group-hover:text-primary transition-colors text-base">{link.name}</span>
                      </a>
                    ) : (
                      <a href={link.path} className="text-gray-text hover:text-primary transition-colors text-base">{link.name}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <NewsletterForm />

        {/* Derechos de autor */}
        <p className="mt-4 text-center text-gray-500">
          © {new Date().getFullYear()} {siteConfig.site_title || "Site Title"}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};