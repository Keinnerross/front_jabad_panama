import { ButtonTheme } from "@/app/components/ui/buttonTheme";
import React, { Fragment } from "react";
import { FaCheck } from "react-icons/fa";

export default function Donation() {
    return (

        <Fragment>
            <div className="w-full bg-blueBackground flex justify-center relative ">
                {/* Hero Section */}
                <div className="w-full max-w-6xl px-4 pt-12 pb-24 md:pt-24  md:pb-32">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Left Content */}
                        <div className="lg:w-[57%]">
                            <h1 className="text-3xl md:text-5xl font-bold text-myBlack mb-6">
                                Donation to Chabad House Panama City
                            </h1>

                            <p className="text-gray-text text-base mb-8">
                                Your gift keeps Chabad House Panama City's doors open to everyone—whether
                                they're here for a Shabbat meal, a Torah class, or simply a friendly face.
                                With your support we can:
                            </p>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-myBlack mb-4">
                                    Why donating to our charity?
                                </h2>

                                <ul className="space-y-4">
                                    {[
                                        "Host uplifting holiday celebrations and weekly services",
                                        "Offer free educational programs and community events",
                                        "Provide spiritual guidance and material assistance to those in need"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <FaCheck className="text-primary mt-1 flex-shrink-0" />
                                            <span className="text-gray-text">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right Donation Form */}
                        <div className="lg:w-[43%]">
                            <div className="bg-white rounded-xl border border-gray-200 p-8">
                                <h2 className="text-3xl font-bold text-darkBlue mb-4">
                                    Choose your donation
                                </h2>

                                <p className="text-gray-text mb-8">
                                    Help us light Shabbat candles, fund Torah classes and support our community.
                                </p>

                                <div className="text-3xl font-bold text-darkBlue mb-6">
                                    $399.00 USD
                                </div>


                                {/* Donation Amount */}
                                <div className="mb-6">
                                    <label className="block text-gray-text mb-2">Amount (USD)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="00.00"
                                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue"
                                        />
                                        <span className="absolute right-4 top-4 text-gray-text">$</span>
                                    </div>
                                </div>

                                {/* Donation Type */}
                                {/*   <div className="mb-8">
                                <label className="block text-gray-text mb-2">Select duration</label>
                                <select className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue">
                                    <option>One-time donation</option>
                                    <option>Monthly donation</option>
                                    <option>Annual donation</option>
                                </select>
                            </div> */}


                                <button className="cursor-pointer w-full py-4 border-1 border-darkBlue rounded-lg text-darkBlue font-medium hover:bg-darkBlue hover:text-white transition-colors">
                                    Next
                                </button>
                            </div>


                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}

                <div className="absolute left-0 top-10 opacity-10">
                    <div className="w-40 h-72 bg-red-300"></div>
                </div>
                <div className="absolute right-0 bottom-10 opacity-10">
                    <div className="w-60 h-72 bg-red-300"></div>
                </div>

                {/* Gradient Bottom */}
                <div className="h-48 bg-gradient-to-t from-blueBackground to-white"></div>
            </div>





            {/* About Donations Section */}
            <div className="w-full max-w-4xl mx-auto ounded-xl border bg-white rounded-2xl border-gray-200 p-6 md:p-12 -translate-y-10">
                <div className="flex flex-col gap-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-darkBlue">
                        About Donations for Shabbat at Chabad Panama
                    </h2>

                    <div className="space-y-6 text-gray-text">
                        <p>
                            Every gift helps keep our home alive—from lighting Shabbat candles
                            to Torah classes and supporting those in need. Your generosity
                            creates a warm, meaningful space for our entire community.
                        </p>

                        <div className="space-y-4">
                            <p className="font-semibold">One-time gift:</p>
                            <p>Fuels special projects like a festive Shabbat dinner or holiday celebration.</p>

                            <p className="font-semibold">Monthly support:</p>
                            <p>Ensures our weekly services and free classes run without interruption.</p>

                            <p className="font-semibold">Event sponsorship:</p>
                            <p>Underwrite a lecture series, spiritual retreat, or kids' camp.</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-myBlack">
                                Is this the right way to give?
                            </h3>

                            <ul className="space-y-3 pl-5 list-disc">
                                <li>You want to make an immediate impact with a one-off contribution</li>
                                <li>You prefer to sustain our programs through a steady monthly pledge</li>
                                <li>You'd like to put your name (or your business) behind a specific event</li>
                                <li>You value full transparency and want to see exactly how your donation is used</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>


    );
};