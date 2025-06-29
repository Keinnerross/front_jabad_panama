import { CardEntry } from "@/app/components/sections/(cards)/cardEntry";
import { AccommodationsSection } from "@/app/components/sections/(Entries)/(accommodations)/accommodationsSection";
import { EntryLayout } from "@/app/components/sections/(Entries)/entryLayout";
import { Fragment } from "react";

export default function Acomodations() {
    return (
        <Fragment>
            {/* Hero */}
            <section className="relative flex flex-col items-center w-full  pt-24 pb-20 ">
                {/* Gradient bottom */}
                <div className="absolute top-0 left-0 flex flex-col items-center w-screen bg-blueBackground pb-20 h-[70vh] overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground  z-10" />
                </div>
                {/* Main content container */}
                < div className="w-full max-w-7xl px-4 md:px-6 h-full flex items-center justify-center z-10" >
                    {/* Text content - using flex for centering */}
                    < div className="w-full flex flex-col items-center justify-center text-center py-12 md:py-0" >
                        <h1 className="md:w-[50%] text-4xl md:text-5xl lg:text-[46px] font-bold text-darkBlue mb-6 leading-tight">
                            Comfortable Stays Close to Chabad in Boquete
                        </h1>
                        <p className="text-base  text-gray-text max-w-2xl mx-auto" >
                            Relax in charming hotels just around the corner from the Chabad House — comfort and convenience for your stay in the mountains.
                        </ p>
                    </div >
                </div >
                {/* Decorative background elements */}
                {/* <div className="absolute top-0 left-0 w-40 h-72 opacity-[0.08]" >
                    <div className="w-full h-full bg-red-300" />
                </div >

                <div className="absolute top-1/3 right-0 w-60 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div> */}
            </section >
            <div className="z-10 relative">
                <AccommodationsSection />
            </div>
        </Fragment >
    )
}