import React, { Fragment } from "react";
import Image from "next/image";
import { RestaurantsSection } from "@/app/components/sections/(Entries)/(restaurants)/restaurantsSection";
import { api } from "@/app/services/strapiApiFetch";

export default async function Restaurants() {

    const restaurantsData = await api.restaurants();




    return (
        <Fragment>
            <section className="relative flex flex-col items-center w-full  pt-20 pb-14 ">

                {/* Gradient bottom */}

                <div className="absolute top-0 left-0 flex flex-col items-center w-full bg-blueBackground pb-20 h-[70vh] overflow-hidden">

                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground z-10" />

                </div>


                {/* Main content container */}
                <div className="w-full max-w-7xl px-6 h-full flex items-center justify-center z-10 relative">
                    {/* Text content - using flex for centering */}
                    <div className="w-full flex flex-col items-center justify-center text-center py-12 md:py-0">
                        <h1 className="md:w-[50%] text-4xl md:text-5xl lg:text-[46px] font-bold text-darkBlue mb-6 leading-tight">
                            Kosher Traditions in Unexpected Corners
                        </h1>

                        <p className="text-base  text-gray-text max-w-2xl mx-auto">
                            Keeping kosher goes beyond the familiar. In places where culture, calm and community come together, small details like a fresh baked challah or a shared Shabbat meal create space for tradition to thrive in unique and meaningful ways.
                        </p>
                    </div>

                </div>




                {/* Decorative background elements */}
                {/*   <div className="absolute top-0 left-0 w-40 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div>

                <div className="absolute top-1/3 right-0 w-60 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div> */}
            </section>


            <div className="relative z-10">

                <RestaurantsSection restaurantsData={restaurantsData} />

            </div>

        </Fragment >
    );
};