'use client'
import { useEffect, useState } from "react";
import { ButtonTheme } from "../../ui/common/buttonTheme"

export const MapSection = ({ siteConfig }) => {


  console.log(siteConfig)



  const fallbackData = {
    phone: "+1 2345 6789",
    address: "Gold Street 123",
    city: "New York, USA.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193596.2600280618!2d-74.14431244705203!3d40.69728463489951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNueva%20York%2C%20EE.%20UU.!5e0!3m2!1ses!2scl!4v1752277682182!5m2!1ses!2scl",
    navigateUrl: "#"
  };




  const sectionData = {
    phone: siteConfig?.phone || fallbackData.phone,
    address: siteConfig?.address || fallbackData.address,
    city: siteConfig?.city || fallbackData.city,
    mapUrl: siteConfig?.mapUrl || fallbackData.mapUrl,
    navigateUrl: siteConfig?.navigateUrl || fallbackData.navigateUrl
  };


  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return (
    <section className="w-full flex justify-center items-center pb-24 pt-10 md:pt-16  px-6 md:px-0">
      <div className="max-w-7xl w-7xl mx-auto flex flex-col justify-center items-center gap-10 ">
        <h2 className="text-center text-myBlack font-bold text-3xl md:text-4xl">
          You will find us here
        </h2>
        <div className="flex justify-between items-center w-full md:w-[70%] text-gray-800 font-medium gap-4 md:gap-0">
          <div>
            <p>{sectionData.city}</p>
            <p>{sectionData.address}</p>
            <p>Ph: {sectionData.phone}</p>
          </div>
          <div>
            <ButtonTheme title="Navigate" href={sectionData.navigateUrl} variation={3} />
          </div>
        </div>
        <div className="w-full h-[200px] md:h-[500px] rounded-3xl overflow-hidden ">
          {isMounted && (
            <iframe
              src={sectionData.mapUrl}
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          )}
        </div>
      </div>
    </section>
  )
}
