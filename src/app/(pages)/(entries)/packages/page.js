import React, { Fragment } from "react";
import Image from "next/image";
import { EntryLayout } from "@/app/components/sections/(Entries)/entryLayout";
import { CardEntry } from "@/app/components/sections/(cards)/cardEntry";
import { HeroActivities } from "@/app/components/sections/Activities/heroActivities";
import { PackagesHome } from "@/app/components/sections/Home/packagesHome";
import { WhyPackagesSection } from "@/app/components/sections/Packages/whyPackagesSection";
import { NewsletterSection } from "@/app/components/sections/Common/newsletterSection";
import { ActivitiesSecundarySection } from "@/app/components/sections/Activities/activitiesSecundarySection";


export default function Restaurants() {
    return (
        <Fragment>
            {/* HERO */}
            <section className="relative flex flex-col items-center w-full bg-white ">
                <PackagesHome />
                {/* Decorative background elements */}
                < div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground z-10" />
                <div className="absolute top-0 left-0 w-40 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div>
                <div className="absolute top-1/3 right-0 w-60 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div>
            </section>

            <div className="transform md:-translate-y-[50px] ">
                <WhyPackagesSection />
                <NewsletterSection />
                <ActivitiesSecundarySection />
            </div>

        </Fragment >
    );
};



