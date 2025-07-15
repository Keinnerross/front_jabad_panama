"use client"
import React, { Fragment, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { TouristInfoEntry } from "@/app/components/sections/(Entries)/touristInfoEntry"
import { FaInstagram, FaFacebookF } from "react-icons/fa"
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation"



export const VisitorInformationSection = ({ infoTouristData, socialMediaLinksData, infoTouristPageData }) => {


    // Datos de fallback
    const fallbackData = [
        {
            title: "Title",
            shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            imageUrls: ["/assets/global/asset001.png"],
            order: 0
        },
        {
            title: "Title",
            descriptionShort: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            descriptionLong: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            imageUrls: ["/assets/global/asset001.png"],
            order: 0
        }
    ];


    // Datos Api Construidos
    const processedData = infoTouristData?.map(entry => ({
        title: entry.title,
        shortDescription: entry.shortDescription,
        longDescription: entry.longDescription,
        order: entry.order,
        imageUrls: entry.pictureUrl || [],
    })) || [];



    // Ordenar por order key con lógica para repetidos
    const sortedData = (processedData.length > 0 ? processedData : fallbackData).sort((a, b) => {
        // Primero ordenar por order
        if (a.order !== b.order) {
            return a.order - b.order;
        }
        // En caso de empate, mantener orden original usando índice implícito
        return 0;
    });

    const dataToUse = sortedData;

    /* const dataEntry = [
        {
            title: "Shabbat in Panama City",
            shortDescription:
                "Experience a warm and welcoming <strong>Shabbat</strong> near the Chabad House.",
            longDescription: `
            <p>3 Shabbat meals at private homes with space for Shabbat conditions while you’re in Panama.</p>
            <p>Please contact Chabad of Panama to confirm your arrival and get Shabbat meal info.</p>
            <p>People new to the area can refer to our updated list of kosher restaurants and our <a href="/faq">Frequently Asked Questions</a> section.</p>
            <br/>
            <h4><strong>SCHEDULE:</strong></h4>
            <br/>

            <ul>
              <li>Friday evening – Mincha and Kabbalat Shabbat at candle lighting time at the Shul at Chabad of Panama</li>
              <li>Shacharit – 9:00 am</li>
              <li>Kiddush – following davening</li>
            </ul>
            <br/>
            <h4>TO REMEMBER:</h4>
            <ul>
              <li>Always dress appropriately when visiting a synagogue</li>
              <li>Pre-register for meals or services using our online system</li>
              <li>Contact the office in case of last-minute changes</li>
            </ul>
          `,
            pictureUrl: "/assets/pictures/about/pic_about (4).jpg",
        },

    ]; */

    const sectionRefs = useRef([])
    const [activeIndex, setActiveIndex] = useState(0)
    /*
    Social Media Links Setting
    */
    const igUrl = socialMediaLinksData?.social_media?.link_instagram || "/#";
    const fbUrl = socialMediaLinksData?.social_media?.link_facebook || "/#";


    const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    const bgUrl = `${url}${infoTouristPageData?.picture?.url}`



    useEffect(() => {
        const handleScroll = () => {
            const offsets = sectionRefs.current.map((ref) => ref?.offsetTop || 0)
            const scrollY = window.scrollY + window.innerHeight / 2;


            for (let i = offsets.length - 1; i >= 0; i--) {
                if (scrollY >= offsets[i]) {
                    setActiveIndex(i)
                    break
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToSection = (index) => {
        const el = sectionRefs.current[index]
        if (el) {
            window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" })
        }
    }




    return (

        <Fragment>

            <section className="w-full flex justify-center  bg-blueBackground overflow-hidden py-20 relative">
                <div className="w-full max-w-7xl px-6 md:px-0">
                    <div className="flex justify-center items-center flex-col gap-6">
                        <div className="md:w-[60%] text-center flex flex-col items-center gap-6">
                            <h1 className="text-4xl font-bold text-darkBlue md:w-[40%]">
                                {infoTouristPageData?.title || "Title"}
                            </h1>
                            <p className="text-gray-text text-sm  leading-relaxed ">
                                {infoTouristPageData?.description || "description"}
                            </p>


                        </div>
                        <div className="w-full h-80 md:h-[450px] rounded-2xl  overflow-hidden relative">
                            {/* Replace with Next.js Image component */}
                            <Image
                                src={bgUrl || "/assets/global/asset001.png"}
                                fill
                                className="w-full h-full object-cover"
                                alt="Panama City tourist information and skyline view"
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground z-10" />
                {/*  <div className="absolute top-0 left-0 w-40 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div>

                <div className="absolute top-1/3 right-0 w-60 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div> */}
            </section>
            <section className="w-full flex justify-center pb-20 px-6 md:px-0">
                <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <div className="lg:w-[30%]">
                        <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">

                            <h2 className="font-semibold text-2xl mb-4">Table of Contents</h2>
                            <ul className="flex flex-col gap-2">
                                {dataToUse.map((entry, i) => (
                                    <li
                                        key={i}
                                        onClick={() => scrollToSection(i)}
                                        className={`cursor-pointer px-4 py-2 rounded-lg transition-all text-base ${activeIndex === i
                                            ? "bg-primary text-white font-semibold"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {entry.title}
                                    </li>
                                ))}
                            </ul>

                            <div className="ml-4 mt-4 flex gap-4 items-center">
                                <a href={fbUrl} target="_blank" className="bg-primary p-2 rounded-xl cursor-pointer">
                                    <FaFacebookF fill="white" size={18} />
                                </a>
                                <a href={igUrl} target="_blank" className="bg-primary p-2 rounded-xl cursor-pointer">
                                    <FaInstagram fill="white" size={19} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-[70%] flex flex-col gap-14">
                        {dataToUse.map((entry, i) => (
                            <div key={i} ref={(el) => (sectionRefs.current[i] = el)}>
                                <TouristInfoEntry data={entry} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Fragment>







    );
}