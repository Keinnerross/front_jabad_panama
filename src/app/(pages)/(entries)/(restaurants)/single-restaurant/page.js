import React from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { Amenities } from "@/app/components/sections/(Entries)/amenites";
import { CategoryTag } from "@/app/components/ui/common/categoryTag";

export default function Single() {
    return (
        <div className="w-full flex justify-center py-20">
            <div className="w-full max-w-7xl px-6 md:px-0">
                {/* Hero Section */}
                <section className="mb-16 md:mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                        <div className="md:w-[60%]">
                            <h1 className="text-4xl font-bold text-darkBlue mb-6">
                                About Chabad House Panama City
                            </h1>
                            <p className="text-gray-text text-sm  leading-relaxed mb-6 md:mb-0">
                                Welcome to Chabad of Panama City, where we open our doors to every
                                member of the Jewish community—whether you live here, are visiting
                                on business, or enjoying a vacation. Our mission is to nurture
                                Jewish pride through study and celebration, support both the
                                spiritual and material needs of all Jews regardless of background,
                                and create a warm, traditional center that feels like home for
                                everyone.
                            </p>
                        </div>
                        <ButtonTheme title="Browse gallery" />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <CategoryTag categoryTitle="Kosher" />
                        <CategoryTag categoryTitle="Meat Restaurant" />
                        <CategoryTag categoryTitle="Five Stars" />
                    </div>

                    <div className="w-full h-80 md:h-[500px] rounded-xl bg-red-300 overflow-hidden">
                        {/* Replace with Next.js Image component */}
                        <div className="w-full h-full object-cover bg-red-300" />
                    </div>
                </section>
                {/* Main Content Section */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* About Section */}
                    <div className="lg:w-[70%]">
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-darkBlue mb-6">
                                About Chabad House
                            </h2>
                            <div className="text-gray-text text-sm leading-relaxed space-y-4">
                                <p>
                                    Chabad of Panama City reaffirms its dedication to best serve the
                                    needs of our community, as well as the Jewish community at large
                                    who make Panama City their temporary home while on vacation or
                                    business.
                                </p>
                                <p>
                                    To strengthen the Panama Jewish Community by promoting Jewish
                                    pride, study and celebration.
                                </p>
                                <p>
                                    We are committed to promoting Jewish knowledge, awareness and
                                    practice, strengthening Jewish identity and pride, and affording
                                    every Jew the opportunity to experience the joy and vibrancy of
                                    his or her Jewish heritage.
                                </p>
                                <p>
                                    To provide for the spiritual & material needs of all Jews in the
                                    community - regardless of their background or affiliation.
                                </p>
                                <p>
                                    To establish a warm and traditional community Center where
                                    everyone is made to feel welcome and comfortable.
                                </p>
                                <p>
                                    To fulfill the mandate of the{" "}
                                    <a
                                        href="https://www.chabadpanama.com/Article.asp?AID=4623853"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className="font-bold text-primary underline hover:text-darkBlue transition-colors"
                                    >
                                        Lubavitcher Rebbe
                                    </a>{" "}
                                    by increasing in acts of goodness and kindness for all humankind;
                                    thus preparing the world for the ultimate redemption.
                                </p>
                                <p>
                                    Sincerely,
                                    <br />
                                    <br />
                                    Rabbi Mendi &amp; Braha Karniel
                                </p>
                            </div>
                        </section>


                        <Amenities />

                        {/* Gallery Section */}
                        <section className="mt-10">
                            <h2 className="text-3xl font-bold text-darkBlue mb-8">
                                Photo gallery
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square rounded-xl overflow-hidden bg-red-300"
                                    >
                                        {/* Replace with Next.js Image component */}
                                        <div className="w-full h-full object-cover bg-red-300" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-[30%]">
                        <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">
                            <div className="space-y-8">
                                <div className="w-12 h-12 bg-red-300 rounded-full"></div>
                                <h3 className="text-2xl font-bold text-darkBlue">
                                    Chabad shluchim
                                </h3>
                                <p className="text-gray-text text-sm">
                                    Our Chabad shluchim bring warmth, education, and spiritual
                                    support to Panama City's Jewish community.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <FaUser className="text-darkBlue mt-1 flex-shrink-0" />
                                        <p>
                                            <span className="font-semibold text-darkBlue">
                                                Rabbi Mendi Karniel
                                            </span>{" "}
                                            - Chabad Shliach
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaUser className="text-darkBlue mt-1 flex-shrink-0" />
                                        <p>
                                            <span className="font-semibold text-darkBlue">
                                                Mrs. Braha Karniel
                                            </span>{" "}
                                            - Chabad Shlucha
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};