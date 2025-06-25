"use client"

import React, { Fragment, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { TouristInfoEntry } from "@/app/components/sections/(Entries)/touristInfoEntry"
import { FaInstagram, FaFacebookF } from "react-icons/fa"

export default function TouristInfo() {
    const dataEntry = [
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
            pictureUrl: "/images/shabbat-family.jpg",
        },
        {
            title: "Fill Out the Security Form",
            shortDescription:
                "Your safety is important to us—please complete the <strong>security form</strong> before your visit.",
            longDescription: `
            <p>In collaboration with the <strong>CSS (Community Security Service)</strong> we are committed to your safety.</p>
            <p>All new visitors are required to fill out a security form in advance.</p>
            <p>Once completed, you will receive your Chabad access card (valid for 30 days), allowing you to attend all services and events at the Chabad House.</p>
            <p><strong>ID is required.</strong></p>
            <p>Fill out the form at: <a href="https://form.chabadpanama.com">form.chabadpanama.com</a></p>
            <p>If you have questions, contact us at <a href="mailto:info@chabadpanama.com">info@chabadpanama.com</a></p>
          `,
            pictureUrl: "/images/security-form.jpg",
        },
        {
            title: "Winter Vacation in Panama",
            shortDescription:
                "Spend your winter in paradise! Panama is the perfect <strong>kosher-friendly</strong> destination.",
            longDescription: `
            <p>Panama is a wonderful destination for many Jewish travelers throughout the winter. The local Chabad community is ready to help visitors feel at home and enjoy their stay.</p>
            <br/>
            <h4>❄️ SPECIAL WINTER BREAKS:</h4>
            <ul>
              <li>Chanukah 2024</li>
              <li>Winter Break 2025</li>
              <li>Midwinter 2025</li>
            </ul>
            <br/>
            <p>We strongly suggest you plan your vacation ahead of time, especially by placing important forms on our website.</p>
            <p>Meal plans, children’s activities, tours and Shabbat meals are offered in partnership with Chabad Panama.</p>
            <br/>
            <p>More info: <a href="mailto:office@chabadpanama.com">office@chabadpanama.com</a></p>
          `,
            pictureUrl: "/images/waterfall-vacation.jpg",
        },
        {
            title: "Mikvah in Panama City",
            shortDescription:
                "Mikvah services are available for <strong>both men and women</strong> at the Chabad Center.",
            longDescription: `
            <p><strong>MIKVAH NASHIM</strong><br/>Women’s Mikvah available with modern facilities located at the Chabad Center. Appointments required.</p>
            <p><strong>MIKVAH GVARIM</strong><br/>Men’s Mikvah available daily. No appointment necessary.</p>
            <p>To schedule a women’s appointment, please contact the office.</p>
            <br/>
            <p>Call or WhatsApp: <a href="tel:+50763213235">+507-6321-3235</a></p>
          `,
            pictureUrl: "/images/mikvah.jpg",
        },
        {
            title: "Minyan/Services",
            shortDescription:
                "Daily prayer services are held at the <strong>Chabad House</strong> with multiple minyanim.",
            longDescription: `
            <p>Chabad of Panama holds Minyanim in all parts of the week.</p>
            <p>Shacharit, Mincha and Maariv times are available upon request or through the office.</p>
            <p>Children are welcome with supervision, and the environment is friendly to both Sephardic and Ashkenazic traditions.</p>
          `,
            pictureUrl: "/images/minyan.jpg",
        },
        {
            title: "ERUV",
            shortDescription:
                "An <strong>Eruv</strong> is available in Panama City, allowing residents and guests to carry on Shabbat.",
            longDescription: `
            <p>There is an active Eruv in Panama City, enabling those who observe Jewish law to carry on Shabbat within defined boundaries.</p>
            <p>It covers key zones like Punta Paitilla, Punta Pacifica, Balboa, Marbella, San Francisco, Obarrio, Bella Vista, Avenida Balboa, and El Cangrejo.</p>
            <p>For the exact route and boundaries, we recommend downloading the <a href="https://chabadpanama.com/eruv">Eruv Map here</a>.</p>
          `,
            pictureUrl: "/images/eruv-map.jpg",
        },
    ];


    const sectionRefs = useRef([])
    const [activeIndex, setActiveIndex] = useState(0)

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
                <div className="w-full max-w-7xl px-4 md:px-0">
                    <div className="flex justify-center items-center flex-col gap-6">
                        <div className="md:w-[60%] text-center flex flex-col items-center gap-6">
                            <h1 className="text-4xl font-bold text-darkBlue md:w-[40%]">
                                Essential Info for Your Stay                        </h1>
                            <p className="text-gray-text text-sm  leading-relaxed ">
                                Panama city impresses everyone with its charming and welcoming atmosphere, picturesque oceanfront location, and of course year-round warm weather. Panama is a great place for all aspects of Jewish life: Synagogues, Jewish day schools, kosher food choices, etc., in short – all the conveniences of a developed and thriving community. Whether you are coming for a short business trip, extended stay, traveling with children or as a group of adults, we would be happy to help make your visit a truly memorable one.
                            </p>
                        </div>
                        <div className="w-full h-80 md:h-[450px] rounded-2xl bg-red-300 overflow-hidden">
                            {/* Replace with Next.js Image component */}
                            <div className="w-full h-full object-cover bg-red-300" />
                        </div>



                    </div>







                </div>

                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground z-10" />

                <div className="absolute top-0 left-0 w-40 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div>

                <div className="absolute top-1/3 right-0 w-60 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div>

            </section>


            <section className="w-full flex justify-center pb-20">
                <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <div className="lg:w-[30%]">
                        <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">

                            <h2 className="font-semibold text-2xl mb-4">Table of Contents</h2>
                            <ul className="flex flex-col gap-2">
                                {dataEntry.map((entry, i) => (
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
                                <div className="bg-primary p-2 rounded-xl cursor-pointer">
                                    <FaFacebookF fill="white" size={18} />
                                </div>
                                <div className="bg-primary p-2 rounded-xl cursor-pointer">
                                    <FaInstagram fill="white" size={19} />
                                </div>


                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-[70%] flex flex-col gap-14">
                        {dataEntry.map((entry, i) => (
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