'use client'

import { useEffect, useState } from "react";
import { ButtonTheme } from "../../ui/common/buttonTheme"

export const MapSection = () => {
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
            <p>Bajo Boquete, Chiriqui, Panama </p>
            <p>Calle 4a con Calle C, (reference: Hotel Isla Verde).</p>
            <p>Ph: 507-6243-0666</p>
          </div>
          <div>
            <ButtonTheme title="Navigate" href="https://maps.app.goo.gl/Q3txjtyXyjXDsNDY6" variation={3} />
          </div>

        </div>

        <div className="w-full h-[200px] md:h-[500px] rounded-3xl overflow-hidden ">
          {isMounted && (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.1143825082404!2d-82.4351859!3d8.7753082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa5ecdbfec33b5d%3A0x7d51f537d9d2c88c!2sChabad%20Boquete!5e0!3m2!1ses!2scl!4v1751043077720!5m2!1ses!2scl"
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
