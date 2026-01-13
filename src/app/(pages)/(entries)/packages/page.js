import React, { Fragment } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { PackagesHome } from "@/app/components/sections/Home/packagesHome";
import { WhyPackagesSection } from "@/app/components/sections/Packages/whyPackagesSection";
import { api } from "@/app/services/strapiApiFetch";
import { PackagesVideo } from "@/app/components/sections/Home/packagesVideo";


export default async function Packages() {
    // Check if packages module is enabled
    const platformSettings = await api.platformSettings() || {};
    
    // Redirect to home if packages module is disabled
    if (!platformSettings.habilitar_packages) {
        redirect('/');
    }
    
    const packagesData = await api.packages();
    return (
        <Fragment>
            {/* HERO */}
            <section className="relative flex flex-col items-center w-full bg-white">
                <PackagesHome
                    packagesData={packagesData}
                />
                {/* Decorative background elements */}
                < div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground z-10" />
               
            </section>
            <div className="transform md:-translate-y-[50px] ">
                <WhyPackagesSection packagesData={packagesData} />
                <PackagesVideo packagesData={packagesData} />
            </div>
        </Fragment >
    );
};