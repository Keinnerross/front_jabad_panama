
'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMail } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { api } from "@/app/services/strapiApiFetch";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { NewsletterForm } from "../ui/newsletter/NewsletterForm";
import { getAssetPath } from "@/app/utils/assetPath";
import { useOverrides } from "@/app/overrides/OverridesProvider";
import { applyLinkOverrides } from "@/app/overrides/applyOverrides";


export const Footer = ({ platformSettings }) => {
  // Overrides por instancia (texto/links/ocultar)
  const { getText, getLink, config: overridesConfig } = useOverrides();

  const [siteConfig, setSiteConfig] = useState(null);
  const [activitiesData, setActivitiesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Footer: Starting API calls...');

        const [siteConfigData, activitiesDataFetch] = await Promise.all([
          api.siteConfig(),
          api.activities()
        ]);

        console.log('🔍 Footer Results:', {
          siteConfig: {
            type: typeof siteConfigData,
            data: siteConfigData
          },
          activities: {
            type: typeof activitiesDataFetch,
            length: Array.isArray(activitiesDataFetch) ? activitiesDataFetch.length : 'not array',
            data: activitiesDataFetch
          }
        });

        setSiteConfig(siteConfigData);
        setActivitiesData(activitiesDataFetch || []);
      } catch (error) {
        console.error('Error fetching footer data:', error);
        setSiteConfig({});
        setActivitiesData([]);
      }
    };
    fetchData();
  }, []);

  const fallbackData = [
    {
      imageUrls: [getAssetPath("/assets/global/asset001.png")]
    },
    {
      imageUrls: [getAssetPath("/assets/global/asset001.png")]
    },
    {
      imageUrls: [getAssetPath("/assets/global/asset001.png")]
    },

  ];


  // Procesar actividades con imagen única
  const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
  const processedActivities = (activitiesData && Array.isArray(activitiesData)) 
    ? activitiesData.map((activity) => ({
        title: activity.title || "Lorem Ipsum",
        // Usar thumbnail para el footer (40x40px) - imageUrl es ahora un array
        imageUrl: activity.imageUrl?.[0]?.formats?.thumbnail?.url
          ? `${url}${activity.imageUrl[0].formats.thumbnail.url}`
          : activity.imageUrl?.[0]?.url
            ? `${url}${activity.imageUrl[0].url}`
            : getAssetPath("/assets/global/asset001.png")
      }))
    : [];
  
  // Tomar solo las últimas 3 actividades para mostrar
  const displayedActivities = processedActivities.slice(-3);




  // Datos de navegación que podrían venir de Strapi
  // Cada columna y link lleva un `id` estable = ancla para overrides por instancia
  // (cambiar texto/link u ocultar). Ver src/app/overrides/README.md.
  const menuSections = [
    {
      id: "footer-col-main",
      title: "Main Pages",
      links: [
        { id: "footer-link-home", name: "Home", path: "/" },
        { id: "footer-link-about", name: "About us", path: "/about" },
        { id: "footer-link-contact", name: "Contact", path: "/contact" },
        { id: "footer-link-donations", name: "Donations", path: "/donation" }
      ]
    },
    {
      id: "footer-col-activities",
      title: "Activities",
      links: [
        { id: "footer-link-restaurants", name: "Restaurants", path: "/restaurants" },
        { id: "footer-link-activities", name: "Activities", path: "/activities" },
        ...(platformSettings?.habilitar_packages ? [
          { id: "footer-link-packages", name: "Packages", path: "/packages" }
        ] : []),
        { id: "footer-link-accommodations", name: "Accommodations", path: "/accommodations" }
      ]
    },
    {
      id: "footer-col-kosher",
      title: "Kosher Food",
      links: [
        // Shabbat Box solo se muestra si isActiveShabbatBox es true
        ...(platformSettings?.isActiveShabbatBox ? [
          { id: "footer-link-shabbatbox", name: "Shabbat Box", path: "/single-shabbatbox" }
        ] : []),
        { id: "footer-link-shabbat-meals", name: "Shabbat Meals", path: "/shabbat-holidays" }
        // Renderizar aquí los events
      ]
    },
    {
      id: "footer-col-attractions",
      title: "Attractions",
      links: (displayedActivities || []).map((activity) => ({
        name: activity.title,
        path: "/activities",
        image: activity.imageUrl
      }))
    },
    {
      id: "footer-col-help",
      title: "Help",
      links: [
        { id: "footer-link-tourist-info", name: "Tourist Info", path: "/visitor-information" },
        { id: "footer-link-whatsapp-group", name: "Whatsapp Group", path: siteConfig?.whatsapp_groups_url_footer || "/visitor-information" }
      ]
    },
    {
      id: "footer-col-legal",
      title: "Legal",
      links: [
        { id: "footer-link-terms", name: "Terms & Conditions", path: "/terms-conditions" },
        { id: "footer-link-privacy", name: "Privacy Policy", path: "/privacy-policy" }
      ]
    }
  ];

  // Aplica overrides de links por instancia (remapea `path` por `id`) en cada columna.
  const finalSections = menuSections.map((section) => ({
    ...section,
    links: applyLinkOverrides(section.links, overridesConfig?.links),
  }));

  return (
    <footer className="w-full bg-blueBackground pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:px-0">
        {/* Grid principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 mb-12">
          {/* Columnas de menú */}
          {(finalSections || []).map((section, index) => (
            <div key={index} data-cust={section.id} className="mb-6">
              <h3 className="text-darkBlue font-bold text-lg mb-4">
                {getText(section.id, section.title)}
              </h3>
              <ul className="space-y-3">
                {(section.links || []).map((link, linkIndex) => (
                  <li key={linkIndex} data-cust={link.id}>
                    {section.title === "Attractions" ? (
                      <Link href={link.path} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 relative rounded-md overflow-hidden flex-shrink-0">
                          <Image src={link.image} alt={link.name} fill className="object-cover" />
                        </div>
                        <span className="text-gray-text group-hover:text-primary transition-colors text-base">{link.name}</span>
                      </Link>
                    ) : link.name === "Whatsapp Group" ? (
                      <Link href={link.path} target="_blank" rel="noopener noreferrer" className="text-gray-text hover:text-primary transition-colors text-base">{getText(link.id, link.name)}</Link>
                    ) : (
                      <Link href={link.path} className="text-gray-text hover:text-primary transition-colors text-base">{getText(link.id, link.name)}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media Links */}
        {siteConfig?.social_media && (
          <div className="flex justify-center items-center gap-4 mt-8 mb-12">
            {siteConfig.social_media.link_facebook && (
              <a
                data-cust="footer-social-facebook"
                href={siteConfig.social_media.link_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary p-3 rounded-xl hover:bg-opacity-90 transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebookF fill="white" size={20} />
              </a>
            )}
            {siteConfig.social_media.link_instagram && (
              <a
                data-cust="footer-social-instagram"
                href={siteConfig.social_media.link_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary p-3 rounded-xl hover:bg-opacity-90 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram fill="white" size={20} />
              </a>
            )}
            {siteConfig.social_media.link_whatsapp && (
              <a
                data-cust="footer-social-whatsapp"
                href={siteConfig.social_media.link_whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary p-3 rounded-xl hover:bg-opacity-90 transition-all hover:scale-110"
                aria-label="WhatsApp"
              >
                <FaWhatsapp fill="white" size={20} />
              </a>
            )}
          </div>
        )}


        {/* Newsletter */}
        {/* <NewsletterForm /> */}


        {/* Derechos de autor */}
        <p data-cust="footer-credit" className="mt-4 text-center text-gray-500">
          © {new Date().getFullYear()} | Powered by{" "}
          <a
            data-cust="footer-kwb"
            href={getLink("footer-kwb", "https://kosherwithoutborders.com")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary transition-colors underline"
          >
            {getText("footer-kwb", "Kosher Without Borders")}
          </a> - v1.1.6
        </p>
      </div>
    </footer>
  );
};