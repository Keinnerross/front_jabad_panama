import React, { Fragment } from "react";
import Image from "next/image";
import { EntryLayout } from "@/app/components/sections/(Entries)/entryLayout";
import { CardEntry } from "@/app/components/sections/(cards)/cardEntry";
import { HeroActivities } from "@/app/components/sections/Activities/heroActivities";
import { PackagesHome } from "@/app/components/sections/Home/packagesHome";
import { WhyPackagesSection } from "@/app/components/sections/Packages/whyPackagesSection";
import { NewsletterSection } from "@/app/components/sections/Common/newsletterSection";
import { ActivitiesSecundarySection } from "@/app/components/sections/Activities/activitiesSecundarySection";
import { ActivitiesSection } from "@/app/components/sections/Activities/activitiesSection";


export default function Restaurants() {
    // Content data - can be moved to a separate file or fetched from CMS

    return (
        <Fragment>
            {/* HERO */}
            <section className="relative flex flex-col items-center w-full bg-white ">
                <HeroActivities />
            </section>

            <ActivitiesSection />
            <PackagesHome showVideo={false} isHero={false} href="#whyPackages" title="All inclusive packages: Leave the thinking to us" />
            <WhyPackagesSection />
            <NewsletterSection />
            {/*  <ActivitiesSecundarySection /> */}
        </Fragment >
    );
};



