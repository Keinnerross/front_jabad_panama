import { CardEntry } from "@/app/components/sections/(cards)/cardEntry";
import { AccommodationsSection } from "@/app/components/sections/(Entries)/(accommodations)/accommodationsSection";
import { EntryLayout } from "@/app/components/sections/(Entries)/entryLayout";
import { api } from "@/app/services/strapiApiFetch";
import Image from "next/image";
import { Fragment } from "react";

export default async function Acomodations() {


    const hotelsData = await api.hotels();
    const copiesData = await api.copiesPages();


    return (
        <Fragment>
            {/* Hero */}
            <section className="relative flex flex-col items-center w-full  pt-24 pb-20 ">
                {/* Gradient bottom */}
                <div className="absolute top-0 left-0 flex flex-col items-center w-full bg-blueBackground pb-20 h-[70vh] overflow-hidden">


                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground  z-10" />



                </div>


                {/* Decorative background elements */}

                <div className="hidden lg:block absolute left-0 top-0  w-40 h-72 ">
                    <Image src="/assets/global/circles/a.png" alt="circle-image" fill className="object-contain" />
                </div>
                <div className="hidden lg:block absolute right-0 bottom-0 w-60 h-72 ">
                    <Image src="/assets/global/circles/b.png" alt="circle-image" fill className="object-contain" />
                </div>
                {/* Main content container */}
                < div className="w-full max-w-7xl px-4 md:px-6 h-full flex items-center justify-center z-10" >
                    {/* Text content - using flex for centering */}
                    < div className="w-full flex flex-col items-center justify-center text-center py-12 md:py-0" >
                        <h1 className="md:w-[50%] text-4xl md:text-5xl lg:text-[46px] font-bold text-darkBlue mb-6 leading-tight">
                            {copiesData?.accommodations?.title || "Find a Cozy Place to Stay Near Chabad"}
                        </h1>
                        <p className="text-base  text-gray-text max-w-2xl mx-auto" >
                            {copiesData?.accommodations?.description || "Relax in charming stays just around the corner from the Chabad House, offering comfort and convenience throughout your visit."}
                        </ p>
                    </div >
                </div >
            </section >
            <div className="z-10 relative">
                <AccommodationsSection hotelsData={hotelsData} />
            </div>
        </Fragment >
    )
}